import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TaskRequesterManager from "../goals/TaskRequesterManager";
import Link from "next/link";

export default async function TaskRequestersPage() {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;

  const requesters = await prisma.defTaskRequester.findMany({
    where: { campusId },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <Link href="/dashboard/coordinator-tasks" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        ← Back to Tasks
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Task Requester Management</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Manage authorities and departments that mandate tasks and goals.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <TaskRequesterManager requesters={JSON.parse(JSON.stringify(requesters))} />
      </div>
    </div>
  );
}
