import React, { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  User,
  Clock,
  FileText,
  Circle,
  Grid3X3,
  List,
  X,
  Minus,
  Wallet,
  QrCode,
  CreditCard,
  Landmark,
  Save,
  Play,
  Scissors,
  ShoppingBag,
} from 'lucide-react';
import { formatRupiah } from '../../../utils/format';
import type { PaymentMethod } from '../../../data/types';

type PosCategory = 'Layanan' | 'Produk';

interface PosItem {
  id: string;
  name: string;
  kind: PosCategory;
  group: string;
  price: number;
  icon: string;
}

interface CartItem extends PosItem {
  qty: number;
}

const POS_ITEMS: PosItem[] = [
  { id: 'svc-haircut', name: 'Haircut', kind: 'Layanan', group: 'Haircut', price: 70000, icon: '✂️' },
  { id: 'svc-creambath', name: 'Creambath', kind: 'Layanan', group: 'Treatment', price: 85000, icon: '🧴' },
  { id: 'svc-shaving', name: 'Shaving', kind: 'Layanan', group: 'Shaving', price: 40000, icon: '🪒' },
  { id: 'svc-hairspa', name: 'Hair Spa', kind: 'Layanan', group: 'Treatment', price: 95000, icon: '♨️' },
  { id: 'svc-coloring', name: 'Coloring', kind: 'Layanan', group: 'Coloring', price: 150000, icon: '💈' },
  { id: 'pkg-haircut-shaving', name: 'Haircut + Shaving', kind: 'Layanan', group: 'Haircut', price: 100000, icon: '✂️🪒' },
  { id: 'prd-pomade', name: 'Pomade Water Based', kind: 'Produk', group: 'Retail', price: 120000, icon: '🧴' },
  { id: 'prd-tonic', name: 'Hair Tonic 100ml', kind: 'Produk', group: 'Retail', price: 80000, icon: '🧴' },
  { id: 'prd-clay', name: 'Clay Matte', kind: 'Produk', group: 'Retail', price: 90000, icon: '🧴' },
  { id: 'prd-shampoo', name: 'Shampoo Anti Dandruff', kind: 'Produk', group: 'Retail', price: 60000, icon: '🧴' },
];

const OPEN_TRANSACTIONS = [
  { id: 'TRX-140625-0068', time: '13:52', customer: 'Pelanggan Umum', item: 'Haircut, Hair Tonic 100ml', total: 150000 },
  { id: 'TRX-140625-0067', time: '12:41', customer: 'Budi Santoso', item: 'Hair Spa', total: 95000 },
  { id: 'TRX-140625-0066', time: '11:17', customer: 'Pelanggan Umum', item: 'Creambath, Pomade Water Based', total: 205000 },
  { id: 'TRX-140625-0065', time: '10:05', customer: 'Andi Pratama', item: 'Haircut + Shaving', total: 100000 },
];

const FILTERS = ['Semua', 'Haircut', 'Treatment', 'Shaving', 'Coloring', 'Retail'];
const PAYMENT_METHODS: { key: PaymentMethod; icon: React.ReactNode }[] = [
  { key: 'Cash', icon: <Wallet size={14} /> },
  { key: 'QRIS', icon: <QrCode size={14} /> },
  { key: 'Debit/Credit', icon: <CreditCard size={14} /> },
  { key: 'Transfer', icon: <Landmark size={14} /> },
];

type PaymentModal = 'Debit/Credit' | 'Transfer' | null;

interface CardPaymentDetails {
  cardType: 'Debit' | 'Credit';
  bank: string;
  approvalCode: string;
  note: string;
}

interface TransferPaymentDetails {
  bank: string;
  accountNumber: string;
  accountName: string;
  referenceNumber: string;
  note: string;
}

