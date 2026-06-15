// ─── POS Service Layer (Dummy Implementation) ───────────────────────────────

import { 
  PosCatalogItem, 
  PosCustomer, 
  PosOpenTransaction, 
  CatalogResult, 
  CustomerResult, 
  OpenTransactionResult,
  PosCategory 
} from '../types/posTypes';

// ─── Dummy Data ──────────────────────────────────────────────────────────────

const DUMMY_CUSTOMERS: PosCustomer[] = [
  { id: 'c-001', name: 'Pelanggan Umum' },
  { id: 'c-002', name: 'Budi Santoso', phone: '081234567890' },
  { id: 'c-003', name: 'Andi Pratama', phone: '081987654321' },
  { id: 'c-004', name: 'Siti Aminah', phone: '081345678901' },
  { id: 'c-005', name: 'Eko Wijoyo', phone: '081567890123' },
];

const DUMMY_OPEN_TRANSACTIONS: PosOpenTransaction[] = [
  { id: 'TRX-140625-0068', time: '13:52', customerName: 'Pelanggan Umum', items: 'Haircut, Hair Tonic 100ml', total: 150000, status: 'Open' },
  { id: 'TRX-140625-0067', time: '12:41', customerName: 'Budi Santoso', items: 'Hair Spa', total: 95000, status: 'Open' },
  { id: 'TRX-140625-0066', time: '11:17', customerName: 'Pelanggan Umum', items: 'Creambath, Pomade Water Based', total: 205000, status: 'Open' },
  { id: 'TRX-140625-0065', time: '10:05', customerName: 'Andi Pratama', items: 'Haircut + Shaving', total: 100000, status: 'Open' },
];

const DUMMY_CATALOG: PosCatalogItem[] = [
  { id: 'svc-haircut', name: 'Haircut', kind: 'Layanan', group: 'Haircut', price: 70000, icon: '✂️' },
  { id: 'svc-creambath', name: 'Creambath', kind: 'Layanan', group: 'Treatment', price: 85000, icon: '💧' },
  { id: 'svc-shaving', name: 'Shaving', kind: 'Layanan', group: 'Shaving', price: 40000, icon: '✨' },
  { id: 'svc-hairspa', name: 'Hair Spa', kind: 'Layanan', group: 'Treatment', price: 95000, icon: '✨' },
  { id: 'svc-coloring', name: 'Coloring', kind: 'Layanan', group: 'Coloring', price: 150000, icon: '🎨' },
  { id: 'pkg-haircut-shaving', name: 'Haircut + Shaving', kind: 'Layanan', group: 'Haircut', price: 100000, icon: '✂️' },
  { id: 'prd-pomade', name: 'Pomade Water Based', kind: 'Produk', group: 'Retail', price: 120000, icon: '👜' },
  { id: 'prd-tonic', name: 'Hair Tonic 100ml', kind: 'Produk', group: 'Retail', price: 80000, icon: '📦' },
  { id: 'prd-clay', name: 'Clay Matte', kind: 'Produk', group: 'Retail', price: 90000, icon: '📦' },
  { id: 'prd-shampoo', name: 'Shampoo Anti Dandruff', kind: 'Produk', group: 'Retail', price: 60000, icon: '📦' },
];

// ─── Service Methods ────────────────────────────────────────────────────────

/**
 * Get catalog items filtered by category
 */
export async function getCatalogItems(kind: PosCategory): Promise<CatalogResult> {
  // Simulate async network delay
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  const items = DUMMY_CATALOG.filter((item) => item.kind === kind);
  const categories = Array.from(new Set(items.map((item) => item.group)));
  
  return { items, categories };
}

/**
 * Get all customers (for search suggestions)
 */
export async function getCustomers(query: string = ''): Promise<CustomerResult> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  const filtered = query
    ? DUMMY_CUSTOMERS.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : DUMMY_CUSTOMERS;
  
  return { customers: filtered };
}

/**
 * Get open transactions
 */
export async function getOpenTransactions(): Promise<OpenTransactionResult> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  return { transactions: DUMMY_OPEN_TRANSACTIONS };
}

/**
 * Create a new customer
 */
export async function createCustomer(name: string, phone?: string, email?: string): Promise<PosCustomer> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  const newCustomer: PosCustomer = {
    id: `c-${Date.now()}`,
    name,
    phone,
    email,
  };
  
  DUMMY_CUSTOMERS.push(newCustomer);
  return newCustomer;
}

/**
 * Save transaction as open (for later completion)
 */
export async function saveOpenTransaction(
  customerId: string | null,
  cartItems: any[],
  note: string,
  paymentMethod: string,
  paymentDetails?: any
): Promise<PosOpenTransaction> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  
  const newItem: PosOpenTransaction = {
    id: `TRX-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    customerName: DUMMY_CUSTOMERS.find((c) => c.id === customerId)?.name || 'Pelanggan Umum',
    items: cartItems.map((item) => item.name).join(', '),
    total,
    status: 'Open',
  };
  
  DUMMY_OPEN_TRANSACTIONS.unshift(newItem);
  return newItem;
}

/**
 * Complete a transaction
 */
export async function completeTransaction(
  customerId: string | null,
  cartItems: any[],
  subtotal: number,
  discount: number,
  total: number,
  paymentMethod: string,
  paymentDetails?: any,
  cashReceived?: number
): Promise<{ success: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Simulate validation
  if (paymentMethod === 'Cash' && cashReceived !== undefined && cashReceived < total) {
    return { success: false, message: 'Uang diterima kurang' };
  }
  
  // If we reached here, transaction succeeded
  return { success: true };
}

/**
 * Get a single customer by ID
 */
export async function getCustomerById(id: string): Promise<PosCustomer | null> {
  await new Promise((resolve) => setTimeout(resolve, 30));
  
  const customer = DUMMY_CUSTOMERS.find((c) => c.id === id);
  return customer || null;
}

/**
 * Search customers by name
 */
export async function searchCustomers(query: string): Promise<PosCustomer[]> {
  const result = await getCustomers(query);
  return result.customers;
}
