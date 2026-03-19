import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TeacherManager from "./TeacherManager";

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
        select: { id: true, name: true, gradeLevel: true }
      }
    }
  });

  const classrooms = await prisma.classroom.findMany({
    where: { campusId },
    select: { id: true, name: true, gradeLevel: true },
    orderBy: [{ gradeLevel: 'asc' }, { name: 'asc' }]
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

      {teachers.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No teachers found for this campus.
        </div>
      ) : (
        <TeacherManager 
          initialTeachers={JSON.parse(JSON.stringify(teachers))} 
          classrooms={JSON.parse(JSON.stringify(classrooms))} 
        />
      )}
    </div>
  );
}
