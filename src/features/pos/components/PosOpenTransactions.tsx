// ─── POS Open Transactions Component ────────────────────────────────────────

import React from 'react';
import { Play } from 'lucide-react';
import { usePosStoreContext } from '../state/PosStoreContext';
import { formatRupiah } from '../../../utils/format';

export function PosOpenTransactions() {
  const {
    openTransactions,
    isOpenTransactionsLoading,
    resumeOpenTransaction,
  } = usePosStoreContext();
  
  if (isOpenTransactionsLoading) {
    return (
      <div style={styles.openCard}>
        <div style={styles.loading}>Loading open transactions...</div>
      </div>
    );
  }
  
  return (
    <div style={styles.openCard}>
      <h2 style={styles.sectionTitle}>Transaksi Open Hari Ini</h2>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['No. Transaksi', 'Waktu', 'Pelanggan', 'Item', 'Total', 'Status', 'Aksi'].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {openTransactions.map((tx) => (
              <tr key={tx.id}>
                <td style={styles.td}>{tx.id}</td>
                <td style={styles.td}>{tx.time}</td>
                <td style={styles.td}>{tx.customerName}</td>
                <td style={styles.td}>{tx.items}</td>
                <td style={styles.td}>{formatRupiah(tx.total)}</td>
                <td style={styles.td}><span style={styles.statusBadge}>Open</span></td>
                <td style={styles.td}>
                  <button 
                    style={styles.continueBtn}
                    onClick={() => resumeOpenTransaction(tx.id)}
                  >
                    Lanjutkan <Play size={10} fill="#C75B3A" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  openCard: {
    background: '#fff',
    border: '1px solid #E7DCCB',
    borderRadius: 12,
    padding: 14,
  },
  sectionTitle: {
    margin: '0 0 12px',
    fontSize: 15,
    fontWeight: 800,
    color: '#1A3325',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 11,
  },
  th: {
    background: '#F8F4EE',
    color: '#534E48',
    padding: '9px 8px',
    textAlign: 'left',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  td: {
    borderBottom: '1px solid #F0E8DC',
    padding: '9px 8px',
    color: '#333',
    whiteSpace: 'nowrap',
  },
  statusBadge: {
    padding: '3px 10px',
    borderRadius: 999,
    background: '#E8F5E9',
    color: '#2E7D32',
    fontWeight: 700,
  },
  continueBtn: {
    border: '1px solid #EBD2BD',
    background: '#fff',
    color: '#C75B3A',
    borderRadius: 5,
    padding: '4px 8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    cursor: 'pointer',
  },
  loading: {
    padding: 20,
    textAlign: 'center',
    color: '#777',
  },
};
