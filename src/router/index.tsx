import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import PosPage from '../features/pos/pages/PosPage';
import ProductsPage from '../features/products/pages/ProductsPage';
import ReportPage from '../features/reports/pages/ReportPage';
import TransactionHistoryPage from '../features/history/pages/TransactionHistoryPage';
import LoginPage from '../features/auth/pages/LoginPage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import SettingsPage from '../features/settings/pages/SettingsPage';

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
        element: <PosPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'history',
        element: <TransactionHistoryPage />,
      },
      {
        path: 'reports',
        element: <ReportPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  }
]);
