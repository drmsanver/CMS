import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTeachers } from "@/app/actions/teacher";
import { getTeacherBranches } from "@/app/actions/teacher-branch";
import TeacherManager from "./TeacherManager";

export default async function TeachersPage() {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;

  const branches = await prisma.campus.findMany({
    where: { organizationId },
    include: { schools: true },
    orderBy: { orderWeight: 'desc' }
  });

  // Flat list of all schools for easier lookup/filtering if needed
  const allSchools = await prisma.school.findMany({
    where: { campus: { organizationId } },
    include: { campus: true },
    orderBy: { name: 'asc' }
  });

  const teacherBranches = await getTeacherBranches();
  const initialTeachers = await getTeachers();

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Teacher Management</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Manage your organization's teachers, assign them to schools and teaching branches, and import in bulk.
        </p>
      </div>

      <TeacherManager 
        initialBranches={JSON.parse(JSON.stringify(branches))} 
        initialSchools={JSON.parse(JSON.stringify(allSchools))}
        initialTeachers={JSON.parse(JSON.stringify(initialTeachers))}
        teacherBranches={JSON.parse(JSON.stringify(teacherBranches))}
      />
    </div>
  );
}
