"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignGradesToCounselor } from "@/app/actions/counselor";

const ALL_GRADES = [
  "Pre-school (Age 2)", "Pre-school (Age 3)", "Pre-school (Age 4)", "Kindergarten",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
];

const GRADE_LABELS: Record<string, string> = {
  "Pre-school (Age 2)": "Pre-school (2)",
  "Pre-school (Age 3)": "Pre-school (3)",
  "Pre-school (Age 4)": "Pre-school (4)",
  "Kindergarten": "Kindergarten",
};

export default function GradeAssigner({ counselorId, initialGrades }: { counselorId: string; initialGrades: string[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(initialGrades);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (grade: string) => {
    setSaved(false);
    setSelected(prev => prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]);
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await assignGradesToCounselor(counselorId, selected);
      setSaved(true);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save grade assignments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {ALL_GRADES.map(grade => {
          const isSelected = selected.includes(grade);
          const label = GRADE_LABELS[grade] || `Grade ${grade}`;
          return (
            <button
              key={grade}
              onClick={() => toggle(grade)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 500,
                border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-strong)',
                background: isSelected ? 'var(--color-primary)' : 'var(--bg-main)',
                color: isSelected ? '#fff' : 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={handleSave} disabled={loading} className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem' }}>
          {loading ? 'Saving...' : 'Save Assignments'}
        </button>
        {saved && <span style={{ color: 'var(--color-success)', fontSize: '0.875rem' }}>✓ Saved successfully</span>}
      </div>
    </div>
  );
}
