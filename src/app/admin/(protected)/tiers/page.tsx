import { store } from "@/lib/admin-store";
import { countSoldByTierId } from "@/lib/admin-bookings";
import TierEditor from "./TierEditor";
import styles from "../admin.module.css";
import tiersStyles from "./tiers.module.css";

export const dynamic = "force-dynamic";

export default async function AdminTiersPage() {
  const tiers = await store.getTiers();
  let sold: { byTierId: Record<string, number>; byTierName: Record<string, number> } = {
    byTierId: {},
    byTierName: {},
  };
  try {
    sold = await countSoldByTierId();
  } catch {
    // Stripe unreachable — render with 0 sold; admin can still edit
  }
  const soldFor = (tier: { id: string; name: string }): number =>
    sold.byTierId[tier.id] ?? sold.byTierName[tier.name] ?? 0;

  const admission = tiers.filter((t) => t.mode === "admission");
  const partnership = tiers.filter((t) => t.mode === "partnership");

  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <span className={`label ${styles.pageHeaderEyebrow}`}>Pricing</span>
          <h1 className="h2">Tiers &amp; pricing</h1>
          <p className={styles.statSub}>
            Edit ticket pricing, capacity, and inclusions. Changes take effect
            on new payment intents immediately.
          </p>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Admission</h2>
        <div className={tiersStyles.tierList}>
          {admission.map((t) => (
            <TierEditor key={t.id} tier={t} sold={soldFor(t)} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Partnership</h2>
        <div className={tiersStyles.tierList}>
          {partnership.map((t) => (
            <TierEditor key={t.id} tier={t} sold={soldFor(t)} />
          ))}
        </div>
      </section>
    </>
  );
}
