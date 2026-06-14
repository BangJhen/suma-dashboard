import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import type { NavPage } from '../data/types';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Map route path to NavPage type for Sidebar
  let activePage: NavPage = 'Dashboard';
  if (location.pathname.startsWith('/pos')) activePage = 'POS / Transaksi';
  else if (location.pathname.startsWith('/products')) activePage = 'Produk & Stok';
  else if (location.pathname.startsWith('/history')) activePage = 'Riwayat Transaksi';
  else if (location.pathname.startsWith('/reports')) activePage = 'Report';
  else if (location.pathname.startsWith('/settings')) activePage = 'Pengaturan';

  const handleNavigate = (page: NavPage) => {
    switch (page) {
      case 'Dashboard': navigate('/'); break;
      case 'POS / Transaksi': navigate('/pos'); break;
      case 'Produk & Stok': navigate('/products'); break;
      case 'Riwayat Transaksi': navigate('/history'); break;
      case 'Report': navigate('/reports'); break;
      case 'Pengaturan': navigate('/settings'); break;
    }
  };

  return (
    <div style={styles.app}>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      <div style={styles.main}>
        <Topbar />

        <main style={styles.content}>
          <Outlet />
        </main>

        <footer style={styles.footer}>
          <span style={styles.footerScissor}>✂</span>
          Suma Barbershop POS • Dashboard Admin
          <span style={styles.footerScissor}>✂</span>
        </footer>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background: '#F5F0E8',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: 0,
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  footer: {
    background: '#fff',
    borderTop: '1px solid #E8E2D8',
    textAlign: 'center',
    padding: '8px 16px',
    fontSize: 10,
    color: '#aaa',
    letterSpacing: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexShrink: 0,
  },
  footerScissor: {
    color: '#C9A84C',
    fontSize: 12,
  },
};
