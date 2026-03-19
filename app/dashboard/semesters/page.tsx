import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SemesterManager from "./SemesterManager";

export default async function SemestersPage() {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;

  const semesters = await prisma.semester.findMany({
    where: { campusId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Semesters</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Organize academic periods (e.g. "2025-2026 Spring").
        </p>
      </div>

      <SemesterManager initialSemesters={JSON.parse(JSON.stringify(semesters))} />
    </div>
  );
}
