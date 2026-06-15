// ─── POS Cart Summary Component ─────────────────────────────────────────────

import React from 'react';
import { X, Minus, Plus, Scissors, ShoppingBag } from 'lucide-react';
import { usePosStoreContext } from '../state/PosStoreContext';
import { formatRupiah } from '../../../utils/format';

export function PosCartSummary() {
  const {
    state,
    updateQty,
    removeFromCart,
    setNote,
    setDiscount,
    subtotal,
    safeDiscount,
    total,
    isCartEmpty,
  } = usePosStoreContext();
  
  if (isCartEmpty) {
    return (
      <div style={styles.summaryCard}>
        <h2 style={styles.sectionTitle}>Ringkasan Transaksi</h2>
        <div style={styles.emptyCart}>
          <ShoppingBag size={48} color="#CCC" />
          <p style={styles.emptyText}>Keranjang kosong</p>
          <p style={styles.hintText}>Pilih item di sebelah kiri untuk menambahkan ke keranjang</p>
        </div>
      </div>
    );
  }
  
  return (
    <div style={styles.summaryCard}>
      <h2 style={styles.sectionTitle}>Ringkasan Transaksi</h2>
      <div style={styles.cartList}>
        {state.cart.map((item) => (
          <div key={item.id} style={styles.cartItem}>
            <span style={styles.cartIcon}>{item.kind === 'Layanan' ? <Scissors size={15} /> : <ShoppingBag size={15} />}</span>
            <div style={styles.cartName}>{item.name}</div>
            <div style={styles.qtyControl}>
              <button onClick={() => updateQty(item.id, -1)} style={styles.qtyBtn}>
                <Minus size={12} />
              </button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.id, 1)} style={styles.qtyBtn}>
                <Plus size={12} />
              </button>
            </div>
            <strong style={styles.cartPrice}>{formatRupiah(item.price * item.qty)}</strong>
            <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>
              <X size={15} />
            </button>
          </div>
        ))}
      </div>

      <label style={styles.noteLabel}>Catatan transaksi (opsional)</label>
      <textarea
        style={styles.noteArea}
        placeholder="Tulis catatan untuk transaksi ini..."
        value={state.note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div style={styles.discountRow}>
        <span>Diskon</span>
        <div style={styles.discountInputWrap}>
          <span>Rp</span>
          <input 
            value={state.discount || ''} 
            onChange={(e) => setDiscount(Number(e.target.value.replace(/\D/g, '')))}
            style={styles.discountInput} 
            placeholder="0" 
          />
        </div>
      </div>

      <div style={styles.totalBox}>
        <SummaryLine label="Subtotal" value={formatRupiah(subtotal)} />
        <SummaryLine label="Diskon" value={`- ${formatRupiah(safeDiscount)}`} />
        <SummaryLine label="Pajak (0%)" value="Rp 0" />
        <div style={styles.grandTotal}>
          <span>Total</span>
          <strong>{formatRupiah(total)}</strong>
        </div>
      </div>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return <div style={styles.summaryLine}><span>{label}</span><span>{value}</span></div>;
}

const styles: Record<string, React.CSSProperties> = {
  summaryCard: {
    background: '#fff',
    border: '1px solid #E7DCCB',
    borderRadius: 12,
    padding: 14,
    minWidth: 0,
    position: 'sticky',
    top: 12,
  },
  sectionTitle: {
    margin: '0 0 12px',
    fontSize: 15,
    fontWeight: 800,
    color: '#1A3325',
  },
  emptyCart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 700,
    color: '#888',
  },
  hintText: {
    fontSize: 12,
    color: '#AAA',
  },
  cartList: {
    border: '1px solid #F0E4D6',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cartItem: {
    minHeight: 52,
    display: 'grid',
    gridTemplateColumns: '34px minmax(0,1fr) 76px 92px 24px',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    borderBottom: '1px solid #F0E8DC',
  },
  cartIcon: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: '#F5EDD6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartName: {
    fontSize: 12,
    fontWeight: 700,
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  qtyControl: {
    height: 28,
    border: '1px solid #E7DCCB',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    fontSize: 12,
  },
  qtyBtn: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  cartPrice: {
    fontSize: 12,
    textAlign: 'right',
    color: '#111',
  },
  removeBtn: {
    border: 'none',
    background: 'transparent',
    color: '#888',
    cursor: 'pointer',
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#333',
    display: 'block',
    marginBottom: 6,
  },
  noteArea: {
    width: '100%',
    minHeight: 48,
    border: '1px solid #E7DCCB',
    borderRadius: 8,
    padding: 10,
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    marginBottom: 10,
  },
  discountRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    fontSize: 12,
    marginBottom: 10,
  },
  discountInputWrap: {
    height: 34,
    width: 155,
    border: '1px solid #E7DCCB',
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    padding: '0 9px',
    gap: 6,
    color: '#888',
  },
  discountInput: {
    flex: 1,
    minWidth: 0,
    border: 'none',
    outline: 'none',
    textAlign: 'right',
  },
  totalBox: {
    borderTop: '1px solid #F0E8DC',
    borderBottom: '1px solid #F0E8DC',
    padding: '10px 0',
    marginBottom: 12,
  },
  summaryLine: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12,
    color: '#333',
    marginBottom: 7,
  },
  grandTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#FBF3E8',
    color: '#1A3325',
    padding: '8px 6px',
    fontSize: 14,
    fontWeight: 800,
  },
};
