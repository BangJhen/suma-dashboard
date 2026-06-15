import React, { useState, useMemo, useEffect } from 'react';
import {
  AlertCircle, ArrowDown, ArrowUp, Box, ChevronDown, ChevronLeft, ChevronRight,
  Download, MoreVertical, Package, Plus, Search, Tags, Scissors, Droplets,
  FlaskConical, Brush, MoreHorizontal, X
} from 'lucide-react';
import { formatRupiah } from '../../../utils/format';

type ProductStatus = 'Kritis' | 'Rendah' | 'Aman';

interface ProductRow {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  status: ProductStatus;
  updatedAt: string;
  icon: React.ReactNode;
}

const INITIAL_PRODUCTS: ProductRow[] = [
  { sku: 'POM-001', name: 'Pomade Water Based', category: 'Pomade', price: 120000, stock: 5, minStock: 10, status: 'Kritis', updatedAt: '14:21', icon: <Package size={16} color="#6E6A64" /> },
  { sku: 'TON-002', name: 'Hair Tonic 100ml', category: 'Hair Tonic', price: 80000, stock: 7, minStock: 10, status: 'Rendah', updatedAt: '14:10', icon: <FlaskConical size={16} color="#6E6A64" /> },
  { sku: 'CLA-003', name: 'Clay Matte', category: 'Styling', price: 90000, stock: 8, minStock: 10, status: 'Rendah', updatedAt: '13:58', icon: <Package size={16} color="#6E6A64" /> },
  { sku: 'SHA-004', name: 'Shampoo Anti Dandruff', category: 'Perawatan', price: 60000, stock: 9, minStock: 12, status: 'Rendah', updatedAt: '13:40', icon: <FlaskConical size={16} color="#6E6A64" /> },
  { sku: 'VIT-005', name: 'Hair Vitamin', category: 'Perawatan', price: 75000, stock: 14, minStock: 10, status: 'Aman', updatedAt: '12:56', icon: <FlaskConical size={16} color="#6E6A64" /> },
  { sku: 'WAX-006', name: 'Hair Wax Strong Hold', category: 'Styling', price: 95000, stock: 21, minStock: 10, status: 'Aman', updatedAt: '12:20', icon: <Package size={16} color="#6E6A64" /> },
  { sku: 'COM-007', name: 'Sisir Barber Carbon', category: 'Aksesoris', price: 35000, stock: 18, minStock: 8, status: 'Aman', updatedAt: '11:48', icon: <Brush size={16} color="#6E6A64" /> },
  { sku: 'OIL-008', name: 'Beard Oil Premium', category: 'Perawatan', price: 85000, stock: 12, minStock: 5, status: 'Aman', updatedAt: '10:30', icon: <Droplets size={16} color="#6E6A64" /> },
  { sku: 'GEL-009', name: 'Styling Hair Gel', category: 'Styling', price: 45000, stock: 3, minStock: 15, status: 'Kritis', updatedAt: '09:15', icon: <Package size={16} color="#6E6A64" /> },
  { sku: 'POM-010', name: 'Pomade Oil Based', category: 'Pomade', price: 110000, stock: 25, minStock: 10, status: 'Aman', updatedAt: '08:45', icon: <Package size={16} color="#6E6A64" /> },
  { sku: 'SHV-011', name: 'Shaving Cream', category: 'Perawatan', price: 55000, stock: 6, minStock: 10, status: 'Rendah', updatedAt: '08:12', icon: <Droplets size={16} color="#6E6A64" /> },
  { sku: 'BAM-012', name: 'Aftershave Balm', category: 'Perawatan', price: 70000, stock: 15, minStock: 8, status: 'Aman', updatedAt: 'Kemarin', icon: <FlaskConical size={16} color="#6E6A64" /> },
  { sku: 'COM-013', name: 'Sisir Lipat Premium', category: 'Aksesoris', price: 50000, stock: 30, minStock: 10, status: 'Aman', updatedAt: 'Kemarin', icon: <Brush size={16} color="#6E6A64" /> },
  { sku: 'HRD-014', name: 'Hair Dryer Mini', category: 'Aksesoris', price: 250000, stock: 4, minStock: 5, status: 'Rendah', updatedAt: 'Kemarin', icon: <Package size={16} color="#6E6A64" /> },
  { sku: 'TWL-015', name: 'Handuk Barber Hitam', category: 'Aksesoris', price: 25000, stock: 45, minStock: 20, status: 'Aman', updatedAt: 'Kemarin', icon: <Package size={16} color="#6E6A64" /> },
  { sku: 'SHP-016', name: 'Cooling Shampoo', category: 'Perawatan', price: 65000, stock: 11, minStock: 10, status: 'Aman', updatedAt: 'Kemarin', icon: <FlaskConical size={16} color="#6E6A64" /> },
  { sku: 'CND-017', name: 'Hair Conditioner', category: 'Perawatan', price: 70000, stock: 8, minStock: 10, status: 'Rendah', updatedAt: 'Kemarin', icon: <FlaskConical size={16} color="#6E6A64" /> },
];

