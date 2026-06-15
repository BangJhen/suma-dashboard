// ─── POS Store Hook ─────────────────────────────────────────────────────────

import { useState, useCallback, useMemo } from 'react';
import {
  PosCategory,
  PosCustomer,
  PosCatalogItem,
  PosCartItem,
  PosOpenTransaction,
  PaymentMethod,
  PosPaymentDetails,
  CompletedTransaction,
  CatalogResult,
  CustomerResult,
  OpenTransactionResult,
} from '../types/posTypes';
import {
  getCatalogItems,
  getCustomers,
  getOpenTransactions,
  createCustomer,
  saveOpenTransaction,
  completeTransaction,
  getCustomerById,
} from '../services/posService';
import { formatRupiah } from '../../../utils/format';

// ─── Store State Interface ───────────────────────────────────────────────────

interface PosState {
  // Catalog state
  tab: PosCategory;
  filter: string;
  query: string;
  viewMode: 'grid' | 'list';
  
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
  paymentDetails: any;
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

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState: PosState = {
  tab: 'Layanan',
  filter: 'Semua',
  query: '',
  viewMode: 'grid',
  customers: [],
  selectedCustomerId: null,
  customerSearchQuery: '',
  isCustomerModalOpen: false,
  cart: [],
  note: '',
  discount: 0,
  paymentMethod: 'QRIS',
  paymentDetails: undefined,
  cashReceived: 0,
  isManualItemModalOpen: false,
  isQrModalOpen: false,
  isPaymentModalOpen: false,
  completedTransaction: null,
  validationMessage: null,
};

// ─── POS Store Hook ──────────────────────────────────────────────────────────

export function usePosStore() {
  // ─── State ───────────────────────────────────────────────────────────────
  
  const [state, setState] = useState<PosState>(initialState);
  
  // ─── Catalog Data ────────────────────────────────────────────────────────
  
  const [catalogItems, setCatalogItems] = useState<PosCatalogItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  
  // ─── Load Catalog ────────────────────────────────────────────────────────
  
  const loadCatalog = useCallback(async (kind: PosCategory) => {
    setIsCatalogLoading(true);
    try {
      const result: CatalogResult = await getCatalogItems(kind);
      setCatalogItems(result.items);
      setCategories(result.categories);
    } finally {
      setIsCatalogLoading(false);
    }
  }, []);
  
  // Load initial catalog for 'Layanan'
  useState(() => {
    loadCatalog('Layanan');
    return undefined;
  });
  
  // ─── Load Customers ──────────────────────────────────────────────────────
  
  const loadCustomers = useCallback(async (query: string = '') => {
    try {
      const result: CustomerResult = await getCustomers(query);
      setState((prev) => ({ ...prev, customers: result.customers }));
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  }, []);
  
  // ─── Load Open Transactions ──────────────────────────────────────────────
  
  const [openTransactions, setOpenTransactions] = useState<PosOpenTransaction[]>([]);
  const [isOpenTransactionsLoading, setIsOpenTransactionsLoading] = useState(false);
  
  const loadOpenTransactions = useCallback(async () => {
    setIsOpenTransactionsLoading(true);
    try {
      const result: OpenTransactionResult = await getOpenTransactions();
      setOpenTransactions(result.transactions);
    } catch (error) {
      console.error('Failed to load open transactions:', error);
    } finally {
      setIsOpenTransactionsLoading(false);
    }
  }, []);
  
  // Load open transactions on mount
  useState(() => {
    loadOpenTransactions();
    return undefined;
  });
  
  // ─── Derived Values ──────────────────────────────────────────────────────
  
  const selectedCustomer = useMemo(() => {
    if (!state.selectedCustomerId) return null;
    return state.customers.find((c) => c.id === state.selectedCustomerId) || null;
  }, [state.selectedCustomerId, state.customers]);
  
  const visibleCatalogItems = useMemo(() => {
    let items = catalogItems;
    
    // Filter by category
    if (state.filter !== 'Semua') {
      items = items.filter((item) => item.group === state.filter);
    }
    
    // Filter by search query
    const query = state.query.trim().toLowerCase();
    if (query) {
      items = items.filter((item) => item.name.toLowerCase().includes(query));
    }
    
    return items;
  }, [catalogItems, state.filter, state.query]);
  
  const subtotal = useMemo(() => {
    return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [state.cart]);
  
  const safeDiscount = useMemo(() => {
    return Math.min(state.discount, subtotal);
  }, [state.discount, subtotal]);
  
  const total = useMemo(() => {
    return Math.max(subtotal - safeDiscount, 0);
  }, [subtotal, safeDiscount]);
  
  const cashChange = useMemo(() => {
    return Math.max(state.cashReceived - total, 0);
  }, [state.cashReceived, total]);
  
  const isCartEmpty = useMemo(() => {
    return state.cart.length === 0;
  }, [state.cart]);
  
  const isPaymentValid = useMemo(() => {
    if (state.paymentMethod === 'Cash') {
      return state.cashReceived >= total;
    }
    return true;
  }, [state.paymentMethod, state.cashReceived, total]);
  
  // ─── Catalog Actions ─────────────────────────────────────────────────────
  
  const setTab = useCallback((tab: PosCategory) => {
    setState((prev) => ({ ...prev, tab }));
    loadCatalog(tab);
  }, [loadCatalog]);
  
  const setFilter = useCallback((filter: string) => {
    setState((prev) => ({ ...prev, filter }));
  }, []);
  
  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);
  
  const setViewMode = useCallback((viewMode: 'grid' | 'list') => {
    setState((prev) => ({ ...prev, viewMode }));
  }, []);
  
  // ─── Customer Actions ────────────────────────────────────────────────────
  
  const setSelectedCustomerId = useCallback((customerId: string | null) => {
    setState((prev) => ({ ...prev, selectedCustomerId: customerId }));
  }, []);
  
  const setCustomerSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, customerSearchQuery: query }));
    loadCustomers(query);
  }, [loadCustomers]);
  
  const openCustomerModal = useCallback(() => {
    setState((prev) => ({ ...prev, isCustomerModalOpen: true }));
  }, []);
  
  const closeCustomerModal = useCallback(() => {
    setState((prev) => ({ ...prev, isCustomerModalOpen: false }));
  }, []);
  
  const handleCreateCustomer = useCallback(async (name: string, phone?: string, email?: string) => {
    try {
      const newCustomer = await createCustomer(name, phone, email);
      setState((prev) => ({
        ...prev,
        customers: [...prev.customers, newCustomer],
        selectedCustomerId: newCustomer.id,
        isCustomerModalOpen: false,
      }));
      return { success: true, customer: newCustomer };
    } catch (error) {
      return { success: false, error };
    }
  }, []);
  
  // ─── Cart Actions ────────────────────────────────────────────────────────
  
  const addToCart = useCallback((item: PosCatalogItem) => {
    setState((prev) => {
      const existing = prev.cart.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
          ),
        };
      }
      return {
        ...prev,
        cart: [...prev.cart, { ...item, qty: 1 }],
      };
    });
  }, []);
  
  const updateQty = useCallback((id: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart
        .map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter((item) => item.qty > 0),
    }));
  }, []);
  
  const removeFromCart = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.id !== id),
    }));
  }, []);
  
  const clearCart = useCallback(() => {
    setState((prev) => ({ ...prev, cart: [] }));
  }, []);
  
  const setNote = useCallback((note: string) => {
    setState((prev) => ({ ...prev, note }));
  }, []);
  
  const setDiscount = useCallback((discount: number) => {
    setState((prev) => ({ ...prev, discount }));
  }, []);
  
  // ─── Payment Actions ─────────────────────────────────────────────────────
  
  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setState((prev) => ({ ...prev, paymentMethod: method }));
  }, []);
  
  const setPaymentDetails = useCallback((details: any) => {
    setState((prev) => ({ ...prev, paymentDetails: details }));
  }, []);
  
  const setCashReceived = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, cashReceived: amount }));
  }, []);
  
  const openPaymentModal = useCallback(() => {
    setState((prev) => ({ ...prev, isPaymentModalOpen: true }));
  }, []);
  
  const closePaymentModal = useCallback(() => {
    setState((prev) => ({ ...prev, isPaymentModalOpen: false }));
  }, []);
  
  // ─── Manual Item Actions ─────────────────────────────────────────────────
  
  const openManualItemModal = useCallback(() => {
    setState((prev) => ({ ...prev, isManualItemModalOpen: true }));
  }, []);
  
  const closeManualItemModal = useCallback(() => {
    setState((prev) => ({ ...prev, isManualItemModalOpen: false }));
  }, []);
  
  const addManualItem = useCallback((name: string, price: number) => {
    const manualItem: PosCatalogItem = {
      id: `manual-${Date.now()}`,
      name,
      kind: 'Produk',
      group: 'Manual',
      price,
      icon: '➕',
    };
    
    setState((prev) => ({
      ...prev,
      cart: [...prev.cart, { ...manualItem, qty: 1 }],
      isManualItemModalOpen: false,
    }));
  }, []);
  
  // ─── QR Actions ──────────────────────────────────────────────────────────
  
  const openQrModal = useCallback(() => {
    setState((prev) => ({ ...prev, isQrModalOpen: true }));
  }, []);
  
  const closeQrModal = useCallback(() => {
    setState((prev) => ({ ...prev, isQrModalOpen: false }));
  }, []);
  
  // ─── Transaction Actions ─────────────────────────────────────────────────
  
  const saveAsOpen = useCallback(async () => {
    if (state.cart.length === 0) {
      setState((prev) => ({ ...prev, validationMessage: 'Cart is empty' }));
      return { success: false };
    }
    
    try {
      const transaction = await saveOpenTransaction(
        state.selectedCustomerId,
        state.cart,
        state.note,
        state.paymentMethod,
        state.paymentDetails
      );
      
      loadOpenTransactions();
      clearCart();
      setDiscount(0);
      
      return { success: true, transaction };
    } catch (error) {
      return { success: false, error };
    }
  }, [state.cart, state.selectedCustomerId, state.note, state.paymentMethod, state.paymentDetails, loadOpenTransactions, clearCart, setDiscount]);
  
  const resumeOpenTransaction = useCallback(async (transactionId: string) => {
    try {
      // For now, we'll just simulate loading a transaction
      // In a real implementation, this would fetch the transaction details
      const transaction = openTransactions.find((t) => t.id === transactionId);
      if (!transaction) return { success: false, error: 'Transaction not found' };
      
      // Clear current state and load transaction data
      clearCart();
      setDiscount(0);
      
      // Simulate loading customer
      if (transaction.customerName !== 'Pelanggan Umum') {
        const customer = state.customers.find((c) => c.name === transaction.customerName);
        if (customer) {
          setState((prev) => ({ ...prev, selectedCustomerId: customer.id }));
        }
      }
      
      // Parse items and add to cart (simplified)
      const itemNames = transaction.items.split(', ');
      const loadedItems: any[] = [];
      
      for (const itemName of itemNames) {
        const item = catalogItems.find((i) => i.name === itemName);
        if (item) {
          loadedItems.push({ ...item, qty: 1 });
        }
      }
      
      setState((prev) => ({ ...prev, cart: loadedItems }));
      
      return { success: true, transaction };
    } catch (error) {
      return { success: false, error };
    }
  }, [openTransactions, state.customers, catalogItems, clearCart, setDiscount]);
  
  const completePayment = useCallback(async () => {
    if (state.cart.length === 0) {
      setState((prev) => ({ ...prev, validationMessage: 'Cart is empty' }));
      return { success: false, message: 'Cart is empty' };
    }
    
    if (state.paymentMethod === 'Cash' && state.cashReceived < total) {
      setState((prev) => ({ ...prev, validationMessage: 'Uang diterima kurang' }));
      return { success: false, message: 'Uang diterima kurang' };
    }
    
    try {
      const result = await completeTransaction(
        state.selectedCustomerId,
        state.cart,
        subtotal,
        safeDiscount,
        total,
        state.paymentMethod,
        state.paymentDetails,
        state.cashReceived
      );
      
      if (!result.success) {
        return result;
      }
      
      const completedTransaction: CompletedTransaction = {
        id: `TRX-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        customer: selectedCustomer,
        items: state.cart,
        subtotal,
        discount: safeDiscount,
        total,
        paymentMethod: state.paymentMethod,
        paymentDetails: state.paymentDetails,
        cashReceived: state.paymentMethod === 'Cash' ? state.cashReceived : undefined,
        change: state.paymentMethod === 'Cash' ? cashChange : undefined,
      };
      
      clearCart();
      setDiscount(0);
      setCashReceived(0);
      setState((prev) => ({ ...prev, completedTransaction }));
      
      return { success: true, transaction: completedTransaction };
    } catch (error) {
      return { success: false, error };
    }
  }, [
    state.cart,
    state.paymentMethod,
    state.cashReceived,
    total,
    state.selectedCustomerId,
    selectedCustomer,
    subtotal,
    safeDiscount,
    state.paymentDetails,
    cashChange,
    clearCart,
    setDiscount,
    setCashReceived,
  ]);
  
  const resetTransaction = useCallback(() => {
    setState((prev) => ({
      ...prev,
      discount: 0,
      note: '',
      paymentMethod: 'QRIS',
      paymentDetails: undefined,
      cashReceived: 0,
      isQrModalOpen: false,
      isPaymentModalOpen: false,
      completedTransaction: null,
    }));
  }, []);
  
  // ─── Expose State and Actions ────────────────────────────────────────────
  
  return {
    // State
    state,
    catalogItems,
    categories,
    isCatalogLoading,
    openTransactions,
    isOpenTransactionsLoading,
    selectedCustomer,
    visibleCatalogItems,
    subtotal,
    safeDiscount,
    total,
    cashChange,
    isCartEmpty,
    isPaymentValid,
    
    // Actions - Catalog
    setTab,
    setFilter,
    setQuery,
    setViewMode,
    
    // Actions - Customer
    setSelectedCustomerId,
    setCustomerSearchQuery,
    openCustomerModal,
    closeCustomerModal,
    handleCreateCustomer,
    
    // Actions - Cart
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    setNote,
    setDiscount,
    
    // Actions - Payment
    setPaymentMethod,
    setPaymentDetails,
    setCashReceived,
    openPaymentModal,
    closePaymentModal,
    
    // Actions - Manual Item
    openManualItemModal,
    closeManualItemModal,
    addManualItem,
    
    // Actions - QR
    openQrModal,
    closeQrModal,
    
    // Actions - Transactions
    saveAsOpen,
    resumeOpenTransaction,
    completePayment,
    resetTransaction,
  };
}
