import React, { useState } from 'react';
import {
  ArrowRight,
  Banknote,
  Building2,
  ChevronRight,
  CreditCard,
  DatabaseBackup,
  Download,
  FileSpreadsheet,
  Globe2,
  Landmark,
  Lock,
  MapPin,
  Palette,
  Printer,
  QrCode,
  RefreshCcw,
  Save,
  Settings,
  ShieldCheck,
  Store,
  Upload,
} from 'lucide-react';

type SettingsTab = 'Profil Usaha' | 'Cabang' | 'Pembayaran' | 'Layanan & Produk' | 'Struk & Printer' | 'Keamanan';
type PaymentKey = 'cash' | 'qris' | 'debit' | 'transfer';
type ThemeColor = 'cream' | 'green' | 'bronze';
type ReceiptSize = '58mm' | '80mm';

interface BusinessInfo {
  namaUsaha: string;
  namaCabang: string;
  email: string;
  telepon: string;
  alamat: string;
}

interface OperationalSettings {
  defaultStatus: string;
  pajakDefault: string;
  autoInvoice: boolean;
  multiItem: boolean;
  defaultCustomer: boolean;
  minStockAlert: number;
}

interface PrinterSettings {
  size: ReceiptSize;
  autoPrint: boolean;
  header: string;
  footer: string;
}

interface OperatingHour {
  day: string;
  open: string;
  close: string;
}

const SETTINGS_TABS: Array<{ label: SettingsTab; icon: React.ReactNode }> = [
  { label: 'Profil Usaha', icon: <Store size={18} /> },
  { label: 'Cabang', icon: <Building2 size={18} /> },
  { label: 'Pembayaran', icon: <CreditCard size={18} /> },
  { label: 'Layanan & Produk', icon: <Globe2 size={18} /> },
  { label: 'Struk & Printer', icon: <Printer size={18} /> },
  { label: 'Keamanan', icon: <ShieldCheck size={18} /> },
];

const TIME_OPTIONS = ['07:00', '08:00', '09:00', '10:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  namaUsaha: 'Suma Barbershop',
  namaCabang: 'Cabang Utama',
  email: 'owner@suma.com',
  telepon: '0812-3456-7890',
  alamat: 'Jl. Merdeka No. 45, Kel. Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40115',
};

const DEFAULT_OPERATIONAL: OperationalSettings = {
  defaultStatus: 'Open',
  pajakDefault: '0%',
  autoInvoice: true,
  multiItem: true,
  defaultCustomer: true,
  minStockAlert: 5,
};

const DEFAULT_PAYMENTS: Record<PaymentKey, boolean> = {
  cash: true,
  qris: true,
  debit: true,
  transfer: true,
};

const DEFAULT_PRINTER: PrinterSettings = {
  size: '80mm',
  autoPrint: true,
  header: 'Terima kasih telah berkunjung',
  footer: 'Suma Barbershop',
};

const DEFAULT_HOURS: OperatingHour[] = [
  { day: 'Senin', open: '09:00', close: '21:00' },
  { day: 'Selasa', open: '09:00', close: '21:00' },
  { day: 'Rabu', open: '09:00', close: '21:00' },
  { day: 'Kamis', open: '09:00', close: '21:00' },
  { day: 'Jumat', open: '09:00', close: '21:00' },
  { day: 'Sabtu', open: '08:00', close: '22:00' },
  { day: 'Minggu', open: '10:00', close: '20:00' },
];

const PAYMENT_METHODS: Array<{ key: PaymentKey; label: string; caption: string; icon: React.ReactNode }> = [
  { key: 'cash', label: 'Cash', caption: 'Tunai kasir', icon: <Banknote size={18} /> },
  { key: 'qris', label: 'QRIS', caption: 'QR pembayaran', icon: <QrCode size={18} /> },
  { key: 'debit', label: 'Debit/Credit', caption: 'EDC bank', icon: <CreditCard size={18} /> },
  { key: 'transfer', label: 'Transfer', caption: 'Antar rekening', icon: <Landmark size={18} /> },
];

