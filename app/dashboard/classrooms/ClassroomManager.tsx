"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignStudentToClassroom, removeStudentFromClassroom } from "@/app/actions/classroom";

type Student = { id: string; firstName: string; lastName: string; studentNumber: string; gradeLevel?: string };
type Classroom = {
  id: string;
  name: string;
  gradeLevel: string;
  primaryTeacher: { id: string; name: string } | null;
  students: Student[];
  _count: { students: number };
};

export default function ClassroomManager({ classrooms, unassignedStudents }: { classrooms: Classroom[]; unassignedStudents: Student[] }) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const handleAssign = async (classroomId: string) => {
    if (!selectedStudentId) return;
    setLoading(true);
    try {
      await assignStudentToClassroom(selectedStudentId, classroomId);
      setSelectedStudentId("");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to assign student.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (studentId: string) => {
    setLoading(true);
    try {
      await removeStudentFromClassroom(studentId);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to remove student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {classrooms.map((classroom) => (
        <div key={classroom.id} className="glass-panel" style={{ overflow: 'hidden' }}>
          {/* Header row */}
          <div 
            onClick={() => setExpandedId(expandedId === classroom.id ? null : classroom.id)}
            style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '1.25rem 1.5rem', cursor: 'pointer',
              borderBottom: expandedId === classroom.id ? '1px solid var(--border-subtle)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '10px', 
                background: 'var(--color-primary)', color: '#fff', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '0.875rem', fontWeight: 700 
              }}>
                {classroom.name}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>Classroom {classroom.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Grade {classroom.gradeLevel} · {classroom._count.students} student{classroom._count.students !== 1 ? 's' : ''}
                  {classroom.primaryTeacher && ` · Teacher: ${classroom.primaryTeacher.name}`}
                </div>
              </div>
            </div>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', transition: 'transform 0.2s', transform: expandedId === classroom.id ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
          </div>

          {/* Expanded content */}
          {expandedId === classroom.id && (
            <div style={{ padding: '1.25rem 1.5rem' }}>
              {/* Assign student */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Add Student</label>
                  <select 
                    value={selectedStudentId} 
                    onChange={e => setSelectedStudentId(e.target.value)}
                    style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
                  >
                    <option value="">Select a student...</option>
                    {unassignedStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentNumber}) — Grade {s.gradeLevel}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={() => handleAssign(classroom.id)} 
                  disabled={loading || !selectedStudentId} 
                  className="btn-primary" 
                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}
                >
                  Assign
                </button>
              </div>

              {/* Student list */}
              {classroom.students.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                  No students assigned to this classroom yet.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '0.6rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500 }}>ID</th>
                      <th style={{ padding: '0.6rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
                      <th style={{ padding: '0.6rem', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 500 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classroom.students.map(s => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.6rem' }}>{s.studentNumber}</td>
                        <td style={{ padding: '0.6rem', fontWeight: 500 }}>{s.firstName} {s.lastName}</td>
                        <td style={{ padding: '0.6rem', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleRemove(s.id)} 
                            disabled={loading}
                            style={{ 
                              background: 'none', border: '1px solid hsla(348, 83%, 47%, 0.3)', 
                              color: 'var(--color-error)', padding: '0.3rem 0.75rem', 
                              borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' 
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
