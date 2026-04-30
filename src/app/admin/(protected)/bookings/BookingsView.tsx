"use client";
import { useState } from "react";
import type { BookingsSnapshot } from "@/lib/admin-bookings";
import adminStyles from "../admin.module.css";
import styles from "./bookings.module.css";

type Payload = BookingsSnapshot;

function formatCurrency(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function formatDate(ms: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ms));
}

export default function BookingsView({
  initial,
  initialError,
}: {
  initial: Payload | null;
  initialError: string | null;
}) {
  const [data, setData] = useState<Payload | null>(initial);
  const [error, setError] = useState(initialError ?? "");
  const [loading, setLoading] = useState(false);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings", { cache: "no-store" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || "Failed to load");
      } else {
        setData(body);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={styles.toolbar}>
        <div>
          {data && (
            <span className={styles.toolbarMeta}>
              Last fetched {formatDate(data.fetched_at)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="btn btn-ghost"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div role="alert" className={styles.error}>
          {error}
        </div>
      )}

      {!data && !error && <div className={styles.placeholder}>Loading…</div>}

      {data && (
        <>
          <section className={adminStyles.statGrid}>
            <div className={adminStyles.statCard}>
              <span className={`label ${adminStyles.statLabel}`}>
                Paid bookings
              </span>
              <span className={adminStyles.statValue}>{data.count}</span>
              <span className={adminStyles.statSub}>succeeded payments</span>
            </div>
            <div className={adminStyles.statCard}>
              <span className={`label ${adminStyles.statLabel}`}>Revenue</span>
              <span className={adminStyles.statValue}>
                {formatCurrency(data.totalRevenueCents, data.currency)}
              </span>
              <span className={adminStyles.statSub}>gross collected</span>
            </div>
            <div className={adminStyles.statCard}>
              <span className={`label ${adminStyles.statLabel}`}>
                Tickets sold
              </span>
              <span className={adminStyles.statValue}>
                {Object.values(data.byTier).reduce((a, b) => a + b, 0)}
              </span>
              <span className={adminStyles.statSub}>across all tiers</span>
            </div>
          </section>

          {Object.keys(data.byTier).length > 0 && (
            <section className={styles.section}>
              <h2 className={adminStyles.sectionTitle}>By tier</h2>
              <div className={styles.tierGrid}>
                {Object.entries(data.byTier)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, qty]) => (
                    <div key={name} className={styles.tierRow}>
                      <span className={styles.tierName}>{name}</span>
                      <span className={styles.tierQty}>{qty}</span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          <section className={styles.section}>
            <h2 className={adminStyles.sectionTitle}>Recent bookings</h2>
            {data.recent.length === 0 ? (
              <div className={styles.placeholder}>
                No paid bookings yet. Once a Stripe payment succeeds, it shows
                up here.
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((b) => (
                      <tr key={b.reference}>
                        <td>
                          <code className={styles.ref}>{b.reference}</code>
                        </td>
                        <td>{b.customer_name || "—"}</td>
                        <td>{b.customer_email || "—"}</td>
                        <td className={styles.lineItems}>
                          {b.line_items || "—"}
                        </td>
                        <td>{formatCurrency(b.amount, b.currency)}</td>
                        <td>{formatDate(b.created)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
