import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Plus,
  ReceiptText,
  Scissors,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { formatRupiah } from '../../../utils/format';

type ReportTab = 'Laba & Rugi' | 'Komisi Kapster' | 'Pengeluaran Operasional';
type Period = 'Hari Ini' | 'Minggu Ini' | 'Bulan Ini' | 'Custom';

interface BarberCommission {
  id: string;
  name: string;
  services: number;
  grossRevenue: number;
  commissionRate: number;
  bonus: number;
}

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  note: string;
}

const COMMISSIONS: BarberCommission[] = [
  { id: 'KPS-001', name: 'Raka Pratama', services: 48, grossRevenue: 2880000, commissionRate: 0.35, bonus: 150000 },
  { id: 'KPS-002', name: 'Dimas Saputra', services: 36, grossRevenue: 2320000, commissionRate: 0.35, bonus: 100000 },
  { id: 'KPS-003', name: 'Bayu Santoso', services: 31, grossRevenue: 1875000, commissionRate: 0.3, bonus: 75000 },
  { id: 'KPS-004', name: 'Andra Wijaya', services: 22, grossRevenue: 1325000, commissionRate: 0.3, bonus: 0 },
];

const INITIAL_EXPENSES: Expense[] = [
  { id: 'EXP-001', date: '14 Jun 2026', category: 'Maintenance', amount: 450000, note: 'Service AC dan perbaikan lampu area tunggu' },
  { id: 'EXP-002', date: '13 Jun 2026', category: 'Operasional', amount: 275000, note: 'Listrik, air, dan kebersihan cabang' },
  { id: 'EXP-003', date: '12 Jun 2026', category: 'Restock', amount: 850000, note: 'Restock pomade, tonic, shampoo, dan handuk' },
  { id: 'EXP-004', date: '11 Jun 2026', category: 'Hospitality', amount: 180000, note: 'Kopi, teh, air mineral, snack pelanggan' },
];

