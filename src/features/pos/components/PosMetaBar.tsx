// ─── POS Meta Bar Component ─────────────────────────────────────────────────

import React from 'react';
import { FileText, Circle, User, Clock } from 'lucide-react';
import { usePosStoreContext } from '../state/PosStoreContext';

export function PosMetaBar() {
  const {
    state,
    setSelectedCustomerId,
  } = usePosStoreContext();
  
  return (
    <div style={styles.metaGrid}>
      <MetaCard icon={<FileText size={20} />} label="No. Transaksi" value="TRX-140625-0069" />
      <MetaCard icon={<Circle size={18} fill="#C9A84C" color="#C9A84C" />} label="Status" value="Open" valueColor="#2E7D32" />
      <MetaCard icon={<User size={20} />} label="Kasir/Owner" value="Owner" />
      <MetaCard icon={<Clock size={20} />} label="Waktu" value={new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} />
      <div style={styles.customerBox}>
        <User size={20} color="#1A3325" />
        <div style={{ flex: 1 }}>
          <div style={styles.metaLabel}>Pelanggan</div>
          <select 
            style={styles.customerSelect}
            value={state.selectedCustomerId || ''}
            onChange={(e) => setSelectedCustomerId(e.target.value || null)}
          >
            <option value="">Pilih pelanggan</option>
            {state.customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function MetaCard({ icon, label, value, valueColor }: { icon: React.ReactNode; label: string; value: string; valueColor?: string }) {
  return (
    <div style={styles.metaCard}>
      <span style={styles.metaIcon}>{icon}</span>
      <div>
        <div style={styles.metaLabel}>{label}</div>
        <strong style={{ ...styles.metaValue, color: valueColor || '#1A3325' }}>{value}</strong>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(150px, 1fr)) minmax(260px, 0.9fr)',
    gap: 10,
    marginBottom: 16,
  },
  metaCard: {
    background: '#fff',
    border: '1px solid #E7DCCB',
    borderRadius: 10,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  metaIcon: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: '#F5EDD6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1A3325',
    flexShrink: 0,
  },
  metaLabel: {
    fontSize: 11,
    color: '#6E6A64',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: 700,
  },
  customerBox: {
    background: '#fff',
    border: '1px solid #E7DCCB',
    borderRadius: 10,
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  customerSelect: {
    width: '100%',
    border: '1px solid #E7DCCB',
    borderRadius: 6,
    padding: '7px 10px',
    fontSize: 13,
    background: '#fff',
    color: '#1A3325',
  },
};
