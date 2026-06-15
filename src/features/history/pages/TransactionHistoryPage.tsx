import React, { useMemo, useState, useEffect } from 'react';
import {
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  PackageCheck,
  ReceiptText,
  Scissors,
  Search,
  ShoppingBag,
  Sparkles,
  Timer,
  WalletCards,
  X,
  XCircle,
} from 'lucide-react';
import { formatRupiah } from '../../../utils/format';

import ReportPreviewModal from '../components/ReportPreviewModal';
import { TRANSACTIONS, type TransactionStatus } from '../data/transactions';

const STATUS_TABS: Array<'Semua' | TransactionStatus> = ['Semua', 'Paid', 'Open', 'Cancelled'];
const PAYMENT_FILTERS = ['Semua', 'Cash', 'QRIS', 'Debit/Credit', 'Transfer'];
const TYPE_FILTERS = ['Semua', 'Layanan', 'Produk', 'Layanan + Produk'];
const CASHIER_FILTERS = ['Semua', 'Nadia', 'Raka', 'Sinta'];
const SORT_OPTIONS = ['Terbaru', 'Terlama', 'Total Tertinggi', 'Total Terendah'];

const PAYMENT_SUMMARY = [
  { label: 'Cash', value: 8450000, pct: 29.7, color: '#0F4A3A' },
  { label: 'QRIS', value: 7200000, pct: 25.3, color: '#C75B3A' },
  { label: 'Debit/Credit', value: 6100000, pct: 21.5, color: '#D7A042' },
  { label: 'Transfer', value: 6700000, pct: 23.5, color: '#6A4A2B' },
];

