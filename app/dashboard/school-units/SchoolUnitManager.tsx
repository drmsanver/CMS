"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSchool, updateSchool, deleteSchool } from "@/app/actions/school";

const GRADE_OPTIONS = [
  "Pre-school (Age 2)", "Pre-school (Age 3)", "Pre-school (Age 4)", "Kindergarten",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
];

export default function SchoolUnitManager({ initialSchools, campuses }: { initialSchools: any[], campuses: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");

  useEffect(() => {
    const savedBranchId = localStorage.getItem("selectedBranchId");
    if (savedBranchId && (savedBranchId === "all" || campuses.find(c => c.id === savedBranchId))) {
      setSelectedBranchId(savedBranchId);
    }
  }, [campuses]);

  const handleBranchChange = (id: string) => {
    setSelectedBranchId(id);
    localStorage.setItem("selectedBranchId", id);
  };

  const filteredSchools = selectedBranchId === "all" 
    ? initialSchools 
    : initialSchools.filter(s => s.campusId === selectedBranchId);

  const [formData, setFormData] = useState({
    campusId: campuses[0]?.id || "",
    name: "",
    principalName: "",
    principalPhoto: "",
    principalPhone1: "",
    principalPhone2: "",
    address: "",
    logoUrl: "",
    capacity: 0,
    classroomCount: 0,
    gradeLevels: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateSchool(editId, formData);
      } else {
        await createSchool(formData);
      }
      setShowAdd(false);
      setEditId(null);
      setFormData({ 
        campusId: selectedBranchId !== "all" ? selectedBranchId : (campuses[0]?.id || ""), 
        name: "", principalName: "", principalPhoto: "", 
        principalPhone1: "", principalPhone2: "", address: "", 
        logoUrl: "", capacity: 0, classroomCount: 0, gradeLevels: [] 
      });
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save school unit.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (school: any) => {
    setEditId(school.id);
    setFormData({
      campusId: school.campusId,
      name: school.name,
      principalName: school.principalName || "",
      principalPhoto: school.principalPhoto || "",
      principalPhone1: school.principalPhone1 || "",
      principalPhone2: school.principalPhone2 || "",
      address: school.address || "",
      logoUrl: school.logoUrl || "",
      capacity: school.capacity || 0,
      classroomCount: school.classroomCount || 0,
      gradeLevels: school.gradeLevels || []
    });
    setShowAdd(true);
  };

  const toggleGrade = (grade: string) => {
    setFormData(prev => ({
      ...prev,
      gradeLevels: prev.gradeLevels.includes(grade) ? prev.gradeLevels.filter(g => g !== grade) : [...prev.gradeLevels, grade]
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Filter by Branch:</label>
          <select 
            value={selectedBranchId} 
            onChange={e => handleBranchChange(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '200px' }}
          >
            <option value="all">All Branches</option>
            {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {!showAdd && (
          <button onClick={() => {
            setFormData(prev => ({ ...prev, campusId: selectedBranchId !== "all" ? selectedBranchId : (campuses[0]?.id || "") }));
            setShowAdd(true);
          }} className="btn-primary">+ Add New School Unit</button>
        )}
      </div>

      {showAdd && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{editId ? 'Edit' : 'Add'} School Unit</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Branch (Campus)</label>
              <select required value={formData.campusId} onChange={e => setFormData({...formData, campusId: e.target.value})} className="input-field">
                {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>School Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="e.g. Kindergarten, Elementary School" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Principal Name</label>
              <input value={formData.principalName} onChange={e => setFormData({...formData, principalName: e.target.value})} className="input-field" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Principal Photo (URL)</label>
              <input value={formData.principalPhoto} onChange={e => setFormData({...formData, principalPhoto: e.target.value})} className="input-field" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Principal Phone 1</label>
              <input maxLength={11} value={formData.principalPhone1} onChange={e => setFormData({...formData, principalPhone1: e.target.value})} className="input-field" style={{ maxWidth: '200px' }} placeholder="Max 11 chars" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Principal Phone 2</label>
              <input maxLength={11} value={formData.principalPhone2} onChange={e => setFormData({...formData, principalPhone2: e.target.value})} className="input-field" style={{ maxWidth: '200px' }} placeholder="Max 11 chars" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label>Address</label>
              <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="input-field" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>School Logo (URL)</label>
              <input value={formData.logoUrl} onChange={e => setFormData({...formData, logoUrl: e.target.value})} className="input-field" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Capacity (4-digit max)</label>
              <input 
                type="text" 
                maxLength={4} 
                value={formData.capacity || ''} 
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData({...formData, capacity: parseInt(val) || 0});
                }} 
                className="input-field" 
                style={{ maxWidth: '120px' }}
                placeholder="9999"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Number of Classrooms</label>
              <input type="number" value={formData.classroomCount} onChange={e => setFormData({...formData, classroomCount: parseInt(e.target.value)})} className="input-field" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label>Grade Levels</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {GRADE_OPTIONS.map(g => (
                  <button key={g} type="button" onClick={() => toggleGrade(g)} style={{
                    padding: '0.4rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem',
                    background: formData.gradeLevels.includes(g) ? 'var(--color-primary)' : 'var(--bg-main)',
                    color: formData.gradeLevels.includes(g) ? '#fff' : 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)', cursor: 'pointer'
                  }}>{g}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', gridColumn: 'span 2' }}>
              <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save School'}</button>
              <button type="button" onClick={() => { setShowAdd(false); setEditId(null); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {filteredSchools.map(school => (
          <div key={school.id} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {school.logoUrl && <img src={school.logoUrl} alt="" style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#fff', borderRadius: '8px' }} />}
                <div>
                  <h4 style={{ margin: 0 }}>{school.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Branch: {school.campus?.name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => startEdit(school)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
                <button onClick={() => { if(confirm('Are you sure?')) deleteSchool(school.id).then(() => router.refresh()) }} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-error)' }}>Del</button>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', fontSize: '0.875rem' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Principal</div>
                <div>{school.principalName || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Capacity/Classes</div>
                <div>{school.capacity || 0} students / {school.classroomCount || 0} classes</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '1rem' }}>
              {school.gradeLevels?.map((g: string) => (
                <span key={g} style={{ fontSize: '0.7rem', background: 'var(--bg-main)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{g}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
