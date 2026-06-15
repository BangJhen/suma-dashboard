import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import type { NavPage } from '../data/types';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={styles.app}>
      <div style={{ ...styles.sidebarWrap, width: isSidebarOpen ? 224 : 0, minWidth: isSidebarOpen ? 224 : 0 }}>
        <Sidebar activePage={activePage} onNavigate={handleNavigate} isOpen={isSidebarOpen} />
      </div>

      <div style={styles.main}>
        <Topbar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />

        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    backgroundImage: 'url("/background-suma-web-light.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  },
  sidebarWrap: {
    overflow: 'hidden',
    transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    flexShrink: 0,
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
};
