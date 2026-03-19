"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCoordinatorTask } from "@/app/actions/coordinator";
import Link from "next/link";

export default function CoordinatorTaskManager({ 
  initialTasks, 
  gradeGroups,
  semesters,
  goals,
  activityTypes,
  participants
}: { 
  initialTasks: any[]; 
  gradeGroups: any[];
  semesters: any[];
  goals: any[];
  activityTypes: any[];
  participants: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    startDate: "",
    groupIds: [] as string[],
    semesterId: "",
    activityTypeId: "",
    goalIds: [] as string[],
    participantIds: [] as string[]
  });

  const toggleItem = (listName: 'groupIds' | 'goalIds' | 'participantIds', id: string) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].includes(id) 
        ? prev[listName].filter(item => item !== id) 
        : [...prev[listName], id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.groupIds.length === 0) return alert("Please select at least one grade group.");
    setLoading(true);
    try {
      await createCoordinatorTask({
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        semesterId: formData.semesterId || undefined,
        activityTypeId: formData.activityTypeId || undefined
      });
      setShowAdd(false);
      setFormData({ 
        title: "", description: "", dueDate: "", startDate: "", 
        groupIds: [], semesterId: "", activityTypeId: "", 
        goalIds: [], participantIds: [] 
      });
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ alignSelf: 'flex-start' }}>+ Create New Task</button>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>New Group Task</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Task Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" placeholder="Seminar on..." />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Semester</label>
                <select value={formData.semesterId} onChange={e => setFormData({...formData, semesterId: e.target.value})} className="input-field">
                  <option value="">Select Semester</option>
                  {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Start Date</label>
                <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="input-field" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Due Date</label>
                <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="input-field" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Activity Type</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select value={formData.activityTypeId} onChange={e => setFormData({...formData, activityTypeId: e.target.value})} className="input-field" style={{ flex: 1 }}>
                    <option value="">Type...</option>
                    {activityTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                  <Link href="/dashboard/infrastructure" className="btn-secondary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}>⚙️</Link>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Goals</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {goals.map(g => (
                  <button key={g.id} type="button" onClick={() => toggleItem('goalIds', g.id)} style={{
                    padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem',
                    border: formData.goalIds.includes(g.id) ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    background: formData.goalIds.includes(g.id) ? 'rgba(79, 70, 229, 0.1)' : 'var(--bg-main)',
                    color: formData.goalIds.includes(g.id) ? 'var(--color-primary)' : 'var(--text-primary)',
                    cursor: 'pointer'
                  }}>{g.code}: {g.title}</button>
                ))}
                <Link href="/dashboard/goals" style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textDecoration: 'underline', alignSelf: 'center' }}>+ Manage Goals</Link>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Participants</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {participants.map(p => (
                  <button key={p.id} type="button" onClick={() => toggleItem('participantIds', p.id)} style={{
                    padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem',
                    border: formData.participantIds.includes(p.id) ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    background: formData.participantIds.includes(p.id) ? 'rgba(79, 70, 229, 0.1)' : 'var(--bg-main)',
                    color: formData.participantIds.includes(p.id) ? 'var(--color-primary)' : 'var(--text-primary)',
                    cursor: 'pointer'
                  }}>{p.name}</button>
                ))}
                <Link href="/dashboard/infrastructure" style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textDecoration: 'underline', alignSelf: 'center' }}>+ Manage Participants</Link>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Target Grade Groups</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {gradeGroups.map(group => (
                  <button key={group.id} type="button" onClick={() => toggleItem('groupIds', group.id)} style={{
                    padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem',
                    border: formData.groupIds.includes(group.id) ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    background: formData.groupIds.includes(group.id) ? 'rgba(79, 70, 229, 0.1)' : 'var(--bg-main)',
                    color: formData.groupIds.includes(group.id) ? 'var(--color-primary)' : 'var(--text-primary)',
                    cursor: 'pointer'
                  }}>{group.name}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Documents / Attachments</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input id="new-attach" className="input-field" style={{ flex: 1 }} placeholder="File URL or name..." />
                <button type="button" onClick={() => {
                  const val = (document.getElementById('new-attach') as HTMLInputElement).value;
                  if (val) {
                    setFormData(prev => ({ ...prev, attachments: [...(prev as any).attachments || [], { fileName: val, fileUrl: val }] }));
                    (document.getElementById('new-attach') as HTMLInputElement).value = "";
                  }
                }} className="btn-secondary">Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {(formData as any).attachments?.map((at: any, i: number) => (
                  <span key={i} style={{ fontSize: '0.75rem', background: 'var(--bg-main)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                    📄 {at.fileName} <button type="button" onClick={() => setFormData(prev => ({ ...prev, attachments: (prev as any).attachments.filter((_: any, idx: number) => idx !== i) }))} style={{ color: 'var(--color-error)', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field" style={{ minHeight: '80px' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>{loading ? 'Creating...' : 'Create Task'}</button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary" style={{ padding: '0.75rem 2rem' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-main)' }}>
              <th style={{ padding: '1rem' }}>Task & Semester</th>
              <th style={{ padding: '1rem' }}>Targets & Goals</th>
              <th style={{ padding: '1rem' }}>Timeline</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {initialTasks.map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600 }}>{task.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {task.semester?.name || 'No Semester'} • {task.activityType?.name || 'No Type'}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.25rem' }}>
                    {task.gradeGroups.map((g: any) => <span key={g.id} style={{ fontSize: '0.7rem', background: 'var(--bg-main)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{g.name}</span>)}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {task.goals.map((g: any) => <span key={g.id} style={{ fontSize: '0.7rem', background: 'rgba(52, 211, 153, 0.1)', color: '#065f46', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{g.code}</span>)}
                  </div>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.8rem' }}>
                  <div>Start: {task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                   <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '999px', background: '#fef3c7', color: '#92400e' }}>{task.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
