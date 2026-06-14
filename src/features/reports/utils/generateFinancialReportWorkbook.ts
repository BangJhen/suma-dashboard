import ExcelJS from 'exceljs';

export type ReportPeriod = 'Hari Ini' | 'Minggu Ini' | 'Bulan Ini' | 'Custom';

export interface FinancialReportSummary {
  grossRevenue: number;
  productRevenue: number;
  serviceRevenue: number;
  totalCommission: number;
  totalExpenses: number;
  netProfit: number;
}

export interface FinancialReportCommission {
  id: string;
  name: string;
  services: number;
  grossRevenue: number;
  commissionRate: number;
  bonus: number;
}

export interface FinancialReportExpense {
  id: string;
  date: string;
  category: string;
  amount: number;
  note: string;
}

export interface FinancialReportTransaction {
  id: string;
  date: string;
  time: string;
  customer: string;
  item: string;
  payment: string;
  total: number;
}

export interface CompleteFinancialReportInput {
  period: ReportPeriod;
  printedAt?: Date;
  financials: FinancialReportSummary;
  commissions: FinancialReportCommission[];
  expenses: FinancialReportExpense[];
  transactions: FinancialReportTransaction[];
}

const COLORS = {
  green: 'FF0F3F31',
  cream: 'FFFBF3E8',
  gold: 'FFD7A042',
  goldLight: 'FFFFF1D2',
  rust: 'FFC75B3A',
  text: 'FF10281F',
  muted: 'FF6E6A64',
  border: 'FFE6D8C6',
  white: 'FFFFFFFF',
  categoryGreen: 'FFDDEFE7',
  categoryBlue: 'FFE8EEF5',
  categoryPeach: 'FFFBE2DA',
  categoryGray: 'FFF2F2F2',
};

const currencyFormat = '#,##0';
const percentFormat = '0.0%';
const defaultFont = { name: 'Arial', size: 10, color: { argb: COLORS.text } };
const thinBorder: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: COLORS.border } },
  left: { style: 'thin', color: { argb: COLORS.border } },
  bottom: { style: 'thin', color: { argb: COLORS.border } },
  right: { style: 'thin', color: { argb: COLORS.border } },
};

export function getCompleteReportExcelFilename(period: ReportPeriod) {
  return `Laporan_Lengkap_Suma_Barbershop_${period.replace(/\s+/g, '_')}.xlsx`;
}

export function buildCompleteFinancialReportWorkbook(input: CompleteFinancialReportInput) {
  const printedAt = input.printedAt ?? new Date();
  const workbook = new ExcelJS.Workbook();

  workbook.creator = 'Suma Barbershop POS';
  workbook.created = printedAt;
  workbook.modified = printedAt;
  workbook.calcProperties.fullCalcOnLoad = true;

  buildSummarySheet(workbook, input.financials, input.period, printedAt);
  buildCommissionSheet(workbook, input.commissions, input.period, printedAt);
  buildExpenseSheet(workbook, input.expenses, input.period, printedAt);
  buildTransactionSheet(workbook, input.transactions, input.period, printedAt);

  return workbook;
}

