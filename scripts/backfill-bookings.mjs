#!/usr/bin/env node
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Stripe from "stripe";
const { PrismaClient } = pkg;

function deriveReference(piId) {
  return "ES-" + piId.replace("pi_", "").slice(0, 7).toUpperCase();
}

function parseTierQty(raw) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const out = {};
      for (const [k, v] of Object.entries(parsed)) {
        const n = Number(v);
        if (Number.isInteger(n) && n > 0) out[k] = n;
      }
      return out;
    }
  } catch {
    /* fallthrough */
  }
  return {};
}

function parseTierTotalsByName(lineItems) {
  const totals = {};
  if (!lineItems) return totals;
  for (const part of lineItems.split(";")) {
    const m = part.trim().match(/^(.+?)\s*[×x]\s*(\d+)$/);
    if (!m) continue;
    const qty = Number(m[2]);
    if (!Number.isFinite(qty)) continue;
    totals[m[1].trim()] = (totals[m[1].trim()] ?? 0) + qty;
  }
  return totals;
}

function parseDollarsToCents(s) {
  if (!s) return 0;
  const n = parseFloat(s);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!dbUrl) throw new Error("DATABASE_URL not set");
  if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

  const adapter = new PrismaPg({ connectionString: dbUrl });
  const prisma = new PrismaClient({ adapter });
  const stripe = new Stripe(stripeKey, { apiVersion: "2026-04-22.dahlia" });

  console.log("Fetching succeeded PaymentIntents from Stripe...");
  const list = await stripe.paymentIntents.list({ limit: 100 });
  const succeeded = list.data.filter((pi) => pi.status === "succeeded");
  console.log(`Found ${succeeded.length} succeeded PIs.`);

  let inserted = 0;
  let updated = 0;

  for (const pi of succeeded) {
    const meta = pi.metadata ?? {};

    // Prefer tier_qty JSON; fall back to parsing the human-readable string by name.
    let tierQty = parseTierQty(meta.tier_qty);
    if (Object.keys(tierQty).length === 0) {
      tierQty = parseTierTotalsByName(meta.line_items ?? "");
    }

    const ref = deriveReference(pi.id);
    const data = {
      paymentIntentId: pi.id,
      referenceCode: ref,
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
      sessionId: meta.session_id ?? "spring-awakening-2026",
      status: pi.status,
    };

    const existing = await prisma.booking.findUnique({
      where: { paymentIntentId: pi.id },
    });
    if (existing) {
      await prisma.booking.update({
        where: { paymentIntentId: pi.id },
        data: {
          status: data.status,
          amountCents: data.amountCents,
        },
      });
      updated += 1;
      console.log(`  ↻ updated ${ref} (${data.customerEmail})`);
    } else {
      await prisma.booking.create({ data });
      inserted += 1;
      console.log(`  + inserted ${ref} (${data.customerEmail})`);
    }
  }

  await prisma.$disconnect();
  console.log(`\ndone — inserted ${inserted}, updated ${updated}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
