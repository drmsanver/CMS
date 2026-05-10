"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { addStudent, addStudentsBulk } from "@/app/actions/student";
import Papa from "papaparse";

export default function StudentForm({ campuses, schools, classrooms }: { campuses: any[], schools: any[], classrooms: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    studentNumber: "",
    firstName: "",
    lastName: "",
    gender: "",
    gradeLevel: "",
    campusId: campuses[0]?.id || "",
    schoolId: "",
    classroomId: "",
    dateOfBirth: "",
    fatherName: "",
    fatherPhone: "",
    fatherEmail: "",
    motherName: "",
    motherPhone: "",
    motherEmail: "",
    defaultContact: "FATHER",
  });

  const availableSchools = useMemo(() => {
    return schools.filter(s => s.campusId === formData.campusId);
  }, [schools, formData.campusId]);

  const availableClassrooms = useMemo(() => {
    let base = classrooms.filter(c => c.campusId === formData.campusId);
    if (formData.schoolId) base = base.filter(c => c.schoolId === formData.schoolId);
    if (formData.gradeLevel) base = base.filter(c => c.gradeLevel === formData.gradeLevel);
    return base;
  }, [classrooms, formData.campusId, formData.schoolId, formData.gradeLevel]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await addStudent(formData);
      setSuccess(`Student ${formData.firstName} added successfully.`);
      setFormData({ 
        studentNumber: "", firstName: "", lastName: "", gender: "", gradeLevel: "", 
        campusId: campuses[0]?.id || "", schoolId: "", classroomId: "",
        dateOfBirth: "", fatherName: "", fatherPhone: "", fatherEmail: "", 
        motherName: "", motherPhone: "", motherEmail: "", defaultContact: "FATHER" 
      });
      router.refresh();
      setTimeout(() => router.push('/dashboard/students'), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to add student.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setSuccess("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await addStudentsBulk(results.data);
          setSuccess(`Successfully imported ${res.count} students!`);
          router.refresh();
          setTimeout(() => router.push('/dashboard/students'), 1500);
        } catch (err: any) {
          setError(err.message || "Failed to import students. Check CSV format.");
          setLoading(false);
        }
      },
      error: (err) => {
        setError("Error parsing CSV: " + err.message);
        setLoading(false);
      }
    });
  };

  const inputStyle = { padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-primary)' };
  const labelStyle = { fontSize: '0.875rem' as const, fontWeight: 500 as const };
  const sectionTitle = { fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-secondary)', marginTop: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-strong)' };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Add New Student</h2>
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Student Number</label>
              <input required value={formData.studentNumber} onChange={e => setFormData({...formData, studentNumber: e.target.value})} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Gender</label>
              <select required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} style={inputStyle}>
                <option value="">Select gender...</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>First Name</label>
              <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Last Name</label>
              <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Branch (Campus)</label>
              <select required value={formData.campusId} onChange={e => setFormData({...formData, campusId: e.target.value, schoolId: '', classroomId: ''})} style={inputStyle}>
                {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>School Unit</label>
              <select value={formData.schoolId} onChange={e => setFormData({...formData, schoolId: e.target.value, classroomId: ''})} style={inputStyle}>
                <option value="">Select unit...</option>
                {availableSchools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Grade Level</label>
              <select required value={formData.gradeLevel} onChange={e => setFormData({...formData, gradeLevel: e.target.value, classroomId: ''})} style={inputStyle}>
                <option value="">Select grade...</option>
                <option value="Pre-school (Age 2)">Pre-school Age 2</option>
                <option value="Pre-school (Age 3)">Pre-school Age 3</option>
                <option value="Pre-school (Age 4)">Pre-school Age 4</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="1">1st Grade</option>
                <option value="2">2nd Grade</option>
                <option value="3">3rd Grade</option>
                <option value="4">4th Grade</option>
                <option value="5">5th Grade</option>
                <option value="6">6th Grade</option>
                <option value="7">7th Grade</option>
                <option value="8">8th Grade</option>
                <option value="9">9th Grade</option>
                <option value="10">10th Grade</option>
                <option value="11">11th Grade</option>
                <option value="12">12th Grade</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Classroom</label>
              <select value={formData.classroomId} onChange={e => setFormData({...formData, classroomId: e.target.value})} style={inputStyle}>
                <option value="">Select classroom...</option>
                {availableClassrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Date of Birth</label>
              <input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} style={inputStyle} />
            </div>
          </div>

          {/* Father Contact */}
          <div style={sectionTitle}>👨 Father Contact</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Name</label>
              <input value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} placeholder="Father's full name" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Phone</label>
              <input type="tel" value={formData.fatherPhone} onChange={e => setFormData({...formData, fatherPhone: e.target.value})} placeholder="05XX XXX XXXX" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={formData.fatherEmail} onChange={e => setFormData({...formData, fatherEmail: e.target.value})} placeholder="father@email.com" style={inputStyle} />
            </div>
          </div>

          {/* Mother Contact */}
          <div style={sectionTitle}>👩 Mother Contact</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Name</label>
              <input value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} placeholder="Mother's full name" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Phone</label>
              <input type="tel" value={formData.motherPhone} onChange={e => setFormData({...formData, motherPhone: e.target.value})} placeholder="05XX XXX XXXX" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={formData.motherEmail} onChange={e => setFormData({...formData, motherEmail: e.target.value})} placeholder="mother@email.com" style={inputStyle} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem' }}>
            {loading ? 'Adding...' : 'Add Student'}
          </button>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Bulk Import (CSV)</h2>
        <div style={{ border: '2px dashed var(--border-strong)', borderRadius: '12px', padding: '3rem', textAlign: 'center', background: 'var(--bg-main)', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <label htmlFor="csv-upload" className="btn-secondary" style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
            Choose CSV File
          </label>
          <input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} disabled={loading} style={{ display: 'none' }} />
          {loading && <div style={{ color: 'var(--color-secondary)' }}>Processing import...</div>}
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {error && <div style={{ padding: '1rem', background: 'hsla(348, 83%, 47%, 0.1)', color: 'var(--color-error)', borderRadius: '8px', border: '1px solid hsla(348, 83%, 47%, 0.3)' }}>{error}</div>}
        {success && <div style={{ padding: '1rem', background: 'hsla(142, 71%, 45%, 0.1)', color: 'var(--color-success)', borderRadius: '8px', border: '1px solid hsla(142, 71%, 45%, 0.3)' }}>{success}</div>}
      </div>

    </div>
  );
}
