"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGradeGroup, updateGradeGroup, deleteGradeGroup } from "@/app/actions/coordinator";

const ALL_GRADES = [
  "Pre-school (Age 2)", "Pre-school (Age 3)", "Pre-school (Age 4)", "Kindergarten",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
];

export default function GradeGroupManager({ initialGroups }: { initialGroups: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    grades: [] as string[]
  });

  const toggleGrade = (grade: string) => {
    setFormData(prev => ({
      ...prev,
      grades: prev.grades.includes(grade) 
        ? prev.grades.filter(g => g !== grade) 
        : [...prev.grades, grade]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.grades.length === 0) return alert("Please select at least one grade.");
    setLoading(true);
    try {
      if (editId) {
        await updateGradeGroup(editId, formData);
      } else {
        await createGradeGroup(formData);
      }
      setShowAdd(false);
      setEditId(null);
      setFormData({ name: "", grades: [] });
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save grade group.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (group: any) => {
    setEditId(group.id);
    setFormData({ name: group.name, grades: group.grades });
    setShowAdd(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete group "${name}"?`)) return;
    setLoading(true);
    try {
      await deleteGradeGroup(id);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ alignSelf: 'flex-start' }}>+ Create Grade Group</button>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{editId ? 'Edit' : 'New'} Grade Group</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Group Name</label>
              <input 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-primary)' }} 
                placeholder="e.g. Middle School" 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Select Grades</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {ALL_GRADES.map(grade => {
                  const isSelected = formData.grades.includes(grade);
                  return (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => toggleGrade(grade)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'var(--color-primary)' : 'var(--bg-main)',
                        color: isSelected ? '#fff' : 'var(--text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      {grade}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                {loading ? 'Saving...' : 'Save Group'}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowAdd(false); setEditId(null); setFormData({name: "", grades: []}); }} 
                className="btn-secondary"
                style={{ padding: '0.75rem 2rem' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {initialGroups.map(group => (
          <div key={group.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{group.name}</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => startEdit(group)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                  <button onClick={() => handleDelete(group.id, group.name)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {group.grades.map((g: string) => (
                  <span key={g} style={{ background: 'var(--bg-main)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{g}</span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Created {new Date(group.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
