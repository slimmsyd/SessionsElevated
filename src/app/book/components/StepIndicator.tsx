import { Fragment } from "react";
import styles from "../book.module.css";

const STEPS = [
  { n: 1, label: "Select" },
  { n: 2, label: "Details" },
  { n: 3, label: "Payment" },
  { n: 4, label: "Confirmation" },
] as const;

export default function StepIndicator({ step }: { step: number }) {
  return (
    <div className={styles.stepIndicator} aria-label="Checkout progress">
      {STEPS.map((s, i) => {
        const active = step === s.n;
        const done = step > s.n;
        const dotCls = `${styles.stepDot} ${
          done ? styles.stepDotDone : active ? styles.stepDotActive : ""
        }`;
        const labelCls = `label ${active || done ? styles.stepLabelActive : styles.stepLabel}`;
        return (
          <Fragment key={s.n}>
            <div
              className={styles.stepItem}
              aria-current={active ? "step" : undefined}
            >
              <span className={dotCls}>{done ? "✓" : s.n}</span>
              <span className={labelCls}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <span className={styles.stepConnector} />}
          </Fragment>
        );
      })}
    </div>
  );
}
