import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { CHART_DATA } from '../data/seed';
import { formatRupiah, formatRupiahCompact } from '../data/utils';

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: '#1A3325' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ fontSize: 12, display: 'flex', gap: 8, marginBottom: 2 }}>
          <span style={{ color: p.color, fontWeight: 500 }}>{p.name}:</span>
          <span>{formatRupiah(p.value ?? 0)}</span>
        </div>
      ))}
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

export default function MixChart() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>Layanan vs Produk (7 Hari Terakhir)</div>
        <div style={styles.legend}>
          <span style={styles.legendItem}>
            <span style={{ ...styles.dot, background: '#1A3325' }} />
            Layanan
          </span>
          <span style={styles.legendItem}>
            <span style={{ ...styles.dot, background: '#C9A84C' }} />
            Produk
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={CHART_DATA} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={14}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={formatRupiahCompact}
            tick={{ fontSize: 10, fill: '#888' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="layanan" name="Layanan" stackId="a" fill="#1A3325" radius={[0, 0, 2, 2]} />
          <Bar dataKey="produk"  name="Produk"  stackId="a" fill="#C9A84C" radius={[2, 2, 0, 0]} />
        </BarChart>
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
  legend: { display: 'flex', gap: 12 },
  legendItem: {
    display: 'flex', alignItems: 'center', gap: 4,
    fontSize: 10, color: '#666',
  },
  dot: {
    width: 8, height: 8, borderRadius: 2, display: 'inline-block',
  },
};
