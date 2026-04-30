import { store } from "@/lib/admin-store";
import CopyEditor from "./CopyEditor";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminCopyPage() {
  const session = await store.getSession();

  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <span className={`label ${styles.pageHeaderEyebrow}`}>Content</span>
          <h1 className="h2">Session copy</h1>
          <p className={styles.statSub}>
            Edit the session details that appear on the booking page and
            confirmation screen.
          </p>
        </div>
      </header>

      <CopyEditor session={session} />
    </>
  );
}
