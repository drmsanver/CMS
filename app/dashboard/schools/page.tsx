import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SchoolManager from "./SchoolManager";

export default async function SchoolsPage() {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;

  const schools = await prisma.campus.findMany({
    where: { organizationId },
    orderBy: { orderWeight: 'desc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Schools / Branches</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Manage your school branches and campus details.
        </p>
      </div>

      <SchoolManager initialSchools={JSON.parse(JSON.stringify(schools))} />
    </div>
  );
}