const CATEGORY_LIST = ['Semua', 'Pomade', 'Styling', 'Perawatan', 'Hair Tonic', 'Aksesoris', 'Lainnya'];
const STATUS_LIST = ['Semua', 'Aman', 'Rendah', 'Kritis'];
const SORT_OPTIONS = ['Nama A-Z', 'Nama Z-A', 'Stok Terendah', 'Stok Tertinggi', 'Harga Terendah', 'Harga Tertinggi'];
const TABS = ['Semua Produk', 'Stok Menipis', 'Hampir Habis', 'Nonaktif'];

export default function ProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [catFilter, setCatFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [sortOrder, setSortOrder] = useState('Nama A-Z');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [isDistribusiModalOpen, setIsDistribusiModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<ProductRow>>({});

  // Dropdown menu state
  const [menuOpenSku, setMenuOpenSku] = useState<string | null>(null);

  // Click outside -> tutup dropdown
  useEffect(() => {
    if (!menuOpenSku) return;
    const close = () => setMenuOpenSku(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpenSku]);

  const handleEdit = (product: ProductRow) => {
    setMenuOpenSku(null);
    handleOpenModal(product);
  };

  const handleDuplicate = (product: ProductRow) => {
    setMenuOpenSku(null);
    const newSku = product.sku.replace(/\d+/, m => String(Number(m) + 100));
    const dup: ProductRow = { ...product, sku: newSku, name: product.name + ' (Copy)' };
    setProducts(prev => [dup, ...prev]);
  };

  const handleDelete = (sku: string) => {
    setMenuOpenSku(null);
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      setProducts(prev => prev.filter(p => p.sku !== sku));
    }
  };

  const [dropdownHover, setDropdownHover] = useState<string | null>(null);

  // Export CSV
  const handleExport = () => {
    const headers = ['SKU', 'Nama Produk', 'Kategori', 'Harga Jual', 'Stok', 'Min. Stok', 'Status'];
    const rows = filteredProducts.map(p => [
      p.sku, p.name, p.category, p.price, p.stock, p.minStock, p.status,
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

  const handleOpenModal = (product?: ProductRow) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        sku: 'NEW-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        name: '',
        category: 'Pomade',
        price: 0,
        stock: 0,
        minStock: 10,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const stock = Number(formData.stock) || 0;
    const minStock = Number(formData.minStock) || 0;
    const status: ProductStatus = stock === 0 ? 'Kritis' : stock <= minStock ? 'Rendah' : 'Aman';
    
    const newProduct: ProductRow = {
      sku: formData.sku || '',
      name: formData.name || 'Produk Baru',
      category: formData.category || 'Lainnya',
      price: Number(formData.price) || 0,
      stock,
      minStock,
      status,
      updatedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      icon: <Package size={16} color="#6E6A64" />,
    };

    if (editingProduct) {
      setProducts(products.map(p => p.sku === editingProduct.sku ? newProduct : p));
    } else {
      setProducts([newProduct, ...products]);
    }
    setIsModalOpen(false);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'Semua' || p.category === catFilter;
      const matchStatus = statusFilter === 'Semua' || p.status === statusFilter;
      const matchTab = 
        activeTab === 'Semua Produk' ? true :
        activeTab === 'Stok Menipis' ? p.status === 'Rendah' || p.status === 'Kritis' :
        activeTab === 'Hampir Habis' ? p.stock <= 2 :
        activeTab === 'Nonaktif' ? false : true;
      return matchSearch && matchCat && matchStatus && matchTab;
    }).sort((a, b) => {
      if (sortOrder === 'Nama A-Z') return a.name.localeCompare(b.name);
      if (sortOrder === 'Nama Z-A') return b.name.localeCompare(a.name);
      if (sortOrder === 'Stok Terendah') return a.stock - b.stock;
      if (sortOrder === 'Stok Tertinggi') return b.stock - a.stock;
      if (sortOrder === 'Harga Terendah') return a.price - b.price;
      if (sortOrder === 'Harga Tertinggi') return b.price - a.price;
      return 0;
    });
  }, [products, search, activeTab, catFilter, statusFilter, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const currentItems = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Dynamic Stats
  const totalStok = products.reduce((acc, p) => acc + p.stock, 0);
  const totalNilai = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const stokMenipisList = products.filter(p => p.status === 'Rendah' || p.status === 'Kritis');

  // Sidebar Action Handlers
  const handleCategorySeeAll = () => {
    setCatFilter('Semua');
    setActiveTab('Semua Produk');
    setPage(1);
  };

  const handleLowStockSeeAll = () => {
    setActiveTab('Stok Menipis');
    setCatFilter('Semua');
    setStatusFilter('Semua');
    setPage(1);
  };

  // Distribusi data untuk modal
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

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Produk & Stok</h1>
          <p style={styles.subtitle}>Kelola inventaris produk retail dan pantau stok cabang aktif secara real-time.</p>
        </div>
        <div style={styles.headerActions}>
          <div style={styles.searchBox}>
            <Search size={16} color="#8A8175" />
            <input 
              value={search} 
              onChange={e => { setSearch(e.target.value); setPage(1); }} 
              style={styles.searchInput} 
              placeholder="Cari produk, SKU, atau kategori..." 
            />
          </div>
          <button onClick={() => handleOpenModal()} style={styles.addButton}><Plus size={16} /> Tambah Produk</button>
        </div>
      </div>

      <div style={styles.gridShell}>
        <main style={styles.mainColumn}>
          <section style={styles.statGrid}>
            <StatCard icon={<Package size={23} />} tone="green" label="Total Produk" value={products.length.toString()} note="Semua produk terdaftar" />
            <StatCard icon={<Box size={23} />} tone="gold" label="Total Unit Stok" value={totalStok.toString()} note="Unit tersedia di cabang aktif" />
            <StatCard icon={<AlertCircle size={23} />} tone="rust" label="Stok Menipis" value={stokMenipisList.length.toString()} note="Produk perlu perhatian" />
            <StatCard icon={<span style={{ fontSize: 20, fontWeight: 800 }}>Rp</span>} tone="green" label="Nilai Inventaris" value={formatRupiah(totalNilai)} note="Berdasarkan harga jual" compact />
          </section>

          <section style={styles.toolbar}>
            <div style={styles.tabs}>
              {TABS.map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => { setActiveTab(tab); setPage(1); }}
                  style={{ ...styles.tabButton, ...(activeTab === tab ? styles.tabActive : {}) }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div style={styles.filters}>
              <SelectFilter label="Kategori" value={catFilter} options={CATEGORY_LIST} onChange={v => { setCatFilter(v); setPage(1); }} />
              <SelectFilter label="Status" value={statusFilter} options={STATUS_LIST} onChange={v => { setStatusFilter(v); setPage(1); }} />
              <SelectFilter label="Urutkan" value={sortOrder} options={SORT_OPTIONS} onChange={v => { setSortOrder(v); setPage(1); }} />
              <button onClick={handleExport} style={styles.exportButton}><Download size={15} /> Export</button>
            </div>
          </section>

          <section style={styles.tableCard}>
            <div style={styles.cardTitle}>Daftar Produk</div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>{['SKU', 'Nama Produk', 'Kategori', 'Harga Jual', 'Stok', 'Min. Stok', 'Status', 'Update Terakhir', 'Aksi'].map((item) => <th key={item} style={styles.th}>{item}</th>)}</tr>
                </thead>
                <tbody>
                  {currentItems.map((product) => (
                    <tr key={product.sku}>
                      <td style={styles.tdSku}>{product.sku}</td>
                      <td style={styles.tdProduct}><span style={styles.productIcon}>{product.icon}</span><strong>{product.name}</strong></td>
                      <td style={styles.td}>{product.category}</td>
                      <td style={styles.td}>{formatRupiah(product.price)}</td>
                      <td style={styles.tdCenter}>{product.stock}</td>
                      <td style={styles.tdCenter}>{product.minStock}</td>
                      <td style={styles.td}><StatusPill status={product.status} /></td>
                      <td style={styles.tdCenter}>{product.updatedAt}</td>
                      <td style={styles.actionCell}>
                        <button onClick={() => handleOpenModal(product)} style={styles.editBtn}>Edit</button>
                        <div style={{ position: 'relative', display: 'inline-block', verticalAlign: 'middle' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpenSku(menuOpenSku === product.sku ? null : product.sku); }}
                            style={styles.moreBtn}
                          >
                            <MoreVertical size={15} />
                          </button>
                          {menuOpenSku === product.sku && (
                            <div style={styles.dropdownMenu}>
                              <button
                                style={{ ...styles.dropdownItem, background: dropdownHover === 'edit' ? '#F5F0E8' : 'transparent' }}
                                onMouseEnter={() => setDropdownHover('edit')}
                                onMouseLeave={() => setDropdownHover(null)}
                                onClick={() => handleEdit(product)}
                              >
                                Edit
                              </button>
                              <button
                                style={{ ...styles.dropdownItem, background: dropdownHover === 'duplicate' ? '#F5F0E8' : 'transparent' }}
                                onMouseEnter={() => setDropdownHover('duplicate')}
                                onMouseLeave={() => setDropdownHover(null)}
                                onClick={() => handleDuplicate(product)}
                              >
                                Duplikat
                              </button>
                              <button
                                style={{ ...styles.dropdownItem, background: dropdownHover === 'delete' ? '#F5F0E8' : 'transparent' }}
                                onMouseEnter={() => setDropdownHover('delete')}
                                onMouseLeave={() => setDropdownHover(null)}
                                onClick={() => handleDelete(product.sku)}
                              >
                                Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#888' }}>Tidak ada produk yang cocok dengan pencarian.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={styles.tableFooter}>
              <span>Menampilkan {currentItems.length} dari {filteredProducts.length} produk</span>
              <div style={styles.pagination}>
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={{ ...styles.pageButton, opacity: page === 1 ? 0.5 : 1 }}>
                  <ChevronLeft size={15} />
                </button>
                <button style={{ ...styles.pageButton, ...styles.pageButtonActive }}>{page}</button>
                <span style={styles.pageDots}>/ {totalPages}</span>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={{ ...styles.pageButton, opacity: page === totalPages ? 0.5 : 1 }}>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </section>
        </main>

        <aside style={styles.sideColumn}>
          <InfoCard title="Kategori Produk" action="Lihat Semua" onAction={handleCategorySeeAll}>
            {[
              { name: 'Pomade', count: products.filter(p => p.category === 'Pomade').length, icon: <Package size={14} color="#B98534" /> },
              { name: 'Styling', count: products.filter(p => p.category === 'Styling').length, icon: <Scissors size={14} color="#B98534" /> },
              { name: 'Perawatan', count: products.filter(p => p.category === 'Perawatan').length, icon: <Droplets size={14} color="#B98534" /> },
              { name: 'Hair Tonic', count: products.filter(p => p.category === 'Hair Tonic').length, icon: <FlaskConical size={14} color="#B98534" /> },
              { name: 'Aksesoris', count: products.filter(p => p.category === 'Aksesoris').length, icon: <Brush size={14} color="#B98534" /> },
              { name: 'Lainnya', count: products.filter(p => p.category === 'Lainnya').length, icon: <MoreHorizontal size={14} color="#B98534" /> },
            ].map((category) => (
              <div key={category.name} style={styles.categoryRow}>
                <span style={styles.sideIcon}>{category.icon}</span>
                <strong>{category.name}</strong>
                <b>{category.count}</b>
              </div>
            ))}
          </InfoCard>

          <InfoCard title="Stok Menipis" action="Lihat Semua" onAction={handleLowStockSeeAll}>
            {stokMenipisList.slice(0, 4).map((item) => (
              <div key={item.sku} style={styles.lowStockRow}>
                <span style={styles.productMini}>{item.icon}</span>
                <strong style={styles.stockItemName}>{item.name}</strong>
                <span style={styles.stockSisa}>Sisa {item.stock} unit</span>
                <div style={{ textAlign: 'right' }}><StatusPill status={item.status} small /></div>
              </div>
            ))}
          </InfoCard>

          <InfoCard title="Pergerakan Stok Hari Ini">
            <Movement icon={<ArrowDown size={15} />} color="#2E9D63" label="Produk Masuk" value="24 unit" />
            <Movement icon={<ArrowUp size={15} />} color="#C75B3A" label="Produk Keluar" value="31 unit" />
            <Movement icon={<Tags size={15} />} color="#B98534" label="Penyesuaian" value="2 unit" />
          </InfoCard>

          <InfoCard title="Distribusi Stok per Kategori" action="Lihat Detail" onAction={() => setIsDistribusiModalOpen(true)}>
            <div style={styles.distributionBox}>
              <div style={styles.donut}><strong>{totalStok}</strong><span>Total Unit</span></div>
              <div style={styles.legendList}>
                {[
                  { name: 'Styling', value: '30%', color: '#0F3F31' },
                  { name: 'Perawatan', value: '27%', color: '#C75B3A' },
                  { name: 'Pomade', value: '22%', color: '#C9A84C' },
                  { name: 'Hair Tonic', value: '13%', color: '#BDAE93' },
                  { name: 'Aksesoris', value: '8%', color: '#D8D0C2' },
                ].map((item) => (
                  <div key={item.name} style={styles.legendRow}><span style={{ ...styles.legendDot, background: item.color }} /> <span>{item.name}</span><b>{item.value}</b></div>
                ))}
              </div>
            </div>
          </InfoCard>
        </aside>
      </div>

      {/* Modal Tambah/Edit Produk */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                <p style={styles.modalSubtitle}>Isi form berikut untuk memperbarui data katalog.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={styles.modalClose}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveModal} style={styles.modalForm}>
              <div style={styles.inputGrid}>
                <div>
                  <label style={styles.modalLabel}>SKU Produk</label>
                  <input required value={formData.sku || ''} onChange={e => setFormData({ ...formData, sku: e.target.value })} style={styles.modalInput} placeholder="Misal: POM-001" disabled={!!editingProduct} />
                </div>
                <div>
                  <label style={styles.modalLabel}>Kategori</label>
                  <select value={formData.category || 'Pomade'} onChange={e => setFormData({ ...formData, category: e.target.value })} style={styles.modalInput}>
                    {CATEGORY_LIST.filter(c => c !== 'Semua').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              
              <label style={styles.modalLabel}>Nama Produk</label>
              <input required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} style={styles.modalInput} placeholder="Nama lengkap produk" />
              
              <label style={styles.modalLabel}>Harga Jual (Rp)</label>
              <input required type="number" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} style={styles.modalInput} placeholder="0" />

              <div style={styles.inputGrid}>
                <div>
                  <label style={styles.modalLabel}>Stok Saat Ini</label>
                  <input required type="number" value={formData.stock !== undefined ? formData.stock : ''} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} style={styles.modalInput} placeholder="0" />
                </div>
                <div>
                  <label style={styles.modalLabel}>Min. Stok (Peringatan)</label>
                  <input required type="number" value={formData.minStock !== undefined ? formData.minStock : ''} onChange={e => setFormData({ ...formData, minStock: Number(e.target.value) })} style={styles.modalInput} placeholder="10" />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.modalCancel}>Batal</button>
                <button type="submit" style={styles.modalSave}>Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Distribusi Stok */}
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
              <div style={{
                width: 140, height: 140, borderRadius: '50%', flexShrink: 0,
                background: `radial-gradient(circle at center, #fff 0 62%, transparent 63%), conic-gradient(${
                  distribusiData.map((d, i) => {
                    const start = distribusiData.slice(0, i).reduce((a, b) => a + b.pct, 0);
                    return `${d.color} ${start}% ${start + d.pct}%`;
                  }).join(', ')
                })`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <strong style={{ fontSize: 22, color: '#10281F' }}>{distribusiData.length}</strong>
                <span style={{ fontSize: 10, color: '#6E6A64' }}>Kategori</span>
              </div>
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
    </div>
  );
}

function StatCard({ icon, tone, label, value, note, compact }: { icon: React.ReactNode; tone: 'green' | 'gold' | 'rust'; label: string; value: string; note: string; compact?: boolean }) {
  const iconStyle = tone === 'green' ? styles.statIconGreen : tone === 'gold' ? styles.statIconGold : styles.statIconRust;
  return <div style={styles.statCard}><span style={{ ...styles.statIcon, ...iconStyle }}>{icon}</span><div style={{ minWidth: 0, flex: 1 }}><div style={styles.statLabel}>{label}</div><strong style={{ ...styles.statValue, fontSize: compact ? 16 : 20 }}>{value}</strong><p style={styles.statNote}>{note}</p></div></div>;
}

function SelectFilter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (val: string) => void }) {
  return (
    <div style={styles.filterWrap}>
      <span style={styles.filterLabel}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={styles.filterSelect}>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div style={styles.filterChevron}><ChevronDown size={14} color="#8A8175" /></div>
    </div>
  );
}

function StatusPill({ status, small }: { status: ProductStatus; small?: boolean }) {
  const style = status === 'Kritis' ? styles.statusCritical : status === 'Rendah' ? styles.statusLow : styles.statusSafe;
  return <span style={{ ...styles.statusPill, ...style, ...(small ? styles.statusSmall : {}) }}>{status}</span>;
}

function InfoCard({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: React.ReactNode }) {
  return <section style={styles.infoCard}><div style={styles.infoHeader}><h2 style={styles.infoTitle}>{title}</h2>{action && <button onClick={onAction} style={styles.infoAction}>{action}</button>}</div>{children}</section>;
}

function Movement({ icon, color, label, value }: { icon: React.ReactNode; color: string; label: string; value: string }) {
  return <div style={styles.movementRow}><span style={{ ...styles.movementIcon, background: color }}>{icon}</span><strong>{label}</strong><b style={{ color }}>{value}</b></div>;
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '20px 24px 24px', color: '#142D22' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginBottom: 20 },
  title: { margin: 0, fontFamily: 'var(--font-heading)', fontSize: 30, color: '#123526', fontWeight: 700 },
  subtitle: { margin: '7px 0 0', fontSize: 14, color: '#6E6A64' },
  headerActions: { display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 },
  searchBox: { width: 430, height: 48, background: 'rgba(255,255,255,0.9)', border: '1px solid #E6D8C6', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', boxShadow: '0 8px 22px rgba(85,58,25,0.04)' },
  searchInput: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: 'inherit' },
  addButton: { height: 48, minWidth: 170, borderRadius: 9, background: 'linear-gradient(180deg, #0F4A3A, #0B3A2D)', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 12px 28px rgba(15,63,49,0.22)', cursor: 'pointer' },
  gridShell: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 16, alignItems: 'stretch' },
  mainColumn: { minWidth: 0, display: 'flex', flexDirection: 'column' },
  sideColumn: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14, marginBottom: 18 },
  statCard: { minHeight: 96, background: 'rgba(255,255,255,0.88)', border: '1px solid #E6D8C6', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 28px rgba(85,58,25,0.04)', minWidth: 0 },
  statIcon: { width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statIconGreen: { background: '#0F3F31', color: '#fff' },
  statIconGold: { background: '#F4D9A4', color: '#B97818' },
  statIconRust: { background: '#C75B3A', color: '#fff' },
  statLabel: { fontSize: 11, color: '#6E6A64', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  statValue: { display: 'block', color: '#10281F', fontWeight: 800, letterSpacing: 0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  statNote: { margin: '2px 0 0', fontSize: 10, color: '#777', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 },
  tabs: { display: 'flex', border: '1px solid #E6D8C6', borderRadius: 7, overflow: 'hidden', background: '#fff' },
  tabButton: { height: 40, padding: '0 14px', fontSize: 12, color: '#6E6A64', fontWeight: 700, borderRight: '1px solid #E6D8C6', background: '#fff', whiteSpace: 'nowrap', cursor: 'pointer' },
  tabActive: { background: '#0F3F31', color: '#fff' },
  filters: { display: 'flex', alignItems: 'center', gap: 8 },
  filterWrap: { position: 'relative', height: 40, background: '#fff', border: '1px solid #E6D8C6', borderRadius: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 32px 0 10px' },
  filterLabel: { fontSize: 9, color: '#888', position: 'absolute', top: 4, pointerEvents: 'none' },
  filterSelect: { width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: 12, fontWeight: 700, color: '#10281F', marginTop: 10, appearance: 'none', cursor: 'pointer', fontFamily: 'inherit' },
  filterChevron: { position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  exportButton: { height: 40, padding: '0 14px', border: '1px solid #E6D8C6', borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#10281F', whiteSpace: 'nowrap', fontSize: 12, cursor: 'pointer' },
  tableCard: { background: 'rgba(255,255,255,0.92)', border: '1px solid #E6D8C6', borderRadius: 11, padding: 14, boxShadow: '0 14px 34px rgba(85,58,25,0.04)', flex: 1, display: 'flex', flexDirection: 'column' },
  cardTitle: { fontSize: 15, fontWeight: 800, margin: '2px 0 14px', color: '#10281F' },
  tableWrap: { overflowX: 'auto', flex: 1 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th: { background: '#FBF3E8', padding: '13px 12px', textAlign: 'left', color: '#4E4944', fontWeight: 800, whiteSpace: 'nowrap' },
  td: { padding: '12px', borderBottom: '1px solid #F0E6D8', color: '#10281F', whiteSpace: 'nowrap' },
  tdSku: { padding: '12px', borderBottom: '1px solid #F0E6D8', color: '#10281F', fontWeight: 800, whiteSpace: 'nowrap' },
  tdCenter: { padding: '12px', borderBottom: '1px solid #F0E6D8', color: '#10281F', textAlign: 'center', whiteSpace: 'nowrap' },
  tdProduct: { padding: '10px 12px', borderBottom: '1px solid #F0E6D8', color: '#10281F', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 12 },
  productIcon: { width: 34, height: 34, borderRadius: 8, background: '#F4EFE5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  statusPill: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 58, height: 24, padding: '0 10px', borderRadius: 999, fontSize: 11, fontWeight: 800 },
  statusSmall: { minWidth: 0, height: 22, fontSize: 10 },
  statusCritical: { background: '#FCE8E8', color: '#C9332C' },
  statusLow: { background: '#FDF2E3', color: '#D97706' },
  statusSafe: { background: '#E8F5E9', color: '#2E7D32' },
  actionCell: { padding: '10px 12px', borderBottom: '1px solid #F0E6D8', whiteSpace: 'nowrap' },
  editBtn: { height: 28, padding: '0 14px', border: '1px solid #E6D8C6', borderRadius: 6, color: '#8A4A23', fontWeight: 800, background: '#fff', cursor: 'pointer' },
  moreBtn: { width: 28, height: 28, color: '#B98534', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle', marginLeft: 6, cursor: 'pointer', background: 'transparent', border: 'none' },
  tableFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 8px 4px', color: '#777', fontSize: 12 },
  pagination: { display: 'flex', alignItems: 'center', gap: 8 },
  pageButton: { width: 39, height: 39, border: '1px solid #E6D8C6', borderRadius: 7, background: '#fff', color: '#10281F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, cursor: 'pointer' },
  pageButtonActive: { background: '#0F3F31', color: '#fff' },
  pageDots: { color: '#777', padding: '0 4px', fontSize: 12, fontWeight: 600 },
  infoCard: { background: 'rgba(255,255,255,0.92)', border: '1px solid #E6D8C6', borderRadius: 11, padding: 16, boxShadow: '0 10px 28px rgba(85,58,25,0.04)' },
  infoHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryRow: { display: 'grid', gridTemplateColumns: '26px 1fr 32px', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid #F0E6D8', fontSize: 11 },
  sideIcon: { width: 22, height: 22, borderRadius: '50%', background: '#FFF1DA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 },
  lowStockRow: { display: 'grid', gridTemplateColumns: '30px 1fr auto auto', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F0E6D8', fontSize: 11 },
  productMini: { width: 28, height: 28, borderRadius: 7, background: '#F4EFE5', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stockItemName: { fontWeight: 800, color: '#10281F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  stockSisa: { color: '#6E6A64', whiteSpace: 'nowrap' },
  movementRow: { display: 'grid', gridTemplateColumns: '30px 1fr 58px', alignItems: 'center', gap: 10, padding: '9px 0', fontSize: 12 },
  movementIcon: { width: 28, height: 28, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  distributionBox: { display: 'flex', gap: 14, alignItems: 'center' },
  infoTitle: { fontSize: 14, fontWeight: 800, color: '#10281F', margin: 0 },
  infoAction: { color: '#C75B3A', fontSize: 11, fontWeight: 800, background: 'transparent', border: 'none', cursor: 'pointer' },
  donut: { width: 96, height: 96, borderRadius: '50%', background: 'radial-gradient(circle at center, #fff 0 62%, transparent 63%), conic-gradient(#0F3F31 0 30%, #C75B3A 30% 57%, #C9A84C 57% 79%, #BDAE93 79% 92%, #D8D0C2 92% 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#10281F', position: 'relative', flexShrink: 0 },
  legendList: { flex: 1, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 10 },
  legendRow: { display: 'grid', gridTemplateColumns: '9px 1fr auto', gap: 6, alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: '50%' },

  // Modal Styles
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(15, 31, 24, 0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 },
  modalCard: { width: '100%', maxWidth: 500, background: '#fff', borderRadius: 16, border: '1px solid #E7DCCB', boxShadow: '0 24px 80px rgba(15,31,24,0.28)', padding: 26 },
  modalHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 },
  modalTitle: { margin: 0, fontSize: 20, color: '#1A3325', fontFamily: 'var(--font-heading)' },
  modalSubtitle: { margin: '5px 0 0', fontSize: 13, color: '#777', lineHeight: 1.5 },
  modalClose: { width: 34, height: 34, borderRadius: 999, background: '#F8F4EE', color: '#1A3325', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' },
  modalForm: { display: 'flex', flexDirection: 'column', gap: 12 },
  inputGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  modalLabel: { fontSize: 12, fontWeight: 800, color: '#333', marginBottom: 6, display: 'block' },
  modalInput: { width: '100%', height: 44, border: '1px solid #E7DCCB', borderRadius: 8, padding: '0 14px', fontSize: 13, outline: 'none', fontFamily: 'inherit', color: '#1A3325', background: '#fff', boxSizing: 'border-box' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid #F0E6D8' },
  modalCancel: { height: 42, padding: '0 18px', borderRadius: 8, border: '1px solid #E7DCCB', color: '#555', background: '#fff', fontWeight: 800, cursor: 'pointer' },
  modalSave: { height: 42, padding: '0 20px', borderRadius: 8, border: 'none', color: '#fff', background: '#0F3F31', fontWeight: 800, cursor: 'pointer' },

  // Dropdown styles
  dropdownMenu: {
    position: 'absolute', right: 0, top: '100%', zIndex: 50,
    background: '#fff', border: '1px solid #E6D8C6', borderRadius: 8,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 140, padding: 4,
    marginTop: 4,
  } as React.CSSProperties,
  dropdownItem: {
    display: 'block', width: '100%', padding: '8px 14px',
    border: 'none', background: 'transparent', textAlign: 'left',
    fontSize: 12, fontWeight: 600, color: '#333', borderRadius: 5,
    cursor: 'pointer',
  } as React.CSSProperties,
};
