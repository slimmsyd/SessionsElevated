import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-auth";
import SignOutButton from "./SignOutButton";
import NavLink from "./NavLink";
import styles from "./admin.module.css";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  const session = verifySession(token);
  if (!session) redirect("/admin/login");

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div>
          <Link href="/" className={`label ${styles.brand}`}>
            ← Elevated Sessions
          </Link>
          <div className={styles.brandSubtitle}>
            <span className="label">§ Admin</span>
          </div>
          <nav className={styles.nav}>
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/tiers">Tiers &amp; pricing</NavLink>
            <NavLink href="/admin/copy">Session copy</NavLink>
            <NavLink href="/admin/bookings">Bookings</NavLink>
          </nav>
        </div>
        <SignOutButton />
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
