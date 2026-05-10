"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTeacherBranch, updateTeacherBranch, deleteTeacherBranch } from "@/app/actions/teacher-branch";

export default function TeacherBranchManager({ initialBranches }: { initialBranches: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [newOrder, setNewOrder] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", order: 0 });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTeacherBranch(newName, newOrder);
      setNewName("");
      setNewOrder(initialBranches.length + 1);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (b: any) => {
    setEditingId(b.id);
    setEditFormData({ name: b.name, order: b.order });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setLoading(true);
    try {
      await updateTeacherBranch(editingId, editFormData);
      setEditingId(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this teaching branch? This may affect teacher profiles.")) return;
    try {
      await deleteTeacherBranch(id);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Add Form */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Add New Branch</h4>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem' }}>Branch Name</label>
            <input required value={newName} onChange={e => setNewName(e.target.value)} className="input-field" placeholder="e.g. Robotik" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem' }}>Order ID</label>
            <input required type="number" value={newOrder} onChange={e => setNewOrder(Number(e.target.value))} className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ height: '42px' }}>{loading ? '...' : '+ Add'}</button>
        </form>
      </div>

      {/* List */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
              <th style={{ padding: '1rem', width: '80px' }}>Order</th>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem', width: '200px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialBranches.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {editingId === b.id ? (
                  <>
                    <td style={{ padding: '1rem' }}>
                      <input type="number" value={editFormData.order} onChange={e => setEditFormData({...editFormData, order: Number(e.target.value)})} className="input-field" style={{ width: '60px' }} />
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <input value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="input-field" />
                    </td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={handleUpdate} className="btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Save</button>
                      <button onClick={() => setEditingId(null)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Cancel</button>
                    </td >
                  </>
                ) : (
                  <>
                    <td style={{ padding: '1rem' }}>{b.order}</td>
                    <td style={{ padding: '1rem' }}>{b.name}</td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => startEdit(b)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Edit</button>
                      <button onClick={() => handleDelete(b.id)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: 'var(--color-error)' }}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
