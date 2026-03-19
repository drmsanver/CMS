import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const userId = (session?.user as any)?.id;
  const currentRole = (session?.user as any)?.role;

  // Build WHERE clause based on role
  let whereClause: any = { campusId };

  // If the user is a COUNSELOR, filter students by their assigned grade levels
  if (currentRole === 'COUNSELOR') {
    const gradeAssignments = await prisma.counselorGradeAssignment.findMany({
      where: { userId },
      select: { gradeLevel: true }
    });
    const assignedGrades = gradeAssignments.map(g => g.gradeLevel);

    if (assignedGrades.length > 0) {
      whereClause.gradeLevel = { in: assignedGrades };
    } else {
      // Counselor with no grade assignments sees no students
      whereClause.gradeLevel = { in: [] };
    }
  }
  
  const students = await prisma.student.findMany({
    where: whereClause,
    orderBy: { lastName: 'asc' },
    include: {
      classroom: { select: { name: true } },
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

      {currentRole === 'COUNSELOR' && (
        <div style={{ 
          padding: '0.75rem 1rem', 
          background: 'hsla(220, 80%, 60%, 0.1)', 
          border: '1px solid hsla(220, 80%, 60%, 0.3)', 
          borderRadius: '8px', 
          marginBottom: '1.5rem', 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)' 
        }}>
          📋 Showing students from your assigned grade levels only. Contact an administrator to modify your grade assignments.
        </div>
      )}

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-main)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Grade Level</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Classroom</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Counseling Records</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
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
                    {student.classroom ? (
                      <span style={{ background: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem' }}>
                        {student.classroom.name}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>—</span>
                    )}
                  </td>
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
