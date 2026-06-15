// ─── POS Payment Success Modal Component ─────────────────────────────────────

import React from 'react';
import { CheckCircle, FileText, Clock, User } from 'lucide-react';
import { usePosStoreContext } from '../state/PosStoreContext';
import { formatRupiah } from '../../../utils/format';

export function PosPaymentSuccessModal() {
  const {
    state,
    resetTransaction,
  } = usePosStoreContext();
  
  if (!state.completedTransaction) return null;
  
  const transaction = state.completedTransaction;
  
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalCard}>
        <div style={styles.successIcon}>
          <CheckCircle size={64} color="#2E7D32" />
        </div>

        <h2 style={styles.successTitle}>Pembayaran Berhasil</h2>
        <p style={styles.successSubtitle}>Transaksi telah diselesaikan dengan successfully.</p>

        <div style={styles.transactionDetails}>
          <DetailRow icon={<FileText size={18} />} label="No. Transaksi" value={transaction.id} />
          <DetailRow icon={<Clock size={18} />} label="Waktu" value={transaction.time} />
          <DetailRow 
            icon={<User size={18} />} 
            label="Pelanggan" 
            value={transaction.customer?.name || 'Pelanggan Umum'} 
          />
          <DetailRow icon={<CheckCircle size={18} />} label="Total Pembayaran" value={formatRupiah(transaction.total)} />
          <DetailRow icon={<CheckCircle size={18} />} label="Metode Pembayaran" value={transaction.paymentMethod} />
          {transaction.cashReceived !== undefined && (
            <DetailRow 
              icon={<CheckCircle size={18} />} 
              label="Uang Diterima" 
              value={formatRupiah(transaction.cashReceived)} 
            />
          )}
          {transaction.change !== undefined && transaction.change > 0 && (
            <DetailRow 
              icon={<CheckCircle size={18} />} 
              label="Kembalian" 
              value={formatRupiah(transaction.change)} 
              highlight 
            />
          )}
        </div>

        <div style={styles.modalActions}>
          <button onClick={resetTransaction} style={styles.modalDoneBtn}>
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, highlight = false }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div style={styles.detailRow}>
      <div style={styles.detailIcon}>{icon}</div>
      <div style={styles.detailInfo}>
        <span style={styles.detailLabel}>{label}</span>
        <span style={{ ...styles.detailValue, fontWeight: highlight ? 800 : 600, color: highlight ? '#2E7D32' : undefined }}>
          {value}
        </span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 31, 24, 0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E7DCCB',
    boxShadow: '0 24px 80px rgba(15,31,24,0.28)',
    padding: 24,
  },
  successIcon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    margin: '0 0 8px',
    fontSize: 24,
    fontWeight: 800,
    color: '#1A3325',
    textAlign: 'center',
  },
  successSubtitle: {
    margin: '0 0 24px',
    fontSize: 13,
    color: '#6E6A64',
    textAlign: 'center',
  },
  transactionDetails: {
    background: '#FBF3E8',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 0',
    borderBottom: '1px solid #F0E4D6',
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#F5EDD6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1A3325',
    flexShrink: 0,
  },
  detailInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
    color: '#6E6A64',
  },
  detailValue: {
    fontSize: 13,
    color: '#1A3325',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  modalDoneBtn: {
    height: 44,
    padding: '0 24px',
    borderRadius: 8,
    border: 'none',
    background: '#0F3F31',
    color: '#fff',
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
  },
};