const ACTIVITY_LOGS = [
  { icon: <Settings size={16} />, title: 'Mengubah informasi alamat usaha', time: '14 Jun 2025, 13:58', actor: 'Owner S' },
  { icon: <Printer size={16} />, title: 'Memperbarui footer struk printer', time: '14 Jun 2025, 11:22', actor: 'Kasir Nadia' },
  { icon: <Lock size={16} />, title: 'Mengaktifkan sesi login baru', time: '13 Jun 2025, 20:15', actor: 'Owner S' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Profil Usaha');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(DEFAULT_BUSINESS_INFO);
  const [operational, setOperational] = useState<OperationalSettings>(DEFAULT_OPERATIONAL);
  const [payments, setPayments] = useState<Record<PaymentKey, boolean>>(DEFAULT_PAYMENTS);
  const [printer, setPrinter] = useState<PrinterSettings>(DEFAULT_PRINTER);
  const [themeColor, setThemeColor] = useState<ThemeColor>('green');
  const [operatingHours, setOperatingHours] = useState<OperatingHour[]>(DEFAULT_HOURS);
  const [lastAction, setLastAction] = useState('Semua pengaturan tersinkron di perangkat ini.');

  const handleBusinessChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo((current) => ({ ...current, [field]: value }));
  };

  const handleOperationalChange = <Key extends keyof OperationalSettings>(field: Key, value: OperationalSettings[Key]) => {
    setOperational((current) => ({ ...current, [field]: value }));
  };

  const handlePrinterChange = <Key extends keyof PrinterSettings>(field: Key, value: PrinterSettings[Key]) => {
    setPrinter((current) => ({ ...current, [field]: value }));
  };

  const handleHourChange = (day: string, field: 'open' | 'close', value: string) => {
    setOperatingHours((current) => current.map((item) => (item.day === day ? { ...item, [field]: value } : item)));
  };

  const handleReset = () => {
    setBusinessInfo(DEFAULT_BUSINESS_INFO);
    setOperational(DEFAULT_OPERATIONAL);
    setPayments(DEFAULT_PAYMENTS);
    setPrinter(DEFAULT_PRINTER);
    setThemeColor('green');
    setOperatingHours(DEFAULT_HOURS);
    setLastAction('Pengaturan dikembalikan ke data awal dummy.');
  };

  const handleSave = () => {
    setLastAction(`Perubahan tersimpan untuk ${businessInfo.namaUsaha} - ${businessInfo.namaCabang}.`);
  };

  return (
    <div style={styles.page}>
      <header style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Pengaturan</h1>
          <p style={styles.subtitle}>Pusat kontrol preferensi sistem, informasi usaha, operasional cabang, struk, dan keamanan akun.</p>
        </div>
        <div style={styles.statusPill}>
          <ShieldCheck size={16} />
          <span>{lastAction}</span>
        </div>
      </header>

      <nav style={styles.tabsRow} aria-label="Menu pengaturan">
        {SETTINGS_TABS.map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              style={{ ...styles.tabButton, ...(isActive ? styles.tabButtonActive : {}) }}
            >
              <span style={{ ...styles.tabIcon, ...(isActive ? styles.tabIconActive : {}) }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {activeTab === 'Profil Usaha' ? (
        <div style={styles.contentGrid}>
          <main style={styles.mainColumn}>
            <section style={styles.card}>
              <CardHeader icon={<Store size={18} />} title="Informasi Usaha" caption="Identitas utama yang muncul di sistem POS dan dokumen transaksi." />

              <div style={styles.businessGrid}>
                <div style={styles.inputStack}>
                  <TextInput label="Nama Usaha" value={businessInfo.namaUsaha} onChange={(value) => handleBusinessChange('namaUsaha', value)} />
                  <TextInput label="Nama Cabang" value={businessInfo.namaCabang} onChange={(value) => handleBusinessChange('namaCabang', value)} />
                  <TextInput label="Email Usaha" value={businessInfo.email} onChange={(value) => handleBusinessChange('email', value)} />
                  <TextInput label="No. Telepon" value={businessInfo.telepon} onChange={(value) => handleBusinessChange('telepon', value)} />
                </div>

                <div style={styles.inputStack}>
                  <label style={styles.label}>Alamat Lengkap</label>
                  <textarea
                    value={businessInfo.alamat}
                    onChange={(event) => handleBusinessChange('alamat', event.target.value)}
                    style={styles.textarea}
                  />
                  <div style={styles.addressHint}>
                    <MapPin size={14} />
                    <span>Alamat ini akan digunakan sebagai referensi cabang utama.</span>
                  </div>
                </div>

                <div style={styles.hoursPanel}>
                  <div style={styles.hoursHeader}>
                    <strong>Jam Operasional</strong>
                    <span>Senin - Minggu</span>
                  </div>
                  <div style={styles.hoursList}>
                    {operatingHours.map((item) => (
                      <div key={item.day} style={styles.hourRow}>
                        <span style={styles.dayLabel}>{item.day}</span>
                        <TimeSelect value={item.open} onChange={(value) => handleHourChange(item.day, 'open', value)} />
                        <span style={styles.hourDash}>-</span>
                        <TimeSelect value={item.close} onChange={(value) => handleHourChange(item.day, 'close', value)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.actionRow}>
                <button onClick={handleSave} style={styles.primaryButton}><Save size={15} /> Simpan Perubahan</button>
                <button onClick={handleReset} style={styles.outlineButton}><RefreshCcw size={15} /> Reset</button>
              </div>
            </section>

            <section style={styles.card}>
              <CardHeader icon={<Settings size={18} />} title="Pengaturan Operasional" caption="Atur perilaku standar transaksi, pajak, dan peringatan stok." />
              <div style={styles.operationalGrid}>
                <SelectInput
                  label="Default Status Transaksi"
                  value={operational.defaultStatus}
                  options={['Open', 'Selesai']}
                  onChange={(value) => handleOperationalChange('defaultStatus', value)}
                />
                <SelectInput
                  label="Pajak Default"
                  value={operational.pajakDefault}
                  options={['0%', '10%', '11%']}
                  onChange={(value) => handleOperationalChange('pajakDefault', value)}
                />
                <div>
                  <label style={styles.label}>Minimum Alert Stok</label>
                  <div style={styles.numberWrap}>
                    <input
                      type="number"
                      min={0}
                      value={operational.minStockAlert}
                      onChange={(event) => handleOperationalChange('minStockAlert', Number(event.target.value))}
                      style={styles.numberInput}
                    />
                    <span>unit</span>
                  </div>
                </div>
              </div>

              <div style={styles.toggleGrid}>
                <ToggleRow
                  title="Nomor transaksi otomatis"
                  caption="Sistem membuat nomor nota berurutan."
                  checked={operational.autoInvoice}
                  onChange={(checked) => handleOperationalChange('autoInvoice', checked)}
                />
                <ToggleRow
                  title="Multi-item transaksi"
                  caption="Kasir bisa memasukkan layanan dan produk sekaligus."
                  checked={operational.multiItem}
                  onChange={(checked) => handleOperationalChange('multiItem', checked)}
                />
                <ToggleRow
                  title="Pelanggan umum default"
                  caption="Transaksi baru memakai pelanggan umum saat belum dipilih."
                  checked={operational.defaultCustomer}
                  onChange={(checked) => handleOperationalChange('defaultCustomer', checked)}
                />
              </div>
            </section>

            <section style={styles.card}>
              <CardHeader icon={<CreditCard size={18} />} title="Metode Pembayaran" caption="Aktifkan metode pembayaran yang muncul di halaman POS." />
              <div style={styles.paymentGrid}>
                {PAYMENT_METHODS.map((method) => (
                  <div key={method.key} style={styles.paymentTile}>
                    <span style={styles.paymentIcon}>{method.icon}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong style={styles.paymentTitle}>{method.label}</strong>
                      <span style={styles.paymentCaption}>{method.caption}</span>
                    </div>
                    <ToggleSwitch
                      checked={payments[method.key]}
                      onChange={(checked) => setPayments((current) => ({ ...current, [method.key]: checked }))}
                      label={`${method.label} aktif`}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section style={styles.card}>
              <div style={styles.listHeader}>
                <CardHeader icon={<Settings size={18} />} title="Perubahan Terakhir" caption="Riwayat aktivitas singkat pada pengaturan sistem." />
                <button style={styles.textButton}>Lihat Semua</button>
              </div>
              <div style={styles.activityList}>
                {ACTIVITY_LOGS.map((activity) => (
                  <div key={activity.title} style={styles.activityItem}>
                    <span style={styles.activityIcon}>{activity.icon}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong style={styles.activityTitle}>{activity.title}</strong>
                      <span style={styles.activityMeta}>{activity.time}</span>
                    </div>
                    <span style={styles.actorBadge}>oleh {activity.actor}</span>
                  </div>
                ))}
              </div>
            </section>
          </main>

          <aside style={styles.sideColumn}>
            <section style={styles.sideCard}>
              <CardHeader icon={<Palette size={18} />} title="Brand & Logo" caption="Tampilan identitas visual cabang." compact />
              <div style={styles.logoPreview}>
                <img src="/Logo Suma Barbershop.png" alt="Suma Barbershop" style={styles.logoImage} />
              </div>
              <button style={styles.fullButton}><Upload size={15} /> Ubah Logo</button>
              <div style={styles.swatchRow}>
                {[
                  { key: 'cream' as ThemeColor, color: '#F5EDD6', label: 'Krem' },
                  { key: 'green' as ThemeColor, color: '#0F3F31', label: 'Hijau' },
                  { key: 'bronze' as ThemeColor, color: '#9B6A3A', label: 'Bronze' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setThemeColor(item.key)}
                    aria-label={`Pilih warna tema ${item.label}`}
                    title={item.label}
                    style={{
                      ...styles.swatch,
                      background: item.color,
                      ...(themeColor === item.key ? styles.swatchActive : {}),
                    }}
                  />
                ))}
              </div>
            </section>

            <section style={styles.sideCard}>
              <CardHeader icon={<Printer size={18} />} title="Struk & Printer" caption="Konfigurasi cetak nota kasir." compact />
              <div style={styles.radioGroup}>
                {(['58mm', '80mm'] as ReceiptSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePrinterChange('size', size)}
                    style={{ ...styles.radioButton, ...(printer.size === size ? styles.radioButtonActive : {}) }}
                  >
                    <span style={{ ...styles.radioDot, ...(printer.size === size ? styles.radioDotActive : {}) }} />
                    {size}
                  </button>
                ))}
              </div>
              <ToggleRow
                title="Cetak otomatis"
                caption="Setelah transaksi dibayar."
                checked={printer.autoPrint}
                onChange={(checked) => handlePrinterChange('autoPrint', checked)}
              />
              <TextInput label="Header Struk" value={printer.header} onChange={(value) => handlePrinterChange('header', value)} />
              <TextInput label="Footer Struk" value={printer.footer} onChange={(value) => handlePrinterChange('footer', value)} />
            </section>

            <section style={styles.sideCard}>
              <CardHeader icon={<Lock size={18} />} title="Keamanan Akun" caption="Kontrol akses owner dan sesi aktif." compact />
              <SettingsLink icon={<Lock size={16} />} label="Ubah Password" meta="Ubah" />
              <SettingsLink icon={<ShieldCheck size={16} />} label="Sesi Login Aktif" meta="3 sesi aktif" />
              <SettingsLink icon={<ArrowRight size={16} />} label="Login 2 langkah" meta="Segera Hadir" badge />
            </section>

            <section style={styles.sideCard}>
              <CardHeader icon={<DatabaseBackup size={18} />} title="Backup & Ekspor" caption="Unduhan data operasional." compact />
              <BackupAction icon={<Download size={16} />} title="Export Data" caption="Transaksi, produk, dan laporan." button="Export" />
              <BackupAction icon={<DatabaseBackup size={16} />} title="Backup Manual" caption="Buat backup data sistem." button="Backup" />
              <BackupAction icon={<FileSpreadsheet size={16} />} title="Template Produk" caption="Format import produk Excel." button="Unduh" />
            </section>
          </aside>
        </div>
      ) : (
        <section style={styles.placeholderCard}>
          <span style={styles.placeholderIcon}>{SETTINGS_TABS.find((tab) => tab.label === activeTab)?.icon}</span>
          <h2>{activeTab}</h2>
          <p>Konten pengaturan untuk tab ini disiapkan sebagai placeholder pada tahap frontend awal.</p>
        </section>
      )}
    </div>
  );
}

function CardHeader({ icon, title, caption, compact }: { icon: React.ReactNode; title: string; caption: string; compact?: boolean }) {
  return (
    <div style={{ ...styles.cardHeader, ...(compact ? styles.cardHeaderCompact : {}) }}>
      <span style={styles.cardHeaderIcon}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <h2 style={styles.cardTitle}>{title}</h2>
        <p style={styles.cardCaption}>{caption}</p>
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} style={styles.input} />
    </label>
  );
}

function SelectInput({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} style={styles.input}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function TimeSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} style={styles.timeSelect}>
      {TIME_OPTIONS.map((time) => <option key={time}>{time}</option>)}
    </select>
  );
}

function ToggleRow({ title, caption, checked, onChange }: { title: string; caption: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div style={styles.toggleRow}>
      <div style={{ minWidth: 0 }}>
        <strong style={styles.toggleTitle}>{title}</strong>
        <span style={styles.toggleCaption}>{caption}</span>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{ ...styles.switchTrack, ...(checked ? styles.switchTrackActive : {}) }}
    >
      <span style={{ ...styles.switchThumb, ...(checked ? styles.switchThumbActive : {}) }} />
    </button>
  );
}

function SettingsLink({ icon, label, meta, badge }: { icon: React.ReactNode; label: string; meta: string; badge?: boolean }) {
  return (
    <button style={styles.settingsLink}>
      <span style={styles.settingsIcon}>{icon}</span>
      <strong>{label}</strong>
      <span style={badge ? styles.badgeMeta : styles.settingsMeta}>{meta}</span>
      <ChevronRight size={15} color="#8B7D6D" />
    </button>
  );
}

function BackupAction({ icon, title, caption, button }: { icon: React.ReactNode; title: string; caption: string; button: string }) {
  return (
    <div style={styles.backupRow}>
      <span style={styles.settingsIcon}>{icon}</span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <strong style={styles.backupTitle}>{title}</strong>
        <span style={styles.backupCaption}>{caption}</span>
      </div>
      <button style={styles.miniButton}>{button}</button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '20px 24px 28px', color: '#142D22' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18, marginBottom: 16 },
  title: { margin: 0, fontFamily: 'var(--font-heading)', fontSize: 30, fontWeight: 800, color: '#123526' },
  subtitle: { margin: '7px 0 0', color: '#6E6A64', fontSize: 14, lineHeight: 1.55, maxWidth: 720 },
  statusPill: { minHeight: 40, maxWidth: 360, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 9, border: '1px solid #E6D8C6', background: 'rgba(255,255,255,0.88)', color: '#0F3F31', fontSize: 12, fontWeight: 800, boxShadow: '0 12px 28px rgba(85,58,25,0.04)' },
  tabsRow: { display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 14 },
  tabButton: { minWidth: 166, height: 58, padding: '0 13px', borderRadius: 11, border: '1px solid #E6D8C6', background: 'rgba(255,255,255,0.88)', color: '#10281F', display: 'flex', alignItems: 'center', gap: 9, fontWeight: 900, whiteSpace: 'nowrap', boxShadow: '0 12px 28px rgba(85,58,25,0.04)' },
  tabButtonActive: { background: '#0F3F31', color: '#fff', borderColor: '#0F3F31', boxShadow: '0 16px 30px rgba(15,63,49,0.2)' },
  tabIcon: { width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBF3E8', color: '#C75B3A', flexShrink: 0 },
  tabIconActive: { background: 'rgba(215,160,66,0.2)', color: '#F4D9A4' },
  contentGrid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 370px', gap: 16, alignItems: 'start' },
  mainColumn: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
  sideColumn: { display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 },
  card: { background: 'rgba(255,255,255,0.93)', border: '1px solid #E6D8C6', borderRadius: 12, padding: 18, boxShadow: '0 14px 34px rgba(85,58,25,0.04)' },
  sideCard: { background: 'rgba(255,255,255,0.94)', border: '1px solid #E6D8C6', borderRadius: 12, padding: 16, boxShadow: '0 14px 34px rgba(85,58,25,0.04)' },
  cardHeader: { display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  cardHeaderCompact: { marginBottom: 13 },
  cardHeaderIcon: { width: 36, height: 36, borderRadius: 9, background: '#FBF3E8', color: '#C75B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardTitle: { margin: 0, fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 800, color: '#10281F' },
  cardCaption: { margin: '4px 0 0', color: '#81786F', fontSize: 12, lineHeight: 1.45 },
  businessGrid: { display: 'grid', gridTemplateColumns: 'minmax(220px, 0.8fr) minmax(240px, 1fr) minmax(290px, 0.95fr)', gap: 14, alignItems: 'start' },
  inputStack: { display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 },
  field: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 },
  label: { color: '#4E4944', fontSize: 12, fontWeight: 900 },
  input: { width: '100%', height: 40, border: '1px solid #E6D8C6', borderRadius: 8, padding: '0 11px', background: '#FFFDF9', color: '#10281F', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 13 },
  textarea: { width: '100%', minHeight: 158, border: '1px solid #E6D8C6', borderRadius: 8, padding: 12, background: '#FFFDF9', color: '#10281F', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.55 },
  addressHint: { display: 'flex', alignItems: 'center', gap: 7, color: '#81786F', fontSize: 11.5, lineHeight: 1.4 },
  hoursPanel: { border: '1px solid #E6D8C6', borderRadius: 10, background: '#FFFDF9', padding: 12 },
  hoursHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10, color: '#10281F', fontSize: 12 },
  hoursList: { display: 'flex', flexDirection: 'column', gap: 7 },
  hourRow: { display: 'grid', gridTemplateColumns: '62px minmax(0, 1fr) 10px minmax(0, 1fr)', alignItems: 'center', gap: 6 },
  dayLabel: { color: '#4E4944', fontSize: 11.5, fontWeight: 800 },
  hourDash: { color: '#A49180', fontWeight: 900, textAlign: 'center' },
  timeSelect: { height: 32, minWidth: 0, border: '1px solid #E6D8C6', borderRadius: 8, padding: '0 7px', background: '#fff', color: '#10281F', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 800 },
  actionRow: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 15, paddingTop: 14, borderTop: '1px solid #F0E6D8' },
  primaryButton: { height: 40, borderRadius: 8, background: '#0F3F31', color: '#fff', padding: '0 15px', display: 'flex', alignItems: 'center', gap: 7, fontWeight: 900, boxShadow: '0 12px 22px rgba(15,63,49,0.2)' },
  outlineButton: { height: 40, borderRadius: 8, border: '1px solid #E6D8C6', background: '#fff', color: '#4E4944', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 7, fontWeight: 900 },
  operationalGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginBottom: 14 },
  numberWrap: { height: 40, border: '1px solid #E6D8C6', borderRadius: 8, background: '#FFFDF9', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 8, color: '#81786F', fontSize: 12, fontWeight: 800 },
  numberInput: { width: '100%', border: 'none', outline: 'none', background: 'transparent', color: '#10281F', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 800 },
  toggleGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 },
  toggleRow: { minHeight: 66, border: '1px solid #F0E6D8', borderRadius: 10, background: '#FFFDF9', padding: 11, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  toggleTitle: { display: 'block', color: '#10281F', fontSize: 12.5, marginBottom: 3 },
  toggleCaption: { display: 'block', color: '#81786F', fontSize: 11, lineHeight: 1.35 },
  switchTrack: { width: 42, height: 24, borderRadius: 999, background: '#D1D5DB', padding: 3, display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'background 160ms ease' },
  switchTrackActive: { background: '#0F3F31' },
  switchThumb: { width: 18, height: 18, borderRadius: '50%', background: '#fff', display: 'block', boxShadow: '0 2px 7px rgba(0,0,0,0.22)', transform: 'translateX(0)', transition: 'transform 160ms ease' },
  switchThumbActive: { transform: 'translateX(18px)' },
  paymentGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 },
  paymentTile: { minHeight: 82, border: '1px solid #F0E6D8', borderRadius: 10, background: '#FFFDF9', padding: 12, display: 'flex', alignItems: 'center', gap: 10 },
  paymentIcon: { width: 36, height: 36, borderRadius: 9, background: '#FBF3E8', color: '#C75B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  paymentTitle: { display: 'block', color: '#10281F', fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  paymentCaption: { display: 'block', color: '#81786F', fontSize: 11, marginTop: 2 },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  textButton: { color: '#C75B3A', fontSize: 12, fontWeight: 900, whiteSpace: 'nowrap', paddingTop: 8 },
  activityList: { display: 'flex', flexDirection: 'column', gap: 9 },
  activityItem: { display: 'flex', alignItems: 'center', gap: 11, padding: 11, border: '1px solid #F0E6D8', borderRadius: 10, background: '#FFFDF9' },
  activityIcon: { width: 34, height: 34, borderRadius: 9, background: '#FBF3E8', color: '#C75B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  activityTitle: { display: 'block', color: '#10281F', fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  activityMeta: { display: 'block', color: '#81786F', fontSize: 11, marginTop: 2 },
  actorBadge: { borderRadius: 999, background: '#EAF6F0', color: '#0F3F31', padding: '5px 9px', fontSize: 11, fontWeight: 900, whiteSpace: 'nowrap' },
  logoPreview: { height: 142, borderRadius: 12, background: '#0F3F31', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18, marginBottom: 11, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' },
  logoImage: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  fullButton: { width: '100%', height: 38, borderRadius: 8, border: '1px solid #E6D8C6', background: '#FFFDF9', color: '#10281F', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontWeight: 900, marginBottom: 12 },
  swatchRow: { display: 'flex', gap: 9, alignItems: 'center' },
  swatch: { width: 30, height: 30, borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 0 0 1px #E6D8C6', flexShrink: 0 },
  swatchActive: { boxShadow: '0 0 0 3px #0F3F31' },
  radioGroup: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 },
  radioButton: { height: 38, borderRadius: 8, border: '1px solid #E6D8C6', background: '#FFFDF9', color: '#4E4944', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontWeight: 900 },
  radioButtonActive: { borderColor: '#0F3F31', background: '#EAF6F0', color: '#0F3F31' },
  radioDot: { width: 10, height: 10, borderRadius: '50%', border: '2px solid #C7B9A6', display: 'block' },
  radioDotActive: { borderColor: '#0F3F31', background: '#0F3F31' },
  settingsLink: { width: '100%', minHeight: 44, display: 'grid', gridTemplateColumns: '34px minmax(0, 1fr) auto 16px', alignItems: 'center', gap: 9, padding: '8px 0', borderBottom: '1px solid #F0E6D8', color: '#10281F', textAlign: 'left', fontSize: 12.5 },
  settingsIcon: { width: 32, height: 32, borderRadius: 8, background: '#FBF3E8', color: '#C75B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  settingsMeta: { color: '#81786F', fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap' },
  badgeMeta: { borderRadius: 999, background: '#F0E6D8', color: '#81786F', padding: '5px 8px', fontSize: 10.5, fontWeight: 900, whiteSpace: 'nowrap' },
  backupRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #F0E6D8' },
  backupTitle: { display: 'block', color: '#10281F', fontSize: 12.5 },
  backupCaption: { display: 'block', color: '#81786F', fontSize: 11, marginTop: 2 },
  miniButton: { height: 30, borderRadius: 7, background: '#0F3F31', color: '#fff', padding: '0 10px', fontSize: 11, fontWeight: 900 },
  placeholderCard: { minHeight: 360, background: 'rgba(255,255,255,0.93)', border: '1px solid #E6D8C6', borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#6E6A64', boxShadow: '0 14px 34px rgba(85,58,25,0.04)' },
  placeholderIcon: { width: 54, height: 54, borderRadius: 14, background: '#0F3F31', color: '#F4D9A4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#8B7D6D', fontSize: 12, fontWeight: 800, padding: '20px 0 0' },
  footerOrnament: { width: 44, height: 1, background: '#D9C9B6', display: 'block' },
};
