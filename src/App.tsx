import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardPage from './pages/DashboardPage';
import PlaceholderPage from './pages/PlaceholderPage';
import type { NavPage } from './data/types';

export default function App() {
  const [activePage, setActivePage] = useState<NavPage>('Dashboard');

  return (
    <div style={styles.app}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div style={styles.main}>
        <Topbar />

        <main style={styles.content}>
          {activePage === 'Dashboard' ? (
            <DashboardPage />
          ) : (
            <PlaceholderPage page={activePage} />
          )}
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
