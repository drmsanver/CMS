import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import InfrastructureManager from "../infrastructure/InfrastructureManager";

export default async function ActivityTypesPage() {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;

  const activityTypes = await prisma.defActivityType.findMany({
    where: { campusId },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Activity Type Management</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Define different types of activities such as seminars, meetings, etc.
        </p>
      </div>
      <InfrastructureManager activityTypes={JSON.parse(JSON.stringify(activityTypes))} participants={[]} />
    </div>
  );
}
