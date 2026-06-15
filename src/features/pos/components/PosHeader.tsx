// ─── POS Header Component ───────────────────────────────────────────────────

import React from 'react';
import { Search, Plus } from 'lucide-react';
import { usePosStoreContext } from '../state/PosStoreContext';

export function PosHeader() {
  const {
    state,
    setCustomerSearchQuery,
    openCustomerModal,
  } = usePosStoreContext();
  
  return (
    <div style={styles.headerRow}>
      <div>
        <h1 style={styles.title}>Kasir / POS Transaksi</h1>
        <p style={styles.subtitle}>Input transaksi layanan dan produk untuk cabang aktif secara cepat dan rapi.</p>
      </div>
      <div style={styles.customerActions}>
        <div style={styles.searchCustomer}>
          <Search size={15} color="#777" />
          <input
            style={styles.searchInput}
            placeholder="Cari pelanggan (Ctrl+K)"
            value={state.customerSearchQuery}
            onChange={(e) => setCustomerSearchQuery(e.target.value)}
          />
        </div>
        <button style={styles.outlineButton} onClick={openCustomerModal}>
          <Plus size={15} /> Pelanggan Baru
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
    marginBottom: 18,
  },
  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 800,
    color: '#123526',
    fontFamily: 'var(--font-heading)',
  },
  subtitle: {
    margin: '6px 0 0',
    fontSize: 13,
    color: '#6E6A64',
  },
  customerActions: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexShrink: 0,
  },
  searchCustomer: {
    width: 290,
    height: 38,
    background: '#fff',
    border: '1px solid #E2D7C7',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 12px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    flex: 1,
    fontSize: 12,
    background: 'transparent',
  },
  outlineButton: {
    height: 38,
    border: '1px solid #DDBB95',
    background: '#fff',
    color: '#C75B3A',
    borderRadius: 8,
    padding: '0 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
