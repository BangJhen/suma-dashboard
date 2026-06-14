import React, { useState } from 'react';
import { ChevronDown, Home, LogOut, PanelLeftClose, PanelLeftOpen, User } from 'lucide-react';

const BRANCHES = [
  'Suma Barbershop - Cabang Utama',
  'Suma Barbershop - Cabang 1',
  'Suma Barbershop - Cabang 2',
];

interface TopbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Topbar({ isSidebarOpen, onToggleSidebar }: TopbarProps) {
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [openMenu, setOpenMenu] = useState<'branch' | 'owner' | null>(null);

  const toggleMenu = (menu: 'branch' | 'owner') => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  return (
    <header style={styles.topbar}>
      <div style={styles.brand}>
        <button onClick={onToggleSidebar} style={styles.menuButton} aria-label="Toggle sidebar">
          {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      <div style={styles.controls}>
        <div style={styles.dropdownWrap}>
          <button type="button" onClick={() => toggleMenu('branch')} style={styles.selector}>
            <Home size={16} color="#C75B3A" />
            <div style={styles.selectorText}>
              <div style={styles.selectorLabel}>Cabang Aktif</div>
              <div style={styles.selectorValue}>{branch}</div>
            </div>
            <ChevronDown size={14} color="#888" style={{ transform: openMenu === 'branch' ? 'rotate(180deg)' : 'none' }} />
          </button>

          {openMenu === 'branch' && (
            <div style={styles.dropdown}>
              {BRANCHES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setBranch(item);
                    setOpenMenu(null);
                  }}
                  style={{ ...styles.dropdownItem, ...(item === branch ? styles.dropdownItemActive : {}) }}
                >
                  <Home size={14} />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={styles.dropdownWrap}>
          <button type="button" onClick={() => toggleMenu('owner')} style={styles.selector}>
            <div style={styles.avatar}>S</div>
            <div style={styles.selectorText}>
              <div style={styles.selectorLabel}>Owner</div>
              <div style={styles.selectorValue}>owner@suma.com</div>
            </div>
            <ChevronDown size={14} color="#888" style={{ transform: openMenu === 'owner' ? 'rotate(180deg)' : 'none' }} />
          </button>

          {openMenu === 'owner' && (
            <div style={{ ...styles.dropdown, right: 0, width: 210 }}>
              <div style={styles.ownerInfo}>
                <div style={styles.avatarLarge}>S</div>
                <div>
                  <strong style={{ fontSize: 13 }}>Owner</strong>
                  <div style={{ fontSize: 11, color: '#888' }}>owner@suma.com</div>
                </div>
              </div>
              <button type="button" style={styles.dropdownItem}><User size={14} /> Profile</button>
              <button type="button" style={{ ...styles.dropdownItem, color: '#C75B3A' }}><LogOut size={14} /> Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  topbar: {
    background: 'rgba(255,255,255,0.92)',
    borderBottom: '1px solid #E8E2D8',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    height: 58,
    gap: 12,
    flexShrink: 0,
    position: 'relative',
    zIndex: 20,
    backdropFilter: 'blur(10px)',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 },
  menuButton: {
    width: 32,
    height: 32,
    border: 'none',
    background: 'transparent',
    color: '#1A3325',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  brandLogo: { height: 26, width: 'auto', objectFit: 'contain', marginLeft: 4 },
  controls: { display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  dropdownWrap: { position: 'relative' },
  selector: {
    minWidth: 230,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '6px 12px',
    border: '1px solid #E8D8C4',
    borderRadius: 9,
    background: '#FFFDF9',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
    boxShadow: '0 6px 18px rgba(85,58,25,0.04)',
  },
  selectorText: { flex: 1, minWidth: 0 },
  selectorLabel: { fontSize: 10, color: '#777', letterSpacing: 0.3 },
  selectorValue: { fontSize: 12, fontWeight: 600, color: '#1A3325', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  avatar: { width: 30, height: 30, borderRadius: '50%', background: '#1A3325', color: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 },
  avatarLarge: { width: 36, height: 36, borderRadius: '50%', background: '#1A3325', color: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    width: '100%',
    background: '#fff',
    border: '1px solid #E8D8C4',
    borderRadius: 10,
    padding: 6,
    boxShadow: '0 18px 50px rgba(26,51,37,0.14)',
    zIndex: 50,
  },
  dropdownItem: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    borderRadius: 7,
    padding: '9px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    fontSize: 12,
    color: '#1A3325',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
  },
  dropdownItemActive: { background: '#F5EDD6', color: '#1A3325', fontWeight: 700 },
  ownerInfo: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px 12px', borderBottom: '1px solid #F0E8DC', marginBottom: 4 },
};
