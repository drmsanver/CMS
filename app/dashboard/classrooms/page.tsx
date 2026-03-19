import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ClassroomManager from "./ClassroomManager";

export default async function ClassroomsPage() {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const currentRole = (session?.user as any)?.role;

  const classrooms = await prisma.classroom.findMany({
    where: { campusId },
    orderBy: [{ gradeLevel: 'asc' }, { name: 'asc' }],
    include: {
      primaryTeacher: { select: { id: true, name: true } },
      students: { 
        select: { id: true, firstName: true, lastName: true, studentNumber: true },
        orderBy: { lastName: 'asc' }
      },
      _count: { select: { students: true } }
    }
  });

  // Get all students for this campus that are NOT assigned to any classroom
  const unassignedStudents = await prisma.student.findMany({
    where: { campusId, classroomId: null },
    select: { id: true, firstName: true, lastName: true, studentNumber: true, gradeLevel: true },
    orderBy: { lastName: 'asc' }
  });

  // Get all teachers for this campus
  const allTeachers = await prisma.user.findMany({
    where: { campusId, role: 'TEACHER' },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  const canCreate = ['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Classrooms</h2>
        {canCreate && (
          <Link href="/dashboard/classrooms/new" className="btn-primary">Create Classroom</Link>
        )}
      </div>

      {classrooms.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No classrooms found. Create your first classroom to get started.
        </div>
      ) : (
        <ClassroomManager 
          classrooms={JSON.parse(JSON.stringify(classrooms))} 
          unassignedStudents={JSON.parse(JSON.stringify(unassignedStudents))} 
          allTeachers={JSON.parse(JSON.stringify(allTeachers))}
        />
      )}
    </div>
  );
}
