import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import InfrastructureManager from "./InfrastructureManager";

export default async function InfrastructurePage() {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;

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
        <h2>Infrastructure & Participants</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Manage global activity types and participant groups.
        </p>
      </div>

      <InfrastructureManager 
        initialActivityTypes={JSON.parse(JSON.stringify(activityTypes))} 
        initialParticipants={JSON.parse(JSON.stringify(participants))}
      />
    </div>
  );
}
