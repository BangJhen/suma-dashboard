import React from 'react';
import type { NavPage } from '../data/types';

const DESCRIPTIONS: Partial<Record<NavPage, string>> = {
  'POS / Transaksi':   'Kelola transaksi layanan dan produk dalam satu kasir.',
  'Produk & Stok':     'Lihat dan kelola inventaris produk barbershop.',
  'Riwayat Transaksi': 'Audit semua transaksi berdasarkan waktu, metode, dan status.',
  'Report':            'Laporan mendalam layanan, produk, dan pembayaran.',
  'Pengaturan':        'Konfigurasi cabang, owner, dan pengaturan bisnis.',
};

const ICONS: Partial<Record<NavPage, string>> = {
  'POS / Transaksi':   '🧾',
  'Produk & Stok':     '📦',
  'Riwayat Transaksi': '📋',
  'Report':            '📊',
  'Pengaturan':        '⚙️',
};

interface PlaceholderPageProps {
  page: NavPage;
}

export default function PlaceholderPage({ page }: PlaceholderPageProps) {
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.emoji}>{ICONS[page]}</div>
        <h2 style={styles.title}>{page}</h2>
        <p style={styles.desc}>{DESCRIPTIONS[page]}</p>
        <div style={styles.badge}>Segera Hadir</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  card: {
    background: '#fff',
    border: '1px solid #E8E2D8',
    borderRadius: 16,
    padding: '40px 48px',
    textAlign: 'center',
    maxWidth: 400,
  },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1A3325',
    marginBottom: 8,
    fontFamily: "'Playfair Display', serif",
  },
  desc: { fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: 20 },
  badge: {
    display: 'inline-block',
    padding: '6px 16px',
    background: '#F5EDD6',
    color: '#C9A84C',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
};
