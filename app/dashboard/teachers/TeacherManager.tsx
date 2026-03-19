"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignTeacherToClassroom } from "@/app/actions/teacher";

type Teacher = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  primaryClassroom: { id: string; name: string; gradeLevel: string } | null;
};

type Classroom = { id: string; name: string; gradeLevel: string };

export default function TeacherManager({ initialTeachers, classrooms }: { initialTeachers: any[]; classrooms: Classroom[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const handleAssign = async (teacherId: string, classroomId: string) => {
    setLoading(teacherId);
    try {
      await assignTeacherToClassroom(teacherId, classroomId || null);
      setEditId(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to assign classroom.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="glass-panel" style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-main)' }}>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email Address</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Primary Classroom</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {initialTeachers.map((teacher) => (
            <tr key={teacher.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '1rem', fontWeight: 500 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>
                    {teacher.name.charAt(0).toUpperCase()}
                  </div>
                  {teacher.name}
                </div>
              </td>
              <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{teacher.email}</td>
              <td style={{ padding: '1rem' }}>
                {editId === teacher.id ? (
                  <select 
                    disabled={loading === teacher.id}
                    value={teacher.primaryClassroom?.id || ""} 
                    onChange={(e) => handleAssign(teacher.id, e.target.value)}
                    style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
                  >
                    <option value="">Not assigned</option>
                    {classrooms.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (Grade {c.gradeLevel})</option>
                    ))}
                  </select>
                ) : (
                  teacher.primaryClassroom ? (
                    <span style={{ background: 'var(--bg-main)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 500 }}>
                      {teacher.primaryClassroom.name} (Grade {teacher.primaryClassroom.gradeLevel})
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Not assigned</span>
                  )
                )}
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <button 
                  onClick={() => setEditId(editId === teacher.id ? null : teacher.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
                >
                  {editId === teacher.id ? 'Cancel' : 'Change Class'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
