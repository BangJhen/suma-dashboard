import type {
  Transaction,
  Product,
  ChartDataPoint,
  PaymentBreakdown,
  TopItem,
} from './types';

// ─── Transactions ────────────────────────────────────────────────────────────

export const TRANSACTIONS: Transaction[] = [
  { id: 'TRX-140625-0068', time: '14:24', items: 'Haircut + Pomade',                paymentMethod: 'QRIS',         total: 120000,  status: 'Paid'      },
  { id: 'TRX-140625-0067', time: '14:05', items: 'Haircut + Creambath + Hair Tonic', paymentMethod: 'Cash',         total: 180000,  status: 'Paid'      },
  { id: 'TRX-140625-0066', time: '13:48', items: 'Haircut',                          paymentMethod: 'Debit/Credit', total: 70000,   status: 'Paid'      },
  { id: 'TRX-140625-0065', time: '13:30', items: 'Clay Matte + Hair Tonic',          paymentMethod: 'Transfer',     total: 155000,  status: 'Paid'      },
  { id: 'TRX-140625-0064', time: '13:12', items: 'Haircut + Shaving',                paymentMethod: 'Cash',         total: 100000,  status: 'Cancelled' },
  { id: 'TRX-140625-0063', time: '12:55', items: 'Creambath + Hair Vitamin',         paymentMethod: 'QRIS',         total: 145000,  status: 'Paid'      },
  { id: 'TRX-140625-0062', time: '12:30', items: 'Haircut',                          paymentMethod: 'Cash',         total: 70000,   status: 'Paid'      },
  { id: 'TRX-140625-0061', time: '12:10', items: 'Hair Spa',                         paymentMethod: 'Transfer',     total: 120000,  status: 'Paid'      },
  { id: 'TRX-140625-0060', time: '11:50', items: 'Pomade Water Based',               paymentMethod: 'Cash',         total: 85000,   status: 'Paid'      },
  { id: 'TRX-140625-0059', time: '11:30', items: 'Coloring + Haircut',               paymentMethod: 'QRIS',         total: 250000,  status: 'Paid'      },
];

// ─── Products ────────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  { id: 'P001', name: 'Pomade Water Based',   category: 'Styling',    price: 85000,  stock: 5,  lowStockThreshold: 10 },
  { id: 'P002', name: 'Hair Tonic 100ml',     category: 'Treatment',  price: 65000,  stock: 7,  lowStockThreshold: 10 },
  { id: 'P003', name: 'Clay Matte',           category: 'Styling',    price: 90000,  stock: 8,  lowStockThreshold: 10 },
  { id: 'P004', name: 'Shampoo Anti Dandruff',category: 'Cleansing',  price: 55000,  stock: 9,  lowStockThreshold: 10 },
  { id: 'P005', name: 'Hair Vitamin',         category: 'Treatment',  price: 75000,  stock: 15, lowStockThreshold: 10 },
  { id: 'P006', name: 'Pomade Oil Based',     category: 'Styling',    price: 80000,  stock: 18, lowStockThreshold: 10 },
  { id: 'P007', name: 'Conditioner 200ml',    category: 'Cleansing',  price: 60000,  stock: 22, lowStockThreshold: 10 },
];

// ─── Chart Data ──────────────────────────────────────────────────────────────

export const CHART_DATA: ChartDataPoint[] = [
  { date: '8 Jun',  omzet: 2800000, layanan: 1800000, produk: 1000000 },
  { date: '9 Jun',  omzet: 3200000, layanan: 2100000, produk: 1100000 },
  { date: '10 Jun', omzet: 3800000, layanan: 2400000, produk: 1400000 },
  { date: '11 Jun', omzet: 2900000, layanan: 1900000, produk: 1000000 },
  { date: '12 Jun', omzet: 4200000, layanan: 2800000, produk: 1400000 },
  { date: '13 Jun', omzet: 5100000, layanan: 3300000, produk: 1800000 },
  { date: '14 Jun', omzet: 6750000, layanan: 4350000, produk: 2400000 },
];

// ─── Payment Breakdown ───────────────────────────────────────────────────────

export const PAYMENT_BREAKDOWN: PaymentBreakdown[] = [
  { method: 'Cash',         amount: 2450000, color: '#1A3325' },
  { method: 'QRIS',         amount: 2100000, color: '#2E7D32' },
  { method: 'Debit/Credit', amount: 1250000, color: '#B0B0B0' },
  { method: 'Transfer',     amount: 950000,  color: '#C75B3A' },
];

// ─── Top Services ────────────────────────────────────────────────────────────

export const TOP_SERVICES: TopItem[] = [
  { rank: 1, name: 'Haircut',   count: 48, revenue: 2880000 },
  { rank: 2, name: 'Creambath', count: 15, revenue: 900000  },
  { rank: 3, name: 'Shaving',   count: 12, revenue: 720000  },
  { rank: 4, name: 'Hair Spa',  count: 8,  revenue: 480000  },
  { rank: 5, name: 'Coloring',  count: 5,  revenue: 750000  },
];

// ─── Top Products ────────────────────────────────────────────────────────────

export const TOP_PRODUCTS: TopItem[] = [
  { rank: 1, name: 'Pomade Water Based',    count: 23, revenue: 920000 },
  { rank: 2, name: 'Hair Tonic 100ml',      count: 18, revenue: 720000 },
  { rank: 3, name: 'Clay Matte',            count: 15, revenue: 600000 },
  { rank: 4, name: 'Shampoo Anti Dandruff', count: 12, revenue: 480000 },
  { rank: 5, name: 'Hair Vitamin',          count: 10, revenue: 360000 },
];

// ─── KPI helper ─────────────────────────────────────────────────────────────

export const KPI_DATA = {
  omzet:         { value: 6750000, change: 18.2 },
  totalTrx:      { value: 68,      change: 12.5 },
  dariLayanan:   { value: 4350000, change: 16.7 },
  dariProduk:    { value: 2400000, change: 21.3 },
  pelanggan:     { value: 64,      change: 11.1 },
};
