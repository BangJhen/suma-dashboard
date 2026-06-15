// ─── POS QR Modal Component ──────────────────────────────────────────────────

import React from 'react';
import { X } from 'lucide-react';
import { usePosStoreContext } from '../state/PosStoreContext';

export function PosQrModal() {
  const {
    state,
    closeQrModal,
  } = usePosStoreContext();
  
  if (!state.isQrModalOpen) return null;
  
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalCard}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>QRIS Payment</h2>
            <p style={styles.modalSubtitle}>Tunjukkan QR code ini kepada pelanggan untuk pembayaran.</p>
          </div>
          <button onClick={closeQrModal} style={styles.modalClose}>
            <X size={18} />
          </button>
        </div>

        <div style={styles.qrContent}>
          <div style={styles.qrPlaceholder}>
            <QrCodeIcon size={120} color="#1A3325" />
          </div>
          <div style={styles.qrInfo}>
            <p style={styles.qrText}>QR code dummy untuk demo</p>
            <p style={styles.qrSubtext}>Scan dengan e-wallet aplikasi</p>
          </div>
        </div>

        <div style={styles.modalActions}>
          <button onClick={closeQrModal} style={styles.modalCloseBtn}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

const QrCodeIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <path d="M3 14h7v7H3z"></path>
  </svg>
);

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
    maxWidth: 400,
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E7DCCB',
    boxShadow: '0 24px 80px rgba(15,31,24,0.28)',
    padding: 22,
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 18,
  },
  modalTitle: {
    margin: 0,
    fontSize: 20,
    color: '#1A3325',
    fontFamily: 'var(--font-heading)',
  },
  modalSubtitle: {
    margin: '5px 0 0',
    fontSize: 12,
    color: '#777',
    lineHeight: 1.5,
  },
  modalClose: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: '#F8F4EE',
    color: '#1A3325',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  qrContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  qrPlaceholder: {
    width: 160,
    height: 160,
    background: '#fff',
    border: '4px solid #1A3325',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrInfo: {
    textAlign: 'center',
  },
  qrText: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1A3325',
    margin: '0 0 4px',
  },
  qrSubtext: {
    fontSize: 11,
    color: '#6E6A64',
    margin: 0,
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  modalCloseBtn: {
    height: 40,
    padding: '0 20px',
    borderRadius: 8,
    border: '1px solid #E7DCCB',
    color: '#555',
    background: '#fff',
    fontWeight: 800,
    cursor: 'pointer',
  },
};
