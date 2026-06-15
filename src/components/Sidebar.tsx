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
  isOpen: boolean;
}

const NAV_ITEMS: { label: NavPage; icon: React.ReactNode }[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'POS / Transaksi', icon: <ShoppingCart size={18} /> },
  { label: 'Produk & Stok', icon: <Package size={18} /> },
  { label: 'Riwayat Transaksi', icon: <Receipt size={18} /> },
  { label: 'Report', icon: <BarChart2 size={18} /> },
  { label: 'Pengaturan', icon: <Settings size={18} /> },
];

export default function Sidebar({ activePage, onNavigate, isOpen }: SidebarProps) {
  const { timeStr, dateStr } = useServerClock();

  return (
    <aside style={{ ...styles.sidebar, transform: `translateX(${isOpen ? 0 : -224}px)` }}>
      <div style={styles.logoWrap}>
        <img src="/Logo%20Suma%20Barbershop.png" alt="Suma Barbershop" style={styles.logoImage} />
      </div>

      <nav style={styles.nav} aria-label="Navigasi utama">
        {NAV_ITEMS.map(({ label, icon }) => {
          const isActive = activePage === label;
          return (
            <button
              key={label}
              type="button"
              className="sidebar-nav-item"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onNavigate(label)}
              style={{ ...styles.navItem, ...(isActive ? styles.navItemActive : {}) }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span style={{ ...styles.navIcon, ...(isActive ? styles.navIconActive : {}) }}>{icon}</span>
              <span style={{ ...styles.navLabel, ...(isActive ? styles.navLabelActive : {}) }}>{label}</span>
            </button>
          );
        })}
      </nav>

      <div style={styles.clockWrap}>
        <div style={styles.clockHeader}>
          <span>Waktu Server</span>
          <Clock size={13} color="#C9A84C" />
        </div>
        <div style={styles.clockTime}>{timeStr}</div>
        <div style={styles.clockDate}>{dateStr}</div>
      </div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 224,
    minWidth: 224,
    height: '100vh',
    backgroundImage: 'url("/sidebar-background.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRight: '1px solid rgba(201,168,76,0.16)',
    transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  logoWrap: {
    padding: '34px 28px 30px',
    position: 'relative',
    zIndex: 1,
  },
  logoImage: {
    width: 140,
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
    margin: '0 auto',
  },
  nav: {
    flex: 1,
    padding: '10px 12px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  navItem: {
    width: '100%',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.18s ease',
    textAlign: 'left' as const,
    fontFamily: 'inherit',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  navItemActive: {
    background: 'linear-gradient(90deg, rgba(244,217,155,0.24) 0%, rgba(255,255,255,0.12) 16%, rgba(255,255,255,0.08) 100%)',
    boxShadow: 'none',
  },
  navIcon: { color: 'rgba(255,255,255,0.78)', display: 'flex', alignItems: 'center', flexShrink: 0 },
  navIconActive: { color: '#F4D99B' },
  navLabel: { color: 'rgba(255,255,255,0.78)', fontSize: 14, fontWeight: 500 },
  navLabelActive: { color: '#fff', fontWeight: 700 },
  clockWrap: {
    margin: '0 20px 24px',
    padding: '15px 16px',
    border: '1px solid rgba(201,168,76,0.35)',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.07)',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 16px 38px rgba(0,0,0,0.16)',
  },
  clockHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontSize: 11,
    color: 'rgba(255,255,255,0.78)',
  },
  clockTime: { fontSize: 24, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums', letterSpacing: 0.5 },
  clockDate: { fontSize: 11, color: 'rgba(255,255,255,0.72)', marginTop: 6 },
};
