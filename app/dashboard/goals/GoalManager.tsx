"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGoal, updateGoal, deleteGoal } from "@/app/actions/goal";
import Link from "next/link";
import TaskRequesterManager from "./TaskRequesterManager";

function ManagedModal({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        <h3 style={{ marginBottom: '1.5rem' }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

const MANDATED_BY_OPTIONS = [
  "MEB",
  "College Administration",
  "School Principal",
  "Teachers",
  "Counselors"
];

export default function GoalManager({ initialGoals, requesters }: { initialGoals: any[], requesters: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    mandatedBy: "",
    requesterId: ""
  });

  const [showRequesterModal, setShowRequesterModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateGoal(editId, formData);
      } else {
        await createGoal(formData);
      }
      handleCancel();
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (goal: any) => {
    setEditId(goal.id);
    setFormData({
      code: goal.code,
      title: goal.title,
      description: goal.description || "",
      mandatedBy: goal.mandatedBy || "",
      requesterId: goal.requesterId || ""
    });
    setShowAdd(true);
  };

  const handleCancel = () => {
    setShowAdd(false);
    setEditId(null);
    setFormData({ code: "", title: "", description: "", mandatedBy: "", requesterId: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteGoal(id);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <Link href="/dashboard/coordinator-tasks" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
        ← Back to Tasks
      </Link>

      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ alignSelf: 'flex-start' }}>+ Define New Goal</button>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{editId ? "Edit Goal" : "New Strategic Goal"}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Goal Code</label>
              <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="input-field" placeholder="e.g. G-2025-01" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Short Title</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" placeholder="e.g. Student Well-being" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Mandated By (Requester)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  required
                  value={formData.requesterId} 
                  onChange={e => setFormData({...formData, requesterId: e.target.value})} 
                  className="input-field"
                  style={{ flex: 1 }}
                >
                  <option value="">Select Requester...</option>
                  {requesters.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <button type="button" onClick={() => setShowRequesterModal(true)} className="btn-secondary" style={{ padding: '0.5rem' }}>⚙️</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field" style={{ minHeight: '100px' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', gridColumn: 'span 2' }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>{loading ? 'Saving...' : (editId ? 'Update Goal' : 'Save Goal')}</button>
              <button type="button" onClick={handleCancel} className="btn-secondary" style={{ padding: '0.75rem 2rem' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-main)' }}>
              <th style={{ padding: '1rem' }}>Code</th>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Mandated By</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialGoals.map(goal => (
              <tr key={goal.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{goal.code}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 500 }}>{goal.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{goal.description}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--bg-main)', borderRadius: '4px' }}>
                    {goal.requester?.name || goal.mandatedBy || 'Not specified'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => startEdit(goal)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}>✏️</button>
                    <button onClick={() => handleDelete(goal.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showRequesterModal && (
        <ManagedModal title="Manage Task Requesters" onClose={() => setShowRequesterModal(false)}>
          <TaskRequesterManager requesters={requesters} />
        </ManagedModal>
      )}
    </div>
  );
}
