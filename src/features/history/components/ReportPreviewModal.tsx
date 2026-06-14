import React, { useRef, useState } from 'react';
import { Check, MapPin, Phone, X, FileDown, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import { formatRupiah } from '../../../utils/format';

interface ReportPreviewModalProps {
  onClose: () => void;
  transactions: any[];
}

export default function ReportPreviewModal({ onClose, transactions }: ReportPreviewModalProps) {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const paperRef = useRef<HTMLDivElement | null>(null);

  // Use up to 10 transactions to match the A4 preview style in the image
  const reportData = transactions.slice(0, 10);
  const total = reportData.reduce((acc, curr) => acc + curr.total, 0);

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
      link.download = 'riwayat_transaksi_24052025.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloaded(true);
    } finally {
      setIsDownloading(false);
    }
  };

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
              File <strong>riwayat_transaksi_24052025.png</strong> telah diunduh.
            </p>
          </div>
        ) : (
          /* Action Header */
          <div style={reportStyles.actionHeader}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={reportStyles.actionTitle}>Pratinjau Laporan</h2>
              <p style={reportStyles.actionSubtitle}>Pastikan data sudah benar sebelum mencetak atau mengunduh screenshot laporan.</p>
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
              <h1 style={reportStyles.docTitle}>LAPORAN RIWAYAT TRANSAKSI</h1>
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
                <span>: 01 Mei 2025 - 24 Mei 2025</span>
              </div>
              <div style={reportStyles.metaRow}>
                <span style={reportStyles.metaLabel}>Tanggal Cetak</span>
                <span>: 24 Mei 2025 14:30 WIB</span>
              </div>
            </div>
          </section>

          <table style={reportStyles.table}>
            <thead>
              <tr>
                <th style={{ ...reportStyles.th, width: 40, textAlign: 'center' }}>No.</th>
                <th style={reportStyles.th}>ID Transaksi</th>
                <th style={reportStyles.th}>Tanggal</th>
                <th style={reportStyles.th}>Pelanggan</th>
                <th style={reportStyles.th}>Layanan</th>
                <th style={reportStyles.th}>Metode Pembayaran</th>
                <th style={{ ...reportStyles.th, textAlign: 'right' }}>Total (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((trx, idx) => (
                <tr key={trx.id}>
                  <td style={{ ...reportStyles.td, textAlign: 'center' }}>{idx + 1}</td>
                  <td style={reportStyles.td}>{trx.id}</td>
                  <td style={reportStyles.td}>{trx.date} {trx.time}</td>
                  <td style={reportStyles.td}>{trx.customer}</td>
                  <td style={reportStyles.td}>{trx.item}</td>
                  <td style={reportStyles.td}>{trx.payment}</td>
                  <td style={{ ...reportStyles.td, textAlign: 'right' }}>{trx.total.toLocaleString('id-ID')}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={6} style={reportStyles.totalLabel}>Total Transaksi</td>
                <td style={reportStyles.totalValue}>{total.toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>

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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 11.5,
    marginBottom: 56,
    border: '1px solid #E6D8C6',
  },
  th: {
    background: '#3A5240',
    color: '#fff',
    padding: '12px 14px',
    textAlign: 'left',
    fontWeight: 700,
    border: '1px solid #3A5240',
  },
  td: {
    padding: '12px 14px',
    border: '1px solid #E6D8C6',
    color: '#10281F',
  },
  totalLabel: {
    padding: '14px 14px',
    background: '#F8F4EE',
    fontWeight: 800,
    border: '1px solid #E6D8C6',
    color: '#10281F',
  },
  totalValue: {
    padding: '14px 14px',
    background: '#F8F4EE',
    fontWeight: 800,
    border: '1px solid #E6D8C6',
    color: '#10281F',
    textAlign: 'right',
    fontSize: 12.5,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 36,
    fontSize: 11.5,
    color: '#4E4944',
    lineHeight: 1.6,
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
