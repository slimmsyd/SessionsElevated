import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";
import customerStyles from "./customers.module.css";

export const dynamic = "force-dynamic";

function fmtCurrency(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export default async function AdminCustomersPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const optedIn = bookings.filter((b) => b.optIn).length;

  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <span className={`label ${styles.pageHeaderEyebrow}`}>People</span>
          <h1 className="h2">Customers</h1>
          <p className={styles.statSub}>
            Captured at payment success via Stripe webhook. {bookings.length}{" "}
            total · {optedIn} opted in for email updates.
          </p>
        </div>
        <a
          href="/api/admin/customers?format=csv"
          download
          className="btn btn-ghost"
        >
          Export CSV
        </a>
      </header>

      {bookings.length === 0 ? (
        <div className={customerStyles.placeholder}>
          No customers yet. Once <code>STRIPE_WEBHOOK_SECRET</code> is set and a
          webhook is configured in Stripe pointing at{" "}
          <code>/api/webhooks/stripe</code>, every successful payment writes a
          row here. To backfill prior test payments run{" "}
          <code>npx dotenv -e .env.local -- node scripts/backfill-bookings.mjs</code>.
        </div>
      ) : (
        <div className={customerStyles.tableWrap}>
          <table className={customerStyles.table}>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Opt-in</th>
                <th>Items</th>
                <th>Amount</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <code className={customerStyles.ref}>
                      {b.referenceCode}
                    </code>
                  </td>
                  <td>{b.customerName || "—"}</td>
                  <td>
                    <a href={`mailto:${b.customerEmail}`}>{b.customerEmail}</a>
                  </td>
                  <td>{b.customerPhone || "—"}</td>
                  <td>
                    <span
                      className={
                        b.optIn
                          ? customerStyles.optInYes
                          : customerStyles.optInNo
                      }
                    >
                      {b.optIn ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className={customerStyles.lineItems}>{b.lineItems}</td>
                  <td>{fmtCurrency(b.amountCents, b.currency)}</td>
                  <td>{fmtDate(b.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
