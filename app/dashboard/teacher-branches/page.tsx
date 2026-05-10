import { getTeacherBranches } from "@/app/actions/teacher-branch";
import TeacherBranchManager from "./TeacherBranchManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TeacherBranchesPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN'].includes(role)) {
    redirect('/dashboard');
  }

  const branches = await getTeacherBranches();

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Teaching Branches</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Define the subjects or departments teachers can be assigned to (e.g., Mathematics, Science).
        </p>
      </div>

      <TeacherBranchManager initialBranches={JSON.parse(JSON.stringify(branches))} />
    </div>
  );
}
