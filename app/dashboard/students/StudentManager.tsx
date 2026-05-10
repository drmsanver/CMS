"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const GRADE_OPTIONS = [
  "Pre-school (Age 2)", "Pre-school (Age 3)", "Pre-school (Age 4)", "Kindergarten",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
];

const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"];

export default function StudentManager({ 
  initialStudents, 
  campuses, 
  schools, 
  classrooms,
  currentRole 
}: { 
  initialStudents: any[], 
  campuses: any[], 
  schools: any[], 
  classrooms: any[],
  currentRole: string
}) {
  const [filters, setFilters] = useState({
    campusId: "all",
    schoolId: "all",
    gradeLevel: "all",
    classroomId: "all",
    gender: "all",
    search: ""
  });

  // Derived filtered students
  const filteredStudents = useMemo(() => {
    return initialStudents.filter(student => {
      const matchCampus = filters.campusId === "all" || student.campusId === filters.campusId;
      const matchSchool = filters.schoolId === "all" || student.schoolId === filters.schoolId;
      const matchGrade = filters.gradeLevel === "all" || student.gradeLevel === filters.gradeLevel;
      const matchClassroom = filters.classroomId === "all" || student.classroomId === filters.classroomId;
      const matchGender = filters.gender === "all" || student.gender === filters.gender;
      const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
      const matchSearch = !filters.search || 
        fullName.includes(filters.search.toLowerCase()) ||
        (student.studentNumber && student.studentNumber.toLowerCase().includes(filters.search.toLowerCase()));

      return matchCampus && matchSchool && matchGrade && matchClassroom && matchGender && matchSearch;
    });
  }, [initialStudents, filters]);

  // Available options based on current selection
  const availableSchools = useMemo(() => {
    if (filters.campusId === "all") return schools;
    return schools.filter(s => s.campusId === filters.campusId);
  }, [schools, filters.campusId]);

  const availableClassrooms = useMemo(() => {
    let base = classrooms;
    if (filters.campusId !== "all") base = base.filter(c => c.campusId === filters.campusId);
    if (filters.schoolId !== "all") base = base.filter(c => c.schoolId === filters.schoolId);
    if (filters.gradeLevel !== "all") base = base.filter(c => c.gradeLevel === filters.gradeLevel);
    return base;
  }, [classrooms, filters]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Filters Area */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '1 1 200px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Branch (Campus)</label>
          <select 
            value={filters.campusId} 
            onChange={e => setFilters({ ...filters, campusId: e.target.value, schoolId: 'all', classroomId: 'all' })}
            className="input-field"
          >
            <option value="all">All Branches</option>
            {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '1 1 200px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>School Unit</label>
          <select 
            value={filters.schoolId} 
            onChange={e => setFilters({ ...filters, schoolId: e.target.value, classroomId: 'all' })}
            className="input-field"
          >
            <option value="all">All Schools</option>
            {availableSchools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '1 1 120px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Grade Level</label>
          <select 
            value={filters.gradeLevel} 
            onChange={e => setFilters({ ...filters, gradeLevel: e.target.value, classroomId: 'all' })}
            className="input-field"
          >
            <option value="all">All Grades</option>
            {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '1 1 120px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Classroom</label>
          <select 
            value={filters.classroomId} 
            onChange={e => setFilters({ ...filters, classroomId: e.target.value })}
            className="input-field"
          >
            <option value="all">All Classes</option>
            {availableClassrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '1 1 100px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Gender</label>
          <select 
            value={filters.gender} 
            onChange={e => setFilters({ ...filters, gender: e.target.value })}
            className="input-field"
          >
            <option value="all">All</option>
            {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '2 1 250px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Search Name/Number</label>
          <input 
            value={filters.search} 
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            className="input-field"
            placeholder="Search..."
          />
        </div>

        <Link href="/dashboard/students/new" className="btn-primary" style={{ height: '42px', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>+ Add Student</Link>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredStudents.length}</strong> students
        </div>
        {currentRole === 'COUNSELOR' && (
          <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>
            📋 Restricted by assigned grade levels
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-main)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Branch / School</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Grade / Class</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Gender</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Records</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No students matching the criteria were found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student: any) => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem' }}>{student.studentNumber}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{student.firstName} {student.lastName}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.85rem' }}>{student.campus?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{student.school?.name || '—'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.85rem' }}>{student.gradeLevel || '—'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{student.classroom?.name || '—'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>{student.gender?.toLowerCase() || '—'}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      background: 'var(--bg-main)', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      display: 'inline-block'
                    }}>
                      {student._count.records} Recs / {student._count.observations} Obs
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link 
                      href={`/dashboard/students/profile/${student.id}`} 
                      className="btn-secondary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-block' }}
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
