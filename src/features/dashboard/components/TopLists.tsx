import React from 'react';
import { Scissors, ShoppingBag } from 'lucide-react';
import { TOP_SERVICES, TOP_PRODUCTS } from '../../../data/seed';
import { formatRupiah } from '../../../utils/format';
import type { TopItem } from '../../../data/types';

interface TopListProps {
  title: string;
  items: TopItem[];
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  onSeeAll?: (title: string, items: TopItem[]) => void;
}

function TopList({ title, items, icon, iconBg, iconColor, onSeeAll }: TopListProps) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={{ ...styles.iconWrap, background: iconBg }}>
            <span style={{ color: iconColor, display: 'flex', alignItems: 'center' }}>{icon}</span>
          </div>
          <div style={styles.title}>{title}</div>
        </div>
        <button type="button" onClick={() => onSeeAll?.(title, items)} style={styles.seeAll}>Lihat Semua</button>
      </div>

      {items.map((item) => (
        <div key={item.rank} style={styles.row}>
          <span style={styles.rank}>{item.rank}.</span>
          <span style={styles.name}>{item.name}</span>
          <span style={styles.count}>{item.count}</span>
          <span style={styles.revenue}>{formatRupiah(item.revenue)}</span>
        </div>
      ))}
    </div>
  );
}

export default function TopLists({ onSeeAll }: { onSeeAll?: (title: string, items: TopItem[]) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <TopList
        title="Top Layanan"
        items={TOP_SERVICES}
        icon={<Scissors size={14} />}
        iconBg="#E8F5E9"
        iconColor="#2E7D32"
        onSeeAll={onSeeAll}
      />
      <TopList
        title="Top Produk"
        items={TOP_PRODUCTS}
        icon={<ShoppingBag size={14} />}
        iconBg="#FFF8E1"
        iconColor="#C9A84C"
        onSeeAll={onSeeAll}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#fff',
    border: '1px solid #E8E2D8',
    borderRadius: 10,
    padding: '12px 14px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 12, fontWeight: 600, color: '#1A3325' },
  seeAll: {
    background: 'none',
    border: 'none',
    color: '#C75B3A',
    fontSize: 11,
    fontWeight: 500,
    cursor: 'pointer',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 0',
    borderBottom: '1px solid #F8F4EE',
    fontSize: 11,
    gap: 4,
  },
  rank: { width: 18, color: '#888', fontWeight: 600, flexShrink: 0 },
  name: { flex: 1, color: '#333', fontWeight: 500 },
  count: { color: '#888', width: 24, textAlign: 'right' as const, flexShrink: 0 },
  revenue: {
    fontWeight: 600,
    color: '#1A3325',
    textAlign: 'right' as const,
    minWidth: 78,
    flexShrink: 0,
  },
};
