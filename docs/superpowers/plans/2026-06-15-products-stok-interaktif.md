# Produk & Stok Interaktif — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membuat halaman Produk & Stok menjadi interaktif: tombol "Lihat Semua" dan "Lihat Detail" di sidebar berfungsi, tombol ⋮ (MoreVertical) membuka dropdown aksi, dan tombol Export download data.

**Architecture:** Semua perubahan di satu file `ProductsPage.tsx` karena komponen sidebar (InfoCard, SelectFilter, StatusPill) dan state sudah di dalam file tsx yang sama. Menambahkan 3 komponen baru: `ThreeDotMenu`, `ExportButton` dengan hidden anchor download, `DistribusiModal`.

**Tech Stack:** React 18, inline styles (CSSProperties), lucide-react icons.

---

### Task 1: InfoCard — tambah callback `onAction` dan wiring

**Files:**
- Modify: `src/features/products/pages/ProductsPage.tsx`

- [ ] **Step 1: Tambah `onAction` di fungsi komponen `InfoCard`**

Ubah `InfoCard` untuk menerima dan memanggil `onAction`:
```tsx
function InfoCard({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: React.ReactNode }) {
  return (
    <section style={styles.infoCard}>
      <div style={styles.infoHeader}>
        <h2 style={styles.infoTitle}>{title}</h2>
        {action && (
          <button onClick={onAction} style={styles.infoAction}>
            {action}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Wiring handler untuk Kategori "Lihat Semua"**

Di `ProductsPage`, tambah function `handleCategorySeeAll` yang set filter ke kategori pertama yang muncul:
```tsx
const handleCategorySeeAll = () => {
  setCatFilter('Semua');
  setActiveTab('Semua Produk');
  setPage(1);
};
```

Pasang ke `InfoCard title="Kategori Produk" action="Lihat Semua" onAction={handleCategorySeeAll}`.

- [ ] **Step 3: Wiring handler untuk Stok Menipis sidebar "Lihat Semua"**

```tsx
const handleLowStockSeeAll = () => {
  setActiveTab('Stok Menipis');
  setCatFilter('Semua');
  setStatusFilter('Semua');
  setPage(1);
};
```

Pasang ke `InfoCard title="Stok Menipis" action="Lihat Semua" onAction={handleLowStockSeeAll}`.

- [ ] **Step 4: Wiring handler untuk Distribusi "Lihat Detail" → buka modal**

```tsx
const [isDistribusiModalOpen, setIsDistribusiModalOpen] = useState(false);
```
Pasang ke `InfoCard title="Distribusi Stok per Kategori" action="Lihat Detail" onAction={() => setIsDistribusiModalOpen(true)}`.

- [ ] **Step 5: Hapus unused import**

`X` sudah di-import, cek apakah ada yang tidak terpakai.

- [ ] **Step 6: Build check**

Run: `npm run build`
Expected: 0 errors

---

### Task 2: Three-dot (⋮) dropdown menu

**Files:**
- Modify: `src/features/products/pages/ProductsPage.tsx`

- [ ] **Step 1: Tambah state dropdown**

```tsx
const [menuOpenSku, setMenuOpenSku] = useState<string | null>(null);
```

- [ ] **Step 2: Handler aksi dropdown**

```tsx
const handleEdit = (product: ProductRow) => {
  setMenuOpenSku(null);
  handleOpenModal(product);
};

const handleDuplicate = (product: ProductRow) => {
  setMenuOpenSku(null);
  const dup: ProductRow = {
    ...product,
    sku: product.sku.replace(/\d+/, m => String(Number(m) + 100)),
    name: product.name + ' (Copy)',
  };
  setProducts([dup, ...products]);
};

const handleDelete = (sku: string) => {
  setMenuOpenSku(null);
  if (window.confirm('Yakin ingin menghapus produk ini?')) {
    setProducts(products.filter(p => p.sku !== sku));
  }
};
```

- [ ] **Step 3: Click outside handler**

```tsx
useEffect(() => {
  if (!menuOpenSku) return;
  const close = () => setMenuOpenSku(null);
  document.addEventListener('click', close);
  return () => document.removeEventListener('click', close);
}, [menuOpenSku]);
```

- [ ] **Step 4: Ganti tombol ⋮ di tabel**

Ubah dari:
```tsx
<button style={styles.moreBtn}><MoreVertical size={15} /></button>
```
Menjadi:
```tsx
<div style={{ position: 'relative', display: 'inline-block' }}>
  <button
    onClick={(e) => { e.stopPropagation(); setMenuOpenSku(menuOpenSku === product.sku ? null : product.sku); }}
    style={styles.moreBtn}
  >
    <MoreVertical size={15} />
  </button>
  {menuOpenSku === product.sku && (
    <div style={styles.dropdownMenu}>
      <button style={styles.dropdownItem} onClick={() => handleEdit(product)}>Edit</button>
      <button style={styles.dropdownItem} onClick={() => handleDuplicate(product)}>Duplikat</button>
      <button style={styles.dropdownItem} onClick={() => handleDelete(product.sku)}>Hapus</button>
    </div>
  )}
