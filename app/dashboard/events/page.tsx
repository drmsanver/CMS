import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  
  const events = await prisma.event.findMany({
    where: { organizerId: (session?.user as any)?.id },
    orderBy: { startTime: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Counseling Events & Seminars</h2>
        <button className="btn-primary">Schedule Event</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {events.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No scheduled events. Click 'Schedule Event' to create one.</p>
        ) : (
          events.map((evt: any) => (
            <div key={evt.id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px',
                background: 'var(--border-subtle)',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {evt.eventType}
              </span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                {evt.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {evt.description || 'No description provided.'}
              </p>
              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {new Date(evt.startTime).toLocaleString()} - {new Date(evt.endTime).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
