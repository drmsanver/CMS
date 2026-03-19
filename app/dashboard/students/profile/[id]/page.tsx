import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      records: {
        include: { counselor: true },
        orderBy: { date: 'desc' }
      },
      observations: {
        include: { teacher: true },
        orderBy: { date: 'desc' }
      }
    }
  });

  if (!student) {
    notFound();
  }

  return (
    <div className="animate-fade-in">
      {/* Header section */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{student.firstName} {student.lastName}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>ID: {student.studentNumber} • Grade: {student.gradeLevel}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary">Export MEB Report (PDF)</button>
          <button className="btn-primary">+ New Record</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Counseling Records List */}
        <div className="glass-panel" style={{ padding: '1.5rem', maxHeight: '600px', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            Counseling Records
            <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
              ({student.records.length} entries)
            </span>
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {student.records.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No records attached yet.</p>
            ) : (
              student.records.map((record: any) => (
                <div key={record.id} style={{ 
                  padding: '1rem', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '12px',
                  background: 'var(--bg-main)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>{record.subject}</h3>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{record.notes}</p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Added by: {record.counselor.name} {record.isConfidential && '🔒 Confidential'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Observation Reports */}
        <div className="glass-panel" style={{ padding: '1.5rem', maxHeight: '600px', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            Teacher Observations
            <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
              ({student.observations.length} entries)
            </span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {student.observations.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No teacher observations.</p>
            ) : (
              student.observations.map((obs: any) => (
                <div key={obs.id} style={{ 
                  padding: '1rem', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '12px',
                  background: 'var(--bg-main)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      background: 'var(--border-subtle)',
                      fontWeight: 600
                    }}>
                      {obs.behaviorType}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {new Date(obs.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{obs.notes}</p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Reported by: {obs.teacher.name}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
