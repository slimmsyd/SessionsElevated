import Link from "next/link";
import { store } from "@/lib/admin-store";
import styles from "./admin.module.css";

export default async function AdminDashboardPage() {
  const [tiers, session] = await Promise.all([
    store.getTiers(),
    store.getSession(),
  ]);

  const prices = tiers.map((t) => t.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const partnershipCount = tiers.filter((t) => t.mode === "partnership").length;

  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <span className={`label ${styles.pageHeaderEyebrow}`}>Overview</span>
          <h1 className="h2">Dashboard</h1>
          <p className={styles.statSub}>
            Managing &ldquo;{session.title}&rdquo; · {session.date}
          </p>
        </div>
      </header>

      <section className={styles.statGrid}>
        <div className={styles.statCard}>
          <span className={`label ${styles.statLabel}`}>Tiers active</span>
          <span className={styles.statValue}>{tiers.length}</span>
          <span className={styles.statSub}>
            1 admission · {partnershipCount} partnership
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={`label ${styles.statLabel}`}>Price range</span>
          <span className={styles.statValue}>
            ${minPrice}–${maxPrice}
          </span>
          <span className={styles.statSub}>across all tiers</span>
        </div>

        <div className={styles.statCard}>
          <span className={`label ${styles.statLabel}`}>Bookings</span>
          <span className={styles.statValue}>—</span>
          <span className={styles.statSub}>
            <Link
              href="/admin/bookings"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              View bookings
            </Link>
          </span>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick actions</h2>
        <p className={styles.sectionLede}>
          Edit tier pricing and inclusions, update session copy that shows on
          the booking page, or review paid bookings pulled live from Stripe.
        </p>
        <div className={styles.linkRow}>
          <Link href="/admin/tiers">Edit tiers &amp; pricing →</Link>
          <Link href="/admin/copy">Edit session copy →</Link>
          <Link href="/admin/bookings">View bookings →</Link>
        </div>
      </section>
    </>
  );
}
