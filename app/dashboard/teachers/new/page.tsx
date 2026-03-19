"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addTeacher } from "@/app/actions/teacher";

export default function NewTeacherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    passwordRaw: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await addTeacher(formData);
      setSuccess(`Teacher ${formData.name} was successfully registered.`);
      setFormData({ name: "", email: "", passwordRaw: "" });
      router.refresh();
      setTimeout(() => router.push('/dashboard/teachers'), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to register teacher.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link href="/dashboard/teachers" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', textDecoration: 'none', fontSize: '0.875rem' }}>← Back</Link>
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-primary)' }}>Register New Teacher</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.875rem' }}>
          Add a new teacher to your campus. They can be assigned as a primary teacher for a classroom.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-primary)' }} placeholder="John Smith" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-primary)' }} placeholder="john.smith@school.com" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Temporary Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                required 
                type={showPassword ? "text" : "password"} 
                value={formData.passwordRaw} 
                onChange={e => setFormData({...formData, passwordRaw: e.target.value})} 
                style={{ width: '100%', padding: '0.875rem', paddingRight: '3.5rem', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-primary)' }} 
                placeholder="••••••••" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '0.75rem', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>The user will log in with this password.</span>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>
            {loading ? 'Registering...' : 'Register Teacher'}
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