const PERIODS: Period[] = ['Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Custom'];
const TABS: ReportTab[] = ['Laba & Rugi', 'Komisi Kapster', 'Pengeluaran Operasional'];
const EXPENSE_CATEGORIES = ['Maintenance', 'Operasional', 'Restock', 'Hospitality', 'Marketing', 'Lainnya'];

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('Laba & Rugi');
  const [period, setPeriod] = useState<Period>('Bulan Ini');
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState<Omit<Expense, 'id'>>({
    date: '14 Jun 2026',
    category: 'Maintenance',
    amount: 0,
    note: '',
  });

  const financials = useMemo(() => {
    const grossRevenue = 18450000;
    const productRevenue = 4620000;
    const serviceRevenue = grossRevenue - productRevenue;
    const totalCommission = COMMISSIONS.reduce((sum, barber) => sum + barber.grossRevenue * barber.commissionRate + barber.bonus, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = grossRevenue - totalCommission - totalExpenses;

    return { grossRevenue, productRevenue, serviceRevenue, totalCommission, totalExpenses, netProfit };
  }, [expenses]);

  const handleAddExpense = (event: React.FormEvent) => {
    event.preventDefault();
    const newExpense: Expense = {
      id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
      ...expenseForm,
      amount: Number(expenseForm.amount) || 0,
    };
    setExpenses([newExpense, ...expenses]);
    setExpenseForm({ date: '14 Jun 2026', category: 'Maintenance', amount: 0, note: '' });
    setIsExpenseModalOpen(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Report</h1>
          <p style={styles.subtitle}>Pantau laba rugi, komisi kapster, dan pengeluaran operasional cabang aktif.</p>
        </div>
        <div style={styles.headerActions}>
          <div style={styles.periodWrap}>
            <Calendar size={15} color="#C75B3A" />
            <select value={period} onChange={(event) => setPeriod(event.target.value as Period)} style={styles.periodSelect}>
              {PERIODS.map((item) => <option key={item}>{item}</option>)}
            </select>
            <ChevronDown size={14} color="#888" />
          </div>
          <button style={styles.exportBtn}><FileText size={15} /> Export PDF</button>
          <button style={styles.exportBtn}><FileSpreadsheet size={15} /> Export Excel</button>
        </div>
      </div>

      <section style={styles.kpiGrid}>
        <KpiCard icon={<TrendingUp size={20} />} tone="green" label="Pendapatan Kotor" value={formatRupiah(financials.grossRevenue)} note="Layanan + produk" />
        <KpiCard icon={<Scissors size={20} />} tone="gold" label="Komisi Kapster" value={formatRupiah(financials.totalCommission)} note="Total estimasi komisi" />
        <KpiCard icon={<TrendingDown size={20} />} tone="rust" label="Pengeluaran" value={formatRupiah(financials.totalExpenses)} note="Operasional & maintenance" />
        <KpiCard icon={<Wallet size={20} />} tone="green" label="Laba Bersih" value={formatRupiah(financials.netProfit)} note="Setelah komisi & biaya" />
      </section>

      <section style={styles.tabsRow}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabActive : {}) }}>{tab}</button>
        ))}
      </section>

      {activeTab === 'Laba & Rugi' && <ProfitLossPanel financials={financials} />}
      {activeTab === 'Komisi Kapster' && <CommissionPanel commissions={COMMISSIONS} />}
      {activeTab === 'Pengeluaran Operasional' && (
        <ExpensesPanel expenses={expenses} onAdd={() => setIsExpenseModalOpen(true)} />
      )}

      {isExpenseModalOpen && (
        <div style={styles.modalOverlay}>
          <form onSubmit={handleAddExpense} style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Tambah Pengeluaran</h2>
                <p style={styles.modalSub}>Catat biaya maintenance, operasional, restock, atau kebutuhan cabang.</p>
              </div>
              <button type="button" onClick={() => setIsExpenseModalOpen(false)} style={styles.closeBtn}><X size={18} /></button>
            </div>

            <label style={styles.label}>Tanggal</label>
            <input value={expenseForm.date} onChange={(event) => setExpenseForm({ ...expenseForm, date: event.target.value })} style={styles.input} />

            <label style={styles.label}>Kategori</label>
            <select value={expenseForm.category} onChange={(event) => setExpenseForm({ ...expenseForm, category: event.target.value })} style={styles.input}>
              {EXPENSE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>

            <label style={styles.label}>Nominal</label>
            <input type="number" value={expenseForm.amount || ''} onChange={(event) => setExpenseForm({ ...expenseForm, amount: Number(event.target.value) })} style={styles.input} placeholder="0" />

            <label style={styles.label}>Catatan</label>
            <textarea value={expenseForm.note} onChange={(event) => setExpenseForm({ ...expenseForm, note: event.target.value })} style={styles.textarea} placeholder="Contoh: service AC, restock pomade, listrik bulanan..." />

            <div style={styles.modalActions}>
              <button type="button" onClick={() => setIsExpenseModalOpen(false)} style={styles.cancelBtn}>Batal</button>
              <button type="submit" style={styles.saveBtn}>Simpan Pengeluaran</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function ProfitLossPanel({ financials }: { financials: { grossRevenue: number; productRevenue: number; serviceRevenue: number; totalCommission: number; totalExpenses: number; netProfit: number } }) {
  return (
    <div style={styles.contentGrid}>
      <section style={styles.cardLarge}>
        <div style={styles.cardHeader}><h2 style={styles.cardTitle}>Laba & Rugi</h2><span style={styles.badge}>Bulan berjalan</span></div>
        <div style={styles.pnlRows}>
          <SummaryLine label="Pendapatan layanan" value={formatRupiah(financials.serviceRevenue)} positive />
          <SummaryLine label="Pendapatan produk" value={formatRupiah(financials.productRevenue)} positive />
          <SummaryLine label="Komisi kapster" value={`- ${formatRupiah(financials.totalCommission)}`} negative />
          <SummaryLine label="Pengeluaran operasional" value={`- ${formatRupiah(financials.totalExpenses)}`} negative />
          <div style={styles.netRow}><span>Laba Bersih</span><strong>{formatRupiah(financials.netProfit)}</strong></div>
        </div>
      </section>

      <aside style={styles.insightCard}>
        <BarChart3 size={28} color="#C9A84C" />
        <h3>Insight Owner</h3>
        <p>Margin bersih masih sehat. Komisi kapster adalah komponen biaya terbesar setelah restock produk.</p>
        <div style={styles.miniMetric}><span>Margin Bersih</span><strong>{Math.round((financials.netProfit / financials.grossRevenue) * 100)}%</strong></div>
      </aside>
    </div>
  );
}

function CommissionPanel({ commissions }: { commissions: BarberCommission[] }) {
  return (
    <section style={styles.cardLarge}>
      <div style={styles.cardHeader}><h2 style={styles.cardTitle}>Komisi Kapster</h2><span style={styles.badge}>Auto calculation</span></div>
      <table style={styles.table}>
        <thead><tr>{['Kapster', 'Jumlah Layanan', 'Omzet Layanan', 'Rate Komisi', 'Bonus', 'Total Komisi'].map((head) => <th key={head} style={styles.th}>{head}</th>)}</tr></thead>
        <tbody>
          {commissions.map((barber) => {
            const commission = barber.grossRevenue * barber.commissionRate + barber.bonus;
            return (
              <tr key={barber.id}>
                <td style={styles.tdStrong}>{barber.name}</td>
                <td style={styles.td}>{barber.services} layanan</td>
                <td style={styles.td}>{formatRupiah(barber.grossRevenue)}</td>
                <td style={styles.td}>{Math.round(barber.commissionRate * 100)}%</td>
                <td style={styles.td}>{formatRupiah(barber.bonus)}</td>
                <td style={styles.tdStrong}>{formatRupiah(commission)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function ExpensesPanel({ expenses, onAdd }: { expenses: Expense[]; onAdd: () => void }) {
  return (
    <section style={styles.cardLarge}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Pengeluaran Operasional</h2>
        <button onClick={onAdd} style={styles.addExpenseBtn}><Plus size={15} /> Tambah Pengeluaran</button>
      </div>
      <table style={styles.table}>
        <thead><tr>{['Tanggal', 'Kategori', 'Catatan', 'Nominal'].map((head) => <th key={head} style={styles.th}>{head}</th>)}</tr></thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td style={styles.tdStrong}>{expense.date}</td>
              <td style={styles.td}><span style={styles.expensePill}>{expense.category}</span></td>
              <td style={styles.td}>{expense.note}</td>
              <td style={styles.tdStrong}>{formatRupiah(expense.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function KpiCard({ icon, tone, label, value, note }: { icon: React.ReactNode; tone: 'green' | 'gold' | 'rust'; label: string; value: string; note: string }) {
  const iconStyle = tone === 'green' ? styles.iconGreen : tone === 'gold' ? styles.iconGold : styles.iconRust;
  return <div style={styles.kpiCard}><span style={{ ...styles.kpiIcon, ...iconStyle }}>{icon}</span><div style={{ minWidth: 0 }}><div style={styles.kpiLabel}>{label}</div><strong style={styles.kpiValue}>{value}</strong><p style={styles.kpiNote}>{note}</p></div></div>;
}

function SummaryLine({ label, value, positive, negative }: { label: string; value: string; positive?: boolean; negative?: boolean }) {
  return <div style={styles.summaryLine}><span>{label}</span><strong style={{ color: positive ? '#0F3F31' : negative ? '#C75B3A' : '#10281F' }}>{value}</strong></div>;
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '20px 24px 24px', color: '#142D22' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18, marginBottom: 18 },
  title: { margin: 0, fontFamily: 'var(--font-heading)', fontSize: 30, fontWeight: 700, color: '#123526' },
  subtitle: { margin: '7px 0 0', color: '#6E6A64', fontSize: 14 },
  headerActions: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  periodWrap: { height: 44, minWidth: 150, background: '#fff', border: '1px solid #E6D8C6', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' },
  periodSelect: { border: 'none', outline: 'none', background: 'transparent', fontWeight: 800, color: '#10281F', fontFamily: 'inherit', appearance: 'none', flex: 1 },
  exportBtn: { height: 44, border: '1px solid #E6D8C6', borderRadius: 9, background: '#fff', color: '#10281F', display: 'flex', alignItems: 'center', gap: 7, padding: '0 14px', fontWeight: 800, cursor: 'pointer' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 16 },
  kpiCard: { minHeight: 104, background: 'rgba(255,255,255,0.9)', border: '1px solid #E6D8C6', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 13, boxShadow: '0 12px 34px rgba(85,58,25,0.04)', minWidth: 0 },
  kpiIcon: { width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iconGreen: { background: '#0F3F31', color: '#fff' },
  iconGold: { background: '#F4D9A4', color: '#B97818' },
  iconRust: { background: '#C75B3A', color: '#fff' },
  kpiLabel: { fontSize: 12, color: '#6E6A64', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  kpiValue: { display: 'block', fontSize: 19, color: '#10281F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  kpiNote: { margin: '4px 0 0', fontSize: 11, color: '#777' },
  tabsRow: { display: 'flex', border: '1px solid #E6D8C6', borderRadius: 9, overflow: 'hidden', background: '#fff', width: 'fit-content', marginBottom: 16 },
  tabBtn: { height: 44, padding: '0 20px', borderRight: '1px solid #E6D8C6', color: '#6E6A64', fontWeight: 800, background: '#fff', cursor: 'pointer' },
  tabActive: { background: '#0F3F31', color: '#fff' },
  contentGrid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 14, alignItems: 'stretch' },
  cardLarge: { background: 'rgba(255,255,255,0.92)', border: '1px solid #E6D8C6', borderRadius: 13, padding: 18, boxShadow: '0 14px 34px rgba(85,58,25,0.04)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 14 },
  cardTitle: { margin: 0, fontSize: 17, fontWeight: 800, color: '#10281F' },
  badge: { background: '#FFF1DA', color: '#B97818', borderRadius: 999, padding: '5px 10px', fontSize: 11, fontWeight: 800 },
  pnlRows: { display: 'flex', flexDirection: 'column', gap: 12 },
  summaryLine: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #F0E6D8', color: '#4E4944', fontSize: 14 },
  netRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FBF3E8', padding: '15px 16px', borderRadius: 9, fontSize: 17, color: '#10281F', fontWeight: 900 },
  insightCard: { background: 'linear-gradient(180deg, rgba(15,63,49,0.96), rgba(8,50,37,0.96))', borderRadius: 13, padding: 20, color: '#fff', boxShadow: '0 18px 42px rgba(15,63,49,0.22)' },
  miniMetric: { marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.18)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th: { background: '#FBF3E8', padding: '12px 10px', textAlign: 'left', color: '#4E4944', whiteSpace: 'nowrap' },
  td: { padding: '12px 10px', borderBottom: '1px solid #F0E6D8', color: '#10281F' },
  tdStrong: { padding: '12px 10px', borderBottom: '1px solid #F0E6D8', color: '#10281F', fontWeight: 800 },
  addExpenseBtn: { height: 38, borderRadius: 8, background: '#0F3F31', color: '#fff', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 7, fontWeight: 800, cursor: 'pointer' },
  expensePill: { background: '#FFF1DA', color: '#B97818', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 800 },
  modalOverlay: { position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,31,24,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { width: '100%', maxWidth: 480, background: '#fff', borderRadius: 16, border: '1px solid #E7DCCB', padding: 24, boxShadow: '0 24px 80px rgba(15,31,24,0.28)' },
  modalHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18 },
  modalTitle: { margin: 0, fontFamily: 'var(--font-heading)', fontSize: 20, color: '#10281F' },
  modalSub: { margin: '5px 0 0', color: '#777', fontSize: 12, lineHeight: 1.5 },
  closeBtn: { width: 34, height: 34, borderRadius: 999, background: '#F8F4EE', color: '#10281F', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  label: { display: 'block', fontSize: 12, fontWeight: 800, color: '#333', marginBottom: 6 },
  input: { width: '100%', height: 42, border: '1px solid #E7DCCB', borderRadius: 8, padding: '0 12px', outline: 'none', fontFamily: 'inherit', marginBottom: 12, boxSizing: 'border-box' },
  textarea: { width: '100%', minHeight: 82, border: '1px solid #E7DCCB', borderRadius: 8, padding: 12, outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18, paddingTop: 15, borderTop: '1px solid #F0E6D8' },
  cancelBtn: { height: 40, padding: '0 16px', border: '1px solid #E7DCCB', borderRadius: 8, background: '#fff', color: '#555', fontWeight: 800, cursor: 'pointer' },
  saveBtn: { height: 40, padding: '0 18px', border: 'none', borderRadius: 8, background: '#0F3F31', color: '#fff', fontWeight: 800, cursor: 'pointer' },
};
