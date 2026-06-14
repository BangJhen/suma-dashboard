import React from 'react';
import { formatRupiah, formatPct } from '../data/utils';

interface KpiCardProps {
  label: string;
  value: number;
  isRupiah?: boolean;
  change: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor?: string;
}

export default function KpiCard({
  label,
  value,
  isRupiah = false,
  change,
  icon,
  iconBg,
  iconColor = '#fff',
}: KpiCardProps) {
  const positive = change >= 0;

  return (
    <div style={styles.card}>
      <div style={{ ...styles.iconWrap, background: iconBg }}>
        <span style={{ color: iconColor, display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      </div>
      <div style={styles.body}>
        <div style={styles.label}>{label}</div>
        <div style={styles.value}>
          {isRupiah ? formatRupiah(value) : value.toLocaleString('id-ID')}
        </div>
        <div style={styles.change}>
          <span style={{ color: positive ? '#2E7D32' : '#C62828', fontWeight: 500 }}>
            {formatPct(change)}
          </span>
          {' '}
          <span style={{ color: '#888' }}>vs kemarin</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#fff',
    border: '1px solid #E8E2D8',
    borderRadius: 10,
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: 700,
    color: '#1A3325',
    whiteSpace: 'nowrap',
  },
  change: {
    fontSize: 11,
    marginTop: 2,
  },
};
