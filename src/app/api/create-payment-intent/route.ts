import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  ALL_TIERS,
  FEE_RATE,
  FEE_FLAT,
  MAX_QTY,
  type Tier,
} from "@/app/book/components/tiers";
import { store } from "@/lib/admin-store";

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

    let tiers: Tier[];
    try {
      tiers = await store.getTiers();
    } catch {
      tiers = ALL_TIERS;
    }

    let subtotal = 0;
    const lineDescriptions: string[] = [];

    for (const item of items) {
      if (!Number.isInteger(item.qty) || item.qty < 0 || item.qty > MAX_QTY) {
        return NextResponse.json(
          { error: "Invalid quantity" },
          { status: 400 },
        );
      }
      if (item.qty === 0) continue;

      const tier = tiers.find((t) => t.id === item.tier_id);
      if (!tier) {
        return NextResponse.json(
          { error: `Unknown tier: ${item.tier_id}` },
          { status: 400 },
        );
      }

      subtotal += tier.price * item.qty;
      lineDescriptions.push(`${tier.name} × ${item.qty}`);
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
        customer_name: `${details.firstName} ${details.lastName}`,
        customer_email: details.email,
        customer_phone: details.phone ?? "",
        line_items: lineDescriptions.join("; "),
        subtotal: subtotal.toFixed(2),
        fees: fees.toFixed(2),
        total: total.toFixed(2),
        opt_in: optIn ? "yes" : "no",
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
