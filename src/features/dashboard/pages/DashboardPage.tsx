import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Scissors,
  Briefcase,
  Users,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import OmzetChart from '../components/OmzetChart';
import MixChart from '../components/MixChart';
import PaymentChart from '../components/PaymentChart';
import RecentTransactions from '../components/RecentTransactions';
import StokMenipis from '../components/StokMenipis';
import TopLists from '../components/TopLists';
import DashboardDetailModal from '../components/DashboardDetailModal';
import { CHART_DATA, KPI_DATA, PAYMENT_BREAKDOWN } from '../../../data/seed';
import { formatRupiah } from '../../../utils/format';
import type { Period, TopItem } from '../../../data/types';

const PERIODS: Period[] = ['Hari Ini', 'Minggu Ini', 'Bulan Ini'];

type DatePreset = 'Hari Ini' | 'Kemarin' | '7 Hari Terakhir' | '30 Hari Terakhir';

const DATE_PRESETS: DatePreset[] = ['Hari Ini', 'Kemarin', '7 Hari Terakhir', '30 Hari Terakhir'];

const DATE_LABELS: Record<DatePreset, string> = {
  'Hari Ini': '14 Juni 2025',
  Kemarin: '13 Juni 2025',
  '7 Hari Terakhir': '8 - 14 Juni 2025',
  '30 Hari Terakhir': '16 Mei - 14 Juni 2025',
};

const PERIOD_MULTIPLIER: Record<Period, number> = {
  'Hari Ini': 1,
  'Minggu Ini': 6.8,
  'Bulan Ini': 24.4,
};

function scaleCurrency(value: number, multiplier: number) {
  return Math.round((value * multiplier) / 50000) * 50000;
}

