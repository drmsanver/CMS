import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import styles from "./layout.module.css";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span style={{color: 'var(--color-primary)'}}>Edu</span>Care
        </div>
        
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navItem}>Dashboard</Link>
          <Link href="/dashboard/students" className={styles.navItem}>Students</Link>
          <Link href="/dashboard/counselors" className={styles.navItem}>Counselors</Link>
          <Link href="/dashboard/tasks" className={styles.navItem}>Tasks</Link>
          <Link href="/dashboard/events" className={styles.navItem}>Events</Link>
        </nav>

        <div className={styles.userSection}>
          <div className={styles.avatar}>
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name || "User"}</span>
            <span className={styles.userRole}>{user.role || "Role"}</span>
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Overview</h1>
          <LogoutButton />
        </header>

        <div className={styles.scrollArea}>
          {children}
        </div>
      </main>
    </div>
  );
}
