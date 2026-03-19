"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addStudent, addStudentsBulk } from "@/app/actions/student";
import Papa from "papaparse";

export default function NewStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    studentNumber: "",
    firstName: "",
    lastName: "",
    gradeLevel: "",
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await addStudent(formData);
      setSuccess(`Student ${formData.firstName} added successfully.`);
      setFormData({ studentNumber: "", firstName: "", lastName: "", gradeLevel: "" });
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

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      
      {/* Single Entry Form */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Add New Student</h2>
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Student Number</label>
            <input required value={formData.studentNumber} onChange={e => setFormData({...formData, studentNumber: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>First Name</label>
              <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Last Name</label>
              <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Grade Level</label>
            <select required value={formData.gradeLevel} onChange={e => setFormData({...formData, gradeLevel: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <option value="" disabled>Select grade...</option>
              <option value="Pre-school (Age 2)">Pre-school Age 2 (Okul Öncesi 2 Yaş)</option>
              <option value="Pre-school (Age 3)">Pre-school Age 3 (Okul Öncesi 3 Yaş)</option>
              <option value="Pre-school (Age 4)">Pre-school Age 4 (Okul Öncesi 4 Yaş)</option>
              <option value="Kindergarten">Kindergarten (Ana Sınıfı)</option>
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

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem' }}>
            {loading ? 'Adding...' : 'Add Student'}
          </button>
        </form>
      </div>

      {/* CSV Import */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Bulk Import (CSV)</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
          Upload a CSV file with the following headers: <b>studentNumber, firstName, lastName, gradeLevel</b>.
        </p>

        <div style={{ 
          border: '2px dashed var(--border-strong)', 
          borderRadius: '12px', 
          padding: '3rem', 
          textAlign: 'center',
          background: 'var(--bg-main)',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <label htmlFor="csv-upload" className="btn-secondary" style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
            Choose CSV File
          </label>
          <input 
            id="csv-upload" 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            disabled={loading}
            style={{ display: 'none' }} 
          />
          {loading && <div style={{ color: 'var(--color-secondary)' }}>Processing import...</div>}
        </div>
      </div>

      {/* Alerts */}
      <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
        {error && <div style={{ padding: '1rem', background: 'hsla(348, 83%, 47%, 0.1)', color: 'var(--color-error)', borderRadius: '8px', border: '1px solid hsla(348, 83%, 47%, 0.3)' }}>{error}</div>}
        {success && <div style={{ padding: '1rem', background: 'hsla(142, 71%, 45%, 0.1)', color: 'var(--color-success)', borderRadius: '8px', border: '1px solid hsla(142, 71%, 45%, 0.3)' }}>{success}</div>}
      </div>

    </div>
  );
}
