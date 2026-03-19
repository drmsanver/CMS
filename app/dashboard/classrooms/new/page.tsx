"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClassroom } from "@/app/actions/classroom";

export default function NewClassroomPage({ searchParams }: { searchParams: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    gradeLevel: "",
    primaryTeacherId: "",
  });

  const teachers: any[] = (typeof window !== 'undefined' && (window as any).__teachers) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createClassroom({
        name: formData.name,
        gradeLevel: formData.gradeLevel,
        primaryTeacherId: formData.primaryTeacherId || undefined,
      });
      setSuccess(`Classroom "${formData.name}" created successfully.`);
      setFormData({ name: "", gradeLevel: "", primaryTeacherId: "" });
      router.refresh();
      setTimeout(() => router.push('/dashboard/classrooms'), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to create classroom.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-primary)' };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Create New Classroom</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>
          Create a classroom and optionally assign a primary teacher.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Classroom Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} placeholder="e.g. 3-A, 5-B" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Grade Level</label>
            <select required value={formData.gradeLevel} onChange={e => setFormData({...formData, gradeLevel: e.target.value})} style={{ ...inputStyle, cursor: 'pointer' }}>
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

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>
            {loading ? 'Creating...' : 'Create Classroom'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem' }}>
          {error && <div style={{ padding: '1rem', background: 'hsla(348, 83%, 47%, 0.1)', color: 'var(--color-error)', borderRadius: '8px', border: '1px solid hsla(348, 83%, 47%, 0.3)' }}>{error}</div>}
          {success && <div style={{ padding: '1rem', background: 'hsla(142, 71%, 45%, 0.1)', color: 'var(--color-success)', borderRadius: '8px', border: '1px solid hsla(142, 71%, 45%, 0.3)' }}>{success}</div>}
        </div>
      </div>
    </div>
  );
}
