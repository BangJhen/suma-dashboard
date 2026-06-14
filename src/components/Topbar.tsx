import React from 'react';
import { Scissors, Home, ChevronDown } from 'lucide-react';

export default function Topbar() {
  return (
    <header style={styles.topbar}>
      <div style={styles.brand}>
        <img src="/logo.png" alt="Suma Barber" style={{ height: 20, objectFit: 'contain' }} />
        <span style={styles.brandName}>Suma Barber</span>
      </div>

      <div style={styles.controls}>
        {/* Branch Selector */}
        <div style={styles.selector}>
          <Home size={16} color="#1A3325" />
          <div>
            <div style={styles.selectorLabel}>Cabang Aktif</div>
            <div style={styles.selectorValue}>Suma Barbershop - Cabang Utama</div>
          </div>
          <ChevronDown size={14} color="#888" />
        </div>

        {/* Owner Selector */}
        <div style={styles.selector}>
          <div style={styles.avatar}>S</div>
          <div>
            <div style={styles.selectorLabel}>Owner</div>
            <div style={styles.selectorValue}>owner@suma.com</div>
          </div>
          <ChevronDown size={14} color="#888" />
        </div>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  topbar: {
    background: '#fff',
    borderBottom: '1px solid #E8E2D8',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    height: 52,
    gap: 12,
    flexShrink: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  brandName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1A3325',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  selector: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 12px',
    border: '1px solid #E8E2D8',
    borderRadius: 8,
    background: '#FAFAF8',
    cursor: 'pointer',
  },
  selectorLabel: {
    fontSize: 9,
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  selectorValue: {
    fontSize: 12,
    fontWeight: 500,
    color: '#1A3325',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#1A3325',
    color: '#C9A84C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
};
