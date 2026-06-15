// ─── POS Domain Types ───────────────────────────────────────────────────────

export type PosCategory = 'Layanan' | 'Produk';
export type CatalogViewMode = 'grid' | 'list';

export interface PosCustomer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface PosCatalogItem {
  id: string;
  name: string;
  kind: PosCategory;
  group: string;
  price: number;
  icon: React.ReactNode;
}

export interface PosCartItem extends PosCatalogItem {
  qty: number;
}

export interface PosOpenTransaction {
  id: string;
  time: string;
  customerName: string;
  items: string;
  total: number;
  status: 'Open';
}

export type PaymentMethod = 'Cash' | 'QRIS' | 'Debit/Credit' | 'Transfer';

export interface PosPaymentDetails {
  method: PaymentMethod;
  details?: {
    cardType?: 'Debit' | 'Credit';
    bank?: string;
    approvalCode?: string;
    accountNumber?: string;
    accountName?: string;
    referenceNumber?: string;
    note?: string;
  };
}

export interface CompletedTransaction {
  id: string;
  time: string;
  customer: PosCustomer | null;
  items: PosCartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentDetails?: PosPaymentDetails['details'];
  cashReceived?: number;
  change?: number;
}

// ─── Service Layer Interfaces ────────────────────────────────────────────────

export interface CatalogResult {
  items: PosCatalogItem[];
  categories: string[];
}

export interface CustomerResult {
  customers: PosCustomer[];
}

export interface OpenTransactionResult {
  transactions: PosOpenTransaction[];
}

// ─── Store State Types ──────────────────────────────────────────────────────

export interface PosState {
  // Catalog state
  tab: PosCategory;
  filter: string;
  query: string;
  viewMode: CatalogViewMode;
  
  // Customer state
  customers: PosCustomer[];
  selectedCustomerId: string | null;
  customerSearchQuery: string;
  isCustomerModalOpen: boolean;
  
  // Cart state
  cart: PosCartItem[];
  note: string;
  discount: number;
  
  // Payment state
  paymentMethod: PaymentMethod;
  paymentDetails: PosPaymentDetails['details'];
  cashReceived: number;
  
  // Modal state
  isManualItemModalOpen: boolean;
  isQrModalOpen: boolean;
  isPaymentModalOpen: boolean;
  
  // Success state
  completedTransaction: CompletedTransaction | null;
  
  // Validation
  validationMessage: string | null;
}
