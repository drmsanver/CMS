import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCampusTypes } from "@/app/actions/campus-type";
import BranchManager from "./BranchManager";

export default async function SchoolsPage() {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;

  const branches = await prisma.campus.findMany({
    where: { organizationId },
    include: { 
      schools: {
        orderBy: { orderWeight: 'desc' }
      }, 
      type: true 
    },
    orderBy: { orderWeight: 'desc' }
  });

  const campusTypes = await getCampusTypes();

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Branch Management</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Manage your organization's branches and campus details.
        </p>
      </div>

      <BranchManager 
        initialBranches={JSON.parse(JSON.stringify(branches))} 
        campusTypes={JSON.parse(JSON.stringify(campusTypes))}
      />
    </div>
  );
}
