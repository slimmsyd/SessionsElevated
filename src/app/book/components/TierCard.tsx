"use client";
import type { Tier } from "./tiers";
import QuantityStepper from "./QuantityStepper";
import styles from "../book.module.css";

type Props = {
  tier: Tier;
  qty: number;
  remaining: number | null;
  onInc: () => void;
  onDec: () => void;
};

const SCARCITY_THRESHOLD = 5;

export default function TierCard({ tier, qty, remaining, onInc, onDec }: Props) {
  const selected = qty > 0;
  const soldOut = remaining !== null && remaining <= 0;
  const showScarcity =
    remaining !== null && remaining > 0 && remaining <= SCARCITY_THRESHOLD;
  const incDisabled = soldOut || (remaining !== null && qty >= remaining);

  return (
    <div
      className={`${styles.tierCard} ${selected ? styles.tierCardSelected : ""} ${
        soldOut ? styles.tierCardSoldOut : ""
      }`}
    >
      <div className={styles.tierHead}>
        <div>
          <div className={styles.tierTitleRow}>
            <h3 className={styles.tierName}>{tier.name}</h3>
            {tier.badge && <span className={styles.tierBadge}>{tier.badge}</span>}
            {soldOut && (
              <span className={styles.tierSoldOutBadge}>Sold out</span>
            )}
            {showScarcity && (
              <span className={styles.tierScarcityBadge}>
                {remaining} {remaining === 1 ? "seat" : "seats"} left
              </span>
            )}
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
        <QuantityStepper
          qty={qty}
          incDisabled={incDisabled}
          onInc={onInc}
          onDec={onDec}
        />
      </div>
    </div>
  );
}
