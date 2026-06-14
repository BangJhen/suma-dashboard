import React, { useRef, useState } from 'react';
import { Check, MapPin, Phone, X, FileDown, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import { formatRupiah } from '../../../utils/format';

type ReportTab = 'Laba & Rugi' | 'Komisi Kapster' | 'Pengeluaran Operasional';
type Period = 'Hari Ini' | 'Minggu Ini' | 'Bulan Ini' | 'Custom';

interface BarberCommission {
  id: string;
  name: string;
  services: number;
  grossRevenue: number;
  commissionRate: number;
  bonus: number;
}

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  note: string;
}

interface ReportExportModalProps {
  onClose: () => void;
  period: Period;
  activeTab: ReportTab;
  financials: {
    grossRevenue: number;
    productRevenue: number;
    serviceRevenue: number;
    totalCommission: number;
    totalExpenses: number;
    netProfit: number;
  };
  commissions: BarberCommission[];
  expenses: Expense[];
}

export default function ReportExportModal({
  onClose,
  period,
  activeTab,
  financials,
  commissions,
  expenses,
}: ReportExportModalProps) {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const paperRef = useRef<HTMLDivElement | null>(null);

  const getPeriodLabel = () => {
    switch (period) {
      case 'Hari Ini': return 'Hari Ini';
      case 'Minggu Ini': return 'Minggu Ini';
      case 'Bulan Ini': return 'Bulan Ini';
      case 'Custom': return 'Custom';
      default: return period;
    }
  };

  const getPeriodFilename = () => {
    switch (period) {
      case 'Hari Ini': return 'hari_ini';
      case 'Minggu Ini': return 'minggu_ini';
      case 'Bulan Ini': return 'bulan_ini';
      case 'Custom': return 'custom';
      default: return 'custom';
    }
  };

  const printDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDownload = async () => {
    if (!paperRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(paperRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imageUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `laporan_report_suma_barbershop_${getPeriodFilename()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloaded(true);
    } finally {
      setIsDownloading(false);
    }
  };

  const getBarberCommission = (barber: BarberCommission) => {
    return barber.grossRevenue * barber.commissionRate + barber.bonus;
  };

  const totalCommission = commissions.reduce((sum, barber) => sum + getBarberCommission(barber), 0);
  const netProfitMargin = financials.grossRevenue > 0 ? (financials.netProfit / financials.grossRevenue) * 100 : 0;

  const marginColor = netProfitMargin >= 20 ? '#0F3F31' : netProfitMargin >= 10 ? '#B97818' : '#C75B3A';

  return (
    <div style={reportStyles.overlay}>
      <button style={reportStyles.closeGlobalBtn} onClick={onClose} aria-label="Tutup Preview">
        <X size={24} />
      </button>

      <div style={reportStyles.scrollContainer}>
        {isDownloaded ? (
          /* Success Message */
          <div style={reportStyles.successMessage}>
            <div style={reportStyles.checkCircle}>
              <Check size={32} strokeWidth={3} />
            </div>
            <h2 style={reportStyles.successTitle}>Laporan berhasil diunduh!</h2>
            <p style={reportStyles.successSubtitle}>
              File <strong>laporan_report_suma_barbershop_{getPeriodFilename()}.png</strong> telah diunduh.
            </p>
          </div>
        ) : (
          /* Action Header */
          <div style={reportStyles.actionHeader}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={reportStyles.actionTitle}>Pratinjau Laporan</h2>
              <p style={reportStyles.actionSubtitle}>
                Pastikan data sudah benar sebelum mencetak atau mengunduh screenshot laporan.
              </p>
            </div>
            <div style={reportStyles.actionButtons}>
              <button style={reportStyles.printBtn} onClick={() => window.print()}>
                <Printer size={16} /> Cetak
              </button>
              <button style={reportStyles.downloadBtn} onClick={handleDownload} disabled={isDownloading}>
                <FileDown size={16} /> {isDownloading ? 'Memproses...' : 'Unduh Gambar'}
              </button>
            </div>
          </div>
        )}

        {/* Paper Document */}
        <div ref={paperRef} style={reportStyles.paper}>
          <header style={reportStyles.paperHeader}>
            {/* Using the available logo */}
            <img src="/Logo Suma Barbershop.png" alt="Suma Barber" style={reportStyles.logo} />
            <div style={reportStyles.headerText}>
              <h1 style={reportStyles.docTitle}>LAPORAN KEUANGAN & OPERASIONAL</h1>
              <h2 style={reportStyles.docSubtitle}>SUMA BARBERSHOP</h2>
            </div>
          </header>

          <div style={reportStyles.divider} />

          <section style={reportStyles.metaInfo}>
            <div style={reportStyles.metaLeft}>
              <div style={reportStyles.metaRow}>
                <MapPin size={15} color="#10281F" />
                <span>Jl. Nusantara No. 45, Yogyakarta</span>
              </div>
              <div style={reportStyles.metaRow}>
                <Phone size={15} color="#10281F" />
                <span>0812-3456-7890</span>
              </div>
            </div>
            <div style={reportStyles.metaRight}>
              <div style={reportStyles.metaRow}>
                <span style={reportStyles.metaLabel}>Periode</span>
                <span>: {getPeriodLabel()}</span>
              </div>
              <div style={reportStyles.metaRow}>
                <span style={reportStyles.metaLabel}>Tab Aktif</span>
                <span>: {activeTab}</span>
              </div>
              <div style={reportStyles.metaRow}>
                <span style={reportStyles.metaLabel}>Tanggal Cetak</span>
                <span>: {printDate}</span>
              </div>
            </div>
          </section>

          {/* Ringkasan Finansial */}
          <section style={reportStyles.summarySection}>
            <h3 style={reportStyles.summaryTitle}>Ringkasan Finansial</h3>
            <div style={reportStyles.summaryGrid}>
              <div style={reportStyles.summaryCard}>
                <p style={reportStyles.summaryLabel}>Pendapatan Layanan</p>
                <p style={reportStyles.summaryValuePositive}>{formatRupiah(financials.serviceRevenue)}</p>
              </div>
              <div style={reportStyles.summaryCard}>
                <p style={reportStyles.summaryLabel}>Pendapatan Produk</p>
                <p style={reportStyles.summaryValuePositive}>{formatRupiah(financials.productRevenue)}</p>
              </div>
              <div style={reportStyles.summaryCard}>
                <p style={reportStyles.summaryLabel}>Pendapatan Kotor</p>
                <p style={reportStyles.summaryValuePositive}>{formatRupiah(financials.grossRevenue)}</p>
              </div>
              <div style={reportStyles.summaryCard}>
                <p style={reportStyles.summaryLabel}>Komisi Kapster</p>
                <p style={reportStyles.summaryValueNegative}>- {formatRupiah(totalCommission)}</p>
              </div>
              <div style={reportStyles.summaryCard}>
                <p style={reportStyles.summaryLabel}>Pengeluaran Operasional</p>
                <p style={reportStyles.summaryValueNegative}>- {formatRupiah(financials.totalExpenses)}</p>
              </div>
              <div style={reportStyles.summaryCard}>
                <p style={reportStyles.summaryLabel}>Laba Bersih</p>
                <p style={{ ...reportStyles.summaryValue, fontWeight: 800 }}>{formatRupiah(financials.netProfit)}</p>
              </div>
              <div style={reportStyles.summaryCard}>
                <p style={reportStyles.summaryLabel}>Margin Bersih</p>
                <p style={{ ...reportStyles.summaryValue, color: marginColor, fontWeight: 800 }}>{netProfitMargin.toFixed(1)}%</p>
              </div>
            </div>
          </section>

          <div style={reportStyles.divider} />

          {/* Laba & Rugi Detail (shown when active tab) */}
          {activeTab === 'Laba & Rugi' && (
            <section style={reportStyles.detailSection}>
              <h3 style={reportStyles.detailTitle}>Laba & Rugi Detail</h3>
              <div style={reportStyles.detailList}>
                <div style={reportStyles.detailItem}>
                  <span style={reportStyles.detailLabel}>Pendapatan Layanan</span>
                  <span style={reportStyles.detailValue}>{formatRupiah(financials.serviceRevenue)}</span>
                </div>
                <div style={reportStyles.detailItem}>
                  <span style={reportStyles.detailLabel}>Pendapatan Produk</span>
                  <span style={reportStyles.detailValue}>{formatRupiah(financials.productRevenue)}</span>
                </div>
                <div style={reportStyles.detailItem}>
                  <span style={reportStyles.detailLabel}>Komisi Kapster</span>
                  <span style={reportStyles.detailValue}>- {formatRupiah(totalCommission)}</span>
                </div>
                <div style={reportStyles.detailItem}>
                  <span style={reportStyles.detailLabel}>Pengeluaran Operasional</span>
                  <span style={reportStyles.detailValue}>- {formatRupiah(financials.totalExpenses)}</span>
                </div>
                <div style={{ ...reportStyles.detailItem, ...reportStyles.detailItemLast }}>
                  <span style={{ ...reportStyles.detailLabel, fontWeight: 800 }}>Laba Bersih</span>
                  <span style={{ ...reportStyles.detailValue, fontWeight: 800 }}>{formatRupiah(financials.netProfit)}</span>
                </div>
              </div>
            </section>
          )}

          {/* Komisi Kapster */}
          {activeTab === 'Komisi Kapster' && (
            <section style={reportStyles.detailSection}>
              <h3 style={reportStyles.detailTitle}>Komisi Kapster</h3>
              <table style={reportStyles.detailTable}>
                <thead>
                  <tr>
                    <th style={reportStyles.th}>Kapster</th>
                    <th style={reportStyles.th}>Layanan</th>
                    <th style={reportStyles.th}>Omzet</th>
                    <th style={reportStyles.th}>Rate</th>
                    <th style={reportStyles.th}>Bonus</th>
                    <th style={{ ...reportStyles.th, textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((barber) => {
                    const commission = getBarberCommission(barber);
                    return (
                      <tr key={barber.id}>
                        <td style={reportStyles.td}>{barber.name}</td>
                        <td style={reportStyles.td}>{barber.services}</td>
                        <td style={reportStyles.td}>{formatRupiah(barber.grossRevenue)}</td>
                        <td style={reportStyles.td}>{Math.round(barber.commissionRate * 100)}%</td>
                        <td style={reportStyles.td}>{formatRupiah(barber.bonus)}</td>
                        <td style={{ ...reportStyles.td, textAlign: 'right', fontWeight: 600 }}>{formatRupiah(commission)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5} style={{ ...reportStyles.td, background: '#F8F4EE', textAlign: 'right', fontWeight: 800 }}>
                      Total Komisi
                    </td>
                    <td style={{ ...reportStyles.td, background: '#F8F4EE', textAlign: 'right', fontWeight: 800 }}>
                      {formatRupiah(totalCommission)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </section>
          )}

          {/* Pengeluaran Operasional */}
          {activeTab === 'Pengeluaran Operasional' && (
            <section style={reportStyles.detailSection}>
              <h3 style={reportStyles.detailTitle}>Pengeluaran Operasional</h3>
              <table style={reportStyles.detailTable}>
                <thead>
                  <tr>
                    <th style={reportStyles.th}>Tanggal</th>
                    <th style={reportStyles.th}>Kategori</th>
                    <th style={reportStyles.th}>Catatan</th>
                    <th style={{ ...reportStyles.th, textAlign: 'right' }}>Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td style={reportStyles.td}>{expense.date}</td>
                      <td style={reportStyles.td}>
                        <span style={reportStyles.expensePill}>{expense.category}</span>
                      </td>
                      <td style={reportStyles.td}>{expense.note}</td>
                      <td style={{ ...reportStyles.td, textAlign: 'right', fontWeight: 600 }}>{formatRupiah(expense.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} style={{ ...reportStyles.td, background: '#F8F4EE', textAlign: 'right', fontWeight: 800 }}>
                      Total Pengeluaran
                    </td>
                    <td style={{ ...reportStyles.td, background: '#F8F4EE', textAlign: 'right', fontWeight: 800 }}>
                      {formatRupiah(financials.totalExpenses)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </section>
          )}

          <footer style={reportStyles.footer}>
            <div style={reportStyles.footerLeft}>
              <p>Terima kasih telah mempercayakan perawatan terbaik Anda kepada kami.</p>
              <p style={{ fontWeight: 800, marginTop: 4, color: '#10281F' }}>
                SUMA BARBERSHOP - Gaya Anda, Identitas Anda.
              </p>
            </div>
            <div style={reportStyles.footerRight}>
              <p>Hormat kami,</p>
              <p style={{ fontWeight: 800, color: '#10281F' }}>SUMA BARBERSHOP</p>
              {/* Dummy signature */}
              <div style={reportStyles.signature}>Suma</div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

const reportStyles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(248, 244, 238, 0.95)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  closeGlobalBtn: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: '#fff',
    border: '1px solid #E6D8C6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#10281F',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  scrollContainer: {
    padding: '60px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100%',
  },
  successMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 45,
    textAlign: 'center',
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: '50%',
    background: '#5C7451',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    boxShadow: '0 8px 24px rgba(92,116,81,0.25)',
  },
  successTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: '#1A3326',
    fontFamily: 'var(--font-heading)',
  },
  successSubtitle: {
    margin: '10px 0 0',
    color: '#4E4944',
    fontSize: 15,
  },
  actionHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 45,
    background: '#fff',
    padding: '24px 32px',
    borderRadius: 12,
    border: '1px solid #E6D8C6',
    boxShadow: '0 8px 24px rgba(85,58,25,0.04)',
    width: '100%',
    maxWidth: 960,
  },
  actionTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
    color: '#10281F',
    fontFamily: 'var(--font-heading)',
  },
  actionSubtitle: {
    margin: '6px 0 0',
    color: '#6E6A64',
    fontSize: 13.5,
  },
  actionButtons: {
    display: 'flex',
    gap: 12,
  },
  printBtn: {
    height: 44,
    padding: '0 20px',
    borderRadius: 8,
    border: '1px solid #E6D8C6',
    background: '#fff',
    color: '#10281F',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
  },
  downloadBtn: {
    height: 44,
    padding: '0 24px',
    borderRadius: 8,
    border: 'none',
    background: '#0F4A3A',
    color: '#fff',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    boxShadow: '0 8px 16px rgba(15,74,58,0.2)',
  },
  paper: {
    width: '100%',
    maxWidth: 960,
    background: '#fff',
    borderRadius: 12,
    padding: '60px 60px',
    boxShadow: '0 24px 60px rgba(85,58,25,0.08)',
    color: '#10281F',
  },
  paperHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  logo: {
    height: 52,
    objectFit: 'contain',
  },
  headerText: {
    textAlign: 'right',
  },
  docTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: '0.04em',
    color: '#1A3326',
  },
  docSubtitle: {
    margin: '4px 0 0',
    fontSize: 16,
    fontWeight: 700,
    color: '#10281F',
    letterSpacing: '0.02em',
  },
  divider: {
    height: 1,
    background: '#E6D8C6',
    margin: '24px 0',
  },
  metaInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 12.5,
    marginBottom: 32,
    lineHeight: 1.6,
  },
  metaLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  metaRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    textAlign: 'right',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontWeight: 500,
  },
  metaLabel: {
    display: 'inline-block',
    width: 90,
    textAlign: 'left',
    color: '#4E4944',
  },
  summarySection: {
    marginBottom: 32,
  },
  summaryTitle: {
    margin: '0 0 16px',
    fontSize: 16,
    fontWeight: 800,
    color: '#10281F',
    letterSpacing: '0.02em',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
  },
  summaryCard: {
    background: '#F8F4EE',
    padding: '14px 16px',
    borderRadius: 9,
  },
  summaryLabel: {
    display: 'block',
    fontSize: 12,
    color: '#6E6A64',
    marginBottom: 6,
  },
  summaryValuePositive: {
    display: 'block',
    fontSize: 15,
    fontWeight: 800,
    color: '#0F3F31',
  },
  summaryValueNegative: {
    display: 'block',
    fontSize: 15,
    fontWeight: 800,
    color: '#C75B3A',
  },
  summaryValue: {
    display: 'block',
    fontSize: 15,
    fontWeight: 800,
    color: '#10281F',
  },
  detailSection: {
    marginBottom: 32,
  },
  detailTitle: {
    margin: '0 0 12px',
    fontSize: 16,
    fontWeight: 800,
    color: '#10281F',
    letterSpacing: '0.02em',
  },
  detailList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    background: '#F8F4EE',
    borderRadius: 8,
  },
  detailItemLast: {
    background: '#0F3F31',
  },
  detailLabel: {
    fontSize: 13,
    color: '#4E4944',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: 700,
    color: '#10281F',
  },
  detailTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 11.5,
    marginBottom: 0,
    border: '1px solid #E6D8C6',
  },
  th: {
    background: '#3A5240',
    color: '#fff',
    padding: '10px 12px',
    textAlign: 'left',
    fontWeight: 700,
    border: '1px solid #3A5240',
  },
  td: {
    padding: '10px 12px',
    border: '1px solid #E6D8C6',
    color: '#10281F',
  },
  expensePill: {
    background: '#FFF1DA',
    color: '#B97818',
    borderRadius: 999,
    padding: '3px 9px',
    fontSize: 10,
    fontWeight: 800,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 36,
    fontSize: 11.5,
    color: '#4E4944',
    lineHeight: 1.6,
    marginTop: 24,
    borderTop: '1px solid #E6D8C6',
    paddingTop: 20,
  },
  footerLeft: {
    maxWidth: 430,
    flex: 1,
  },
  footerRight: {
    textAlign: 'center',
    width: 200,
    flexShrink: 0,
  },
  signature: {
    fontFamily: '"Brush Script MT", cursive, sans-serif',
    fontSize: 42,
    color: '#10281F',
    marginTop: 16,
    transform: 'rotate(-5deg)',
  },
};
