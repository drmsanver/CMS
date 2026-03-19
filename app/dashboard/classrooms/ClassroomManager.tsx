"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignStudentToClassroom, removeStudentFromClassroom, updateClassroom, deleteClassroom } from "@/app/actions/classroom";

type Student = { id: string; firstName: string; lastName: string; studentNumber: string; gradeLevel?: string };
type Teacher = { id: string; name: string };
type Classroom = {
  id: string;
  name: string;
  gradeLevel: string;
  primaryTeacher: Teacher | null;
  students: Student[];
  _count: { students: number };
};

const GRADE_OPTIONS = [
  "Pre-school (Age 2)", "Pre-school (Age 3)", "Pre-school (Age 4)", "Kindergarten",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
];

export default function ClassroomManager({ classrooms, unassignedStudents, allTeachers }: { classrooms: Classroom[]; unassignedStudents: Student[]; allTeachers: Teacher[] }) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  
  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editGrade, setEditGrade] = useState("");
  const [editTeacherId, setEditTeacherId] = useState("");

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

  const startEdit = (classroom: Classroom) => {
    setEditId(classroom.id);
    setEditName(classroom.name);
    setEditGrade(classroom.gradeLevel);
    setEditTeacherId(classroom.primaryTeacher?.id || "");
  };

  const handleUpdate = async () => {
    if (!editId) return;
    setLoading(true);
    try {
      await updateClassroom(editId, { 
        name: editName, 
        gradeLevel: editGrade, 
        primaryTeacherId: editTeacherId || undefined 
      });
      setEditId(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to update classroom.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete classroom "${name}"? This will unassign all students.`)) return;
    setLoading(true);
    try {
      await deleteClassroom(id);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete classroom.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', background: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '0.875rem' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {classrooms.map((classroom) => (
        <div key={classroom.id} className="glass-panel" style={{ overflow: 'hidden' }}>
          {/* Header row */}
          <div 
            style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '1.25rem 1.5rem', cursor: 'pointer',
              borderBottom: expandedId === classroom.id ? '1px solid var(--border-subtle)' : 'none',
              background: editId === classroom.id ? 'hsla(var(--color-primary-hsl), 0.05)' : 'transparent'
            }}
          >
            <div 
              onClick={() => editId !== classroom.id && setExpandedId(expandedId === classroom.id ? null : classroom.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}
            >
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '10px', 
                background: 'var(--color-primary)', color: '#fff', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '0.875rem', fontWeight: 700 
              }}>
                {classroom.name.charAt(0)}
              </div>
              
              {editId === classroom.id ? (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Name</label>
                    <input value={editName} onChange={e => setEditName(e.target.value)} style={{ ...inputStyle, width: '100px' }} placeholder="Name" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Grade</label>
                    <select value={editGrade} onChange={e => setEditGrade(e.target.value)} style={inputStyle}>
                      {GRADE_OPTIONS.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Primary Teacher</label>
                    <select value={editTeacherId} onChange={e => setEditTeacherId(e.target.value)} style={inputStyle}>
                      <option value="">Unassigned</option>
                      {allTeachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>Classroom {classroom.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Grade {classroom.gradeLevel} · {classroom._count.students} student{classroom._count.students !== 1 ? 's' : ''}
                    {classroom.primaryTeacher && ` · Teacher: ${classroom.primaryTeacher.name}`}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {editId === classroom.id ? (
                <>
                  <button onClick={handleUpdate} disabled={loading} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Save</button>
                  <button onClick={() => setEditId(null)} disabled={loading} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Cancel</button>
                </>
              ) : (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); startEdit(classroom); }} 
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(classroom.id, classroom.name); }} 
                    style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
                  >
                    Delete
                  </button>
                  <span 
                    onClick={() => setExpandedId(expandedId === classroom.id ? null : classroom.id)}
                    style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', transition: 'transform 0.2s', transform: expandedId === classroom.id ? 'rotate(180deg)' : 'rotate(0)', marginLeft: '0.5rem' }}
                  >
                    ▼
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Expanded content */}
          {expandedId === classroom.id && (
            <div style={{ padding: '1.25rem 1.5rem' }}>
              {/* Assign student */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Add Student (Grade {classroom.gradeLevel})</label>
                  <select 
                    value={selectedStudentId} 
                    onChange={e => setSelectedStudentId(e.target.value)}
                    style={{ ...inputStyle, width: '100%' }}
                  >
                    <option value="">Select a student...</option>
                    {unassignedStudents
                      .filter(s => s.gradeLevel === classroom.gradeLevel)
                      .map(s => (
                        <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentNumber})</option>
                      ))
                    }
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
