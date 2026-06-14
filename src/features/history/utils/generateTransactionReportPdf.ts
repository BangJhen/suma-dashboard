import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface TransactionReportRow {
  id: string;
  date: string;
  time: string;
  customer: string;
  item: string;
  payment: string;
  total: number;
}

export function generateTransactionReportPdf(transactions: TransactionReportRow[]) {
  const reportData = transactions.slice(0, 10);
  const total = reportData.reduce((sum, transaction) => sum + transaction.total, 0);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(252, 248, 241);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(18, 14, pageWidth - 36, 178, 4, 4, 'F');

  doc.setTextColor(16, 40, 31);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('SUMA', 28, 35);
  doc.setFontSize(9);
  doc.text('BARBERSHOP', 30, 42);

  doc.setFontSize(16);
  doc.text('LAPORAN RIWAYAT TRANSAKSI', pageWidth - 28, 32, { align: 'right' });
  doc.text('SUMA BARBERSHOP', pageWidth - 28, 41, { align: 'right' });

  doc.setDrawColor(230, 216, 198);
  doc.line(26, 54, pageWidth - 26, 54);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Jl. Nusantara No. 45, Yogyakarta', 28, 66);
  doc.text('0812-3456-7890', 28, 73);

  doc.setFont('helvetica', 'bold');
  doc.text('Periode', pageWidth - 82, 66);
  doc.text('Tanggal Cetak', pageWidth - 82, 73);
  doc.setFont('helvetica', 'normal');
  doc.text(': 01 Mei 2025 - 24 Mei 2025', pageWidth - 54, 66);
  doc.text(': 24 Mei 2025 14:30 WIB', pageWidth - 54, 73);

  autoTable(doc, {
    startY: 86,
    margin: { left: 26, right: 26 },
    head: [['No.', 'ID Transaksi', 'Tanggal', 'Pelanggan', 'Layanan', 'Metode Pembayaran', 'Total (Rp)']],
    body: reportData.map((transaction, index) => [
      String(index + 1),
      transaction.id,
      `${transaction.date} ${transaction.time}`,
      transaction.customer,
      transaction.item,
      transaction.payment,
      transaction.total.toLocaleString('id-ID'),
    ]),
    foot: [['Total Transaksi', '', '', '', '', '', total.toLocaleString('id-ID')]],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2.5,
      textColor: [16, 40, 31],
      lineColor: [230, 216, 198],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [58, 82, 64],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    footStyles: {
      fillColor: [248, 244, 238],
      textColor: [16, 40, 31],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { cellWidth: 34 },
      2: { cellWidth: 32 },
      3: { cellWidth: 34 },
      4: { cellWidth: 54 },
      5: { cellWidth: 38 },
      6: { halign: 'right', cellWidth: 26 },
    },
    didParseCell: (data) => {
      if (data.section === 'foot' && data.column.index === 0) {
        data.cell.colSpan = 6;
        data.cell.styles.halign = 'left';
      }
      if (data.section === 'foot' && data.column.index > 0 && data.column.index < 6) {
        data.cell.text = [''];
      }
      if (data.section === 'foot' && data.column.index === 6) {
        data.cell.styles.halign = 'right';
      }
    },
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(78, 73, 68);
  doc.text('Terima kasih telah mempercayakan perawatan terbaik Anda kepada kami.', 28, 166);
  doc.setFont('helvetica', 'bold');
  doc.text('SUMA BARBERSHOP - Gaya Anda, Identitas Anda.', 28, 173);

  doc.setFont('helvetica', 'normal');
  doc.text('Hormat kami,', pageWidth - 68, 166);
  doc.setFont('helvetica', 'bold');
  doc.text('SUMA BARBERSHOP', pageWidth - 68, 173);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(18);
  doc.text('Suma', pageWidth - 62, 185);

  doc.save('riwayat_transaksi_24052025.pdf');
}
