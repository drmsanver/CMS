import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  
  const tasks = await prisma.task.findMany({
    where: { assignedToId: (session?.user as any)?.id },
    include: { createdBy: true },
    orderBy: { dueDate: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Tasks</h2>
        <button className="btn-primary">Create Task</button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-main)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Title</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Assigned By</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Due Date</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No pending tasks!
                </td>
              </tr>
            ) : (
              tasks.map((task: any) => (
                <tr key={task.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      background: task.status === 'PENDING' ? 'var(--color-warning)' : 'var(--color-success)',
                      color: 'black',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}>
                      {task.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{task.title}</td>
                  <td style={{ padding: '1rem' }}>{task.createdBy.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Mark Done</button>
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
