import { fetchBookings, type BookingsSnapshot } from "@/lib/admin-bookings";
import BookingsView from "./BookingsView";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  let initial: BookingsSnapshot | null = null;
  let initialError: string | null = null;
  try {
    initial = await fetchBookings();
  } catch (err) {
    initialError = err instanceof Error ? err.message : "Failed to load";
  }

  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <span className={`label ${styles.pageHeaderEyebrow}`}>Sales</span>
          <h1 className="h2">Bookings</h1>
          <p className={styles.statSub}>
            Live from Stripe. Refresh to pull the latest. Source of truth is the
            Stripe dashboard.
          </p>
        </div>
      </header>

      <BookingsView initial={initial} initialError={initialError} />
    </>
  );
}
