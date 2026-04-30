"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./admin.module.css";

export default function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    if (pending) return;
    setPending(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      /* ignore — cookie clear is best effort */
    }
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className={styles.signOut}
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
