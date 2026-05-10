"use client";

import { useState } from "react";
import styles from "./layout.module.css";

export default function NavGroup({ label, children }: { label: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      background: isOpen ? 'var(--bg-main)' : 'transparent',
      borderRadius: '8px',
      padding: isOpen ? '0.25rem' : '0',
      transition: 'all 0.2s'
    }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={styles.navItem}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'none', 
          border: 'none', 
          width: '100%', 
          cursor: 'pointer',
          textAlign: 'left',
          color: isOpen ? 'var(--color-primary)' : 'inherit'
        }}
      >
        <span>{label}</span>
        <span style={{ 
          fontSize: '0.75rem', 
          transition: 'transform 0.2s', 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
        }}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div style={{ 
          paddingLeft: '0.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.1rem', 
          marginTop: '0.25rem',
          borderLeft: '2px solid var(--border-subtle)'
        }}>
          {children}
        </div>
      )}
    </div>
  );
}
