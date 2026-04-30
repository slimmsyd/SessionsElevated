import type { Tier, QtyMap } from "./tiers";
import type { Session } from "@/lib/sessions";
import styles from "../book.module.css";

type Props = {
  session: Session;
  tiers: Tier[];
  qty: QtyMap;
  subtotal: number;
  fees: number;
  total: number;
};

export default function OrderSummary({
  session,
  tiers,
  qty,
  subtotal,
  fees,
  total,
}: Props) {
  const lines = tiers.filter((t) => (qty[t.id] ?? 0) > 0);

  return (
    <div className={styles.summarySticky}>
      <div className={styles.summaryCard}>
        <div className={styles.summaryPoster}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={session.poster} alt={`${session.title} poster`} />
        </div>

        <div className={styles.summaryHead}>
          <div className="label" style={{ marginBottom: 10 }}>
            Your reservation
          </div>
          <h3 className={styles.summaryTitle}>{session.title}</h3>
          <p className={styles.summarySubtitle}>{session.subtitle.toLowerCase()}</p>
        </div>

        <div className={styles.summaryRows}>
          <SummaryRow label="Date" value={session.date} />
          <SummaryRow label="Time" value={session.time} />
          <SummaryRow label="Location" value={session.location} small />
        </div>

        <div className={styles.summaryLines}>
          {lines.length === 0 ? (
            <p className={styles.summaryLinesEmpty}>No tickets selected yet.</p>
          ) : (
            <div className={styles.summaryLineList}>
              {lines.map((t) => {
                const q = qty[t.id] ?? 0;
                return (
                  <div key={t.id} className={styles.summaryLine}>
                    <div>
                      <div className={styles.summaryLineName}>{t.name}</div>
                      <div className={styles.summaryLineQty}>
                        {q} × ${t.price}
                      </div>
                    </div>
                    <div className={styles.summaryLineTotal}>
                      ${(q * t.price).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {subtotal > 0 && (
          <div className={styles.summaryFees}>
            <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} mono />
            <SummaryRow label="Processing" value={`$${fees.toFixed(2)}`} mono />
          </div>
        )}

        <div className={styles.summaryTotalBar}>
          <span className="label">Total</span>
          <span className={styles.summaryTotalValue}>${total.toFixed(2)}</span>
        </div>
      </div>

      <p className={styles.summaryFootnote}>
        ✦ SECURE CHECKOUT &nbsp;·&nbsp; CARD DETAILS NEVER STORED &nbsp;·&nbsp;
        SUPPORT@ELEVATEDSESSIONS.CO
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  small,
  mono,
}: {
  label: string;
  value: string;
  small?: boolean;
  mono?: boolean;
}) {
  const valueCls = `${styles.summaryRowValue} ${
    small ? styles.summaryRowValueSmall : ""
  } ${mono ? styles.summaryRowValueMono : ""}`;
  return (
    <div className={styles.summaryRow}>
      <span className={styles.summaryRowLabel}>{label}</span>
      <span className={valueCls}>{value}</span>
    </div>
  );
}
