import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import InfrastructureManager from "../infrastructure/InfrastructureManager";

export default async function ParticipantsPage() {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;

  const participants = await prisma.defParticipant.findMany({
    where: { campusId },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Participant Management</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Define internal or external participants for your tasks.
        </p>
      </div>
      <InfrastructureManager activityTypes={[]} participants={JSON.parse(JSON.stringify(participants))} />
    </div>
  );
}
