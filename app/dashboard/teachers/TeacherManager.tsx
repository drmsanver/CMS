"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createTeacher, importTeachers, deleteTeacher } from "@/app/actions/teacher";

export default function TeacherManager({ 
  initialBranches, 
  initialSchools, 
  initialTeachers,
  teacherBranches
}: { 
  initialBranches: any[], 
  initialSchools: any[], 
  initialTeachers: any[],
  teacherBranches: any[]
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  
  // Filters
  const [filterCampusId, setFilterCampusId] = useState("");
  const [filterSchoolId, setFilterSchoolId] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    campusId: "",
    schoolId: "",
    teacherBranchId: ""
  });

  const filteredSchools = useMemo(() => {
    return initialSchools.filter(s => !formData.campusId || s.campusId === formData.campusId);
  }, [initialSchools, formData.campusId]);

  const teacherList = useMemo(() => {
    return initialTeachers.filter(t => {
      const matchCampus = !filterCampusId || t.campusId === filterCampusId;
      const matchSchool = !filterSchoolId || t.schoolId === filterSchoolId;
      return matchCampus && matchSchool;
    });
  }, [initialTeachers, filterCampusId, filterSchoolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingTeacherId) {
        // @ts-ignore - updateTeacher exists but TS might be lagging on actions
        const { updateTeacher } = await import("@/app/actions/teacher");
        await updateTeacher(editingTeacherId, formData);
      } else {
        await createTeacher(formData);
      }
      setShowAdd(false);
      setEditingTeacherId(null);
      setFormData({ name: "", email: "", phone: "", campusId: "", schoolId: "", teacherBranchId: "" });
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to create teacher.");
    } finally {
      setLoading(false);
    }
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      const rows = text.split('\n').map(r => r.trim()).filter(r => r);
      // Remove header: name,email,phone,branch_name,school_name,teaching_branch
      const dataRows = rows.slice(1);

      const parsedTeachers = dataRows.map(row => {
        const [name, email, phone, branchName, schoolName, teachingBranchName] = row.split(',').map(c => c.trim());
        const branch = initialBranches.find(b => b.name === branchName || b.fullName === branchName);
        const school = initialSchools.find(s => s.name === schoolName && (!branch || s.campusId === branch.id));
        const teachingBranch = teacherBranches.find(tb => tb.name === teachingBranchName);

        return {
          name,
          email,
          phone,
          campusId: branch?.id || "",
          schoolId: school?.id || "",
          teacherBranchId: teachingBranch?.id || ""
        };
      }).filter(t => t.name && t.email && t.campusId && t.schoolId);

      if (parsedTeachers.length === 0) {
        alert("No valid teachers found in CSV. Check branch/school names.");
        return;
      }

      setLoading(true);
      try {
        const res = await importTeachers(parsedTeachers);
        alert(`Imported ${res.created} teachers. Errors: ${res.errors.length}`);
        router.refresh();
      } catch (err: any) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const header = "name,email,phone,branch_name,school_name,teaching_branch\n";
    const sample = "John Doe,john@example.com,5551234455,Main Campus,Kindergarten,Matematik\n";
    const blob = new Blob([header + sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "teacher_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Search & Bulk Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Filter Branch</label>
            <select value={filterCampusId} onChange={e => { setFilterCampusId(e.target.value); setFilterSchoolId(""); }} className="input-field" style={{ minWidth: '180px' }}>
              <option value="">All Branches</option>
              {initialBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Filter School</label>
            <select value={filterSchoolId} onChange={e => setFilterSchoolId(e.target.value)} className="input-field" style={{ minWidth: '180px' }}>
              <option value="">All Schools</option>
              {initialSchools.filter(s => !filterCampusId || s.campusId === filterCampusId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={downloadTemplate} className="btn-secondary" title="Download CSV Template">Template</button>
          <label className="btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            Import CSV
            <input type="file" accept=".csv" onChange={handleCsvImport} style={{ display: 'none' }} />
          </label>
          <button onClick={() => { setShowAdd(true); setEditingTeacherId(null); setFormData({ name: "", email: "", phone: "", campusId: "", schoolId: "", teacherBranchId: "" }); }} className="btn-primary">+ Add Teacher</button>
        </div>
      </div>

      {/* Add Form Modal/Panel */}
      {showAdd && (
        <div className="glass-panel" id="teacher-form" style={{ padding: '2rem', border: `2px solid ${editingTeacherId ? 'var(--color-success)' : 'var(--color-primary)'}` }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{editingTeacherId ? 'Edit Teacher' : 'Add New Teacher'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label>Full Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label>Email Address</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label>Phone Number</label>
              <input maxLength={11} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-field" placeholder="0555..." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label>Branch</label>
              <select required value={formData.campusId} onChange={e => setFormData({...formData, campusId: e.target.value, schoolId: ""})} className="input-field">
                <option value="">Select Branch...</option>
                {initialBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label>School Unit</label>
              <select required value={formData.schoolId} onChange={e => setFormData({...formData, schoolId: e.target.value})} className="input-field">
                <option value="">Select School...</option>
                {filteredSchools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label>Teaching Branch</label>
              <select value={formData.teacherBranchId} onChange={e => setFormData({...formData, teacherBranchId: e.target.value})} className="input-field">
                <option value="">Select Branch...</option>
                {teacherBranches.map(tb => <option key={tb.id} value={tb.id}>{tb.name}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : (editingTeacherId ? 'Update Teacher' : 'Create Teacher')}</button>
              <button type="button" onClick={() => { setShowAdd(false); setEditingTeacherId(null); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Teacher List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {teacherList.map(teacher => (
          <div key={teacher.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-main)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
                  border: '2px solid var(--border-subtle)', overflow: 'hidden'
                }}>
                  {teacher.photo ? <img src={teacher.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👨‍🏫'}
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{teacher.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{teacher.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => {
                    setEditingTeacherId(teacher.id);
                    setFormData({
                      name: teacher.name,
                      email: teacher.email,
                      phone: teacher.phone || "",
                      campusId: teacher.campusId || "",
                      schoolId: teacher.schoolId || "",
                      teacherBranchId: teacher.teacherBranchId || ""
                    });
                    setShowAdd(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Edit
                </button>
                <button onClick={() => { if(confirm('Are you sure?')) deleteTeacher(teacher.id).then(() => router.refresh()) }} style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.85rem' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Branch</div>
                <div>{teacher.campus?.name}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>School</div>
                <div>{teacher.school?.name}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Teaching Branch</div>
                <div style={{ fontWeight: 500, color: 'var(--color-primary)' }}>{teacher.teacherBranch?.name || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Phone</div>
                <div>{teacher.phone || 'N/A'} {teacher.isPhoneVerified && '✅'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
