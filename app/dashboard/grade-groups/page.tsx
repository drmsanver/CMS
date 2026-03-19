import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GradeGroupManager from "./GradeGroupManager";

export default async function GradeGroupsPage() {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;

  const gradeGroups = await prisma.gradeGroup.findMany({
    where: { campusId },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Grade Groups</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Define categories (e.g. "Primary School", "LGS Prep") to assign unified tasks.
        </p>
      </div>

      <GradeGroupManager initialGroups={JSON.parse(JSON.stringify(gradeGroups))} />
    </div>
  );
}
