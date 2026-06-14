import React, { useMemo, useState } from 'react';
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
  MoreVertical,
  PackageCheck,
  ReceiptText,
  Scissors,
  Search,
  ShoppingBag,
  Sparkles,
  Timer,
  WalletCards,
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

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    return [...TRANSACTIONS]
      .filter((transaction) => {
        const matchesSearch = [transaction.id, transaction.customer, transaction.item]
          .some((value) => value.toLowerCase().includes(normalizedSearch));
        const matchesTab = activeTab === 'Semua' || transaction.status === activeTab;
        const matchesPayment = paymentFilter === 'Semua' || transaction.payment === paymentFilter;
        const matchesType = typeFilter === 'Semua' || transaction.type === typeFilter;
        const matchesCashier = cashierFilter === 'Semua' || transaction.cashier === cashierFilter;
        const matchesStatus = statusFilter === 'Semua' || transaction.status === statusFilter;
        return matchesSearch && matchesTab && matchesPayment && matchesType && matchesCashier && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOrder === 'Total Tertinggi') return b.total - a.total;
        if (sortOrder === 'Total Terendah') return a.total - b.total;
        if (sortOrder === 'Terlama') return a.id.localeCompare(b.id);
        return b.id.localeCompare(a.id);
      });
  }, [activeTab, cashierFilter, paymentFilter, search, sortOrder, statusFilter, typeFilter]);

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
        <KpiCard icon={<ShoppingBag size={20} />} label="Total Transaksi" value="268" note="Semua transaksi" tone="green" />
        <KpiCard icon={<CheckCircle2 size={20} />} label="Transaksi Paid" value="241" note="89.9% dari total" tone="green" />
        <KpiCard icon={<Clock3 size={20} />} label="Transaksi Open" value="12" note="4.5% dari total" tone="gold" />
        <KpiCard icon={<XCircle size={20} />} label="Transaksi Cancelled" value="15" note="5.6% dari total" tone="rust" />
        <KpiCard icon={<strong style={{ fontSize: 17 }}>Rp</strong>} label="Total Omzet" value="Rp 28.450.000" note="Periode terpilih" tone="green" />
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
          <button style={styles.dateBtn}><Calendar size={15} color="#C75B3A" /> 8 Jun 2025 - 14 Jun 2025</button>
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
                    <td style={styles.tdAction}><button style={styles.actionBtn} aria-label={`Aksi ${transaction.id}`}><MoreVertical size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer style={styles.paginationRow}>
            <span style={styles.paginationText}>Menampilkan 1 dari 268 transaksi</span>
            <div style={styles.paginationButtons}>
              <button style={styles.pageButton}><ChevronLeft size={15} /></button>
              {[1, 2, 3].map((pageNumber) => <button key={pageNumber} style={{ ...styles.pageButton, ...(pageNumber === 1 ? styles.pageActive : {}) }}>{pageNumber}</button>)}
              <span style={styles.dots}>...</span>
              <button style={styles.pageButton}>18</button>
              <button style={styles.pageButton}><ChevronRight size={15} /></button>
            </div>
          </footer>
        </section>

        <aside style={styles.asideColumn}>
          <PaymentSummaryCard />
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

function PaymentSummaryCard() {
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
      <button style={styles.linkButton}>Lihat detail pembayaran -&gt;</button>
    </section>
  );
}

function RecentTransactionsCard() {
  const latest = TRANSACTIONS.slice(0, 4);
  return (
    <section style={styles.sideCard}>
      <div style={styles.sideHeader}>
        <h3 style={styles.sideTitle}>Transaksi Terbaru</h3>
        <button style={styles.seeAllBtn}>Lihat Semua</button>
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
};
