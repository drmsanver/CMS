import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);
  
  const students = await prisma.student.findMany({
    where: { campusId: (session?.user as any)?.campusId },
    orderBy: { lastName: 'asc' },
    include: {
      _count: {
        select: { records: true, observations: true }
      }
    }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Students Directory</h2>
        <Link href="/dashboard/students/new" className="btn-primary">Add New Student</Link>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-main)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Grade Level</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Counseling Records</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student: any) => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem' }}>{student.studentNumber}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{student.firstName} {student.lastName}</td>
                  <td style={{ padding: '1rem' }}>Grade {student.gradeLevel}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      background: 'var(--bg-main)', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px',
                      fontSize: '0.875rem' 
                    }}>
                      {student._count.records} Records
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link href={`/dashboard/students/profile/${student.id}`} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}>View Directory</Link>
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
