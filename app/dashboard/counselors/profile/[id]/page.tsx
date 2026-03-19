import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CounselorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const counselor = await prisma.user.findUnique({
    where: { id },
    include: {
      counselingRecords: {
        include: { student: true },
        orderBy: { date: 'desc' }
      }
    }
  });

  console.log("Fetching Counselor ID:", id, "Result:", counselor);

  if (!counselor || counselor.role !== 'COUNSELOR') {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        Counselor {id} not found or invalid role. 
        <br/>
        Data: {JSON.stringify(counselor)}
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard/counselors" className="btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>← Back</Link>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Counselor Profile</h2>
        </div>
      </div>

      {/* Main Profile Shell */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600 }}>
          {counselor.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{counselor.name}</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
            <span>📧 {counselor.email}</span>
            <span>📅 Joined {new Date(counselor.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
      </div>

      {/* Embedded Counseling Logs associated with this Teacher */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Administered Counseling Logs</h3>
        {counselor.counselingRecords.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No counseling records maintained by this counselor yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {counselor.counselingRecords.map((record: any) => (
              <div key={record.id} style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-main)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{record.topic}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{new Date(record.date).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  Involved Student: <b>{record.student.firstName} {record.student.lastName}</b> ({record.student.studentNumber})
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>{record.notes}</p>
                
                {record.actionItems && (
                   <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'hsla(38, 92%, 50%, 0.1)', border: '1px solid var(--color-warning)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '0.875rem' }}>
                     <strong style={{ color: 'var(--color-warning)' }}>Action Required:</strong> {record.actionItems}
                   </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