export default function TransactionHistoryPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'Semua' | TransactionStatus>('Semua');
  const [paymentFilter, setPaymentFilter] = useState('Semua');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [cashierFilter, setCashierFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [sortOrder, setSortOrder] = useState('Terbaru');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Modal state
  const [detailTx, setDetailTx] = useState<typeof TRANSACTIONS[0] | null>(null);
  const [isPaymentDetailOpen, setIsPaymentDetailOpen] = useState(false);

  // Date range state
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const fmtDisplay = (d: Date) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const [startDate, setStartDate] = useState(fmt(sevenDaysAgo));
  const [endDate, setEndDate] = useState(fmt(today));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = React.useRef<HTMLDivElement>(null);

  // Click outside -> tutup datepicker
  useEffect(() => {
    if (!isDatePickerOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isDatePickerOpen]);

  // Dynamic KPI
  const kpiData = useMemo(() => {
    const total = TRANSACTIONS.length;
    const paid = TRANSACTIONS.filter(t => t.status === 'Paid').length;
    const open = TRANSACTIONS.filter(t => t.status === 'Open').length;
    const cancelled = TRANSACTIONS.filter(t => t.status === 'Cancelled').length;
    const omzet = TRANSACTIONS.filter(t => t.status === 'Paid').reduce((s, t) => s + t.total, 0);
    return { total, paid, open, cancelled, omzet };
  }, []);

  // Konversi "14 Jun 2025" ke Date
  const parseDateStr = (d: string) => {
    const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const [day, month, year] = d.split(' ');
    return new Date(Number(year), months[month] ?? 0, Number(day));
  };

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    const sd = new Date(startDate + 'T00:00:00');
    const ed = new Date(endDate + 'T23:59:59');
    return [...TRANSACTIONS]
      .filter((transaction) => {
        const txDate = parseDateStr(transaction.date);
        const matchesDate = txDate >= sd && txDate <= ed;
        const matchesSearch = [transaction.id, transaction.customer, transaction.item]
          .some((value) => value.toLowerCase().includes(normalizedSearch));
        const matchesTab = activeTab === 'Semua' || transaction.status === activeTab;
        const matchesPayment = paymentFilter === 'Semua' || transaction.payment === paymentFilter;
        const matchesType = typeFilter === 'Semua' || transaction.type === typeFilter;
        const matchesCashier = cashierFilter === 'Semua' || transaction.cashier === cashierFilter;
        const matchesStatus = statusFilter === 'Semua' || transaction.status === statusFilter;
        return matchesDate && matchesSearch && matchesTab && matchesPayment && matchesType && matchesCashier && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOrder === 'Total Tertinggi') return b.total - a.total;
        if (sortOrder === 'Total Terendah') return a.total - b.total;
        if (sortOrder === 'Terlama') return a.id.localeCompare(b.id);
        return b.id.localeCompare(a.id);
      });
  }, [activeTab, cashierFilter, paymentFilter, search, sortOrder, statusFilter, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.max(1, Math.min(page, totalPages));
  const pagedTransactions = filteredTransactions.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const generatePageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };
  const pageNumbers = generatePageNumbers();

  const startItem = (safePage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(safePage * ITEMS_PER_PAGE, filteredTransactions.length);

  return (
    <div style={styles.page}>
      <header style={styles.headerRow}>
        <div style={{ minWidth: 0 }}>
          <h1 style={styles.title}>Riwayat Transaksi</h1>
          <p style={styles.subtitle}>Pantau seluruh transaksi layanan dan produk dari cabang aktif secara rapi dan real-time.</p>
        </div>
        <div style={styles.headerActions}>
          <label style={styles.searchBox}>
            <Search size={17} color="#9A8F82" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari no. transaksi, pelanggan, atau item..."
              style={styles.searchInput}
            />
          </label>
          <button style={styles.downloadBtn} onClick={() => setIsReportOpen(true)}>
            <Download size={16} /> Unduh Laporan
          </button>
        </div>
      </header>

      <section style={styles.kpiGrid}>
        <KpiCard icon={<ShoppingBag size={20} />} label="Total Transaksi" value={String(kpiData.total)} note="Semua transaksi" tone="green" />
        <KpiCard icon={<CheckCircle2 size={20} />} label="Transaksi Paid" value={String(kpiData.paid)} note={`${kpiData.total > 0 ? Math.round(kpiData.paid / kpiData.total * 100) : 0}% dari total`} tone="green" />
        <KpiCard icon={<Clock3 size={20} />} label="Transaksi Open" value={String(kpiData.open)} note={`${kpiData.total > 0 ? Math.round(kpiData.open / kpiData.total * 100) : 0}% dari total`} tone="gold" />
        <KpiCard icon={<XCircle size={20} />} label="Transaksi Cancelled" value={String(kpiData.cancelled)} note={`${kpiData.total > 0 ? Math.round(kpiData.cancelled / kpiData.total * 100) : 0}% dari total`} tone="rust" />
        <KpiCard icon={<strong style={{ fontSize: 17 }}>Rp</strong>} label="Total Omzet" value={formatRupiah(kpiData.omzet)} note="Periode terpilih" tone="green" />
      </section>

      <section style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <div style={styles.tabsGroup}>
            {STATUS_TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabActive : {}) }}>{tab}</button>
            ))}
          </div>
        </div>
        <div style={styles.toolbarRight}>
          <FilterSelect value={paymentFilter} onChange={setPaymentFilter} options={PAYMENT_FILTERS} />
          <FilterSelect value={typeFilter} onChange={setTypeFilter} options={TYPE_FILTERS} />
          <FilterSelect value={cashierFilter} onChange={setCashierFilter} options={CASHIER_FILTERS} />
          <div ref={datePickerRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} style={styles.dateBtn}>
              <Calendar size={15} color="#C75B3A" /> {fmtDisplay(new Date(startDate + 'T00:00:00'))} - {fmtDisplay(new Date(endDate + 'T00:00:00'))}
            </button>
            {isDatePickerOpen && (
              <div style={styles.datePickerDropdown}>
                <label style={styles.datePickerLabel}>Dari Tanggal</label>
                <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} style={styles.datePickerInput} />
                <label style={{ ...styles.datePickerLabel, marginTop: 8 }}>Sampai Tanggal</label>
                <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} style={styles.datePickerInput} />
              </div>
            )}
          </div>
          <div style={styles.sortWrap}>
            <ArrowUpDown size={14} color="#C75B3A" />
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} style={styles.selectInput}>
              {SORT_OPTIONS.map((option) => <option key={option}>{option}</option>)}
            </select>
            <ChevronDown size={14} color="#8B7D6D" />
          </div>
        </div>
      </section>

      <main style={styles.contentGrid}>
        <section style={styles.tableCard}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>Daftar Transaksi</h2>
              <p style={styles.cardSubtitle}>Data transaksi terbaru pada periode 8 Jun - 14 Jun 2025.</p>
            </div>
            <span style={styles.resultBadge}>{filteredTransactions.length} data tampil</span>
          </div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>No. Transaksi</th>
                  <th style={styles.th}>Tanggal</th>
                  <th style={styles.th}>Waktu</th>
                  <th style={styles.th}>Pelanggan</th>
                  <th style={styles.th}>Item</th>
                  <th style={styles.th}>Metode Pembayaran</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} style={styles.tr}>
                    <td style={styles.tdId}>{transaction.id}</td>
                    <td style={styles.td}>{transaction.date}</td>
                    <td style={styles.td}>{transaction.time}</td>
                    <td style={styles.td}>{transaction.customer}</td>
                    <td style={styles.tdItem}>{transaction.item}</td>
                    <td style={styles.td}><span style={styles.paymentPill}>{transaction.payment}</span></td>
                    <td style={styles.tdTotal}>{formatRupiah(transaction.total)}</td>
                    <td style={styles.td}><StatusBadge status={transaction.status} /></td>
                    <td style={styles.tdAction}>
                      <button onClick={() => setDetailTx(transaction)} style={styles.detailBtn}>
                        <Eye size={14} /> Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer style={styles.paginationRow}>
            <span style={styles.paginationText}>Menampilkan {startItem}-{endItem} dari {filteredTransactions.length} transaksi</span>
            <div style={styles.paginationButtons}>
              <button onClick={() => setPage(safePage - 1)} disabled={safePage <= 1} style={{ ...styles.pageButton, opacity: safePage <= 1 ? 0.4 : 1 }}>
                <ChevronLeft size={15} />
              </button>
              {pageNumbers.map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} style={styles.dots}>...</span>
                ) : (
                  <button key={p} onClick={() => setPage(p)} style={{ ...styles.pageButton, ...(p === safePage ? styles.pageActive : {}) }}>
                    {p}
                  </button>
                )
              )}
              <button onClick={() => setPage(safePage + 1)} disabled={safePage >= totalPages} style={{ ...styles.pageButton, opacity: safePage >= totalPages ? 0.4 : 1 }}>
                <ChevronRight size={15} />
              </button>
            </div>
          </footer>
        </section>

        <aside style={styles.asideColumn}>
          <PaymentSummaryCard onViewDetail={() => setIsPaymentDetailOpen(true)} />
          <RecentTransactionsCard />
          <InsightsCard />
        </aside>
      </main>
      
      {isReportOpen && (
        <ReportPreviewModal 
          onClose={() => setIsReportOpen(false)} 
          transactions={filteredTransactions} 
        />
      )}

      {/* Modal Detail Transaksi */}
      {detailTx && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, maxWidth: 480 }}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Detail Transaksi</h2>
                <p style={styles.modalSubtitle}>{detailTx.id}</p>
              </div>
              <button onClick={() => setDetailTx(null)} style={styles.modalClose}><X size={18} /></button>
            </div>
            <div style={styles.detailGrid}>
              <DetailRow label="Tanggal" value={`${detailTx.date} ${detailTx.time}`} />
              <DetailRow label="Pelanggan" value={detailTx.customer} />
              <DetailRow label="Item" value={detailTx.item} />
              <DetailRow label="Metode Pembayaran" value={detailTx.payment} />
              <DetailRow label="Status" value={detailTx.status} />
              <DetailRow label="Kasir" value={detailTx.cashier} />
              <DetailRow label="Total" value={formatRupiah(detailTx.total)} />
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Pembayaran */}
      {isPaymentDetailOpen && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, maxWidth: 420 }}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Detail Pembayaran</h2>
                <p style={styles.modalSubtitle}>Ringkasan semua metode pembayaran</p>
              </div>
              <button onClick={() => setIsPaymentDetailOpen(false)} style={styles.modalClose}><X size={18} /></button>
            </div>
            <div style={{ padding: '8px 0' }}>
              {PAYMENT_SUMMARY.map(item => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0', borderBottom: '1px solid #F0E6D8',
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ fontSize: 13, color: '#10281F' }}>{item.label}</strong>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: '#6E6A64' }}>{item.pct}% dari total pembayaran</p>
                  </div>
                  <strong style={{ fontSize: 13, color: '#10281F' }}>{formatRupiah(item.value)}</strong>
                </div>
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0 4px', borderTop: '2px solid #10281F', marginTop: 8,
              }}>
                <strong style={{ fontSize: 14, color: '#10281F' }}>Total</strong>
                <strong style={{ fontSize: 16, color: '#10281F' }}>
                  {formatRupiah(PAYMENT_SUMMARY.reduce((s, i) => s + i.value, 0))}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <strong style={styles.detailValue}>{value}</strong>
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div style={styles.filterWrap}>
      <select value={value} onChange={(event) => onChange(event.target.value)} style={styles.selectInput}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <ChevronDown size={14} color="#8B7D6D" />
    </div>
  );
}

