import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StudentManager from "./StudentManager";

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;
  const campusId = (session?.user as any)?.campusId;
  const userId = (session?.user as any)?.id;
  const currentRole = (session?.user as any)?.role;

  if (!organizationId) return <div>Not logged in</div>;

  // Fetch filter options based on organization
  const campuses = await prisma.campus.findMany({
    where: { organizationId },
    orderBy: { name: 'asc' }
  });

  const schools = await prisma.school.findMany({
    where: { campus: { organizationId } },
    orderBy: { name: 'asc' }
  });

  const classrooms = await prisma.classroom.findMany({
    where: { campus: { organizationId } },
    orderBy: { name: 'asc' }
  });

  // Build initial WHERE clause based on role (similar to existing logic but will be refined in client)
  let whereClause: any = { campus: { organizationId } };

  if (currentRole === 'COUNSELOR') {
    const gradeAssignments = await prisma.counselorGradeAssignment.findMany({
      where: { userId },
      select: { gradeLevel: true }
    });
    const assignedGrades = gradeAssignments.map(g => g.gradeLevel);

    if (assignedGrades.length > 0) {
      whereClause.gradeLevel = { in: assignedGrades };
    } else {
      whereClause.gradeLevel = { in: [] };
    }
    // Also counselor is usually bound to a campus
    if (campusId) {
      whereClause.campusId = campusId;
    }
  } else if (currentRole === 'PRINCIPAL' || currentRole === 'COORDINATOR') {
    if (campusId) {
      whereClause.campusId = campusId;
    }
  }

  const students = await prisma.student.findMany({
    where: whereClause,
    orderBy: { lastName: 'asc' },
    include: {
      campus: { select: { name: true } },
      school: { select: { name: true } },
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
      </div>

      <StudentManager
        initialStudents={JSON.parse(JSON.stringify(students))}
        campuses={JSON.parse(JSON.stringify(campuses))}
        schools={JSON.parse(JSON.stringify(schools))}
        classrooms={JSON.parse(JSON.stringify(classrooms))}
        currentRole={currentRole}
      />
    </div>
  );
}

