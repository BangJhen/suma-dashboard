import React from 'react';
import { TRANSACTIONS } from '../../../data/seed';
import { formatRupiah } from '../../../utils/format';
import Badge from '../../../components/Badge';

const PREVIEW = TRANSACTIONS.slice(0, 10);

export default function RecentTransactions() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>Transaksi Terbaru</div>
        <button style={styles.seeAll}>Lihat Semua</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['No. Transaksi', 'Waktu', 'Item', 'Metode Pembayaran', 'Total', 'Status'].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PREVIEW.map((tx) => (
              <tr key={tx.id} style={styles.row}>
                <td style={{ ...styles.td, fontWeight: 500, color: '#1A3325' }}>{tx.id}</td>
                <td style={styles.td}>{tx.time}</td>
                <td style={styles.td}>{tx.items}</td>
                <td style={styles.td}>{tx.paymentMethod}</td>
                <td style={{ ...styles.td, fontWeight: 600 }}>{formatRupiah(tx.total)}</td>
                <td style={styles.td}><Badge status={tx.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.footer}>
        Menampilkan {PREVIEW.length} dari {TRANSACTIONS.length} transaksi
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 13, fontWeight: 600, color: '#1A3325' },
  seeAll: {
    background: 'none',
    border: 'none',
    color: '#C75B3A',
    fontSize: 11,
    fontWeight: 500,
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: 12,
  },
  th: {
    fontSize: 11,
    color: '#888',
    fontWeight: 500,
    padding: '6px 8px',
    textAlign: 'left' as const,
    borderBottom: '1px solid #F0EBE1',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '8px',
    color: '#333',
    borderBottom: '1px solid #F8F4EE',
    whiteSpace: 'nowrap',
  },
  row: {},
  footer: {
    marginTop: 8,
    fontSize: 11,
    color: '#888',
  },
};