function KpiCard({ icon, label, value, note, tone }: { icon: React.ReactNode; label: string; value: string; note: string; tone: 'green' | 'gold' | 'rust' }) {
  const toneStyle = tone === 'green' ? styles.iconGreen : tone === 'gold' ? styles.iconGold : styles.iconRust;
  return (
    <article style={styles.kpiCard}>
      <span style={{ ...styles.kpiIcon, ...toneStyle }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <p style={styles.kpiLabel}>{label}</p>
        <strong style={styles.kpiValue}>{value}</strong>
        <span style={styles.kpiNote}>{note}</span>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const statusStyle = status === 'Paid' ? styles.statusPaid : status === 'Open' ? styles.statusOpen : styles.statusCancelled;
  return <span style={{ ...styles.statusBadge, ...statusStyle }}>{status}</span>;
}

function PaymentSummaryCard({ onViewDetail }: { onViewDetail: () => void }) {
  return (
    <section style={styles.sideCard}>
      <div style={styles.sideHeader}>
        <h3 style={styles.sideTitle}>Ringkasan Pembayaran</h3>
        <WalletCards size={18} color="#C75B3A" />
      </div>
      <div style={styles.donutRow}>
          <div style={styles.donutChart}>
            <div style={styles.donutCenter}>
              <strong style={{ fontSize: 10 }}>Rp 28,4 Jt</strong>
              <span style={{ fontSize: 8, opacity: 0.65 }}>Total</span>
            </div>
          </div>
        <div style={styles.legendList}>
          {PAYMENT_SUMMARY.map((item) => (
            <div key={item.label} style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: item.color }} />
              <div style={{ minWidth: 0 }}>
                <strong style={styles.legendLabel}>{item.label}</strong>
                <p style={styles.legendValue}>{formatRupiah(item.value)} ({item.pct}%)</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onViewDetail} style={styles.linkButton}>Lihat detail pembayaran -&gt;</button>
    </section>
  );
}

function RecentTransactionsCard() {
  const latest = TRANSACTIONS.slice(0, 4);
  return (
    <section style={styles.sideCard}>
      <div style={styles.sideHeader}>
        <h3 style={styles.sideTitle}>Transaksi Terbaru</h3>
      </div>
      <div style={styles.latestList}>
        {latest.map((transaction) => (
          <div key={transaction.id} style={styles.latestItem}>
            <span style={styles.receiptIcon}><ReceiptText size={16} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong style={styles.latestId}>{transaction.id}</strong>
              <span style={styles.latestMeta}>{transaction.payment}</span>
            </div>
            <StatusBadge status={transaction.status} />
          </div>
        ))}
      </div>
    </section>
  );
}

function InsightsCard() {
  return (
    <section style={styles.sideCard}>
      <div style={styles.sideHeader}>
        <h3 style={styles.sideTitle}>Insight Hari Ini</h3>
        <Sparkles size={18} color="#C75B3A" />
      </div>
      <InsightRow icon={<WalletCards size={15} />} label="Rata-rata nilai transaksi" value="Rp 118.000" />
      <InsightRow icon={<Scissors size={15} />} label="Layanan paling sering" value="Haircut" />
      <InsightRow icon={<PackageCheck size={15} />} label="Produk paling sering" value="Pomade Water Based" />
      <InsightRow icon={<Timer size={15} />} label="Jam tersibuk" value="13:00 - 15:00" />
    </section>
  );
}

function InsightRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={styles.insightRow}>
      <span style={styles.insightLabel}>{icon}{label}</span>
      <strong style={styles.insightValue}>{value}</strong>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '20px 24px 24px', color: '#142D22' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18, marginBottom: 18 },
  title: { margin: 0, fontFamily: 'var(--font-heading)', fontSize: 30, fontWeight: 800, color: '#123526', letterSpacing: '-0.02em' },
  subtitle: { margin: '7px 0 0', color: '#6E6A64', fontSize: 14, lineHeight: 1.55 },
  headerActions: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  searchBox: { width: 400, height: 44, background: 'rgba(255,255,255,0.93)', border: '1px solid #E6D8C6', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 9, padding: '0 13px', boxShadow: '0 12px 28px rgba(85,58,25,0.04)' },
  searchInput: { border: 'none', outline: 'none', background: 'transparent', width: '100%', height: '100%', fontFamily: 'inherit', fontSize: 13, color: '#10281F' },
  downloadBtn: { height: 44, border: 'none', borderRadius: 9, background: 'linear-gradient(135deg, #0F4A3A, #0B3A2D)', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 14px 26px rgba(15,74,58,0.22)', whiteSpace: 'nowrap' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 12, marginBottom: 14 },
  kpiCard: { minHeight: 96, background: 'rgba(255,255,255,0.9)', border: '1px solid #E6D8C6', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 12px 32px rgba(85,58,25,0.04)', minWidth: 0 },
  kpiIcon: { width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iconGreen: { background: '#0F4A3A', color: '#fff' },
  iconGold: { background: '#FFF1D2', color: '#B97818' },
  iconRust: { background: '#FBE2DA', color: '#C75B3A' },
  kpiLabel: { margin: '0 0 3px', color: '#6E6A64', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  kpiValue: { display: 'block', color: '#10281F', fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  kpiNote: { display: 'block', marginTop: 4, color: '#81786F', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14, overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: 2 },
  toolbarLeft: { display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 },
  toolbarRight: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 'auto' },
  tabsGroup: { display: 'flex', border: '1px solid #E6D8C6', borderRadius: 9, overflow: 'hidden', background: '#fff', flexShrink: 0 },
  tabBtn: { height: 40, padding: '0 15px', border: 'none', borderRight: '1px solid #E6D8C6', background: '#fff', color: '#6E6A64', fontWeight: 900, fontSize: 12, cursor: 'pointer' },
  tabActive: { background: '#0F4A3A', color: '#fff' },
  filterWrap: { height: 40, minWidth: 118, background: '#fff', border: '1px solid #E6D8C6', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', flexShrink: 0 },
  sortWrap: { height: 40, minWidth: 112, background: '#fff', border: '1px solid #E6D8C6', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', flexShrink: 0 },
  selectInput: { border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', fontWeight: 800, color: '#10281F', fontSize: 12, appearance: 'none', flex: 1, minWidth: 0 },
  dateBtn: { height: 40, border: '1px solid #E6D8C6', borderRadius: 9, background: '#fff', color: '#10281F', display: 'flex', alignItems: 'center', gap: 7, padding: '0 12px', fontWeight: 800, fontSize: 12, cursor: 'pointer', flexShrink: 0 },
  contentGrid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 330px', gap: 14, alignItems: 'start' },
  tableCard: { minWidth: 0, background: 'rgba(255,255,255,0.92)', border: '1px solid #E6D8C6', borderRadius: 12, boxShadow: '0 14px 34px rgba(85,58,25,0.04)', overflow: 'hidden' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, padding: '16px 18px 13px', borderBottom: '1px solid #F0E6D8' },
  cardTitle: { margin: 0, color: '#10281F', fontSize: 17, fontWeight: 900 },
  cardSubtitle: { margin: '5px 0 0', color: '#81786F', fontSize: 12 },
  resultBadge: { background: '#FFF1DA', color: '#B97818', borderRadius: 999, padding: '6px 10px', fontSize: 11, fontWeight: 900, flexShrink: 0 },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 1040 },
  th: { background: '#FBF3E8', padding: '12px 10px', textAlign: 'left', color: '#5D554B', fontWeight: 900, whiteSpace: 'nowrap', borderBottom: '1px solid #EADDCB' },
  tr: { background: 'rgba(255,255,255,0.72)' },
  td: { padding: '12px 10px', borderBottom: '1px solid #F0E6D8', color: '#10281F', verticalAlign: 'middle' },
  tdId: { padding: '12px 10px', borderBottom: '1px solid #F0E6D8', color: '#10281F', fontWeight: 900, whiteSpace: 'nowrap', verticalAlign: 'middle' },
  tdItem: { padding: '12px 10px', borderBottom: '1px solid #F0E6D8', color: '#10281F', lineHeight: 1.45, maxWidth: 190, verticalAlign: 'middle' },
  tdTotal: { padding: '12px 10px', borderBottom: '1px solid #F0E6D8', color: '#10281F', fontWeight: 900, whiteSpace: 'nowrap', verticalAlign: 'middle' },
  tdAction: { padding: '12px 10px', borderBottom: '1px solid #F0E6D8', textAlign: 'center', verticalAlign: 'middle' },
  paymentPill: { display: 'inline-flex', alignItems: 'center', border: '1px solid #EADDCB', background: '#FFFDF9', borderRadius: 999, padding: '4px 9px', color: '#6A4A2B', fontSize: 11, fontWeight: 900, whiteSpace: 'nowrap' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 72, borderRadius: 999, padding: '5px 9px', fontSize: 11, fontWeight: 900 },
  statusPaid: { background: '#DDEFE7', color: '#0F4A3A' },
  statusOpen: { background: '#FFF1D2', color: '#B97818' },
  statusCancelled: { background: '#FBE2DA', color: '#C75B3A' },
  actionBtn: { width: 32, height: 32, borderRadius: 8, border: '1px solid #E6D8C6', background: '#FFFDF9', color: '#C75B3A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  paginationRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '13px 16px 16px', background: 'rgba(255,253,249,0.88)' },
  paginationText: { color: '#81786F', fontSize: 12, fontWeight: 700 },
  paginationButtons: { display: 'flex', alignItems: 'center', gap: 6 },
  pageButton: { minWidth: 32, height: 32, borderRadius: 8, border: '1px solid #E6D8C6', background: '#fff', color: '#10281F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, cursor: 'pointer' },
  pageActive: { background: '#0F4A3A', color: '#fff', borderColor: '#0F4A3A' },
  dots: { color: '#81786F', fontWeight: 900, padding: '0 2px' },
  asideColumn: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
  sideCard: { background: 'rgba(255,255,255,0.93)', border: '1px solid #E6D8C6', borderRadius: 12, padding: 15, boxShadow: '0 14px 34px rgba(85,58,25,0.04)' },
  sideHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 13 },
  sideTitle: { margin: 0, color: '#10281F', fontSize: 15, fontWeight: 900 },
  donutRow: { display: 'grid', gridTemplateColumns: '130px minmax(0, 1fr)', gap: 14, alignItems: 'center' },
  donutChart: { width: 130, height: 130, borderRadius: '50%', background: 'conic-gradient(#0F4A3A 0 29.7%, #C75B3A 29.7% 55%, #D7A042 55% 76.5%, #6A4A2B 76.5% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.45)' },
  donutCenter: { width: 84, height: 84, borderRadius: '50%', background: '#FFFDF9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#10281F', lineHeight: 1.3, boxShadow: '0 8px 22px rgba(85,58,25,0.1)' },
  legendList: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 },
  legendDot: { width: 9, height: 9, borderRadius: '50%', flexShrink: 0 },
  legendLabel: { display: 'block', color: '#10281F', fontSize: 11, whiteSpace: 'nowrap' },
  legendValue: { margin: 0, color: '#81786F', fontSize: 10.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  linkButton: { marginTop: 12, marginLeft: 'auto', border: 'none', background: 'transparent', color: '#C75B3A', fontWeight: 900, fontSize: 12, cursor: 'pointer', display: 'block' },
  seeAllBtn: { border: 'none', background: 'transparent', color: '#C75B3A', fontWeight: 900, fontSize: 12, cursor: 'pointer' },
  latestList: { display: 'flex', flexDirection: 'column', gap: 10 },
  latestItem: { display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid #F0E6D8' },
  receiptIcon: { width: 34, height: 34, borderRadius: 10, background: '#FBF3E8', color: '#C75B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  latestId: { display: 'block', color: '#10281F', fontSize: 11.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  latestMeta: { display: 'block', marginTop: 2, color: '#81786F', fontSize: 11 },
  insightRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid #F0E6D8' },
  insightLabel: { display: 'flex', alignItems: 'center', gap: 7, color: '#6E6A64', fontSize: 12, minWidth: 0 },
  insightValue: { color: '#10281F', fontSize: 12.5, textAlign: 'right', maxWidth: 135 },

  // Modal & Dropdown Styles
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(15, 31, 24, 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 },
  modalCard: { width: '100%', maxWidth: 500, background: '#fff', borderRadius: 16, border: '1px solid #E7DCCB', boxShadow: '0 24px 80px rgba(15,31,24,0.28)', padding: 26 },
  modalHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18 },
  modalTitle: { margin: 0, fontSize: 20, color: '#1A3325', fontFamily: 'var(--font-heading)' },
  modalSubtitle: { margin: '5px 0 0', fontSize: 13, color: '#777', lineHeight: 1.5 },
  modalClose: { width: 34, height: 34, borderRadius: 999, background: '#F8F4EE', color: '#1A3325', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' },
  detailGrid: { display: 'flex', flexDirection: 'column', gap: 2 },
  detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F0E6D8' },
  detailLabel: { fontSize: 12, color: '#6E6A64', fontWeight: 600 },
  detailValue: { fontSize: 13, color: '#10281F', textAlign: 'right', maxWidth: '60%' },

  // Detail button
  detailBtn: {
    height: 32, padding: '0 12px', border: '1px solid #E6D8C6', borderRadius: 6,
    background: '#fff', color: '#C75B3A', fontWeight: 800, fontSize: 11,
    display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer',
  } as React.CSSProperties,

  // Date picker
  datePickerDropdown: {
    position: 'absolute', top: '100%', right: 0, zIndex: 50, marginTop: 6,
    background: '#fff', border: '1px solid #E6D8C6', borderRadius: 10,
    boxShadow: '0 12px 40px rgba(15,31,24,0.18)', padding: 16, minWidth: 220,
  } as React.CSSProperties,
  datePickerLabel: {
    display: 'block', fontSize: 11, fontWeight: 700, color: '#6E6A64', marginBottom: 5,
  },
  datePickerInput: {
    width: '100%', height: 38, border: '1px solid #E6D8C6', borderRadius: 7,
    padding: '0 10px', fontSize: 13, fontFamily: 'inherit', color: '#10281F',
    background: '#fff', boxSizing: 'border-box',
  } as React.CSSProperties,
};
