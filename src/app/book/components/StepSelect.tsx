"use client";
import {
  ADMISSION_TIER,
  PARTNERSHIP_TIERS,
  PARTNERSHIP_NOTE,
  type QtyMap,
  type TierMode,
} from "./tiers";
import TierCard from "./TierCard";
import styles from "../book.module.css";

type Props = {
  mode: TierMode;
  setMode: (m: TierMode) => void;
  qty: QtyMap;
  inc: (id: string) => void;
  dec: (id: string) => void;
};

export default function StepSelect({ mode, setMode, qty, inc, dec }: Props) {
  return (
    <div>
      <h2 className={`h3 ${styles.stepHeading}`}>Reserve your place</h2>
      <p className={`body ${styles.stepIntro}`}>
        Coming as a guest? Choose <em>General Admission</em>. Coming as a vendor or
        business partner? Switch to <em>Partnership</em>.
      </p>

      <div className={styles.modeToggle} role="tablist" aria-label="Ticket category">
        <ModeButton
          active={mode === "admission"}
          onClick={() => setMode("admission")}
        >
          Guest admission
        </ModeButton>
        <ModeButton
          active={mode === "partnership"}
          onClick={() => setMode("partnership")}
        >
          Vendor &amp; partnership
        </ModeButton>
      </div>

      {mode === "admission" ? (
        <div className={styles.tierList}>
          <TierCard
            tier={ADMISSION_TIER}
            qty={qty[ADMISSION_TIER.id] ?? 0}
            onInc={() => inc(ADMISSION_TIER.id)}
            onDec={() => dec(ADMISSION_TIER.id)}
          />
        </div>
      ) : (
        <div>
          <div className={styles.partnershipNotice}>
            <span className={styles.partnershipNoticeMark}>✦</span>
            <p className="body" style={{ fontSize: 14, margin: 0 }}>
              {PARTNERSHIP_NOTE}
            </p>
          </div>
          <div className={styles.tierList}>
            {PARTNERSHIP_TIERS.map((t) => (
              <TierCard
                key={t.id}
                tier={t}
                qty={qty[t.id] ?? 0}
                onInc={() => inc(t.id)}
                onDec={() => dec(t.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`${styles.modeBtn} ${active ? styles.modeBtnActive : ""}`}
    >
      {children}
    </button>
  );
}
