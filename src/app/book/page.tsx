import { store } from "@/lib/admin-store";
import { countSoldByTierId } from "@/lib/admin-bookings";
import BookingFlow from "./BookingFlow";

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const [session, tiers] = await Promise.all([
    store.getSession(),
    store.getTiers(),
  ]);

  let sold: {
    byTierId: Record<string, number>;
    byTierName: Record<string, number>;
  } = { byTierId: {}, byTierName: {} };
  try {
    sold = await countSoldByTierId();
  } catch {
    // Stripe unreachable — render with 0 sold; server-side guard at PI creation
    // is the load-bearing protection. The UI hint is best-effort.
  }

  // remaining = null when capacity is null (unlimited).
  const remainingByTierId: Record<string, number | null> = Object.fromEntries(
    tiers.map((t) => {
      if (t.capacity == null) return [t.id, null];
      const soldFor = sold.byTierId[t.id] ?? sold.byTierName[t.name] ?? 0;
      return [t.id, Math.max(0, t.capacity - soldFor)];
    }),
  );

  return (
    <BookingFlow
      session={session}
      tiers={tiers}
      remainingByTierId={remainingByTierId}
    />
  );
}
