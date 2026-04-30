"use client";
import type { Tier } from "./tiers";
import QuantityStepper from "./QuantityStepper";
import styles from "../book.module.css";

type Props = {
  tier: Tier;
  qty: number;
  onInc: () => void;
  onDec: () => void;
};

export default function TierCard({ tier, qty, onInc, onDec }: Props) {
  const selected = qty > 0;
  return (
    <div className={`${styles.tierCard} ${selected ? styles.tierCardSelected : ""}`}>
      <div className={styles.tierHead}>
        <div>
          <div className={styles.tierTitleRow}>
            <h3 className={styles.tierName}>{tier.name}</h3>
            {tier.badge && <span className={styles.tierBadge}>{tier.badge}</span>}
          </div>
          {tier.rsvpCount > 1 && (
            <div className={`label ${styles.tierRsvpCount}`}>
              Includes {tier.rsvpCount} RSVPs
            </div>
          )}
          <p className={`body ${styles.tierBlurb}`}>{tier.blurb}</p>
        </div>
        <div className={styles.tierPrice}>${tier.price}</div>
      </div>

      <ul className={styles.tierIncludes}>
        {tier.includes.map((line, i) => (
          <li key={i} className={`body ${styles.tierIncludesLine}`}>
            <span className={styles.tierIncludesDash}>—</span>
            {line}
          </li>
        ))}
      </ul>

      <div className={styles.tierFoot}>
        <span className="label">Quantity</span>
        <QuantityStepper qty={qty} onInc={onInc} onDec={onDec} />
      </div>
    </div>
  );
}
