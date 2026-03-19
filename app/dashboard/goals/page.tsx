import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GoalManager from "./GoalManager";

export default async function GoalsPage() {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;

  const goals = await prisma.goal.findMany({
    where: { campusId },
    orderBy: { code: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Goal Management</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Define strategic goals mandated by various authorities.
        </p>
      </div>

      <GoalManager initialGoals={JSON.parse(JSON.stringify(goals))} />
    </div>
  );
}
