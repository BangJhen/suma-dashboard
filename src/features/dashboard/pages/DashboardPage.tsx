import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Scissors,
  Briefcase,
  Users,
  Calendar,
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import OmzetChart from '../components/OmzetChart';
import MixChart from '../components/MixChart';
import PaymentChart from '../components/PaymentChart';
import RecentTransactions from '../components/RecentTransactions';
import StokMenipis from '../components/StokMenipis';
import TopLists from '../components/TopLists';
import { KPI_DATA } from '../../../data/seed';
import type { Period } from '../../../data/types';

const PERIODS: Period[] = ['Hari Ini', 'Minggu Ini', 'Bulan Ini'];

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('Hari Ini');

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
          <div style={styles.dateBtn}>
            <Calendar size={13} color="#888" />
            <span>14 Juni 2025</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiRow}>
        <KpiCard
          label="Omzet"
          value={KPI_DATA.omzet.value}
          isRupiah
          change={KPI_DATA.omzet.change}
          icon={<TrendingUp size={18} />}
          iconBg="#1A3325"
        />
        <KpiCard
          label="Total Transaksi"
          value={KPI_DATA.totalTrx.value}
          change={KPI_DATA.totalTrx.change}
          icon={<ShoppingCart size={18} />}
          iconBg="#F5EDD6"
          iconColor="#C9A84C"
        />
        <KpiCard
          label="Dari Layanan"
          value={KPI_DATA.dariLayanan.value}
          isRupiah
          change={KPI_DATA.dariLayanan.change}
          icon={<Scissors size={18} />}
          iconBg="#1A3325"
        />
        <KpiCard
          label="Dari Produk"
          value={KPI_DATA.dariProduk.value}
          isRupiah
          change={KPI_DATA.dariProduk.change}
          icon={<Briefcase size={18} />}
          iconBg="#F5EDD6"
          iconColor="#C9A84C"
        />
        <KpiCard
          label="Pelanggan"
          value={KPI_DATA.pelanggan.value}
          change={KPI_DATA.pelanggan.change}
          icon={<Users size={18} />}
          iconBg="#1A3325"
        />
      </div>

      {/* Konten Utama (Kiri 2fr, Kanan 1fr) */}
      <div style={styles.mainContent}>
        {/* Kolom Kiri: Omzet, MixChart, lalu Transaksi Terbaru */}
        <div style={styles.leftColumn}>
          <div style={styles.chartsLeft}>
            <OmzetChart />
            <MixChart />
          </div>
          <RecentTransactions />
        </div>

        {/* Kolom Kanan: PaymentChart, Stok Menipis, Top Layanan & Produk */}
        <div style={styles.rightColumn}>
          <PaymentChart />
          <StokMenipis />
          <TopLists />
        </div>
      </div>
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
    fontFamily: "'Playfair Display', serif",
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
  },
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 10,
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: 10,
    alignItems: 'start',
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
};
