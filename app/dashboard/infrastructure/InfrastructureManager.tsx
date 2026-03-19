"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createActivityType, createParticipant } from "@/app/actions/infrastructure";

export default function InfrastructureManager({ initialActivityTypes, initialParticipants }: { initialActivityTypes: any[], initialParticipants: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newParticipantName, setNewParticipantName] = useState("");

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createActivityType(newTypeName);
      setNewTypeName("");
      router.refresh();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createParticipant(newParticipantName);
      setNewParticipantName("");
      router.refresh();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Activity Types</h3>
        <form onSubmit={handleAddType} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input required value={newTypeName} onChange={e => setNewTypeName(e.target.value)} className="input-field" placeholder="e.g. Seminar" />
          <button disabled={loading} className="btn-primary">Add</button>
        </form>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {initialActivityTypes.map(t => (
            <span key={t.id} style={{ background: 'var(--bg-main)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.875rem', border: '1px solid var(--border-subtle)' }}>{t.name}</span>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Participants / Entities</h3>
        <form onSubmit={handleAddParticipant} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input required value={newParticipantName} onChange={e => setNewParticipantName(e.target.value)} className="input-field" placeholder="e.g. Main College" />
          <button disabled={loading} className="btn-primary">Add</button>
        </form>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {initialParticipants.map(p => (
            <span key={p.id} style={{ background: 'var(--bg-main)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.875rem', border: '1px solid var(--border-subtle)' }}>{p.name}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
