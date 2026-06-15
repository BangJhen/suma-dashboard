// ─── POS Catalog Component ──────────────────────────────────────────────────

import React from 'react';
import { Grid3X3, List, Scissors, ShoppingBag, Package, Droplets, Sparkles, Palette, Search } from 'lucide-react';
import { usePosStoreContext } from '../state/PosStoreContext';
import { formatRupiah } from '../../../utils/format';

export function PosCatalog() {
  const {
    state,
    setTab,
    setFilter,
    setQuery,
    setViewMode,
    addToCart,
    openManualItemModal,
    catalogItems,
    categories,
    visibleCatalogItems,
    isCatalogLoading,
  } = usePosStoreContext();
  
  const FILTERS = ['Semua', ...categories];
  
  if (isCatalogLoading) {
    return (
      <div style={styles.catalogCard}>
        <div style={styles.loading}>Loading catalog...</div>
      </div>
    );
  }
  
  return (
    <div style={styles.catalogCard}>
      <div style={styles.tabsRow}>
        <div>
          <button 
            onClick={() => setTab('Layanan')} 
            style={{ ...styles.tabButton, ...(state.tab === 'Layanan' ? styles.tabActive : {}) }}
          >
            Layanan
          </button>
          <button 
            onClick={() => setTab('Produk')} 
            style={{ ...styles.tabButton, ...(state.tab === 'Produk' ? styles.tabActive : {}) }}
          >
            Produk
          </button>
        </div>
        <div style={styles.viewButtons}>
          <button 
            style={{ ...styles.iconBtn, ...(state.viewMode === 'grid' ? styles.iconBtnActive : {}) }}
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 size={15} />
          </button>
          <button 
            style={{ ...styles.iconBtnMuted, ...(state.viewMode === 'list' ? styles.iconBtnActive : {}) }}
            onClick={() => setViewMode('list')}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      <div style={styles.catalogSearch}>
        <Search size={16} color="#777" />
        <input 
          value={state.query} 
          onChange={(e) => setQuery(e.target.value)} 
          style={styles.catalogSearchInput} 
          placeholder="Cari layanan atau produk" 
        />
      </div>

      <div style={styles.filterRow}>
        {FILTERS.map((item) => (
          <button 
            key={item} 
            onClick={() => setFilter(item)} 
            style={{ ...styles.filterBtn, ...(state.filter === item ? styles.filterActive : {}) }}
          >
            {item}
          </button>
        ))}
      </div>

      <div style={state.viewMode === 'grid' ? styles.itemGrid : styles.itemList}>
        {visibleCatalogItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => addToCart(item)}
            style={{ 
              ...styles.itemCard, 
              ...(state.cart.some((cartItem) => cartItem.id === item.id) ? styles.itemSelected : {}) 
            }}
          >
            {state.cart.some((cartItem) => cartItem.id === item.id) && (
              <span style={styles.checkMark}>✓</span>
            )}
            <span style={styles.itemIcon}>
              {renderIcon(item.group)}
            </span>
            <span style={styles.itemInfo}>
              <strong style={styles.itemName}>{item.name}</strong>
              <span style={styles.itemKind}>{item.group}</span>
              <b style={styles.itemPrice}>{formatRupiah(item.price)}</b>
            </span>
          </button>
        ))}
        <button style={styles.manualCard} onClick={openManualItemModal}>
          <span style={{ fontSize: 20, color: '#888', display: 'block', marginBottom: 4 }}>+</span>
          Tambah Produk Manual
        </button>
      </div>
    </div>
  );
}

function renderIcon(group: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    'Haircut': <Scissors size={25} strokeWidth={1.9} />,
    'Treatment': <Droplets size={25} strokeWidth={1.9} />,
    'Shaving': <Sparkles size={25} strokeWidth={1.9} />,
    'Coloring': <Palette size={25} strokeWidth={1.9} />,
    'Retail': <Package size={25} strokeWidth={1.9} />,
    'Manual': <Sparkles size={25} strokeWidth={1.9} />,
  };
  return iconMap[group] || <Package size={25} strokeWidth={1.9} />;
}

const styles: Record<string, React.CSSProperties> = {
  catalogCard: {
    background: '#fff',
    border: '1px solid #E7DCCB',
    borderRadius: 12,
    padding: 14,
  },
  tabsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tabButton: {
    minWidth: 94,
    height: 34,
    border: '1px solid #E7DCCB',
    background: '#fff',
    color: '#666',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    borderRadius: 7,
  },
  tabActive: {
    background: '#0F3F31',
    color: '#fff',
    borderColor: '#0F3F31',
  },
  viewButtons: {
    display: 'flex',
    gap: 0,
  },
  iconBtn: {
    width: 38,
    height: 34,
    border: '1px solid #1A3325',
    color: '#1A3325',
    background: '#fff',
    borderRadius: '7px 0 0 7px',
    cursor: 'pointer',
  },
  iconBtnActive: {
    background: '#1A3325',
    color: '#fff',
  },
  iconBtnMuted: {
    width: 38,
    height: 34,
    border: '1px solid #E7DCCB',
    color: '#444',
    background: '#fff',
    borderRadius: '0 7px 7px 0',
    cursor: 'pointer',
  },
  catalogSearch: {
    height: 38,
    border: '1px solid #E7DCCB',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 10px',
    marginBottom: 12,
  },
  catalogSearchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: 13,
  },
  filterRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  filterBtn: {
    height: 31,
    padding: '0 18px',
    border: '1px solid #E7DCCB',
    borderRadius: 6,
    background: '#fff',
    color: '#333',
    cursor: 'pointer',
    fontSize: 12,
  },
  filterActive: {
    background: '#0F3F31',
    color: '#fff',
    borderColor: '#0F3F31',
  },
  itemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  itemCard: {
    minHeight: 100,
    position: 'relative',
    border: '1px solid #E7DCCB',
    background: '#fff',
    borderRadius: 10,
    padding: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textAlign: 'left',
    cursor: 'pointer',
  },
  itemSelected: {
    borderColor: '#0F3F31',
    background: '#F7FBF7',
    boxShadow: '0 0 0 1px rgba(15,63,49,0.08)',
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#0F3F31',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 800,
  },
  itemIcon: {
    width: 58,
    height: 58,
    borderRadius: '50%',
    background: '#F8F4EE',
    border: '1px solid #E7DCCB',
    color: '#1A3325',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    minWidth: 0,
  },
  itemName: {
    fontSize: 13,
    color: '#1A3325',
    lineHeight: 1.2,
  },
  itemKind: {
    fontSize: 11,
    color: '#777',
  },
  itemPrice: {
    fontSize: 13,
    color: '#111',
  },
  manualCard: {
    minHeight: 100,
    border: '1px dashed #DDBB95',
    background: '#FFFCF7',
    borderRadius: 10,
    color: '#777',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
  },
  loading: {
    padding: 20,
    textAlign: 'center',
    color: '#777',
  },
};
