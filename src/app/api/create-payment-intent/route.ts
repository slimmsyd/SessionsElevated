import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  FEE_RATE,
  FEE_FLAT,
  MAX_QTY,
} from "@/app/book/components/tiers";
import { store } from "@/lib/admin-store";
import { countSoldByTierId } from "@/lib/admin-bookings";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const MAX_TOTAL_CENTS = 5_000_00; // $5,000 hard ceiling

type LineItem = { tier_id: string; qty: number };
type RequestBody = {
  items: LineItem[];
  details: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  optIn: boolean;
};

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { items, details, optIn } = body;

    // ── Validate & compute server-side total ─────────────────────────────
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 },
      );
    }

    const [tiers, currentSession] = await Promise.all([
      store.getTiers(),
      store.getSession(),
    ]);

    // Aggregate requested qty per tier_id (in case the client sends duplicates)
    const requestedByTierId: Record<string, number> = {};
    for (const item of items) {
      if (!Number.isInteger(item.qty) || item.qty < 0 || item.qty > MAX_QTY) {
        return NextResponse.json(
          { error: "Invalid quantity" },
          { status: 400 },
        );
      }
      if (item.qty === 0) continue;
      requestedByTierId[item.tier_id] =
        (requestedByTierId[item.tier_id] ?? 0) + item.qty;
    }

    let subtotal = 0;
    const lineDescriptions: string[] = [];
    const tierQtyById: Record<string, number> = {};

    // Capacity check: load already-sold counts once
    const anyCapacity = tiers.some((t) => t.capacity != null);
    const sold = anyCapacity
      ? await countSoldByTierId()
      : { byTierId: {}, byTierName: {} };

    for (const [tierId, qty] of Object.entries(requestedByTierId)) {
      const tier = tiers.find((t) => t.id === tierId);
      if (!tier) {
        return NextResponse.json(
          { error: `Unknown tier: ${tierId}` },
          { status: 400 },
        );
      }

      if (tier.capacity != null) {
        const alreadySold =
          sold.byTierId[tier.id] ?? sold.byTierName[tier.name] ?? 0;
        const remaining = Math.max(0, tier.capacity - alreadySold);
        if (qty > remaining) {
          return NextResponse.json(
            {
              error:
                remaining === 0
                  ? `${tier.name} is sold out`
                  : `Only ${remaining} ${tier.name} ticket${remaining === 1 ? "" : "s"} remaining`,
            },
            { status: 409 },
          );
        }
      }

      subtotal += tier.price * qty;
      lineDescriptions.push(`${tier.name} × ${qty}`);
      tierQtyById[tier.id] = qty;
    }

    if (subtotal === 0) {
      return NextResponse.json(
        { error: "Order total is zero" },
        { status: 400 },
      );
    }

    const fees = Number((subtotal * FEE_RATE + FEE_FLAT).toFixed(2));
    const total = Number((subtotal + fees).toFixed(2));
    const amountInCents = Math.round(total * 100);

    if (amountInCents > MAX_TOTAL_CENTS) {
      return NextResponse.json(
        { error: "Order exceeds maximum" },
        { status: 400 },
      );
    }

    // ── Create PaymentIntent ─────────────────────────────────────────────
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: details.email,
      metadata: {
        app: "elevated_sessions",
        customer_name: `${details.firstName} ${details.lastName}`,
        customer_first_name: details.firstName,
        customer_last_name: details.lastName,
        customer_email: details.email,
        customer_phone: details.phone ?? "",
        line_items: lineDescriptions.join("; "),
        tier_qty: JSON.stringify(tierQtyById),
        subtotal: subtotal.toFixed(2),
        fees: fees.toFixed(2),
        total: total.toFixed(2),
        opt_in: optIn ? "yes" : "no",
        session_id: currentSession.id,
      },
    });

    // Reference code derived from PaymentIntent ID for traceability
    const referenceCode =
      "ES-" + paymentIntent.id.replace("pi_", "").slice(0, 7).toUpperCase();

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      referenceCode,
    });
  } catch (err) {
    console.error("Stripe PaymentIntent error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
