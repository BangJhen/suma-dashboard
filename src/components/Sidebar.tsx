import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  BarChart2,
  Settings,
  Clock,
} from 'lucide-react';
import { useServerClock } from '../hooks/useServerClock';
import type { NavPage } from '../data/types';

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
}

const NAV_ITEMS: { label: NavPage; icon: React.ReactNode }[] = [
  { label: 'Dashboard',         icon: <LayoutDashboard size={18} /> },
  { label: 'POS / Transaksi',   icon: <ShoppingCart size={18} /> },
  { label: 'Produk & Stok',     icon: <Package size={18} /> },
  { label: 'Riwayat Transaksi', icon: <Receipt size={18} /> },
  { label: 'Report',            icon: <BarChart2 size={18} /> },
  { label: 'Pengaturan',        icon: <Settings size={18} /> },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { timeStr, dateStr } = useServerClock();

  return (
    <aside style={styles.sidebar}>
      {/* Nusantara pattern overlay */}
      <div style={styles.pattern} aria-hidden="true" />

      {/* Logo */}
      <div style={styles.logoWrap}>
        <img src="/logo.png" alt="Suma Barber" style={styles.logoImage} />
      </div>

      {/* Navigation */}
      <nav style={styles.nav} aria-label="Navigasi utama">
        {NAV_ITEMS.map(({ label, icon }) => {
          const isActive = activePage === label;
          return (
            <button
              key={label}
              onClick={() => onNavigate(label)}
              style={{ ...styles.navItem, ...(isActive ? styles.navItemActive : {}) }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span style={{ ...styles.navIcon, ...(isActive ? styles.navIconActive : {}) }}>
                {icon}
              </span>
              <span style={{ ...styles.navLabel, ...(isActive ? styles.navLabelActive : {}) }}>
                {label}
              </span>
              {isActive && <span style={styles.activeBar} aria-hidden="true" />}
            </button>
          );
        })}
      </nav>

      {/* Server Clock */}
      <div style={styles.clockWrap}>
        <div style={styles.clockHeader}>
          <Clock size={12} color="rgba(255,255,255,0.4)" />
          <span style={styles.clockLabel}>Waktu Server</span>
        </div>
        <div style={styles.clockTime}>{timeStr}</div>
        <div style={styles.clockDate}>{dateStr}</div>
      </div>
    </aside>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 200,
    minWidth: 200,
    background: '#1A3325',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  pattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M20 0L40 20L20 40L0 20z'/%3E%3C/g%3E%3C/svg%3E")`,
    pointerEvents: 'none',
  },
  logoWrap: {
    padding: '24px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 80,
  },
  logoImage: {
    maxWidth: '100%',
    maxHeight: 50,
    objectFit: 'contain',
    // Karena sidebar warnanya hijau gelap, dan logo yang kamu berikan warnanya hitam,
    // kita ubah warnanya jadi putih (atau emas) otomatis lewat CSS:
    filter: 'brightness(0) invert(1)', 
  },
  nav: {
    flex: 1,
    padding: '10px 0',
    position: 'relative',
    zIndex: 1,
  },
  navItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.15s',
    textAlign: 'left' as const,
  },
  navItemActive: {
    background: 'rgba(201,168,76,0.12)',
  },
  navIcon: {
    color: 'rgba(255,255,255,0.45)',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  navIconActive: {
    color: '#C9A84C',
  },
  navLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: 400,
  },
  navLabelActive: {
    color: '#fff',
    fontWeight: 500,
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    background: '#C9A84C',
    borderRadius: '0 2px 2px 0',
  },
  clockWrap: {
    padding: '12px 16px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    position: 'relative',
    zIndex: 1,
  },
  clockHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  clockLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 0.5,
  },
  clockTime: {
    fontSize: 22,
    fontWeight: 600,
    color: '#fff',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: 1,
  },
  clockDate: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
};
