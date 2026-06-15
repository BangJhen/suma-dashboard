// ─── POS Page - Main Container Component ─────────────────────────────────────

import React from 'react';
import { PosStoreProvider } from '../state/PosStoreContext';
import { PosHeader } from '../components/PosHeader';
import { PosMetaBar } from '../components/PosMetaBar';
import { PosCatalog } from '../components/PosCatalog';
import { PosOpenTransactions } from '../components/PosOpenTransactions';
import { PosCartSummary } from '../components/PosCartSummary';
import { PosPaymentPanel } from '../components/PosPaymentPanel';
import { PosCustomerModal } from '../components/PosCustomerModal';
import { PosManualItemModal } from '../components/PosManualItemModal';
import { PosQrModal } from '../components/PosQrModal';
import { PosPaymentSuccessModal } from '../components/PosPaymentSuccessModal';
import { PosPaymentDetailsModal } from '../components/PosPaymentDetailsModal';

export default function PosPage() {
  return (
    <PosStoreProvider>
      <div style={styles.page}>
        <PosHeader />
        <PosMetaBar />
        
        <div style={styles.contentGrid}>
          <section style={styles.leftColumn}>
            <PosCatalog />
            <PosOpenTransactions />
          </section>

          <aside style={styles.summaryCard}>
            <PosCartSummary />
            <PosPaymentPanel />
          </aside>
        </div>

        {/* Modals */}
        <PosCustomerModal />
        <PosManualItemModal />
        <PosQrModal />
        <PosPaymentSuccessModal />
        <PosPaymentDetailsModal />
      </div>
    </PosStoreProvider>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '18px 24px 24px', background: 'transparent', minHeight: '100%', color: '#1A3325' },
  contentGrid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 390px', gap: 14, alignItems: 'start' },
  leftColumn: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
  summaryCard: { position: 'sticky', top: 12 },
};
