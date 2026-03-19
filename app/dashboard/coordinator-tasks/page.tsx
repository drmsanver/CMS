import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CoordinatorTaskManager from "./CoordinatorTaskManager";

export default async function CoordinatorTasksPage() {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;

  const tasks = await prisma.task.findMany({
    where: {
      createdBy: { campusId }
    },
    include: {
      gradeGroups: true,
      assignedTo: { select: { name: true } },
      semester: true,
      activityType: true,
      goals: true,
      participants: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const gradeGroups = await prisma.gradeGroup.findMany({
    where: { campusId },
    orderBy: { name: 'asc' }
  });

  const semesters = await prisma.semester.findMany({
    where: { campusId },
    orderBy: { createdAt: 'desc' }
  });

  const goals = await prisma.goal.findMany({
    where: { campusId },
    orderBy: { code: 'asc' }
  });

  const activityTypes = await prisma.activityType.findMany({
    where: { campusId },
    orderBy: { name: 'asc' }
  });

  const participants = await prisma.participant.findMany({
    where: { campusId },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Coordinator Tasks</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Create and track tasks assigned to specific grade groups.
        </p>
      </div>

      <CoordinatorTaskManager 
        initialTasks={JSON.parse(JSON.stringify(tasks))} 
        gradeGroups={JSON.parse(JSON.stringify(gradeGroups))}
        semesters={JSON.parse(JSON.stringify(semesters))}
        goals={JSON.parse(JSON.stringify(goals))}
        activityTypes={JSON.parse(JSON.stringify(activityTypes))}
        participants={JSON.parse(JSON.stringify(participants))}
      />
    </div>
  );
}