export async function downloadCompleteFinancialReportExcel(input: CompleteFinancialReportInput) {
  const workbook = buildCompleteFinancialReportWorkbook(input);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = getCompleteReportExcelFilename(input.period);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function buildSummarySheet(
  workbook: ExcelJS.Workbook,
  financials: FinancialReportSummary,
  period: ReportPeriod,
  printedAt: Date,
) {
  const sheet = workbook.addWorksheet('Ringkasan Finansial', {
    views: [{ state: 'frozen', ySplit: 5 }],
  });

  sheet.columns = [{ width: 34 }, { width: 18 }];
  applyDocumentHeader(sheet, 2, 'LAPORAN KEUANGAN & OPERASIONAL - SUMA BARBERSHOP', period, printedAt);

  sheet.addRow([]);
  sheet.addRow(['Metrik', 'Nilai']);
  styleHeaderRow(sheet.getRow(5), 2);

  const margin = financials.grossRevenue > 0 ? financials.netProfit / financials.grossRevenue : 0;
  const rows: Array<[string, number | ExcelJS.CellFormulaValue]> = [
    ['Pendapatan Layanan (Rp)', financials.serviceRevenue],
    ['Pendapatan Produk (Rp)', financials.productRevenue],
    ['Pendapatan Kotor (Rp)', financials.grossRevenue],
    ['Komisi Kapster (Rp)', financials.totalCommission],
    ['Pengeluaran Operasional (Rp)', financials.totalExpenses],
    ['Laba Bersih (Rp)', { formula: 'B8-B9-B10', result: financials.netProfit }],
    ['Margin Bersih (%)', { formula: 'B11/B8', result: margin }],
  ];

  rows.forEach(([label, value], index) => {
    const row = sheet.addRow([label, value]);
    const rowNumber = row.number;

    styleBodyRow(row, 2, index % 2 === 1);
    row.getCell(2).numFmt = label.includes('%') ? percentFormat : currencyFormat;

    if (rowNumber === 9 || rowNumber === 10) {
      row.getCell(1).font = { ...defaultFont, color: { argb: COLORS.rust }, bold: true };
      row.getCell(2).font = { ...defaultFont, color: { argb: COLORS.rust }, bold: true };
    }

    if (rowNumber === 11) {
      styleEmphasisRow(row, 2);
    }

    if (rowNumber === 12) {
      row.getCell(2).font = {
        ...defaultFont,
        color: { argb: margin >= 0.2 ? COLORS.green : margin >= 0.1 ? COLORS.gold : COLORS.rust },
        bold: true,
      };
    }
  });

  return sheet;
}

function buildCommissionSheet(
  workbook: ExcelJS.Workbook,
  commissions: FinancialReportCommission[],
  period: ReportPeriod,
  printedAt: Date,
) {
  const sheet = workbook.addWorksheet('Komisi Kapster', {
    views: [{ state: 'frozen', ySplit: 4 }],
  });

  sheet.columns = [
    { width: 14 },
    { width: 22 },
    { width: 16 },
    { width: 20 },
    { width: 18 },
    { width: 16 },
    { width: 20 },
  ];
  applyDocumentHeader(sheet, 7, 'LAPORAN KOMISI KAPSTER - SUMA BARBERSHOP', period, printedAt);

  sheet.addRow(['ID Kapster', 'Nama Kapster', 'Jumlah Layanan', 'Omzet Layanan (Rp)', 'Rate Komisi (%)', 'Bonus (Rp)', 'Total Komisi (Rp)']);
  styleHeaderRow(sheet.getRow(4), 7);

  commissions.forEach((barber, index) => {
    const row = sheet.addRow([
      barber.id,
      barber.name,
      barber.services,
      barber.grossRevenue,
      barber.commissionRate,
      barber.bonus,
      {
        formula: `D${5 + index}*E${5 + index}+F${5 + index}`,
        result: getCommissionTotal(barber),
      },
    ]);

    styleBodyRow(row, 7, index % 2 === 1);
    row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(4).numFmt = currencyFormat;
    row.getCell(5).numFmt = percentFormat;
    row.getCell(6).numFmt = currencyFormat;
    row.getCell(7).numFmt = currencyFormat;
  });

  const firstDataRow = 5;
  const lastDataRow = firstDataRow + commissions.length - 1;
  const footerRow = sheet.addRow([
    'TOTAL',
    '',
    formulaValue(`SUM(C${firstDataRow}:C${lastDataRow})`, commissions.reduce((sum, barber) => sum + barber.services, 0)),
    formulaValue(`SUM(D${firstDataRow}:D${lastDataRow})`, commissions.reduce((sum, barber) => sum + barber.grossRevenue, 0)),
    '',
    formulaValue(`SUM(F${firstDataRow}:F${lastDataRow})`, commissions.reduce((sum, barber) => sum + barber.bonus, 0)),
    formulaValue(`SUM(G${firstDataRow}:G${lastDataRow})`, commissions.reduce((sum, barber) => sum + getCommissionTotal(barber), 0)),
  ]);

  styleFooterRow(footerRow, 7);
  footerRow.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
  footerRow.getCell(4).numFmt = currencyFormat;
  footerRow.getCell(6).numFmt = currencyFormat;
  footerRow.getCell(7).numFmt = currencyFormat;
  sheet.autoFilter = { from: 'A4', to: `G${footerRow.number}` };

  return sheet;
}

function buildExpenseSheet(
  workbook: ExcelJS.Workbook,
  expenses: FinancialReportExpense[],
  period: ReportPeriod,
  printedAt: Date,
) {
  const sheet = workbook.addWorksheet('Pengeluaran Operasional', {
    views: [{ state: 'frozen', ySplit: 4 }],
  });

  sheet.columns = [{ width: 16 }, { width: 16 }, { width: 18 }, { width: 48 }, { width: 18 }];
  applyDocumentHeader(sheet, 5, 'LAPORAN PENGELUARAN OPERASIONAL - SUMA BARBERSHOP', period, printedAt);

  sheet.addRow(['ID Pengeluaran', 'Tanggal', 'Kategori', 'Catatan / Deskripsi', 'Nominal (Rp)']);
  styleHeaderRow(sheet.getRow(4), 5);

  expenses.forEach((expense, index) => {
    const row = sheet.addRow([expense.id, expense.date, expense.category, expense.note, expense.amount]);

    styleBodyRow(row, 5, index % 2 === 1);
    row.getCell(3).fill = solidFill(getExpenseCategoryColor(expense.category));
    row.getCell(3).font = { ...defaultFont, bold: true };
    row.getCell(5).numFmt = currencyFormat;
  });

  const firstDataRow = 5;
  const lastDataRow = firstDataRow + expenses.length - 1;
  const footerRow = sheet.addRow([
    'TOTAL PENGELUARAN',
    '',
    '',
    '',
    formulaValue(`SUM(E${firstDataRow}:E${lastDataRow})`, expenses.reduce((sum, expense) => sum + expense.amount, 0)),
  ]);

  styleFooterRow(footerRow, 5);
  footerRow.getCell(5).numFmt = currencyFormat;
  sheet.autoFilter = { from: 'A4', to: `E${footerRow.number}` };

  return sheet;
}

function buildTransactionSheet(
  workbook: ExcelJS.Workbook,
  transactions: FinancialReportTransaction[],
  period: ReportPeriod,
  printedAt: Date,
) {
  const sheet = workbook.addWorksheet('Riwayat Transaksi', {
    views: [{ state: 'frozen', ySplit: 4 }],
  });

  sheet.columns = [
    { width: 8 },
    { width: 20 },
    { width: 22 },
    { width: 20 },
    { width: 40 },
    { width: 20 },
    { width: 18 },
  ];
  applyDocumentHeader(sheet, 7, 'LAPORAN RIWAYAT TRANSAKSI - SUMA BARBERSHOP', period, printedAt);

  sheet.addRow(['No.', 'ID Transaksi', 'Tanggal & Waktu', 'Pelanggan', 'Layanan / Produk', 'Metode Pembayaran', 'Total (Rp)']);
  styleHeaderRow(sheet.getRow(4), 7);

  transactions.forEach((transaction, index) => {
    const row = sheet.addRow([
      index + 1,
      transaction.id,
      `${transaction.date} ${transaction.time}`,
      transaction.customer,
      transaction.item,
      transaction.payment,
      transaction.total,
    ]);

    styleBodyRow(row, 7, index % 2 === 1);
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(2).font = { ...defaultFont, bold: true };
    row.getCell(7).numFmt = currencyFormat;
  });

  const firstDataRow = 5;
  const lastDataRow = firstDataRow + transactions.length - 1;
  const footerRow = sheet.addRow([
    'TOTAL TRANSAKSI',
    '',
    '',
    '',
    '',
    '',
    formulaValue(`SUM(G${firstDataRow}:G${lastDataRow})`, transactions.reduce((sum, transaction) => sum + transaction.total, 0)),
  ]);

  styleFooterRow(footerRow, 7);
  footerRow.getCell(7).numFmt = currencyFormat;
  sheet.autoFilter = { from: 'A4', to: `G${footerRow.number}` };

  return sheet;
}

function applyDocumentHeader(sheet: ExcelJS.Worksheet, lastColumn: number, title: string, period: ReportPeriod, printedAt: Date) {
  sheet.mergeCells(1, 1, 1, lastColumn);
  sheet.mergeCells(2, 1, 2, lastColumn);
  sheet.mergeCells(3, 1, 3, lastColumn);

  sheet.getCell('A1').value = title;
  sheet.getCell('A2').value = `Periode: ${period}`;
  sheet.getCell('A3').value = `Tanggal Cetak: ${formatPrintedAt(printedAt)}`;

  const titleRow = sheet.getRow(1);
  titleRow.height = 24;
  styleRange(titleRow, lastColumn, {
    font: { name: 'Arial', size: 14, bold: true, color: { argb: COLORS.white } },
    fill: solidFill(COLORS.green),
    alignment: { horizontal: 'center', vertical: 'middle' },
  });

  [sheet.getRow(2), sheet.getRow(3)].forEach((row) => {
    styleRange(row, lastColumn, {
      font: { ...defaultFont, color: { argb: COLORS.muted } },
      fill: solidFill(COLORS.cream),
      alignment: { horizontal: 'left', vertical: 'middle' },
    });
  });
}

function styleHeaderRow(row: ExcelJS.Row, lastColumn: number) {
  row.height = 22;
  styleRange(row, lastColumn, {
    font: { name: 'Arial', size: 10, bold: true, color: { argb: COLORS.white } },
    fill: solidFill(COLORS.green),
    alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
    border: thinBorder,
  });
}

function styleBodyRow(row: ExcelJS.Row, lastColumn: number, useZebraFill: boolean) {
  styleRange(row, lastColumn, {
    font: defaultFont,
    fill: useZebraFill ? solidFill(COLORS.cream) : solidFill(COLORS.white),
    alignment: { vertical: 'middle', wrapText: true },
    border: thinBorder,
  });

  for (let column = 1; column <= lastColumn; column += 1) {
    row.getCell(column).alignment = {
      ...row.getCell(column).alignment,
      horizontal: column === lastColumn ? 'right' : 'left',
    };
  }
}

function styleFooterRow(row: ExcelJS.Row, lastColumn: number) {
  row.height = 22;
  styleRange(row, lastColumn, {
    font: { ...defaultFont, bold: true },
    fill: solidFill(COLORS.gold),
    alignment: { vertical: 'middle', wrapText: true },
    border: {
      ...thinBorder,
      top: { style: 'medium', color: { argb: COLORS.green } },
    },
  });

  for (let column = 1; column <= lastColumn; column += 1) {
    row.getCell(column).alignment = {
      ...row.getCell(column).alignment,
      horizontal: column === lastColumn ? 'right' : 'left',
    };
  }
}

function styleEmphasisRow(row: ExcelJS.Row, lastColumn: number) {
  styleRange(row, lastColumn, {
    font: { name: 'Arial', size: 10, bold: true, color: { argb: COLORS.white } },
    fill: solidFill(COLORS.green),
    alignment: { vertical: 'middle' },
    border: thinBorder,
  });
}

function styleRange(row: ExcelJS.Row, lastColumn: number, style: Partial<ExcelJS.Style>) {
  for (let column = 1; column <= lastColumn; column += 1) {
    const cell = row.getCell(column);

    if (style.font) cell.font = style.font;
    if (style.fill) cell.fill = style.fill;
    if (style.alignment) cell.alignment = style.alignment;
    if (style.border) cell.border = style.border;
  }
}

function solidFill(argb: string): ExcelJS.Fill {
  return {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb },
  };
}

function formulaValue(formula: string, result: number): ExcelJS.CellFormulaValue {
  return { formula, result };
}

function getExpenseCategoryColor(category: string) {
  switch (category) {
    case 'Maintenance':
      return COLORS.goldLight;
    case 'Restock':
      return COLORS.categoryGreen;
    case 'Operasional':
      return COLORS.categoryBlue;
    case 'Hospitality':
      return COLORS.categoryPeach;
    default:
      return COLORS.categoryGray;
  }
}

function getCommissionTotal(barber: FinancialReportCommission) {
  return barber.grossRevenue * barber.commissionRate + barber.bonus;
}

function formatPrintedAt(date: Date) {
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}
