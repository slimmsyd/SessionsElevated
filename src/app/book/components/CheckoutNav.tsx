import Link from "next/link";
import styles from "../book.module.css";

export default function CheckoutNav() {
  return (
    <nav className={styles.checkoutNav} aria-label="Checkout navigation">
      <div className="shell">
        <div className={styles.checkoutNavRow}>
          <Link href="/" className="brand" style={{ textDecoration: "none", color: "var(--ink)" }}>
            <span className="brand-mark" />
            Elevated Sessions
          </Link>
          <Link href="/" className={styles.checkoutBack}>
            ← Back to site
          </Link>
        </div>
      </div>
    </nav>
  );
}
