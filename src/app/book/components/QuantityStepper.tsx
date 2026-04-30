"use client";
import styles from "../book.module.css";

type Props = {
  qty: number;
  incDisabled?: boolean;
  onInc: () => void;
  onDec: () => void;
};

export default function QuantityStepper({
  qty,
  incDisabled = false,
  onInc,
  onDec,
}: Props) {
  return (
    <div className={styles.qtyStepper}>
      <button
        type="button"
        onClick={onDec}
        disabled={qty === 0}
        className={`${styles.qtyBtn} ${qty === 0 ? styles.qtyBtnDisabled : ""}`}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={styles.qtyValue} aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={onInc}
        disabled={incDisabled}
        className={`${styles.qtyBtn} ${incDisabled ? styles.qtyBtnDisabled : ""}`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
