import React from 'react';
import { X } from 'lucide-react';

interface DashboardDetailModalProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function DashboardDetailModal({ title, subtitle, children, onClose }: DashboardDetailModalProps) {
  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{title}</h2>
            {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Tutup modal">
            <X size={18} />
          </button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(15,31,24,0.45)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 760,
    maxHeight: '82vh',
    overflow: 'hidden',
    background: '#fff',
    border: '1px solid #E6D8C6',
    borderRadius: 16,
    boxShadow: '0 24px 80px rgba(15,31,24,0.28)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    padding: '20px 22px 16px',
    borderBottom: '1px solid #F0E6D8',
  },
  title: {
    margin: 0,
    fontFamily: 'var(--font-heading)',
    fontSize: 22,
    color: '#10281F',
  },
  subtitle: {
    margin: '5px 0 0',
    color: '#6E6A64',
    fontSize: 13,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    border: 'none',
    background: '#F8F4EE',
    color: '#10281F',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  body: {
    padding: 22,
    overflowY: 'auto',
    maxHeight: 'calc(82vh - 84px)',
  },
};