export default function PosPage() {
  const [tab, setTab] = useState<PosCategory>('Layanan');
  const [filter, setFilter] = useState('Semua');
  const [query, setQuery] = useState('');
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod>('QRIS');
  const [paymentModal, setPaymentModal] = useState<PaymentModal>(null);
  const [cashReceived, setCashReceived] = useState(250000);
  const [cardDetails, setCardDetails] = useState<CardPaymentDetails>({
    cardType: 'Debit',
    bank: 'BCA',
    approvalCode: '',
    note: '',
  });
  const [transferDetails, setTransferDetails] = useState<TransferPaymentDetails>({
    bank: 'Mandiri',
    accountNumber: '1234567890',
    accountName: 'Suma Barbershop',
    referenceNumber: '',
    note: '',
  });
  const [cart, setCart] = useState<CartItem[]>([
    { ...POS_ITEMS[0], qty: 1 },
    { ...POS_ITEMS[6], qty: 1 },
    { ...POS_ITEMS[2], qty: 1 },
  ]);

  const visibleItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    return POS_ITEMS.filter((item) => item.kind === tab)
      .filter((item) => filter === 'Semua' || item.group === filter)
      .filter((item) => !search || item.name.toLowerCase().includes(search));
  }, [tab, filter, query]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const safeDiscount = Math.min(discount || 0, subtotal);
  const total = Math.max(subtotal - safeDiscount, 0);

  const addToCart = (item: PosItem) => {
    setCart((items) => {
      const existing = items.find((cartItem) => cartItem.id === item.id);
      if (existing) return items.map((cartItem) => cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem);
      return [...items, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((items) => items
      .map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item)
      .filter((item) => item.qty > 0));
  };

  const removeItem = (id: string) => setCart((items) => items.filter((item) => item.id !== id));

  const handleSelectPayment = (method: PaymentMethod) => {
    setPayment(method);
    if (method === 'Debit/Credit' || method === 'Transfer') setPaymentModal(method);
  };

  const cardSummary = `${cardDetails.cardType} ${cardDetails.bank}${cardDetails.approvalCode ? ` • Ref: ${cardDetails.approvalCode}` : ''}`;
  const transferSummary = `${transferDetails.bank} • ${transferDetails.accountName}${transferDetails.referenceNumber ? ` • Ref: ${transferDetails.referenceNumber}` : ''}`;

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Kasir / POS Transaksi</h1>
          <p style={styles.subtitle}>Input transaksi layanan dan produk untuk cabang aktif secara cepat dan rapi.</p>
        </div>
        <div style={styles.customerActions}>
          <div style={styles.searchCustomer}>
            <Search size={15} color="#777" />
            <input style={styles.searchInput} placeholder="Cari pelanggan (Ctrl+K)" />
          </div>
          <button style={styles.outlineButton}><Plus size={15} /> Pelanggan Baru</button>
        </div>
      </div>

      <div style={styles.metaGrid}>
        <MetaCard icon={<FileText size={20} />} label="No. Transaksi" value="TRX-140625-0069" />
        <MetaCard icon={<Circle size={18} fill="#C9A84C" color="#C9A84C" />} label="Status" value="Open" valueColor="#2E7D32" />
        <MetaCard icon={<User size={20} />} label="Kasir/Owner" value="Owner" />
        <MetaCard icon={<Clock size={20} />} label="Waktu" value="14:35" />
        <div style={styles.customerBox}>
          <User size={20} color="#1A3325" />
          <div style={{ flex: 1 }}>
            <div style={styles.metaLabel}>Pelanggan</div>
            <select style={styles.customerSelect}>
              <option>Pelanggan Umum</option>
              <option>Budi Santoso</option>
              <option>Andi Pratama</option>
            </select>
          </div>
        </div>
      </div>

      <div style={styles.contentGrid}>
        <section style={styles.leftColumn}>
          <div style={styles.catalogCard}>
            <div style={styles.tabsRow}>
              <div>
                <button onClick={() => setTab('Layanan')} style={{ ...styles.tabButton, ...(tab === 'Layanan' ? styles.tabActive : {}) }}>Layanan</button>
                <button onClick={() => setTab('Produk')} style={{ ...styles.tabButton, ...(tab === 'Produk' ? styles.tabActive : {}) }}>Produk</button>
              </div>
              <div style={styles.viewButtons}>
                <button style={styles.iconBtn}><Grid3X3 size={15} /></button>
                <button style={styles.iconBtnMuted}><List size={15} /></button>
              </div>
            </div>

            <div style={styles.catalogSearch}>
              <Search size={16} color="#777" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} style={styles.catalogSearchInput} placeholder="Cari layanan atau produk" />
            </div>

            <div style={styles.filterRow}>
              {FILTERS.map((item) => (
                <button key={item} onClick={() => setFilter(item)} style={{ ...styles.filterBtn, ...(filter === item ? styles.filterActive : {}) }}>{item}</button>
              ))}
            </div>

            <div style={styles.itemGrid}>
              {visibleItems.map((item) => {
                const selected = cart.some((cartItem) => cartItem.id === item.id);
                return (
                  <button key={item.id} onClick={() => addToCart(item)} style={{ ...styles.itemCard, ...(selected ? styles.itemSelected : {}) }}>
                    {selected && <span style={styles.checkMark}>✓</span>}
                    <span style={styles.itemIcon}>{item.icon}</span>
                    <span style={styles.itemInfo}>
                      <strong style={styles.itemName}>{item.name}</strong>
                      <span style={styles.itemKind}>{item.group}</span>
                      <b style={styles.itemPrice}>{formatRupiah(item.price)}</b>
                    </span>
                  </button>
                );
              })}
              <button style={styles.manualCard}><Plus size={20} color="#888" />Tambah Produk Manual</button>
            </div>
          </div>

          <div style={styles.openCard}>
            <h2 style={styles.sectionTitle}>Transaksi Open Hari Ini</h2>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>{['No. Transaksi', 'Waktu', 'Pelanggan', 'Item', 'Total', 'Status', 'Aksi'].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {OPEN_TRANSACTIONS.map((tx) => (
                    <tr key={tx.id}>
                      <td style={styles.td}>{tx.id}</td>
                      <td style={styles.td}>{tx.time}</td>
                      <td style={styles.td}>{tx.customer}</td>
                      <td style={styles.td}>{tx.item}</td>
                      <td style={styles.td}>{formatRupiah(tx.total)}</td>
                      <td style={styles.td}><span style={styles.statusBadge}>Open</span></td>
                      <td style={styles.td}><button style={styles.continueBtn}>Lanjutkan <Play size={10} fill="#C75B3A" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside style={styles.summaryCard}>
          <h2 style={styles.sectionTitle}>Ringkasan Transaksi</h2>
          <div style={styles.cartList}>
            {cart.map((item) => (
              <div key={item.id} style={styles.cartItem}>
                <span style={styles.cartIcon}>{item.kind === 'Layanan' ? <Scissors size={15} /> : <ShoppingBag size={15} />}</span>
                <div style={styles.cartName}>{item.name}</div>
                <div style={styles.qtyControl}>
                  <button onClick={() => updateQty(item.id, -1)} style={styles.qtyBtn}><Minus size={12} /></button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} style={styles.qtyBtn}><Plus size={12} /></button>
                </div>
                <strong style={styles.cartPrice}>{formatRupiah(item.price * item.qty)}</strong>
                <button onClick={() => removeItem(item.id)} style={styles.removeBtn}><X size={15} /></button>
              </div>
            ))}
          </div>

          <label style={styles.noteLabel}>Catatan transaksi (opsional)</label>
          <textarea style={styles.noteArea} placeholder="Tulis catatan untuk transaksi ini..." />

          <div style={styles.discountRow}>
            <span>Diskon</span>
            <div style={styles.discountInputWrap}>
              <span>Rp</span>
              <input value={discount || ''} onChange={(e) => setDiscount(Number(e.target.value.replace(/\D/g, '')))} style={styles.discountInput} placeholder="0" />
            </div>
          </div>

          <div style={styles.totalBox}>
            <SummaryLine label="Subtotal" value={formatRupiah(subtotal)} />
            <SummaryLine label="Diskon" value={`- ${formatRupiah(safeDiscount)}`} />
            <SummaryLine label="Pajak (0%)" value="Rp 0" />
            <div style={styles.grandTotal}><span>Total</span><strong>{formatRupiah(total)}</strong></div>
          </div>

          <h3 style={styles.paymentTitle}>Metode Pembayaran</h3>
          <div style={styles.paymentGrid}>
            {PAYMENT_METHODS.map((method) => (
              <button key={method.key} onClick={() => handleSelectPayment(method.key)} style={{ ...styles.paymentBtn, ...(payment === method.key ? styles.paymentActive : {}) }}>{method.icon}{method.key}</button>
            ))}
          </div>

          {payment === 'Cash' && (
            <div style={styles.cashBox}>
              <div>
                <strong>Cash</strong>
                <p>Input uang diterima untuk menghitung kembalian pelanggan.</p>
              </div>
              <div style={styles.cashInputWrap}>
                <span>Rp</span>
                <input value={cashReceived || ''} onChange={(e) => setCashReceived(Number(e.target.value.replace(/\D/g, '')))} style={styles.cashInput} placeholder="0" />
              </div>
              <div style={styles.changeRow}><span>Kembalian</span><strong>{formatRupiah(Math.max(cashReceived - total, 0))}</strong></div>
            </div>
          )}

          {payment === 'QRIS' && (
            <div style={styles.qrisBox}>
              <QrCode size={38} color="#1A3325" />
              <div style={{ flex: 1 }}>
                <strong>QRIS</strong>
                <p>Tunjukkan kode QR ke pelanggan atau minta scan dari aplikasi e-wallet.</p>
              </div>
              <button style={styles.qrButton}>Tampilkan QR</button>
            </div>
          )}

          {payment === 'Debit/Credit' && (
            <div style={styles.paymentSummaryBox}>
              <CreditCard size={20} color="#1A3325" />
              <div style={{ flex: 1 }}>
                <strong>Debit/Credit</strong>
                <p>{cardSummary}</p>
              </div>
              <button onClick={() => setPaymentModal('Debit/Credit')} style={styles.editPaymentBtn}>Detail</button>
            </div>
          )}

          {payment === 'Transfer' && (
            <div style={styles.paymentSummaryBox}>
              <Landmark size={20} color="#1A3325" />
              <div style={{ flex: 1 }}>
                <strong>Transfer</strong>
                <p>{transferSummary}</p>
              </div>
              <button onClick={() => setPaymentModal('Transfer')} style={styles.editPaymentBtn}>Detail</button>
            </div>
          )}

          <button style={styles.payButton}>Selesaikan Pembayaran</button>
          <button style={styles.saveButton}><Save size={15} /> Simpan sebagai Open</button>
        </aside>
      </div>

      {paymentModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>{paymentModal === 'Debit/Credit' ? 'Detail Debit/Credit' : 'Detail Transfer'}</h2>
                <p style={styles.modalSubtitle}>Lengkapi informasi pembayaran sebelum transaksi diselesaikan.</p>
              </div>
              <button onClick={() => setPaymentModal(null)} style={styles.modalClose}><X size={18} /></button>
            </div>

            {paymentModal === 'Debit/Credit' ? (
              <div style={styles.modalForm}>
                <label style={styles.modalLabel}>Tipe Kartu</label>
                <select value={cardDetails.cardType} onChange={(e) => setCardDetails({ ...cardDetails, cardType: e.target.value as 'Debit' | 'Credit' })} style={styles.modalInput}>
                  <option value="Debit">Debit</option>
                  <option value="Credit">Credit</option>
                </select>

                <label style={styles.modalLabel}>Bank / Issuer</label>
                <select value={cardDetails.bank} onChange={(e) => setCardDetails({ ...cardDetails, bank: e.target.value })} style={styles.modalInput}>
                  <option>BCA</option>
                  <option>Mandiri</option>
                  <option>BRI</option>
                  <option>BNI</option>
                  <option>CIMB Niaga</option>
                </select>

                <label style={styles.modalLabel}>Nomor Approval / Reference</label>
                <input value={cardDetails.approvalCode} onChange={(e) => setCardDetails({ ...cardDetails, approvalCode: e.target.value })} style={styles.modalInput} placeholder="Contoh: 829102" />

                <label style={styles.modalLabel}>Catatan Opsional</label>
                <textarea value={cardDetails.note} onChange={(e) => setCardDetails({ ...cardDetails, note: e.target.value })} style={styles.modalTextarea} placeholder="Contoh: kartu customer tidak perlu struk bank" />
              </div>
            ) : (
              <div style={styles.modalForm}>
                <label style={styles.modalLabel}>Bank Tujuan</label>
                <select value={transferDetails.bank} onChange={(e) => setTransferDetails({ ...transferDetails, bank: e.target.value })} style={styles.modalInput}>
                  <option>Mandiri</option>
                  <option>BCA</option>
                  <option>BRI</option>
                  <option>BNI</option>
                  <option>BSI</option>
                </select>

                <label style={styles.modalLabel}>Nomor Rekening</label>
                <input value={transferDetails.accountNumber} onChange={(e) => setTransferDetails({ ...transferDetails, accountNumber: e.target.value })} style={styles.modalInput} placeholder="Nomor rekening tujuan" />

                <label style={styles.modalLabel}>Nama Penerima</label>
                <input value={transferDetails.accountName} onChange={(e) => setTransferDetails({ ...transferDetails, accountName: e.target.value })} style={styles.modalInput} placeholder="Nama penerima" />

                <label style={styles.modalLabel}>Nomor Referensi Transfer</label>
                <input value={transferDetails.referenceNumber} onChange={(e) => setTransferDetails({ ...transferDetails, referenceNumber: e.target.value })} style={styles.modalInput} placeholder="Contoh: TRF-9821" />

                <label style={styles.modalLabel}>Catatan Opsional</label>
                <textarea value={transferDetails.note} onChange={(e) => setTransferDetails({ ...transferDetails, note: e.target.value })} style={styles.modalTextarea} placeholder="Contoh: transfer dari rekening atas nama pelanggan" />
              </div>
            )}

            <div style={styles.modalActions}>
              <button onClick={() => setPaymentModal(null)} style={styles.modalCancel}>Batal</button>
              <button onClick={() => setPaymentModal(null)} style={styles.modalSave}>Simpan Detail</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetaCard({ icon, label, value, valueColor }: { icon: React.ReactNode; label: string; value: string; valueColor?: string }) {
  return <div style={styles.metaCard}><span style={styles.metaIcon}>{icon}</span><div><div style={styles.metaLabel}>{label}</div><strong style={{ ...styles.metaValue, color: valueColor || '#1A3325' }}>{value}</strong></div></div>;
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return <div style={styles.summaryLine}><span>{label}</span><span>{value}</span></div>;
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '18px 24px 24px', background: 'transparent', minHeight: '100%', color: '#1A3325' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginBottom: 18 },
  title: { margin: 0, fontSize: 26, fontWeight: 800, color: '#123526', fontFamily: 'var(--font-heading)' },
  subtitle: { margin: '6px 0 0', fontSize: 13, color: '#6E6A64' },
  customerActions: { display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 },
  searchCustomer: { width: 290, height: 38, background: '#fff', border: '1px solid #E2D7C7', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' },
  searchInput: { border: 'none', outline: 'none', flex: 1, fontSize: 12, background: 'transparent' },
  outlineButton: { height: 38, border: '1px solid #DDBB95', background: '#fff', color: '#C75B3A', borderRadius: 8, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 7, fontWeight: 600, cursor: 'pointer' },
  metaGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr)) minmax(260px, 0.9fr)', gap: 10, marginBottom: 16 },
  metaCard: { background: '#fff', border: '1px solid #E7DCCB', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 },
  metaIcon: { width: 38, height: 38, borderRadius: '50%', background: '#F5EDD6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A3325', flexShrink: 0 },
  metaLabel: { fontSize: 11, color: '#6E6A64', marginBottom: 2 },
  metaValue: { fontSize: 14, fontWeight: 700 },
  customerBox: { background: '#fff', border: '1px solid #E7DCCB', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 },
  customerSelect: { width: '100%', border: '1px solid #E7DCCB', borderRadius: 6, padding: '7px 10px', fontSize: 13, background: '#fff', color: '#1A3325' },
  contentGrid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 390px', gap: 14, alignItems: 'start' },
  leftColumn: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
  catalogCard: { background: '#fff', border: '1px solid #E7DCCB', borderRadius: 12, padding: 14 },
  tabsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tabButton: { minWidth: 94, height: 34, border: '1px solid #E7DCCB', background: '#fff', color: '#666', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  tabActive: { background: '#0F3F31', color: '#fff', borderColor: '#0F3F31', borderRadius: 7 },
  viewButtons: { display: 'flex', gap: 0 },
  iconBtn: { width: 38, height: 34, border: '1px solid #1A3325', color: '#1A3325', background: '#fff', borderRadius: '7px 0 0 7px', cursor: 'pointer' },
  iconBtnMuted: { width: 38, height: 34, border: '1px solid #E7DCCB', color: '#444', background: '#fff', borderRadius: '0 7px 7px 0', cursor: 'pointer' },
  catalogSearch: { height: 38, border: '1px solid #E7DCCB', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', marginBottom: 12 },
  catalogSearchInput: { flex: 1, border: 'none', outline: 'none', fontSize: 13 },
  filterRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 },
  filterBtn: { height: 31, padding: '0 18px', border: '1px solid #E7DCCB', borderRadius: 6, background: '#fff', color: '#333', cursor: 'pointer', fontSize: 12 },
  filterActive: { background: '#0F3F31', color: '#fff', borderColor: '#0F3F31' },
  itemGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
  itemCard: { minHeight: 100, position: 'relative', border: '1px solid #E7DCCB', background: '#fff', borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer' },
  itemSelected: { borderColor: '#0F3F31', background: '#F7FBF7', boxShadow: '0 0 0 1px rgba(15,63,49,0.08)' },
  checkMark: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: '#0F3F31', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 },
  itemIcon: { width: 58, height: 58, borderRadius: '50%', background: '#F5EDD6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 },
  itemInfo: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 },
  itemName: { fontSize: 13, color: '#1A3325', lineHeight: 1.2 },
  itemKind: { fontSize: 11, color: '#777' },
  itemPrice: { fontSize: 13, color: '#111' },
  manualCard: { minHeight: 100, border: '1px dashed #DDBB95', background: '#FFFCF7', borderRadius: 10, color: '#777', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' },
  openCard: { background: '#fff', border: '1px solid #E7DCCB', borderRadius: 12, padding: 14 },
  sectionTitle: { margin: '0 0 12px', fontSize: 15, fontWeight: 800, color: '#1A3325' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 11 },
  th: { background: '#F8F4EE', color: '#534E48', padding: '9px 8px', textAlign: 'left', fontWeight: 700, whiteSpace: 'nowrap' },
  td: { borderBottom: '1px solid #F0E8DC', padding: '9px 8px', color: '#333', whiteSpace: 'nowrap' },
  statusBadge: { padding: '3px 10px', borderRadius: 999, background: '#E8F5E9', color: '#2E7D32', fontWeight: 700 },
  continueBtn: { border: '1px solid #EBD2BD', background: '#fff', color: '#C75B3A', borderRadius: 5, padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer' },
  summaryCard: { background: '#fff', border: '1px solid #E7DCCB', borderRadius: 12, padding: 14, minWidth: 0, position: 'sticky', top: 12 },
  cartList: { border: '1px solid #F0E4D6', borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
  cartItem: { minHeight: 52, display: 'grid', gridTemplateColumns: '34px minmax(0,1fr) 76px 92px 24px', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: '1px solid #F0E8DC' },
  cartIcon: { width: 30, height: 30, borderRadius: '50%', background: '#F5EDD6', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cartName: { fontSize: 12, fontWeight: 700, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis' },
  qtyControl: { height: 28, border: '1px solid #E7DCCB', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontSize: 12 },
  qtyBtn: { border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  cartPrice: { fontSize: 12, textAlign: 'right', color: '#111' },
  removeBtn: { border: 'none', background: 'transparent', color: '#888', cursor: 'pointer' },
  noteLabel: { fontSize: 12, fontWeight: 700, color: '#333', display: 'block', marginBottom: 6 },
  noteArea: { width: '100%', minHeight: 48, border: '1px solid #E7DCCB', borderRadius: 8, padding: 10, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 10 },
  discountRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 12, marginBottom: 10 },
  discountInputWrap: { height: 34, width: 155, border: '1px solid #E7DCCB', borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 9px', gap: 6, color: '#888' },
  discountInput: { flex: 1, minWidth: 0, border: 'none', outline: 'none', textAlign: 'right' },
  totalBox: { borderTop: '1px solid #F0E8DC', borderBottom: '1px solid #F0E8DC', padding: '10px 0', marginBottom: 12 },
  summaryLine: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#333', marginBottom: 7 },
  grandTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FBF3E8', color: '#1A3325', padding: '8px 6px', fontSize: 14, fontWeight: 800 },
  paymentTitle: { fontSize: 12, margin: '0 0 8px', color: '#333' },
  paymentGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, marginBottom: 12 },
  paymentBtn: { minHeight: 42, border: '1px solid #E7DCCB', borderRadius: 9, background: '#fff', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer', fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap', minWidth: 0 },
  paymentActive: { background: '#0F3F31', color: '#fff', borderColor: '#0F3F31' },
  cashBox: { display: 'grid', gridTemplateColumns: '1fr 150px', gap: 12, alignItems: 'center', background: '#FFF9EE', border: '1px solid #EBD9BE', borderRadius: 9, padding: 12, marginBottom: 10 },
  cashInputWrap: { height: 38, border: '1px solid #E7DCCB', borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 9px', gap: 6, color: '#888', background: '#fff' },
  cashInput: { flex: 1, minWidth: 0, border: 'none', outline: 'none', textAlign: 'right', fontWeight: 800, fontFamily: 'inherit' },
  changeRow: { gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F0E4D6', paddingTop: 8, fontSize: 12, color: '#1A3325' },
  qrisBox: { display: 'flex', alignItems: 'center', gap: 12, background: '#EFF8EF', border: '1px solid #CFE7D3', borderRadius: 9, padding: 12, marginBottom: 10 },
  qrButton: { border: '1px solid #0F3F31', color: '#0F3F31', background: '#fff', borderRadius: 7, padding: '8px 10px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  paymentSummaryBox: { display: 'flex', alignItems: 'center', gap: 12, background: '#EFF8EF', border: '1px solid #CFE7D3', borderRadius: 9, padding: 12, marginBottom: 10 },
  editPaymentBtn: { border: '1px solid #0F3F31', color: '#0F3F31', background: '#fff', borderRadius: 7, padding: '8px 12px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' },
  payButton: { width: '100%', height: 44, border: 'none', borderRadius: 8, background: '#0F3F31', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', marginBottom: 8 },
  saveButton: { width: '100%', height: 40, border: '1px solid #C75B3A', borderRadius: 8, background: '#fff', color: '#C75B3A', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(15, 31, 24, 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 },
  modalCard: { width: '100%', maxWidth: 480, background: '#fff', borderRadius: 16, border: '1px solid #E7DCCB', boxShadow: '0 24px 80px rgba(15,31,24,0.28)', padding: 22 },
  modalHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18 },
  modalTitle: { margin: 0, fontSize: 20, color: '#1A3325', fontFamily: 'var(--font-heading)' },
  modalSubtitle: { margin: '5px 0 0', fontSize: 12, color: '#777', lineHeight: 1.5 },
  modalClose: { width: 34, height: 34, borderRadius: 999, background: '#F8F4EE', color: '#1A3325', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  modalForm: { display: 'flex', flexDirection: 'column', gap: 8 },
  modalLabel: { fontSize: 12, fontWeight: 800, color: '#333', marginTop: 6 },
  modalInput: { height: 42, border: '1px solid #E7DCCB', borderRadius: 8, padding: '0 12px', fontSize: 13, outline: 'none', fontFamily: 'inherit', color: '#1A3325', background: '#fff' },
  modalTextarea: { minHeight: 76, border: '1px solid #E7DCCB', borderRadius: 8, padding: 12, fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', color: '#1A3325' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 },
  modalCancel: { height: 40, padding: '0 16px', borderRadius: 8, border: '1px solid #E7DCCB', color: '#555', background: '#fff', fontWeight: 800, cursor: 'pointer' },
  modalSave: { height: 40, padding: '0 18px', borderRadius: 8, border: 'none', color: '#fff', background: '#0F3F31', fontWeight: 800, cursor: 'pointer' },
};
