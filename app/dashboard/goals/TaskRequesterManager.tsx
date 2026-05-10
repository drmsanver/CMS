"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTaskRequester, updateTaskRequester, deleteTaskRequester } from "@/app/actions/task-requester";

export default function TaskRequesterManager({ requesters, onClose }: { requesters: any[], onClose?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateTaskRequester(editId, name);
      } else {
        await createTaskRequester(name);
      }
      setName("");
      setEditId(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteTaskRequester(id);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          required 
          value={name} 
          onChange={e => setName(e.target.value)} 
          className="input-field" 
          placeholder="e.g. MEB, College Principal" 
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? '...' : (editId ? 'Update' : 'Add')}
        </button>
        {editId && <button type="button" onClick={() => { setEditId(null); setName(""); }} className="btn-secondary">Cancel</button>}
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
        {requesters.map(r => (
          <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span>{r.name}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => { setEditId(r.id); setName(r.name); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
              <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
