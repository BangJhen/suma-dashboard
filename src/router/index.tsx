import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import PlaceholderPage from '../pages/PlaceholderPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'pos',
        element: <PlaceholderPage page="POS / Transaksi" />,
      },
      {
        path: 'products',
        element: <PlaceholderPage page="Produk & Stok" />,
      },
      {
        path: 'history',
        element: <PlaceholderPage page="Riwayat Transaksi" />,
      },
      {
        path: 'reports',
        element: <PlaceholderPage page="Report" />,
      },
      {
        path: 'settings',
        element: <PlaceholderPage page="Pengaturan" />,
      },
    ],
  },
  {
    path: '/login',
    element: <div style={{ padding: 40 }}><h1>Login Page</h1><p>Masih dalam pengembangan...</p></div>, // Kita bisa ubah ini nanti jadi AuthLayout
  }
]);
