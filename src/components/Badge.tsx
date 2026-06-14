import React from 'react';
import type { TransactionStatus } from '../data/types';

interface BadgeProps {
  status: TransactionStatus | 'Kritis' | 'Rendah';
}

const CONFIG = {
  Paid:      { bg: '#E8F5E9', color: '#2E7D32' },
  Cancelled: { bg: '#FCE8E8', color: '#C62828' },
  Open:      { bg: '#FFF3E0', color: '#E65100' },
  Kritis:    { bg: '#FCE8E8', color: '#C62828' },
  Rendah:    { bg: '#FFF8E1', color: '#F57F17' },
};

export default function Badge({ status }: BadgeProps) {
  const cfg = CONFIG[status] ?? CONFIG.Open;
  return (
    <span
      style={{
        padding: '2px 10px',
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}
