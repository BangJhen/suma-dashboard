# POS Modular Service Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor halaman Transaksi/POS menjadi modul lengkap, interaktif, dan siap integrasi database/service melalui dummy service layer.

**Architecture:** `PosPage.tsx` menjadi container layout saja. State transaksi, customer, cart, payment, open transaction, dan modal dipusatkan di `usePosStore`; data akses lewat `posService` agar nanti mudah diganti ke Supabase/API tanpa bongkar UI besar.

**Tech Stack:** React, TypeScript, inline React CSSProperties, lucide-react, Vite.

---

## File Structure

- Create `src/features/pos/types/posTypes.ts` — domain type POS.
- Create `src/features/pos/services/posService.ts` — dummy service layer untuk catalog/customer/open transaction/complete transaction.
- Create `src/features/pos/state/usePosStore.ts` — hook state dan action POS.
- Create `src/features/pos/components/PosHeader.tsx` — header, customer search, tombol pelanggan baru.
- Create `src/features/pos/components/PosMetaBar.tsx` — metadata transaksi.
- Create `src/features/pos/components/PosCatalog.tsx` — tab layanan/produk, search, filter, grid/list, add item.
- Create `src/features/pos/components/PosOpenTransactions.tsx` — tabel transaksi open dan action lanjutkan.
- Create `src/features/pos/components/PosCartSummary.tsx` — cart, qty, catatan, diskon, total.
- Create `src/features/pos/components/PosPaymentPanel.tsx` — metode pembayaran, validasi, cash/QRIS/card/transfer summary.
- Create `src/features/pos/components/PosCustomerModal.tsx` — tambah pelanggan baru.
- Create `src/features/pos/components/PosManualItemModal.tsx` — tambah item manual.
- Create `src/features/pos/components/PosQrModal.tsx` — modal QRIS dummy.
- Create `src/features/pos/components/PosPaymentSuccessModal.tsx` — success modal setelah pembayaran.
- Rewrite `src/features/pos/pages/PosPage.tsx` — compose semua komponen.

---

### Task 1: Domain Types and Dummy Service

**Files:**
- Create: `src/features/pos/types/posTypes.ts`
- Create: `src/features/pos/services/posService.ts`

- [ ] **Step 1: Create POS domain types**

Define `PosCategory`, `PosCatalogItem`, `PosCartItem`, `PosCustomer`, `PosPaymentMethod`, `PosPaymentDetails`, `PosOpenTransaction`, and `CompletedTransaction`.

- [ ] **Step 2: Create dummy service implementation**

Implement catalog, customer, open transaction seeds and async-like functions:
`getCatalogItems`, `getCustomers`, `getOpenTransactions`, `createCustomer`, `saveOpenTransaction`, `completeTransaction`.

- [ ] **Step 3: Verify TypeScript**

Run: `npm run build`

Expected: TypeScript compiles or only errors related to later missing imports if task is executed partially.

---

### Task 2: Central POS Store

**Files:**
- Create: `src/features/pos/state/usePosStore.ts`

- [ ] **Step 1: Build `usePosStore` hook**

State includes catalog, customers, selectedCustomerId, active tab/filter/search/view mode, cart, note, discount, payment method/details, modal flags, validation message, open transactions, and success transaction.

- [ ] **Step 2: Add actions**

Implement `addToCart`, `removeFromCart`, `updateQty`, `setDiscount`, `setNote`, `addManualItem`, `createCustomer`, `saveAsOpen`, `resumeOpenTransaction`, `completePayment`, `resetTransaction`, `selectPayment`, `open/close modal` actions.

- [ ] **Step 3: Add derived values**

Return `visibleCatalogItems`, `subtotal`, `safeDiscount`, `total`, `cashChange`, `selectedCustomer`, and validation helper output.

- [ ] **Step 4: Verify TypeScript**

Run: `npm run build`.

Expected: store compiles before UI integration.

---

### Task 3: Split Presentational Components

**Files:**
- Create all files under `src/features/pos/components/`

- [ ] **Step 1: Implement header and meta components**

`PosHeader` handles customer search and add customer button. `PosMetaBar` renders transaction number, status, cashier, time, and selected customer selector.

- [ ] **Step 2: Implement catalog component**

`PosCatalog` renders tabs, filters, search, grid/list toggle, item cards/list rows, and manual item button.

- [ ] **Step 3: Implement cart and payment components**

`PosCartSummary` renders cart, qty controls, note, discount, subtotal, total. `PosPaymentPanel` renders payment methods, payment specific panel, and primary actions.

- [ ] **Step 4: Implement open transaction and modal components**

`PosOpenTransactions`, `PosCustomerModal`, `PosManualItemModal`, `PosQrModal`, `PosPaymentSuccessModal`.

---

### Task 4: Compose New POS Page

**Files:**
- Rewrite: `src/features/pos/pages/PosPage.tsx`

- [ ] **Step 1: Replace monolithic page with composed layout**

Import `usePosStore` and component files. Keep existing desktop layout: header, meta grid, left catalog/open transactions, right sticky summary/payment.

- [ ] **Step 2: Wire all handlers**

Pass store state/actions into each component so every interactive button updates state or opens a modal.

- [ ] **Step 3: Preserve visual theme**

Use green/cream/gold/rust palette, clean icons, consistent button states, and no colorful emoji.

---

### Task 5: Functional Verification

**Files:**
- Modify as needed: POS files only.

- [ ] **Step 1: Run build**

Run: `npm run build`.

Expected: build exits successfully.

- [ ] **Step 2: Manual POS flow checklist**

Verify:
- Customer search changes visible/selectable customers.
- New customer modal creates and selects a customer.
- Catalog search/filter/tab works.
- Grid/List toggle changes catalog presentation.
- Add item/manual item adds to cart.
- Qty +/- and remove work.
- Discount clamps to subtotal.
- Save as open adds an open transaction and clears active cart.
- Resume open transaction loads cart and customer.
- QRIS shows QR modal.
- Cash validates insufficient received amount.
- Complete payment shows success modal and resets transaction on close.

---

## Self Review

- Spec coverage: Covers modularization, service abstraction, all interactive POS buttons, and design polish.
- Placeholder scan: No TBD/TODO placeholders.
- Type consistency: Types are centralized in `posTypes.ts`; store actions drive all components.
