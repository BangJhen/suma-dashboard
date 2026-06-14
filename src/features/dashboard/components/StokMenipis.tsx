import React from 'react';
import { Package } from 'lucide-react';
import { PRODUCTS } from '../../../data/seed';
import Badge from '../../../components/Badge';

const LOW_STOCK = PRODUCTS.filter((p) => p.stock <= p.lowStockThreshold)
  .sort((a, b) => a.stock - b.stock);

export default function StokMenipis() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>Stok Menipis</div>
        <button style={styles.seeAll}>Lihat Semua</button>
      </div>

      {LOW_STOCK.map((p) => {
        const level = p.stock <= 5 ? 'Kritis' : 'Rendah';
        return (
          <div key={p.id} style={styles.row}>
            <div style={styles.iconWrap}>
              <Package size={16} color="#C9A84C" />
            </div>
            <div style={styles.name}>{p.name}</div>
            <div style={styles.sisa}>Sisa {p.stock}</div>
            <Badge status={level} />
          </div>
        );
      })}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#fff',
    border: '1px solid #E8E2D8',
    borderRadius: 10,
    padding: '14px',
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    gap: 10,
    padding: '7px 0',
    borderBottom: '1px solid #F8F4EE',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 6,
    background: '#F5EDD6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  name: { fontSize: 12, fontWeight: 500, color: '#333', flex: 1 },
  sisa: { fontSize: 11, color: '#888', whiteSpace: 'nowrap' },
};
