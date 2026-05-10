import { getAllUsers } from "@/app/actions/user_management";
import UserManager from "./UserManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN'].includes(role)) {
    redirect('/dashboard');
  }

  const users = await getAllUsers();

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>User Management</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Manage all users within your organization. Reset passwords or update profiles.
        </p>
      </div>

      <UserManager initialUsers={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}
