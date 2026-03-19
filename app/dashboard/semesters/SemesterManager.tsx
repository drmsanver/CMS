"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSemester, deleteSemester } from "@/app/actions/semester";

export default function SemesterManager({ initialSemesters }: { initialSemesters: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSemester({ name });
      setName("");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>New Semester Name</label>
            <input required value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="e.g. 2025-2026 Spring" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ height: '42px' }}>{loading ? 'Adding...' : 'Add Semester'}</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {initialSemesters.map(s => (
          <div key={s.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>{s.name}</span>
            <button onClick={() => deleteSemester(s.id).then(() => router.refresh())} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
