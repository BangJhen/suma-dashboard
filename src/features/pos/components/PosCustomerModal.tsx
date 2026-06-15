// ─── POS Customer Modal Component ────────────────────────────────────────────

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePosStoreContext } from '../state/PosStoreContext';

export function PosCustomerModal() {
  const {
    state,
    closeCustomerModal,
    handleCreateCustomer,
  } = usePosStoreContext();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = async () => {
    if (!name.trim()) {
      return;
    }
    
    const result = await handleCreateCustomer(name, phone, email);
    if (result?.success) {
      setName('');
      setPhone('');
      setEmail('');
    }
  };
  
  if (!state.isCustomerModalOpen) return null;
  
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalCard}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>Pelanggan Baru</h2>
            <p style={styles.modalSubtitle}>Tambahkan data pelanggan baru untuk transaksi ini.</p>
          </div>
          <button onClick={closeCustomerModal} style={styles.modalClose}>
            <X size={18} />
          </button>
        </div>

        <div style={styles.modalForm}>
          <label style={styles.modalLabel}>Nama</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.modalInput}
            placeholder="Nama lengkap pelanggan"
          />

          <label style={styles.modalLabel}>No. Telepon (opsional)</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.modalInput}
            placeholder="Contoh: 081234567890"
          />

          <label style={styles.modalLabel}>Email (opsional)</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.modalInput}
            placeholder="Contoh: pelanggan@example.com"
          />
        </div>

        <div style={styles.modalActions}>
          <button onClick={closeCustomerModal} style={styles.modalCancel}>
            Batal
          </button>
          <button onClick={handleSubmit} style={styles.modalSave}>
            Simpan
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
