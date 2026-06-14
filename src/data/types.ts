// ─── Domain Types ───────────────────────────────────────────────────────────

export type PaymentMethod = 'Cash' | 'QRIS' | 'Debit/Credit' | 'Transfer';
export type TransactionStatus = 'Open' | 'Paid' | 'Cancelled';
export type Period = 'Hari Ini' | 'Minggu Ini' | 'Bulan Ini';
export type NavPage = 'Dashboard' | 'POS / Transaksi' | 'Produk & Stok' | 'Riwayat Transaksi' | 'Report' | 'Pengaturan';

export interface Transaction {
  id: string;
  time: string;
  items: string;
  paymentMethod: PaymentMethod;
  total: number;
  status: TransactionStatus;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
}

export interface KpiData {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
}

export interface ChartDataPoint {
  date: string;
  omzet: number;
  layanan: number;
  produk: number;
}

export interface PaymentBreakdown {
  method: PaymentMethod;
  amount: number;
  color: string;
}

export interface TopItem {
  rank: number;
  name: string;
  count: number;
  revenue: number;
}
