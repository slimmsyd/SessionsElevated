import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { store } from "@/lib/admin-store";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ??
  "https://oncode.app.n8n.cloud/webhook/72cd1098-45bd-4d0e-82bb-1a20959dc75a";

// Stripe needs the raw body to verify the signature.
// In Next.js App Router, request.text() preserves it.

function deriveReference(piId: string): string {
  return "ES-" + piId.replace("pi_", "").slice(0, 7).toUpperCase();
}

function parseTierQty(raw: string | undefined | null): Record<string, number> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const out: Record<string, number> = {};
      for (const [k, v] of Object.entries(parsed)) {
        const n = Number(v);
        if (typeof k === "string" && Number.isInteger(n) && n > 0) out[k] = n;
      }
      return out;
    }
  } catch {
    /* fallthrough */
  }
  return {};
}

function parseDollarsToCents(s: string | undefined | null): number {
  if (!s) return 0;
  const n = parseFloat(s);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

async function forwardToN8n(payload: unknown): Promise<void> {
  if (!N8N_WEBHOOK_URL) return;
  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(
        "n8n webhook returned non-2xx:",
        res.status,
        await res.text().catch(() => ""),
      );
    }
  } catch (err) {
    // Never let a fulfillment hop failure break the webhook handler — Stripe
    // will retry the whole event if we 5xx, and we already wrote the Booking row.
    console.error("n8n webhook forward failed:", err);
  }
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 },
    );
  }

  const sig = (await headers()).get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const meta = pi.metadata ?? {};

      const referenceCode = deriveReference(pi.id);
      const tierQty = parseTierQty(meta.tier_qty);

      await prisma.booking.upsert({
        where: { paymentIntentId: pi.id },
        create: {
          paymentIntentId: pi.id,
          referenceCode,
          customerName: meta.customer_name ?? "",
          customerEmail: meta.customer_email ?? "",
          customerPhone: meta.customer_phone || null,
          optIn: meta.opt_in === "yes",
          amountCents: pi.amount_received ?? pi.amount,
          currency: pi.currency,
          subtotalCents: parseDollarsToCents(meta.subtotal),
          feesCents: parseDollarsToCents(meta.fees),
          lineItems: meta.line_items ?? "",
          tierQty,
          sessionId: meta.session_id ?? "unknown",
          status: pi.status,
        },
        update: {
          // Stripe may resend the event — only update mutable fields
          status: pi.status,
          amountCents: pi.amount_received ?? pi.amount,
        },
      });

      // Forward a clean payload to n8n for fulfillment (email, sheet, etc.)
      let session = null;
      let tiers: Awaited<ReturnType<typeof store.getTiers>> = [];
      try {
        [session, tiers] = await Promise.all([
          store.getSession(),
          store.getTiers(),
        ]);
      } catch {
        /* tolerate missing data */
      }

      // Determine purchase mode: "partnership" if any partnership tier was bought,
      // otherwise "admission". Mixed orders count as partnership so the buyer gets
      // the partnership-specific email (richer logistical info).
      const partnershipTierIds = new Set(
        tiers.filter((t) => t.mode === "partnership").map((t) => t.id),
      );
      const hasPartnership = Object.keys(tierQty).some((id) =>
        partnershipTierIds.has(id),
      );
      const mode: "admission" | "partnership" = hasPartnership
        ? "partnership"
        : "admission";

      await forwardToN8n({
        event: "payment_intent.succeeded",
        reference: referenceCode,
        mode,
        customer: {
          first_name: meta.customer_first_name ?? "",
          last_name: meta.customer_last_name ?? "",
          email: meta.customer_email ?? "",
          phone: meta.customer_phone ?? "",
        },
        amount_cents: pi.amount_received ?? pi.amount,
        currency: pi.currency,
        subtotal: meta.subtotal ?? "",
        fees: meta.fees ?? "",
        total: meta.total ?? "",
        line_items: meta.line_items ?? "",
        tier_qty: tierQty,
        opt_in: meta.opt_in === "yes",
        session: session
          ? {
              id: session.id,
              title: session.title,
              subtitle: session.subtitle,
              date: session.date,
              time: session.time,
              doors: session.doors,
              location: session.location,
            }
          : { id: meta.session_id ?? "unknown" },
      });
    } else if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object as Stripe.PaymentIntent;
      // Track failed attempts only if a Booking row already exists for this PI
      // (so we don't pollute the table with abandoned attempts).
      await prisma.booking.updateMany({
        where: { paymentIntentId: pi.id },
        data: { status: pi.status },
      });
    }
    // Other events ignored for now.

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    const msg = err instanceof Error ? err.message : "Handler error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
