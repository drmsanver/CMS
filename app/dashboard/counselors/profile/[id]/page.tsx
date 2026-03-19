import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GradeAssigner from "./GradeAssigner";

export default async function CounselorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;
  
  const counselor = await prisma.user.findUnique({
    where: { id },
    include: {
      counselingRecords: {
        include: { student: true },
        orderBy: { date: 'desc' }
      },
      counselorGrades: {
        select: { gradeLevel: true }
      }
    }
  });

  if (!counselor || counselor.role !== 'COUNSELOR') {
    return notFound();
  }

  const assignedGrades = counselor.counselorGrades.map((g: any) => g.gradeLevel);
  const canManageGrades = ['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole);

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

      {/* Grade Assignments */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Assigned Grade Levels</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          This counselor can view and manage students from the assigned grade levels below.
        </p>
        {canManageGrades ? (
          <GradeAssigner counselorId={id} initialGrades={assignedGrades} />
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {assignedGrades.length === 0 ? (
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No grade levels assigned.</span>
            ) : (
              assignedGrades.map((g: string) => (
                <span key={g} style={{ background: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 500 }}>
                  Grade {g}
                </span>
              ))
            )}
          </div>
        )}
      </div>

      {/* Embedded Counseling Logs */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Administered Counseling Logs</h3>
        {counselor.counselingRecords.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No counseling records maintained by this counselor yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {counselor.counselingRecords.map((record: any) => (
              <div key={record.id} style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-main)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{record.subject}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{new Date(record.date).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  Involved Student: <b>{record.student.firstName} {record.student.lastName}</b> ({record.student.studentNumber})
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>{record.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
