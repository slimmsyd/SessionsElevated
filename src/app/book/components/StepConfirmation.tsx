"use client";
import Link from "next/link";
import { CURRENT_SESSION } from "@/lib/sessions";
import styles from "../book.module.css";

type Props = {
  code: string;
  email: string;
};

export default function StepConfirmation({ code, email }: Props) {
  return (
    <div style={{ paddingTop: 24 }}>
      <div className={styles.confirmCheck} aria-hidden="true">
        ✓
      </div>
      <h2 className={`h2 ${styles.confirmHeading}`}>
        Your seat is held.
        <br />
        <em>See you in the room.</em>
      </h2>
      <p className={`body ${styles.confirmIntro}`}>
        A confirmation is on its way to{" "}
        <strong style={{ color: "var(--ink)" }}>
          {email || "your inbox"}
        </strong>
        . Save this reference in case you need to write us — we&apos;ll match it to
        your reservation.
      </p>

      <div className={styles.confirmDetails}>
        <div>
          <div className="label" style={{ marginBottom: 8 }}>
            Reference
          </div>
          <div className={styles.confirmRefValue}>{code}</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 8 }}>
            When
          </div>
          <div className="body" style={{ color: "var(--ink)" }}>
            {CURRENT_SESSION.date}
          </div>
        </div>
        <div className={styles.confirmFullSpan}>
          <div className="label" style={{ marginBottom: 8 }}>
            Where
          </div>
          <div className="body" style={{ color: "var(--ink)" }}>
            {CURRENT_SESSION.location}
          </div>
        </div>
      </div>

      <div className={styles.confirmActions}>
        <Link
          href="/"
          className="btn"
          style={{ background: "var(--ink)", color: "var(--bg)" }}
        >
          Return home <span className="arrow">→</span>
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn"
        >
          Print receipt
        </button>
      </div>
    </div>
  );
}
