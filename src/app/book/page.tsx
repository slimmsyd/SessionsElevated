import { store } from "@/lib/admin-store";
import BookingFlow from "./BookingFlow";

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const [session, tiers] = await Promise.all([
    store.getSession(),
    store.getTiers(),
  ]);
  return <BookingFlow session={session} tiers={tiers} />;
}
