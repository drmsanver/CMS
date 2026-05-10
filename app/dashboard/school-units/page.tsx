import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SchoolUnitManager from "./SchoolUnitManager";

export default async function SchoolUnitsPage() {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;

  if (!organizationId) return <div>Not logged in</div>;

  const campuses = await prisma.campus.findMany({
    where: { organizationId },
    orderBy: { name: 'asc' }
  });

  const schools = await prisma.school.findMany({
    where: {
      campus: { organizationId }
    },
    include: {
      campus: true
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>School Units</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Manage Kindergarten, Elementary, Middle, and High School units within your branches.
        </p>
      </div>

      <SchoolUnitManager 
        initialSchools={JSON.parse(JSON.stringify(schools))} 
        campuses={JSON.parse(JSON.stringify(campuses))} 
      />
    </div>
  );
}
