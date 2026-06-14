export type TransactionStatus = 'Paid' | 'Open' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'QRIS' | 'Debit/Credit' | 'Transfer';
export type TransactionType = 'Layanan' | 'Produk' | 'Layanan + Produk';

export interface TransactionRow {
  id: string;
  date: string;
  time: string;
  customer: string;
  item: string;
  payment: PaymentMethod;
  total: number;
  status: TransactionStatus;
  type: TransactionType;
  cashier: string;
}

export const TRANSACTIONS: TransactionRow[] = [
  { id: 'TRX-140625-0068', date: '14 Jun 2025', time: '14:42', customer: 'Rizky A.', item: 'Haircut + Creambath + Hair Tonic', payment: 'Cash', total: 120000, status: 'Paid', type: 'Layanan + Produk', cashier: 'Nadia' },
  { id: 'TRX-140625-0067', date: '14 Jun 2025', time: '14:18', customer: 'Dimas P.', item: 'Executive Haircut + Pomade Water Based', payment: 'QRIS', total: 185000, status: 'Paid', type: 'Layanan + Produk', cashier: 'Nadia' },
  { id: 'TRX-140625-0066', date: '14 Jun 2025', time: '13:55', customer: 'Andra W.', item: 'Haircut', payment: 'Debit/Credit', total: 65000, status: 'Open', type: 'Layanan', cashier: 'Raka' },
  { id: 'TRX-140625-0065', date: '14 Jun 2025', time: '13:32', customer: 'Bayu S.', item: 'Kids Haircut + Shampoo', payment: 'Cash', total: 85000, status: 'Paid', type: 'Layanan', cashier: 'Raka' },
  { id: 'TRX-140625-0064', date: '14 Jun 2025', time: '13:04', customer: 'Fajar N.', item: 'Beard Trim + Beard Oil Premium', payment: 'Transfer', total: 150000, status: 'Paid', type: 'Layanan + Produk', cashier: 'Sinta' },
  { id: 'TRX-140625-0063', date: '14 Jun 2025', time: '12:48', customer: 'Ari K.', item: 'Haircut + Hair Wash', payment: 'QRIS', total: 95000, status: 'Cancelled', type: 'Layanan', cashier: 'Sinta' },
  { id: 'TRX-140625-0062', date: '14 Jun 2025', time: '12:17', customer: 'Yoga M.', item: 'Pomade Oil Based + Sisir Barber Carbon', payment: 'Transfer', total: 145000, status: 'Paid', type: 'Produk', cashier: 'Nadia' },
  { id: 'TRX-140625-0061', date: '14 Jun 2025', time: '11:54', customer: 'Bima R.', item: 'Premium Haircut + Hair Tonic 100ml', payment: 'Debit/Credit', total: 160000, status: 'Paid', type: 'Layanan + Produk', cashier: 'Raka' },
  { id: 'TRX-140625-0060', date: '14 Jun 2025', time: '11:22', customer: 'Hendra L.', item: 'Classic Haircut', payment: 'Cash', total: 55000, status: 'Paid', type: 'Layanan', cashier: 'Sinta' },
  { id: 'TRX-140625-0059', date: '14 Jun 2025', time: '10:58', customer: 'Taufik H.', item: 'Shaving Cream + Beard Trim', payment: 'QRIS', total: 110000, status: 'Open', type: 'Layanan + Produk', cashier: 'Nadia' },
];
