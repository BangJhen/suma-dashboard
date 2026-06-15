// ─── POS Payment Panel Component ────────────────────────────────────────────

import React from 'react';
import {
  Wallet,
  QrCode,
  CreditCard,
  Landmark,
  Save,
  Play,
} from 'lucide-react';
import { usePosStoreContext } from '../state/PosStoreContext';
import { formatRupiah } from '../../../utils/format';

const PAYMENT_METHODS = [
  { key: 'Cash', icon: <Wallet size={14} /> },
  { key: 'QRIS', icon: <QrCode size={14} /> },
  { key: 'Debit/Credit', icon: <CreditCard size={14} /> },
  { key: 'Transfer', icon: <Landmark size={14} /> },
];

export function PosPaymentPanel() {
  const {
    state,
    setPaymentMethod,
    setCashReceived,
    openQrModal,
    openPaymentModal,
    saveAsOpen,
    completePayment,
    resetTransaction,
    subtotal,
    safeDiscount,
    total,
    cashChange,
    isPaymentValid,
    isCartEmpty,
  } = usePosStoreContext();
  
  const handleSelectPayment = (method: string) => {
    setPaymentMethod(method as any);
    if (method === 'Debit/Credit' || method === 'Transfer') {
      openPaymentModal();
    }
  };
  
  const handleCashReceived = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCashReceived(Number(value));
  };
  
  const handleCompletePayment = () => {
    completePayment();
  };
  
  const handleSaveAsOpen = () => {
    saveAsOpen();
  };
  
  const isPayButtonDisabled = isCartEmpty || !isPaymentValid;
  const isSaveButtonDisabled = isCartEmpty;
  
  return (
    <div style={styles.summaryCard}>
      <h2 style={styles.sectionTitle}>Ringkasan Transaksi</h2>
      <div style={styles.totalDisplay}>
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

      <h3 style={styles.paymentTitle}>Metode Pembayaran</h3>
      <div style={styles.paymentGrid}>
        {PAYMENT_METHODS.map((method) => (
          <button 
            key={method.key} 
            onClick={() => handleSelectPayment(method.key)} 
            style={{ ...styles.paymentBtn, ...(state.paymentMethod === method.key ? styles.paymentActive : {}) }}
          >
            {method.icon}
            {method.key}
          </button>
        ))}
      </div>

      {state.paymentMethod === 'Cash' && (
        <div style={styles.cashBox}>
          <div>
            <strong>Cash</strong>
            <p>Input uang diterima untuk menghitung kembalian pelanggan.</p>
          </div>
          <div style={styles.cashInputWrap}>
            <span>Rp</span>
            <input 
              value={state.cashReceived || ''} 
              onChange={handleCashReceived} 
              style={styles.cashInput} 
              placeholder="0" 
            />
          </div>
          <div style={styles.changeRow}>
            <span>Kembalian</span>
            <strong>{formatRupiah(cashChange)}</strong>
          </div>
        </div>
      )}

      {state.paymentMethod === 'QRIS' && (
        <div style={styles.qrisBox}>
          <QrCode size={38} color="#1A3325" />
          <div style={{ flex: 1 }}>
            <strong>QRIS</strong>
            <p>Tunjukkan kode QR ke pelanggan atau minta scan dari aplikasi e-wallet.</p>
          </div>
          <button style={styles.qrButton} onClick={openQrModal}>
            Tampilkan QR
          </button>
        </div>
      )}

      {state.paymentMethod === 'Debit/Credit' && (
        <div style={styles.paymentSummaryBox}>
          <CreditCard size={20} color="#1A3325" />
          <div style={{ flex: 1 }}>
            <strong>Debit/Credit</strong>
            <p>
              {state.paymentDetails?.cardType} {state.paymentDetails?.bank}
              {state.paymentDetails?.approvalCode ? ` • Ref: ${state.paymentDetails.approvalCode}` : ''}
            </p>
          </div>
          <button onClick={openPaymentModal} style={styles.editPaymentBtn}>
            Detail
          </button>
        </div>
      )}

      {state.paymentMethod === 'Transfer' && (
        <div style={styles.paymentSummaryBox}>
          <Landmark size={20} color="#1A3325" />
          <div style={{ flex: 1 }}>
            <strong>Transfer</strong>
            <p>
              {state.paymentDetails?.bank} • {state.paymentDetails?.accountName}
              {state.paymentDetails?.referenceNumber ? ` • Ref: ${state.paymentDetails.referenceNumber}` : ''}
            </p>
          </div>
          <button onClick={openPaymentModal} style={styles.editPaymentBtn}>
            Detail
          </button>
        </div>
      )}

      <button 
        style={styles.payButton} 
        onClick={handleCompletePayment}
        disabled={isPayButtonDisabled}
      >
        Selesaikan Pembayaran
      </button>
      <button 
        style={styles.saveButton} 
        onClick={handleSaveAsOpen}
        disabled={isSaveButtonDisabled}
      >
        <Save size={15} /> Simpan sebagai Open
      </button>
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
  totalDisplay: {
    background: '#fff',
    border: '1px solid #F0E4D6',
    borderRadius: 8,
    marginBottom: 12,
  },
  totalBox: {
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
  paymentTitle: {
    fontSize: 12,
    margin: '0 0 8px',
    color: '#333',
  },
  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 8,
    marginBottom: 12,
  },
  paymentBtn: {
    minHeight: 42,
    border: '1px solid #E7DCCB',
    borderRadius: 9,
    background: '#fff',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  paymentActive: {
    background: '#0F3F31',
    color: '#fff',
    borderColor: '#0F3F31',
  },
  cashBox: {
    display: 'grid',
    gridTemplateColumns: '1fr 150px',
    gap: 12,
    alignItems: 'center',
    background: '#FFF9EE',
    border: '1px solid #EBD9BE',
    borderRadius: 9,
    padding: 12,
    marginBottom: 10,
  },
  cashInputWrap: {
    height: 38,
    border: '1px solid #E7DCCB',
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    padding: '0 9px',
    gap: 6,
    color: '#888',
    background: '#fff',
  },
  cashInput: {
    flex: 1,
    minWidth: 0,
    border: 'none',
    outline: 'none',
    textAlign: 'right',
    fontWeight: 800,
    fontFamily: 'inherit',
  },
  changeRow: {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #F0E4D6',
    paddingTop: 8,
    fontSize: 12,
    color: '#1A3325',
  },
  qrisBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#EFF8EF',
    border: '1px solid #CFE7D3',
    borderRadius: 9,
    padding: 12,
    marginBottom: 10,
  },
  qrButton: {
    border: '1px solid #0F3F31',
    color: '#0F3F31',
    background: '#fff',
    borderRadius: 7,
    padding: '8px 10px',
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  paymentSummaryBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#EFF8EF',
    border: '1px solid #CFE7D3',
    borderRadius: 9,
    padding: 12,
    marginBottom: 10,
  },
  editPaymentBtn: {
    border: '1px solid #0F3F31',
    color: '#0F3F31',
    background: '#fff',
    borderRadius: 7,
    padding: '8px 12px',
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  payButton: {
    width: '100%',
    height: 44,
    border: 'none',
    borderRadius: 8,
    background: '#0F3F31',
    color: '#fff',
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
    marginBottom: 8,
  },
  saveButton: {
    width: '100%',
    height: 40,
    border: '1px solid #C75B3A',
    borderRadius: 8,
    background: '#fff',
    color: '#C75B3A',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  validationMessage: {
    marginTop: 10,
    padding: 10,
    background: '#FFEBEE',
    border: '1px solid #F44336',
    borderRadius: 6,
    color: '#C62828',
    fontSize: 12,
  },
};
