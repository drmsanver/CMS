import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CounselorsPage() {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const currentRole = (session?.user as any)?.role;

  const counselors = await prisma.user.findMany({
    where: { 
      campusId: campusId,
      role: 'COUNSELOR' 
    },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: {
        select: {
          counselingRecords: true
        }
      }
    }
  });

  const canCreate = ['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Counselors Directory</h2>
        {canCreate && (
          <Link href="/dashboard/counselors/new" className="btn-primary">Add New Counselor</Link>
        )}
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-main)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email Address</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Joined Date</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Records Managed</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {counselors.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No counselors found for this campus.
                </td>
              </tr>
            ) : (
              counselors.map((counselor: any) => (
                <tr key={counselor.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>
                        {counselor.name.charAt(0).toUpperCase()}
                      </div>
                      {counselor.name}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{counselor.email}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {new Date(counselor.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      background: 'var(--bg-main)', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}>
                      {counselor._count.counselingRecords} Cases
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link href={`/dashboard/counselors/profile/${counselor.id}`} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}>Manage</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
