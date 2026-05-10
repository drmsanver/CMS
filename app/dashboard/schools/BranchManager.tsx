"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addSchool as addBranch, updateSchool as updateBranch, deleteSchool as deleteBranch } from "@/app/actions/branch";

import { createSchool, updateSchool, deleteSchool } from "@/app/actions/school";

const GRADE_OPTIONS = [
  "Pre-school (Age 2)", "Pre-school (Age 3)", "Pre-school (Age 4)", "Kindergarten",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
];

export default function BranchManager({ initialBranches, campusTypes }: { initialBranches: any[], campusTypes: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // School Modal State
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [targetBranchId, setTargetBranchId] = useState<string | null>(null);
  const [editingSchool, setEditingSchool] = useState<any | null>(null);

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
    typeId: "",
    images: [] as string[],
    newPhone: "",
    newImage: ""
  });

  const [schoolFormData, setSchoolFormData] = useState({
    name: "",
    principalName: "",
    principalPhoto: "",
    principalPhone1: "",
    principalPhone2: "",
    address: "",
    logoUrl: "",
    capacity: 0,
    classroomCount: 0,
    orderWeight: 0,
    gradeLevels: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { newPhone, newImage, ...submitData } = formData;
      if (editId) {
        await updateBranch(editId, submitData);
      } else {
        await addBranch(submitData);
      }
      setShowAdd(false);
      setEditId(null);
      setFormData({ name: "", fullName: "", shortName: "", principalName: "", address: "", phoneNumbers: [""], logoUrl: "", websiteUrl: "", email: "", orderWeight: 0, grades: [], typeId: "", images: [], newPhone: "", newImage: "" });
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBranchId && !editingSchool) return;
    setLoading(true);
    try {
      if (editingSchool) {
        await updateSchool(editingSchool.id, schoolFormData);
      } else {
        await createSchool({ ...schoolFormData, campusId: targetBranchId! });
      }
      setShowSchoolModal(false);
      setEditingSchool(null);
      setTargetBranchId(null);
      setSchoolFormData({ name: "", principalName: "", principalPhoto: "", principalPhone1: "", principalPhone2: "", address: "", logoUrl: "", capacity: 0, classroomCount: 0, orderWeight: 0, gradeLevels: [] });
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save school unit.");
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

  const startEdit = (branch: any) => {
    setEditId(branch.id);
    setFormData({
      name: branch.name,
      fullName: branch.fullName || "",
      shortName: branch.shortName || "",
      principalName: branch.principalName || "",
      address: branch.address || "",
      phoneNumbers: branch.phoneNumbers.length > 0 ? branch.phoneNumbers : [""],
      logoUrl: branch.logoUrl || "",
      websiteUrl: branch.websiteUrl || "",
      email: branch.email || "",
      orderWeight: branch.orderWeight || 0,
      grades: branch.grades || [],
      typeId: branch.typeId || "",
      images: branch.images || [],
      newPhone: "",
      newImage: ""
    });
    setShowAdd(true);
  };

  const startAddSchool = (branchId: string) => {
    setTargetBranchId(branchId);
    setEditingSchool(null);
    setSchoolFormData({ name: "", principalName: "", principalPhoto: "", principalPhone1: "", principalPhone2: "", address: "", logoUrl: "", capacity: 0, classroomCount: 0, orderWeight: 0, gradeLevels: [] });
    setShowSchoolModal(true);
  };

  const startEditSchool = (school: any) => {
    setEditingSchool(school);
    setTargetBranchId(school.campusId);
    setSchoolFormData({
      name: school.name,
      principalName: school.principalName || "",
      principalPhoto: school.principalPhoto || "",
      principalPhone1: school.principalPhone1 || "",
      principalPhone2: school.principalPhone2 || "",
      address: school.address || "",
      logoUrl: school.logoUrl || "",
      capacity: school.capacity || 0,
      classroomCount: school.classroomCount || 0,
      orderWeight: school.orderWeight || 0,
      gradeLevels: school.gradeLevels || []
    });
    setShowSchoolModal(true);
  };

  const toggleGrade = (grade: string) => {
    setFormData(prev => ({
      ...prev,
      grades: prev.grades.includes(grade) ? prev.grades.filter(g => g !== grade) : [...prev.grades, grade]
    }));
  };

  const toggleSchoolGrade = (grade: string) => {
    setSchoolFormData(prev => ({
      ...prev,
      gradeLevels: prev.gradeLevels.includes(grade) ? prev.gradeLevels.filter(g => g !== grade) : [...prev.gradeLevels, grade]
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ alignSelf: 'flex-start' }}>+ Add New Branch</button>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{editId ? 'Edit' : 'Add'} Branch</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* ... Branch Form Controls ... */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Branch Name (Internal)</label>
              <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="Campus A" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Full Branch Name</label>
              <input value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="input-field" placeholder="EduCare International School" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Short Name / Code</label>
              <input value={formData.shortName} onChange={e => setFormData({ ...formData, shortName: e.target.value })} className="input-field" placeholder="EDU-A" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Principal Name</label>
              <input value={formData.principalName} onChange={e => setFormData({ ...formData, principalName: e.target.value })} className="input-field" placeholder="John Doe" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Campus Type</label>
              <select value={formData.typeId} onChange={e => setFormData({ ...formData, typeId: e.target.value })} className="input-field">
                <option value="">Select Type...</option>
                {campusTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Order ID</label>
              <input type="number" value={formData.orderWeight} onChange={e => setFormData({ ...formData, orderWeight: parseInt(e.target.value) || 0 })} className="input-field" placeholder="0" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-field" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Branch Logo (URL)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input value={formData.logoUrl} onChange={e => setFormData({ ...formData, logoUrl: e.target.value })} className="input-field" placeholder="https://logo-url..." />
                {formData.logoUrl && <img src={formData.logoUrl} alt="Logo Preview" style={{ height: '40px', width: '40px', objectFit: 'contain', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />}
              </div>
            </div>
            {/* ... Gallery / Phones ... */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Additional Pictures (URLs)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input value={formData.newImage} onChange={e => setFormData({ ...formData, newImage: e.target.value })} className="input-field" placeholder="Add gallery image URL..." />
                <button type="button" onClick={() => addItem('images', formData.newImage)} className="btn-secondary">Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {formData.images.map((img, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={img} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <button type="button" onClick={() => removeItem('images', i)} style={{ position: 'absolute', top: -5, right: -5, background: 'var(--color-error)', color: '#fff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Website URL</label>
              <input value={formData.websiteUrl} onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Phone Numbers</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input value={formData.newPhone} onChange={e => setFormData({ ...formData, newPhone: e.target.value })} className="input-field" placeholder="Add phone..." />
                <button type="button" onClick={() => addItem('phoneNumbers', formData.newPhone)} className="btn-secondary">Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {formData.phoneNumbers.map((p, i) => p && (
                  <span key={i} style={{ fontSize: '0.75rem', background: 'var(--bg-main)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {p} <button type="button" onClick={() => removeItem('phoneNumbers', i)} style={{ color: 'var(--color-error)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>×</button>
                  </span>
                ))}
              </div>
            </div>
            {/* ... Grades ... */}
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
              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>{loading ? 'Saving...' : 'Save Branch'}</button>
              <button type="button" onClick={() => { setShowAdd(false); setEditId(null); }} className="btn-secondary" style={{ padding: '0.75rem 2rem' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Branch List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {initialBranches.map(branch => (
          <div key={branch.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Header: Logo, Name, Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '64px', height: '64px', flexShrink: 0, background: '#fff', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {branch.logoUrl ? (
                    <img src={branch.logoUrl} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No Logo</span>
                  )}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{branch.fullName || branch.name}</h4>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    <span style={{ marginRight: '1rem' }}><strong>Code:</strong> {branch.shortName || 'N/A'}</span>
                    <span style={{ marginRight: '1rem' }}><strong>Type:</strong> {branch.type?.name || 'N/A'}</span>
                    <span><strong>Principal:</strong> {branch.principalName || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => startAddSchool(branch.id)} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>+ Add School</button>
                <button onClick={() => startEdit(branch)} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Edit Branch</button>
                <button onClick={() => { if (confirm('Delete?')) deleteBranch(branch.id).then(() => router.refresh()) }} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--color-error)' }}>Delete</button>
              </div>
            </div>

            {/* Content Body: Schools List Added Here */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Contact & Location */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Contact</div>
                    <div style={{ fontSize: '0.8rem' }}>{branch.email} | {branch.phoneNumbers?.[0]}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Available Grades</div>
                    <div style={{ fontSize: '0.7rem', display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                      {branch.grades?.map((g: any) => <span key={g} style={{background: 'var(--color-primary)', color: '#fff', padding: '1px 4px', borderRadius: '3px'}}>{g}</span>)}
                    </div>
                  </div>
                </div>

                {/* Sub-Schools List */}
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>School Units ({branch.schools?.length || 0})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {branch.schools?.map((school: any) => (
                      <div key={school.id} onClick={() => startEditSchool(school)} className="glass-panel" style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          {school.logoUrl && <img src={school.logoUrl} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />}
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{school.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Principal: {school.principalName || 'N/A'} | Capacity: {school.capacity || 0}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)' }}>Click to edit</div>
                      </div>
                    ))}
                    {(!branch.schools || branch.schools.length === 0) && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No school units added yet.</div>}
                  </div>
                </div>
              </div>

              {/* Sidebar: Gallery */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Gallery</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {branch.images?.slice(0, 4).map((img: any, i: number) => (
                    <img key={i} src={img} alt="" style={{ width: '100%', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* School Unit Modal */}
      {showSchoolModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{editingSchool ? 'Edit' : 'Add'} School Unit</h3>
            <form onSubmit={handleSchoolSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>School Name</label>
                <input required value={schoolFormData.name} onChange={e => setSchoolFormData({...schoolFormData, name: e.target.value})} className="input-field" placeholder="e.g. Elementary School" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Principal Name</label>
                <input value={schoolFormData.principalName} onChange={e => setSchoolFormData({...schoolFormData, principalName: e.target.value})} className="input-field" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Principal Phone 1</label>
                <input maxLength={11} value={schoolFormData.principalPhone1} onChange={e => setSchoolFormData({...schoolFormData, principalPhone1: e.target.value})} className="input-field" style={{ maxWidth: '200px' }} placeholder="Max 11 chars" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Principal Phone 2</label>
                <input maxLength={11} value={schoolFormData.principalPhone2} onChange={e => setSchoolFormData({...schoolFormData, principalPhone2: e.target.value})} className="input-field" style={{ maxWidth: '200px' }} placeholder="Max 11 chars" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Logo URL</label>
                <input value={schoolFormData.logoUrl} onChange={e => setSchoolFormData({...schoolFormData, logoUrl: e.target.value})} className="input-field" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Capacity (4-digit max)</label>
                <input 
                  type="text" 
                  maxLength={4} 
                  value={schoolFormData.capacity || ''} 
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    setSchoolFormData({...schoolFormData, capacity: parseInt(val) || 0});
                  }} 
                  className="input-field" 
                  style={{ maxWidth: '120px' }}
                  placeholder="9999"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Order ID</label>
                <input type="number" value={schoolFormData.orderWeight} onChange={e => setSchoolFormData({ ...schoolFormData, orderWeight: parseInt(e.target.value) || 0 })} className="input-field" style={{ maxWidth: '80px' }} placeholder="0" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                <label>Grade Levels</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {GRADE_OPTIONS.map(g => (
                    <button key={g} type="button" onClick={() => toggleSchoolGrade(g)} style={{
                      padding: '0.4rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem',
                      background: schoolFormData.gradeLevels.includes(g) ? 'var(--color-primary)' : 'var(--bg-main)',
                      color: schoolFormData.gradeLevels.includes(g) ? '#fff' : 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)', cursor: 'pointer'
                    }}>{g}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', gridColumn: 'span 2' }}>
                <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save School'}</button>
                {editingSchool && (
                  <button type="button" onClick={() => { if(confirm('Delete?')) deleteSchool(editingSchool.id).then(() => { setShowSchoolModal(false); setEditingSchool(null); router.refresh(); }) }} className="btn-secondary" style={{ color: 'var(--color-error)' }}>Delete School</button>
                )}
                <button type="button" onClick={() => { setShowSchoolModal(false); setEditingSchool(null); }} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
