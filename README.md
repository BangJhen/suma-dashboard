# Suma Barbershop — POS Admin

Aplikasi dashboard dan POS admin untuk Suma Barbershop, dibangun dengan React + TypeScript + Vite.

## Fitur MVP

- **Dashboard** — KPI cards, grafik omzet & mix layanan/produk, ringkasan pembayaran, transaksi terbaru, stok menipis, top layanan & produk
- **Navigasi sidebar** — Dashboard, POS/Transaksi, Produk & Stok, Riwayat Transaksi, Report, Pengaturan
- **Jam server real-time** di sidebar
- **Period tabs** — Hari Ini, Minggu Ini, Bulan Ini
- Desain Heritage Green/Nusantara sesuai brand Suma

## Tech Stack

- React 18 + TypeScript
- Vite (build tool, dev server)
- Recharts (grafik)
- Lucide React (ikon)

## Cara Menjalankan

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev

# Build untuk production
npm run build

# Preview hasil build
npm run preview
```

Dev server berjalan di `http://localhost:5173`

## Struktur Proyek

```
suma-barbershop/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx              # Entry point
    ├── App.tsx               # Root layout + routing
    ├── index.css             # Global styles
    ├── data/
    │   ├── types.ts          # TypeScript interfaces
    │   ├── seed.ts           # Data dummy (transaksi, produk, chart, dll)
    │   └── utils.ts          # Format helpers (Rupiah, persen)
    ├── hooks/
    │   └── useServerClock.ts # Hook jam real-time
    ├── components/
    │   ├── Sidebar.tsx       # Sidebar navigasi + jam server
    │   ├── Topbar.tsx        # Header (cabang + owner)
    │   ├── KpiCard.tsx       # Kartu KPI (omzet, transaksi, dll)
    │   ├── Badge.tsx         # Status badge (Paid/Cancelled/Kritis/Rendah)
    │   ├── OmzetChart.tsx    # Line chart omzet 7 hari
    │   ├── MixChart.tsx      # Bar chart layanan vs produk
    │   ├── PaymentChart.tsx  # Donut chart metode pembayaran
    │   ├── RecentTransactions.tsx  # Tabel transaksi terbaru
    │   ├── StokMenipis.tsx   # Panel stok kritis/rendah
    │   └── TopLists.tsx      # Top layanan & top produk
    └── pages/
        ├── DashboardPage.tsx # Halaman dashboard utama
        └── PlaceholderPage.tsx # Placeholder halaman lainnya
```

## Langkah Selanjutnya

1. **Backend** — Sambungkan ke Supabase/Postgres dengan RPC atomik untuk checkout
2. **Autentikasi** — Implementasi login owner sebelum production
3. **POS Page** — Form transaksi dengan cart layanan + produk
4. **Multi-cabang** — Branch switcher sudah disiapkan di data model
5. **Deploy** — Upload ke Vercel (Vite-ready, noindex sudah dipasang)

## Catatan

- Saat ini data berjalan sebagai prototype state (seed data)
- `meta robots: noindex, nofollow` sudah dipasang di `index.html`
- Struktur domain sudah siap untuk integrasi database
# suma-dashboard
