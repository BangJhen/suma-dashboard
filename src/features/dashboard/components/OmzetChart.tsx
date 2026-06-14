import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { CHART_DATA } from '../../../data/seed';
import { formatRupiah, formatRupiahCompact } from '../../../utils/format';

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
      <div style={{ fontWeight: 600, marginBottom: 4, color: '#1A3325' }}>{label}</div>
      <div style={{ fontSize: 13 }}>{formatRupiah(payload[0].value ?? 0)}</div>
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #E8E2D8',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

const totalOmzet = CHART_DATA.reduce((s, d) => s + d.omzet, 0);

export default function OmzetChart() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>Omzet (7 Hari Terakhir)</div>
        <div style={styles.total}>Total: {formatRupiah(totalOmzet)}</div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={CHART_DATA} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#888' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatRupiahCompact}
            tick={{ fontSize: 10, fill: '#888' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="omzet"
            stroke="#1A3325"
            strokeWidth={2}
            dot={{ fill: '#1A3325', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#C9A84C' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#fff',
    border: '1px solid #E8E2D8',
    borderRadius: 10,
    padding: '14px 14px 8px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 12, fontWeight: 600, color: '#1A3325' },
  total: { fontSize: 11, fontWeight: 500, color: '#1A3325' },
};
