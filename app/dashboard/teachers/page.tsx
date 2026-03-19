import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TeachersPage() {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const currentRole = (session?.user as any)?.role;

  const teachers = await prisma.user.findMany({
    where: { 
      campusId,
      role: 'TEACHER' 
    },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      primaryClassroom: {
        select: { name: true, gradeLevel: true }
      }
    }
  });

  const canCreate = ['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Teachers Directory</h2>
        {canCreate && (
          <Link href="/dashboard/teachers/new" className="btn-primary">Add New Teacher</Link>
        )}
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-main)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email Address</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Primary Classroom</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No teachers found for this campus.
                </td>
              </tr>
            ) : (
              teachers.map((teacher: any) => (
                <tr key={teacher.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>
                        {teacher.name.charAt(0).toUpperCase()}
                      </div>
                      {teacher.name}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{teacher.email}</td>
                  <td style={{ padding: '1rem' }}>
                    {teacher.primaryClassroom ? (
                      <span style={{ background: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 500 }}>
                        {teacher.primaryClassroom.name} (Grade {teacher.primaryClassroom.gradeLevel})
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Not assigned</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {new Date(teacher.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
