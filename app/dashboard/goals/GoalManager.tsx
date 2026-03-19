"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGoal, deleteGoal } from "@/app/actions/goal";

const MANDATED_BY_OPTIONS = [
  "MEB",
  "College Administration",
  "School Principal",
  "Teachers",
  "Counselors"
];

export default function GoalManager({ initialGoals }: { initialGoals: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    mandatedBy: "MEB"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createGoal(formData);
      setFormData({ code: "", title: "", description: "", mandatedBy: "MEB" });
      setShowAdd(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ alignSelf: 'flex-start' }}>+ Define New Goal</button>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>New Strategic Goal</h3>
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
              <label>Mandated By</label>
              <select value={formData.mandatedBy} onChange={e => setFormData({...formData, mandatedBy: e.target.value})} className="input-field">
                {MANDATED_BY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field" style={{ minHeight: '100px' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', gridColumn: 'span 2' }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>{loading ? 'Saving...' : 'Save Goal'}</button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary" style={{ padding: '0.75rem 2rem' }}>Cancel</button>
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
                  <div>{goal.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{goal.description}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--bg-main)', borderRadius: '4px' }}>{goal.mandatedBy}</span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button onClick={() => deleteGoal(goal.id).then(() => router.refresh())} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
