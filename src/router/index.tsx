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
import BookingPage from '../features/booking/pages/BookingPage';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import PublicOnlyRoute from '../features/auth/components/PublicOnlyRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
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
    path: '/booking',
    element: <BookingPage />,
  },
  {
    path: '/login',
    element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>,
  }
]);
