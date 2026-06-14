import React from 'react';
import { PieChart, Pie, Cell, Tooltip, TooltipProps } from 'recharts';
import { PAYMENT_BREAKDOWN } from '../../../data/seed';
import { formatRupiah } from '../../../utils/format';

const TOTAL = PAYMENT_BREAKDOWN.reduce((s, p) => s + p.amount, 0);

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={tooltipStyle}>
      <div style={{ fontWeight: 600, color: '#1A3325' }}>{d.name}</div>
      <div style={{ fontSize: 12 }}>{formatRupiah(d.value ?? 0)}</div>
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

export default function PaymentChart({ onViewDetail }: { onViewDetail?: () => void }) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>Ringkasan Pembayaran</div>
      <div style={styles.body}>

        {/* Donut */}
        <div style={styles.donutWrap}>
          <PieChart width={110} height={110}>
            <Pie
              data={PAYMENT_BREAKDOWN}
              cx={50}
              cy={50}
              innerRadius={34}
              outerRadius={50}
              dataKey="amount"
              nameKey="method"
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
            >
              {PAYMENT_BREAKDOWN.map((entry) => (
                <Cell key={entry.method} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
          <div style={styles.center}>
            <div style={styles.centerVal}>Rp {(TOTAL / 1_000_000).toFixed(2)}jt</div>
            <div style={styles.centerLabel}>Total</div>
          </div>
        </div>

        {/* Legend list */}
        <div style={styles.list}>
          {PAYMENT_BREAKDOWN.map((p) => {
            const pct = ((p.amount / TOTAL) * 100).toFixed(1);
            return (
              <div key={p.method} style={styles.row}>
                <div style={styles.rowLeft}>
                  <span style={{ ...styles.dot, background: p.color }} />
                  <span style={styles.methodName}>{p.method}</span>
                </div>
                <div style={styles.rowRight}>
                  <span style={styles.amount}>{formatRupiah(p.amount)}</span>
                  <span style={styles.pct}>{pct}%</span>
                </div>
              </div>
            );
          })}
          <button type="button" onClick={onViewDetail} style={styles.viewLink}>Lihat detail pembayaran →</button>
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
    padding: '14px',
  },
  title: { fontSize: 12, fontWeight: 600, color: '#1A3325', marginBottom: 10 },
  body: { display: 'flex', alignItems: 'center', gap: 10 },
  donutWrap: { position: 'relative', flexShrink: 0 },
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
    pointerEvents: 'none',
  },
  centerVal: { fontSize: 11, fontWeight: 700, color: '#1A3325', whiteSpace: 'nowrap' },
  centerLabel: { fontSize: 9, color: '#888' },
  list: { flex: 1 },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 0',
    borderBottom: '1px solid #F8F4EE',
    fontSize: 11,
  },
  rowLeft: { display: 'flex', alignItems: 'center', gap: 6 },
  rowRight: { display: 'flex', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0, display: 'inline-block' },
  methodName: { color: '#444' },
  amount: { fontWeight: 600, color: '#1A3325' },
  pct: { color: '#888', fontSize: 10 },
  viewLink: {
    display: 'block',
    width: '100%',
    marginTop: 6,
    paddingTop: 6,
    borderTop: '1px solid #F0EBE1',
    background: 'none',
    border: 'none',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#F0EBE1',
    color: '#C75B3A',
    fontSize: 11,
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left' as const,
    padding: '6px 0 0 0',
  },
};
