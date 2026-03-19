"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addSchool, updateSchool, deleteSchool } from "@/app/actions/school";

const GRADE_OPTIONS = [
  "Pre-school (Age 2)", "Pre-school (Age 3)", "Pre-school (Age 4)", "Kindergarten",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
];

export default function SchoolManager({ initialSchools }: { initialSchools: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    shortName: "",
    principalName: "",
    address: "",
    phoneNumbers: [""] as string[],
    logoUrl: "",
    websiteUrl: "",
    email: "",
    orderWeight: 0,
    grades: [] as string[],
    images: [] as string[],
    newPhone: "",
    newImage: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { newPhone, newImage, ...submitData } = formData;
      if (editId) {
        await updateSchool(editId, submitData);
      } else {
        await addSchool(submitData);
      }
      setShowAdd(false);
      setEditId(null);
      setFormData({ name: "", fullName: "", shortName: "", principalName: "", address: "", phoneNumbers: [""], logoUrl: "", websiteUrl: "", email: "", orderWeight: 0, grades: [], images: [], newPhone: "", newImage: "" });
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field: 'phoneNumbers' | 'images', value: string) => {
    if (!value) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value],
      [field === 'phoneNumbers' ? 'newPhone' : 'newImage']: ""
    }));
  };

  const removeItem = (field: 'phoneNumbers' | 'images', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const startEdit = (school: any) => {
    setEditId(school.id);
    setFormData({
      name: school.name,
      fullName: school.fullName || "",
      shortName: school.shortName || "",
      principalName: school.principalName || "",
      address: school.address || "",
      phoneNumbers: school.phoneNumbers.length > 0 ? school.phoneNumbers : [""],
      logoUrl: school.logoUrl || "",
      websiteUrl: school.websiteUrl || "",
      email: school.email || "",
      orderWeight: school.orderWeight || 0,
      grades: school.grades || [],
      images: school.images || [],
      newPhone: "",
      newImage: ""
    });
    setShowAdd(true);
  };

  const toggleGrade = (grade: string) => {
    setFormData(prev => ({
      ...prev,
      grades: prev.grades.includes(grade) ? prev.grades.filter(g => g !== grade) : [...prev.grades, grade]
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ alignSelf: 'flex-start' }}>+ Add New School</button>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{editId ? 'Edit' : 'Add'} School</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Name (Internal)</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="Campus A" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Full School Name</label>
              <input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="input-field" placeholder="EduCare International School" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Short Name / Code</label>
              <input value={formData.shortName} onChange={e => setFormData({...formData, shortName: e.target.value})} className="input-field" placeholder="EDU-A" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Principal Name</label>
              <input value={formData.principalName} onChange={e => setFormData({...formData, principalName: e.target.value})} className="input-field" placeholder="John Doe" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Website</label>
              <input value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} className="input-field" placeholder="https://..." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Phone Numbers</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input value={formData.newPhone} onChange={e => setFormData({...formData, newPhone: e.target.value})} className="input-field" placeholder="Add phone..." />
                <button type="button" onClick={() => addItem('phoneNumbers', formData.newPhone)} className="btn-secondary">Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {formData.phoneNumbers.map((p, i) => p && (
                  <span key={i} style={{ fontSize: '0.75rem', background: 'var(--bg-main)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                    {p} <button onClick={() => removeItem('phoneNumbers', i)} style={{ color: 'var(--color-error)', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Pictures (URLs)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input value={formData.newImage} onChange={e => setFormData({...formData, newImage: e.target.value})} className="input-field" placeholder="Add image URL..." />
                <button type="button" onClick={() => addItem('images', formData.newImage)} className="btn-secondary">Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {formData.images.map((img, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={img} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <button onClick={() => removeItem('images', i)} style={{ position: 'absolute', top: -5, right: -5, background: 'var(--color-error)', color: '#fff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', cursor: 'pointer' }}>×</button>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label>Grades on Campus</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {GRADE_OPTIONS.map(g => (
                  <button key={g} type="button" onClick={() => toggleGrade(g)} style={{
                    padding: '0.4rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem',
                    background: formData.grades.includes(g) ? 'var(--color-primary)' : 'var(--bg-main)',
                    color: formData.grades.includes(g) ? '#fff' : 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)', cursor: 'pointer'
                  }}>{g}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', gridColumn: 'span 2' }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>{loading ? 'Saving...' : 'Save School'}</button>
              <button type="button" onClick={() => { setShowAdd(false); setEditId(null); }} className="btn-secondary" style={{ padding: '0.75rem 2rem' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {initialSchools.map(school => (
          <div key={school.id} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ margin: 0 }}>{school.fullName || school.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{school.shortName} | Principal: {school.principalName || 'N/A'}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => startEdit(school)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
                <button onClick={() => { if(confirm('Delete?')) deleteSchool(school.id).then(() => router.refresh()) }} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-error)' }}>Del</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '1rem' }}>
              {school.grades?.map((g: string) => (
                <span key={g} style={{ fontSize: '0.7rem', background: 'var(--bg-main)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{g}</span>
              ))}
            </div>
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', fontSize: '0.8rem' }}>
              {school.email && <div>✉️ {school.email}</div>}
              {school.websiteUrl && <div>🌐 {school.websiteUrl}</div>}
              <div style={{ marginTop: '0.5rem', fontWeight: 500 }}>Weight: {school.orderWeight}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
