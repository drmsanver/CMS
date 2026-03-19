import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Sample Metrics Cards */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Students</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>1,245</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Pending Parent Meetings</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--color-warning)' }}>8</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Observation Reports (This Mth)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--color-success)' }}>34</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2>Welcome back, {session?.user?.name || "User"}</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          You have 3 counseling tasks pending for this week. Please check your tasks table to stay compliant with MEB reporting guidelines.
        </p>
      </div>
    </div>
  );
}
