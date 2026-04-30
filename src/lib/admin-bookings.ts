import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export type Booking = {
  reference: string;
  customer_name: string;
  customer_email: string;
  line_items: string;
  amount: number;
  currency: string;
  created: number;
};

export type BookingsSnapshot = {
  count: number;
  totalRevenueCents: number;
  currency: string;
  byTier: Record<string, number>;
  recent: Booking[];
  fetched_at: number;
};

function deriveReference(piId: string): string {
  return "ES-" + piId.replace("pi_", "").slice(0, 7).toUpperCase();
}

/**
 * True if a PaymentIntent was created by the Elevated Sessions booking flow.
 * Recognized by the `app: "elevated_sessions"` metadata marker (new) OR
 * the presence of `session_id` / `tier_qty` / `line_items` (older PIs that
 * predate the marker). Anything without these tags is some other Stripe
 * activity on the same account and should be ignored.
 */
function isOurPI(pi: Stripe.PaymentIntent): boolean {
  const m = pi.metadata ?? {};
  return (
    m.app === "elevated_sessions" ||
    typeof m.session_id === "string" ||
    typeof m.tier_qty === "string" ||
    typeof m.line_items === "string"
  );
}

function parseTierTotals(lineItems: string): Record<string, number> {
  const totals: Record<string, number> = {};
  if (!lineItems) return totals;
  for (const part of lineItems.split(";")) {
    const m = part.trim().match(/^(.+?)\s*[×x]\s*(\d+)$/);
    if (!m) continue;
    const name = m[1].trim();
    const qty = Number(m[2]);
    if (!name || !Number.isFinite(qty)) continue;
    totals[name] = (totals[name] ?? 0) + qty;
  }
  return totals;
}

function parseTierQtyById(meta: Stripe.Metadata | null | undefined): Record<string, number> | null {
  const raw = meta?.tier_qty;
  if (!raw || typeof raw !== "string") return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const out: Record<string, number> = {};
      for (const [k, v] of Object.entries(parsed)) {
        const n = Number(v);
        if (typeof k === "string" && Number.isInteger(n) && n > 0) {
          out[k] = n;
        }
      }
      return out;
    }
  } catch {
    /* fall through */
  }
  return null;
}

/**
 * Counts succeeded sales per tier_id from Stripe metadata.
 * Prefers the `tier_qty` JSON map (rename-safe). Falls back to parsing
 * the human-readable `line_items` string for legacy PIs (key = name).
 */
export async function countSoldByTierId(): Promise<{
  byTierId: Record<string, number>;
  byTierName: Record<string, number>;
}> {
  const list = await stripe.paymentIntents.list({ limit: 100 });
  const succeeded = list.data.filter(
    (pi) => pi.status === "succeeded" && isOurPI(pi),
  );

  const byTierId: Record<string, number> = {};
  const byTierName: Record<string, number> = {};

  for (const pi of succeeded) {
    const byId = parseTierQtyById(pi.metadata);
    if (byId) {
      for (const [id, qty] of Object.entries(byId)) {
        byTierId[id] = (byTierId[id] ?? 0) + qty;
      }
    }
    const byName = parseTierTotals(pi.metadata?.line_items ?? "");
    for (const [name, qty] of Object.entries(byName)) {
      byTierName[name] = (byTierName[name] ?? 0) + qty;
    }
  }

  return { byTierId, byTierName };
}

export async function fetchBookings(): Promise<BookingsSnapshot> {
  const list = await stripe.paymentIntents.list({ limit: 100 });
  const succeeded = list.data.filter(
    (pi) => pi.status === "succeeded" && isOurPI(pi),
  );

  const totalRevenueCents = succeeded.reduce(
    (s, pi) => s + (pi.amount_received ?? pi.amount),
    0,
  );

  const byTier: Record<string, number> = {};
  for (const pi of succeeded) {
    const items = parseTierTotals(pi.metadata?.line_items ?? "");
    for (const [name, qty] of Object.entries(items)) {
      byTier[name] = (byTier[name] ?? 0) + qty;
    }
  }

  const recent: Booking[] = succeeded.slice(0, 50).map((pi) => ({
    reference: deriveReference(pi.id),
    customer_name: pi.metadata?.customer_name ?? "",
    customer_email: pi.metadata?.customer_email ?? "",
    line_items: pi.metadata?.line_items ?? "",
    amount: pi.amount_received ?? pi.amount,
    currency: pi.currency,
    created: pi.created * 1000,
  }));

  return {
    count: succeeded.length,
    totalRevenueCents,
    currency: succeeded[0]?.currency ?? "usd",
    byTier,
    recent,
    fetched_at: Date.now(),
  };
}