function scaleCount(value: number, multiplier: number) {
  return Math.max(1, Math.round(value * multiplier));
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('Hari Ini');
  const [dateLabel, setDateLabel] = useState('14 Juni 2025');
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [selectedDatePreset, setSelectedDatePreset] = useState<DatePreset>('Hari Ini');
  const [customDate, setCustomDate] = useState('2025-06-14');
  const [topModal, setTopModal] = useState<{ title: string; items: TopItem[] } | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const dashboardData = useMemo(() => {
    const multiplier = PERIOD_MULTIPLIER[period];
    const titleSuffix = period === 'Hari Ini' ? dateLabel : period;

    return {
      kpi: {
        omzet: { ...KPI_DATA.omzet, value: scaleCurrency(KPI_DATA.omzet.value, multiplier) },
        totalTrx: { ...KPI_DATA.totalTrx, value: scaleCount(KPI_DATA.totalTrx.value, multiplier) },
        dariLayanan: { ...KPI_DATA.dariLayanan, value: scaleCurrency(KPI_DATA.dariLayanan.value, multiplier) },
        dariProduk: { ...KPI_DATA.dariProduk, value: scaleCurrency(KPI_DATA.dariProduk.value, multiplier) },
        pelanggan: { ...KPI_DATA.pelanggan, value: scaleCount(KPI_DATA.pelanggan.value, multiplier) },
      },
      chart: CHART_DATA.map((item, index) => ({
        ...item,
        omzet: scaleCurrency(item.omzet, period === 'Hari Ini' ? 1 : multiplier / 5 + index * 0.08),
        layanan: scaleCurrency(item.layanan, period === 'Hari Ini' ? 1 : multiplier / 5 + index * 0.07),
        produk: scaleCurrency(item.produk, period === 'Hari Ini' ? 1 : multiplier / 5 + index * 0.05),
      })),
      titleSuffix,
    };
  }, [dateLabel, period]);

  const handleDatePreset = (preset: DatePreset) => {
    setSelectedDatePreset(preset);
    setDateLabel(DATE_LABELS[preset]);
    setIsDateMenuOpen(false);
  };

  const handleCustomDate = (value: string) => {
    setCustomDate(value);
    if (!value) return;
    const formatted = new Date(value).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setSelectedDatePreset('Hari Ini');
    setDateLabel(formatted);
    setIsDateMenuOpen(false);
  };

  const paymentTotal = PAYMENT_BREAKDOWN.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div style={styles.page}>

      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Ringkasan Report</h1>
          <p style={styles.pageSub}>Pantau performa bisnis barbershop Anda secara real-time.</p>
        </div>
        <div style={styles.periodRow}>
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{ ...styles.tabBtn, ...(period === p ? styles.tabBtnActive : {}) }}
            >
              {p}
            </button>
          ))}
          <div style={styles.dateWrap}>
            <button type="button" onClick={() => setIsDateMenuOpen((current) => !current)} style={styles.dateBtn}>
              <Calendar size={13} color="#888" />
              <span>{dateLabel}</span>
              <ChevronDown size={13} color="#888" style={{ transform: isDateMenuOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            {isDateMenuOpen && (
              <div style={styles.dateMenu}>
                <div style={styles.dateMenuTitle}>Pilih rentang cepat</div>
                {DATE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleDatePreset(preset)}
                    style={{ ...styles.dateMenuItem, ...(selectedDatePreset === preset ? styles.dateMenuItemActive : {}) }}
                  >
                    {preset}
                  </button>
                ))}
                <label style={styles.dateInputLabel}>Tanggal spesifik</label>
                <input type="date" value={customDate} onChange={(event) => handleCustomDate(event.target.value)} style={styles.dateInput} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiRow}>
        <KpiCard
          label="Omzet"
          value={dashboardData.kpi.omzet.value}
          isRupiah
          change={dashboardData.kpi.omzet.change}
          icon={<TrendingUp size={18} />}
          iconBg="#1A3325"
        />
        <KpiCard
          label="Total Transaksi"
          value={dashboardData.kpi.totalTrx.value}
          change={dashboardData.kpi.totalTrx.change}
          icon={<ShoppingCart size={18} />}
          iconBg="#F5EDD6"
          iconColor="#C9A84C"
        />
        <KpiCard
          label="Dari Layanan"
          value={dashboardData.kpi.dariLayanan.value}
          isRupiah
          change={dashboardData.kpi.dariLayanan.change}
          icon={<Scissors size={18} />}
          iconBg="#1A3325"
        />
        <KpiCard
          label="Dari Produk"
          value={dashboardData.kpi.dariProduk.value}
          isRupiah
          change={dashboardData.kpi.dariProduk.change}
          icon={<Briefcase size={18} />}
          iconBg="#F5EDD6"
          iconColor="#C9A84C"
        />
        <KpiCard
          label="Pelanggan"
          value={dashboardData.kpi.pelanggan.value}
          change={dashboardData.kpi.pelanggan.change}
          icon={<Users size={18} />}
          iconBg="#1A3325"
        />
      </div>

      {/* Konten Utama (Kiri 2fr, Kanan 1fr) */}
      <div style={styles.mainContent}>
        {/* Kolom Kiri: Omzet, MixChart, lalu Transaksi Terbaru */}
        <div style={styles.leftColumn}>
          <div style={styles.chartsLeft}>
            <OmzetChart data={dashboardData.chart} title={`Omzet (${dashboardData.titleSuffix})`} />
            <MixChart data={dashboardData.chart} title={`Layanan vs Produk (${dashboardData.titleSuffix})`} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <RecentTransactions />
          </div>
        </div>

        {/* Kolom Kanan: PaymentChart, Stok Menipis, Top Layanan & Produk */}
        <div style={styles.rightColumn}>
          <PaymentChart onViewDetail={() => setIsPaymentModalOpen(true)} />
          <StokMenipis />
          <TopLists onSeeAll={(title, items) => setTopModal({ title, items })} />
        </div>
      </div>

      {topModal && (
        <DashboardDetailModal
          title={`Detail ${topModal.title}`}
          subtitle={`Ranking performa untuk periode ${dashboardData.titleSuffix}.`}
          onClose={() => setTopModal(null)}
        >
          <table style={styles.modalTable}>
            <thead>
              <tr>
                {['Rank', 'Nama', 'Jumlah', 'Revenue'].map((head) => (
                  <th key={head} style={styles.modalTh}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topModal.items.map((item) => (
                <tr key={item.rank}>
                  <td style={styles.modalTd}>#{item.rank}</td>
                  <td style={styles.modalTdStrong}>{item.name}</td>
                  <td style={styles.modalTd}>{item.count}x</td>
                  <td style={{ ...styles.modalTdStrong, textAlign: 'right' }}>{formatRupiah(item.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardDetailModal>
      )}

      {isPaymentModalOpen && (
        <DashboardDetailModal
          title="Detail Pembayaran"
          subtitle={`Breakdown metode pembayaran untuk periode ${dashboardData.titleSuffix}.`}
          onClose={() => setIsPaymentModalOpen(false)}
        >
          <div style={styles.paymentDetailList}>
            {PAYMENT_BREAKDOWN.map((item, index) => {
              const percent = ((item.amount / paymentTotal) * 100).toFixed(1);
              const txCount = [24, 19, 13, 12][index];
              return (
                <div key={item.method} style={styles.paymentDetailItem}>
                  <span style={{ ...styles.paymentDot, background: item.color }} />
                  <div style={{ flex: 1 }}>
                    <div style={styles.paymentName}>{item.method}</div>
                    <div style={styles.paymentMeta}>{txCount} transaksi • {percent}% dari total</div>
                  </div>
                  <strong style={styles.paymentAmount}>{formatRupiah(item.amount)}</strong>
                </div>
              );
            })}
            <div style={styles.paymentTotalRow}>
              <span>Total Pembayaran</span>
              <strong>{formatRupiah(paymentTotal)}</strong>
            </div>
          </div>
        </DashboardDetailModal>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: '16px 20px',
    minHeight: 0,
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1A3325',
    fontFamily: 'var(--font-heading)',
  },
  pageSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  periodRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  tabBtn: {
    padding: '6px 14px',
    borderRadius: 6,
    border: '1px solid #E0D9CE',
    background: '#fff',
    color: '#666',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  },
  tabBtnActive: {
    background: '#1A3325',
    color: '#fff',
    borderColor: '#1A3325',
    fontWeight: 500,
  },
  dateWrap: { position: 'relative' },
  dateBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    border: '1px solid #E0D9CE',
    background: '#fff',
    borderRadius: 6,
    fontSize: 12,
    color: '#444',
    cursor: 'pointer',
    fontFamily: 'inherit',
    minWidth: 162,
    justifyContent: 'space-between',
  },
  dateMenu: {
    position: 'absolute',
    top: 36,
    right: 0,
    width: 220,
    background: '#fff',
    border: '1px solid #E8D8C4',
    borderRadius: 10,
    padding: 10,
    boxShadow: '0 18px 50px rgba(26,51,37,0.14)',
    zIndex: 80,
  },
  dateMenuTitle: { fontSize: 11, color: '#888', fontWeight: 700, marginBottom: 6 },
  dateMenuItem: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    padding: '8px 10px',
    borderRadius: 7,
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 12,
    color: '#1A3325',
  },
  dateMenuItemActive: { background: '#F5EDD6', fontWeight: 800 },
  dateInputLabel: { display: 'block', margin: '10px 0 5px', color: '#6E6A64', fontSize: 11, fontWeight: 700 },
  dateInput: { width: '100%', height: 34, border: '1px solid #E0D9CE', borderRadius: 7, padding: '0 8px', fontFamily: 'inherit', boxSizing: 'border-box' },
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 10,
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: 10,
    alignItems: 'stretch',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  chartsLeft: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  modalTable: { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  modalTh: { background: '#FBF3E8', padding: '12px 10px', color: '#4E4944', textAlign: 'left', borderBottom: '1px solid #E6D8C6' },
  modalTd: { padding: '12px 10px', borderBottom: '1px solid #F0E6D8', color: '#10281F' },
  modalTdStrong: { padding: '12px 10px', borderBottom: '1px solid #F0E6D8', color: '#10281F', fontWeight: 800 },
  paymentDetailList: { display: 'flex', flexDirection: 'column', gap: 10 },
  paymentDetailItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: '#F8F4EE', borderRadius: 10 },
  paymentDot: { width: 12, height: 12, borderRadius: '50%', flexShrink: 0 },
  paymentName: { fontSize: 13, fontWeight: 800, color: '#10281F' },
  paymentMeta: { fontSize: 11, color: '#6E6A64', marginTop: 2 },
  paymentAmount: { fontSize: 13, color: '#10281F' },
  paymentTotalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, padding: '15px 16px', background: '#0F3F31', color: '#fff', borderRadius: 10, fontWeight: 800 },
};
