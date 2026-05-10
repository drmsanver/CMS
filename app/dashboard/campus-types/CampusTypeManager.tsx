"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCampusType, updateCampusType, deleteCampusType } from "@/app/actions/campus-type";

export default function CampusTypeManager({ initialTypes }: { initialTypes: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateCampusType(editId, name);
      } else {
        await createCampusType(name);
      }
      setShowAdd(false);
      setEditId(null);
      setName("");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (type: any) => {
    setEditId(type.id);
    setName(type.name);
    setShowAdd(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ alignSelf: 'flex-start' }}>+ Add Campus Type</button>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '500px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{editId ? 'Edit' : 'Add'} Campus Type</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Type Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="e.g. Bağımsız, Okul" />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={() => { setShowAdd(false); setEditId(null); setName(""); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {initialTypes.map(type => (
          <div key={type.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>{type.name}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => startEdit(type)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
              <button onClick={() => { if(confirm('Delete?')) deleteCampusType(type.id).then(() => router.refresh()) }} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-error)' }}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
