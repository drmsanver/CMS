"use client";

import { useState, useMemo } from "react";
import { adminResetPassword } from "@/app/actions/user_management";

export default function UserManager({ initialUsers }: { initialUsers: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return initialUsers.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialUsers, searchTerm]);

  const handleReset = async (userId: string) => {
    if (!confirm("Are you sure you want to reset this user's password?")) return;
    try {
      const res = await adminResetPassword(userId);
      alert(res.message);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
          className="input-field"
          style={{ maxWidth: '400px' }}
        />
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Total Users: {initialUsers.length}
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Campus/School</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {user.photo && <img src={user.photo} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />}
                    <span>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', border: '1px solid var(--border-subtle)', 
                    padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'capitalize' 
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.8rem' }}>{user.campus?.name || 'N/A'}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{user.school?.name || ''}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => handleReset(user.id)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Reset Password</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
