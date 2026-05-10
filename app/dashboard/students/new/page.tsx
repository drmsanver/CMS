import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StudentForm from "./StudentForm";

export default async function NewStudentPage() {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;

  if (!organizationId) return <div>Not logged in</div>;

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

  return (
    <StudentForm 
      campuses={JSON.parse(JSON.stringify(campuses))}
      schools={JSON.parse(JSON.stringify(schools))}
      classrooms={JSON.parse(JSON.stringify(classrooms))}
    />
  );
}