</div>
```

- [ ] **Step 5: Tambah style dropdown**

```tsx
dropdownMenu: {
  position: 'absolute', right: 0, top: '100%', zIndex: 50,
  background: '#fff', border: '1px solid #E6D8C6', borderRadius: 8,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 140, padding: 4,
} as React.CSSProperties,
dropdownItem: {
  display: 'block', width: '100%', padding: '8px 14px',
  border: 'none', background: 'transparent', textAlign: 'left',
  fontSize: 12, fontWeight: 600, color: '#333', borderRadius: 5,
  cursor: 'pointer',
} as React.CSSProperties,
```

Tambah `&:hover` effect inline via `onMouseEnter`/`onMouseLeave` atau pakai state terpisah — sederhananya pakai state `hoveredItem` atau cukup inline style di `onMouseEnter`.

- [ ] **Step 6: Build check**

Run: `npm run build`
Expected: 0 errors

---

### Task 3: Export CSV

**Files:**
- Modify: `src/features/products/pages/ProductsPage.tsx`

- [ ] **Step 1: Fungsi export CSV**

```tsx
const handleExport = () => {
  const headers = ['SKU', 'Nama Produk', 'Kategori', 'Harga Jual', 'Stok', 'Min. Stok', 'Status'];
  const rows = filteredProducts.map(p => [
    p.sku, p.name, p.category, p.price, p.stock, p.minStock, p.status
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `produk-stok-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
```

- [ ] **Step 2: Pasang ke tombol Export**

```tsx
<button onClick={handleExport} style={styles.exportButton}><Download size={15} /> Export</button>
```

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: 0 errors

---

### Task 4: Modal Detail Distribusi Stok

**Files:**
- Modify: `src/features/products/pages/ProductsPage.tsx`

- [ ] **Step 1: Data distribusi per kategori**

```tsx
const distribusiData = useMemo(() => {
  const catMap = new Map<string, number>();
  products.forEach(p => {
    catMap.set(p.category, (catMap.get(p.category) || 0) + p.stock);
  });
  const total = Array.from(catMap.values()).reduce((a, b) => a + b, 0);
  const colors = ['#0F3F31', '#C75B3A', '#C9A84C', '#BDAE93', '#D8D0C2'];
  return Array.from(catMap.entries()).map(([name, value], i) => ({
    name,
    value,
    pct: total > 0 ? Math.round((value / total) * 100) : 0,
    color: colors[i % colors.length],
  })).sort((a, b) => b.value - a.value);
}, [products]);
```

- [ ] **Step 2: Render modal distribusi**

```tsx
{isDistribusiModalOpen && (
  <div style={styles.modalOverlay}>
    <div style={{ ...styles.modalCard, maxWidth: 460 }}>
      <div style={styles.modalHeader}>
        <div>
          <h2 style={styles.modalTitle}>Distribusi Stok per Kategori</h2>
          <p style={styles.modalSubtitle}>Total {distribusiData.reduce((a, b) => a + b.value, 0)} unit stok</p>
        </div>
        <button onClick={() => setIsDistribusiModalOpen(false)} style={styles.modalClose}><X size={18} /></button>
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '12px 0' }}>
        {/* Donut */}
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: `radial-gradient(circle at center, #fff 0 62%, transparent 63%), conic-gradient(${
            distribusiData.map((d, i) => {
              const start = distribusiData.slice(0, i).reduce((a, b) => a + b.pct, 0);
              return `${d.color} ${start}% ${start + d.pct}%`;
            }).join(', ')
          })`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <strong style={{ fontSize: 22, color: '#10281F' }}>{distribusiData.length}</strong>
          <span style={{ fontSize: 10, color: '#6E6A64' }}>Kategori</span>
        </div>
        {/* Legend */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {distribusiData.map(d => (
            <div key={d.name} style={{ display: 'grid', gridTemplateColumns: '12px 1fr auto auto', gap: 8, alignItems: 'center', fontSize: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
              <span style={{ fontWeight: 600, color: '#333' }}>{d.name}</span>
              <span style={{ color: '#6E6A64' }}>{d.value} unit</span>
              <b style={{ color: '#10281F' }}>{d.pct}%</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
```

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: 0 errors
