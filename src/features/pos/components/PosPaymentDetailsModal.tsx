// ─── POS Payment Details Modal Component ─────────────────────────────────────

import React from 'react';
import { X } from 'lucide-react';
import { usePosStoreContext } from '../state/PosStoreContext';

const BANKS = ['BCA', 'Mandiri', 'BRI', 'BNI', 'CIMB Niaga', 'BSI'];

export function PosPaymentDetailsModal() {
  const {
    state,
    closePaymentModal,
    setPaymentDetails,
  } = usePosStoreContext();
  
  if (!state.isPaymentModalOpen) return null;
  
  const isCardPayment = state.paymentMethod === 'Debit/Credit';
  
  const handleChange = (field: string, value: string) => {
    setPaymentDetails({
      ...state.paymentDetails,
      [field]: value,
    });
  };
  
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalCard}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>
              {isCardPayment ? 'Detail Debit/Credit' : 'Detail Transfer'}
            </h2>
            <p style={styles.modalSubtitle}>Lengkapi informasi pembayaran sebelum transaksi diselesaikan.</p>
          </div>
          <button onClick={closePaymentModal} style={styles.modalClose}>
            <X size={18} />
          </button>
        </div>

        <div style={styles.modalForm}>
          {isCardPayment ? (
            <>
              <label style={styles.modalLabel}>Tipe Kartu</label>
              <select 
                value={state.paymentDetails?.cardType || 'Debit'} 
                onChange={(e) => handleChange('cardType', e.target.value)}
                style={styles.modalInput}
              >
                <option value="Debit">Debit</option>
                <option value="Credit">Credit</option>
              </select>

              <label style={styles.modalLabel}>Bank / Issuer</label>
              <select 
                value={state.paymentDetails?.bank || 'BCA'} 
                onChange={(e) => handleChange('bank', e.target.value)}
                style={styles.modalInput}
              >
                {BANKS.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>

              <label style={styles.modalLabel}>Nomor Approval / Reference</label>
              <input 
                value={state.paymentDetails?.approvalCode || ''} 
                onChange={(e) => handleChange('approvalCode', e.target.value)}
                style={styles.modalInput} 
                placeholder="Contoh: 829102" 
              />

              <label style={styles.modalLabel}>Catatan Opsional</label>
              <textarea 
                value={state.paymentDetails?.note || ''} 
                onChange={(e) => handleChange('note', e.target.value)}
                style={styles.modalTextarea} 
                placeholder="Contoh: kartu customer tidak perlu struk bank" 
              />
            </>
          ) : (
            <>
              <label style={styles.modalLabel}>Bank Tujuan</label>
              <select 
                value={state.paymentDetails?.bank || 'Mandiri'} 
                onChange={(e) => handleChange('bank', e.target.value)}
                style={styles.modalInput}
              >
                {BANKS.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>

              <label style={styles.modalLabel}>Nomor Rekening</label>
              <input 
                value={state.paymentDetails?.accountNumber || ''} 
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                style={styles.modalInput} 
                placeholder="Nomor rekening tujuan" 
              />

              <label style={styles.modalLabel}>Nama Penerima</label>
              <input 
                value={state.paymentDetails?.accountName || 'Suma Barbershop'} 
                onChange={(e) => handleChange('accountName', e.target.value)}
                style={styles.modalInput} 
                placeholder="Nama penerima" 
              />

              <label style={styles.modalLabel}>Nomor Referensi Transfer</label>
              <input 
                value={state.paymentDetails?.referenceNumber || ''} 
                onChange={(e) => handleChange('referenceNumber', e.target.value)}
                style={styles.modalInput} 
                placeholder="Contoh: TRF-9821" 
              />

              <label style={styles.modalLabel}>Catatan Opsional</label>
              <textarea 
                value={state.paymentDetails?.note || ''} 
                onChange={(e) => handleChange('note', e.target.value)}
                style={styles.modalTextarea} 
                placeholder="Contoh: transfer dari rekening atas nama pelanggan" 
              />
            </>
          )}
        </div>

        <div style={styles.modalActions}>
          <button onClick={closePaymentModal} style={styles.modalCancel}>
            Batal
          </button>
          <button onClick={closePaymentModal} style={styles.modalSave}>
            Simpan Detail
          </button>
        </div>
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
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: 800,
    color: '#333',
    marginTop: 6,
  },
  modalInput: {
    height: 42,
    border: '1px solid #E7DCCB',
    borderRadius: 8,
    padding: '0 12px',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
    color: '#1A3325',
    background: '#fff',
  },
  modalTextarea: {
    minHeight: 76,
    border: '1px solid #E7DCCB',
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    color: '#1A3325',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  modalCancel: {
    height: 40,
    padding: '0 16px',
    borderRadius: 8,
    border: '1px solid #E7DCCB',
    color: '#555',
    background: '#fff',
    fontWeight: 800,
    cursor: 'pointer',
  },
  modalSave: {
    height: 40,
    padding: '0 18px',
    borderRadius: 8,
    border: 'none',
    color: '#fff',
    background: '#0F3F31',
    fontWeight: 800,
    cursor: 'pointer',
  },
};
