"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  createActivityType, updateActivityType, deleteActivityType,
  createParticipant, updateParticipant, deleteParticipant 
} from "@/app/actions/infrastructure";
import Link from "next/link";

export default function InfrastructureManager({ activityTypes, participants }: { activityTypes: any[], participants: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [participantName, setParticipantName] = useState("");
  
  const [editType, setEditType] = useState<any>(null);
  const [editPart, setEditPart] = useState<any>(null);

  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editType) {
        await updateActivityType(editType.id, typeName);
        setEditType(null);
      } else {
        await createActivityType(typeName);
      }
      setTypeName("");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save activity type.");
    } finally {
      setLoading(false);
    }
  };

  const handlePartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editPart) {
        await updateParticipant(editPart.id, participantName);
        setEditPart(null);
      } else {
        await createParticipant(participantName);
      }
      setParticipantName("");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save participant.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteType = async (id: string) => {
    if (!confirm("Are you sure? This might affect existing tasks.")) return;
    try { await deleteActivityType(id); router.refresh(); } catch (err: any) { alert(err.message); }
  };

  const handleDeletePart = async (id: string) => {
    if (!confirm("Are you sure? This might affect existing tasks.")) return;
    try { await deleteParticipant(id); router.refresh(); } catch (err: any) { alert(err.message); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <Link href="/dashboard/coordinator-tasks" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
        ← Back to Tasks
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      
      {/* Activity Types */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Activity Types</h3>
        <form onSubmit={handleTypeSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input required value={typeName} onChange={e => setTypeName(e.target.value)} className="input-field" placeholder="Seminar, Meeting..." />
          <button type="submit" disabled={loading} className="btn-primary">{loading ? '...' : (editType ? 'Update' : 'Add')}</button>
          {editType && <button type="button" onClick={() => {setEditType(null); setTypeName("");}} className="btn-secondary">Cancel</button>}
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {activityTypes.map(t => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span>{t.name}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => {setEditType(t); setTypeName(t.name);}} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}>✏️</button>
                <button onClick={() => handleDeleteType(t.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Participants */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Participants</h3>
        <form onSubmit={handlePartSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input required value={participantName} onChange={e => setParticipantName(e.target.value)} className="input-field" placeholder="Main College, Branch X..." />
          <button type="submit" disabled={loading} className="btn-primary">{loading ? '...' : (editPart ? 'Update' : 'Add')}</button>
          {editPart && <button type="button" onClick={() => {setEditPart(null); setParticipantName("");}} className="btn-secondary">Cancel</button>}
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {participants.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span>{p.name}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => {setEditPart(p); setParticipantName(p.name);}} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}>✏️</button>
                <button onClick={() => handleDeletePart(p.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      </div>
    </div>
  );
}
