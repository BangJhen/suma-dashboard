import ExcelJS from 'exceljs';
import {
  buildCompleteFinancialReportWorkbook,
  getCompleteReportExcelFilename,
  type CompleteFinancialReportInput,
} from '../src/features/reports/utils/generateFinancialReportWorkbook.js';

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${String(expected)}, got ${String(actual)}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function assertFormula(cellValue: unknown, formula: string, result: number, message: string) {
  const value = cellValue as { formula?: string; result?: number };
  assertEqual(value.formula, formula, `${message} formula`);
  assertEqual(value.result, result, `${message} cached result`);
}

const input: CompleteFinancialReportInput = {
  period: 'Bulan Ini',
  printedAt: new Date(2026, 5, 15, 9, 5),
  financials: {
    serviceRevenue: 1000000,
    productRevenue: 250000,
    grossRevenue: 1250000,
    totalCommission: 300000,
    totalExpenses: 200000,
    netProfit: 750000,
  },
  commissions: [
    { id: 'KPS-001', name: 'Raka', services: 10, grossRevenue: 700000, commissionRate: 0.35, bonus: 50000 },
    { id: 'KPS-002', name: 'Dimas', services: 5, grossRevenue: 300000, commissionRate: 0.3, bonus: 0 },
  ],
  expenses: [
    { id: 'EXP-001', date: '15 Jun 2026', category: 'Maintenance', note: 'Service AC', amount: 200000 },
  ],
  transactions: [
    {
      id: 'TRX-001',
      date: '15 Jun 2026',
      time: '09:00',
      customer: 'Bima',
      item: 'Haircut',
      payment: 'QRIS',
      total: 85000,
    },
    {
      id: 'TRX-002',
      date: '15 Jun 2026',
      time: '09:30',
      customer: 'Andra',
      item: 'Pomade',
      payment: 'Cash',
      total: 120000,
    },
  ],
};

const workbook = buildCompleteFinancialReportWorkbook(input);
const styledWorkbook = workbook as any;

assertEqual(styledWorkbook.worksheets.length, 4, 'workbook has four sheets');
assertEqual(styledWorkbook.worksheets[0].name, 'Ringkasan Finansial', 'first sheet name');
assertEqual(styledWorkbook.worksheets[1].name, 'Komisi Kapster', 'second sheet name');
assertEqual(styledWorkbook.worksheets[2].name, 'Pengeluaran Operasional', 'third sheet name');
assertEqual(styledWorkbook.worksheets[3].name, 'Riwayat Transaksi', 'fourth sheet name');

const summarySheet = styledWorkbook.getWorksheet('Ringkasan Finansial');
assert(summarySheet, 'summary sheet exists');
assertEqual(summarySheet.getCell('A1').value, 'LAPORAN KEUANGAN & OPERASIONAL - SUMA BARBERSHOP', 'summary title');
assertEqual(summarySheet.getCell('A2').value, 'Periode: Bulan Ini', 'summary period');
assertEqual(summarySheet.getCell('A3').value, 'Tanggal Cetak: 15-06-2026 09:05', 'summary print date');
assertEqual(summarySheet.getCell('B8').value, 1250000, 'gross revenue remains numeric');
assertFormula(summarySheet.getCell('B11').value, 'B8-B9-B10', 750000, 'net profit remains dynamic');
assertEqual(summarySheet.getCell('A1').fill.fgColor.argb, 'FF0F3F31', 'title bar uses Suma green');
assertEqual(summarySheet.getCell('A5').font.color.argb, 'FFFFFFFF', 'table header uses white text');
assertEqual(summarySheet.getCell('A5').fill.fgColor.argb, 'FF0F3F31', 'table header uses Suma green fill');
assertEqual(summarySheet.getCell('A11').fill.fgColor.argb, 'FF0F3F31', 'net profit row is highlighted');
assertEqual(summarySheet.getCell('B12').numFmt, '0.0%', 'margin uses one decimal percent format');

const commissionSheet = styledWorkbook.getWorksheet('Komisi Kapster');
assert(commissionSheet, 'commission sheet exists');
assertEqual(commissionSheet.getCell('A4').value, 'ID Kapster', 'commission table header starts after document header');
assertFormula(commissionSheet.getCell('G5').value, 'D5*E5+F5', 295000, 'commission total remains dynamic');
assertEqual(commissionSheet.getCell('A7').value, 'TOTAL', 'commission footer label');
assertFormula(commissionSheet.getCell('D7').value, 'SUM(D5:D6)', 1000000, 'commission footer gross revenue');
assertFormula(commissionSheet.getCell('F7').value, 'SUM(F5:F6)', 50000, 'commission footer bonus');
assertFormula(commissionSheet.getCell('G7').value, 'SUM(G5:G6)', 385000, 'commission footer commission total');
assertEqual(commissionSheet.views[0].state, 'frozen', 'commission sheet freezes table header');
assertEqual(commissionSheet.autoFilter.from, 'A4', 'commission sheet auto filter starts at header');
assertEqual(commissionSheet.getCell('A6').fill.fgColor.argb, 'FFFBF3E8', 'commission table uses zebra row fill');
assertEqual(commissionSheet.getCell('A7').fill.fgColor.argb, 'FFD7A042', 'commission footer uses gold fill');
assertEqual(commissionSheet.getCell('D5').numFmt, '#,##0', 'commission currency cells remain numeric currency format');
assertEqual(commissionSheet.getCell('E5').numFmt, '0.0%', 'commission rate cells use percent format');

const expenseSheet = styledWorkbook.getWorksheet('Pengeluaran Operasional');
assert(expenseSheet, 'expense sheet exists');
assertEqual(expenseSheet.getCell('A6').value, 'TOTAL PENGELUARAN', 'expense footer label');
assertFormula(expenseSheet.getCell('E6').value, 'SUM(E5:E5)', 200000, 'expense footer total');
assertEqual(expenseSheet.getCell('C5').fill.fgColor.argb, 'FFFFF1D2', 'expense category gets readable category fill');

const transactionSheet = styledWorkbook.getWorksheet('Riwayat Transaksi');
assert(transactionSheet, 'transaction sheet exists');
assertEqual(transactionSheet.getCell('A5').value, 1, 'transaction row has running number');
assertEqual(transactionSheet.getCell('C5').value, '15 Jun 2026 09:00', 'transaction date and time merged');
assertEqual(transactionSheet.getCell('A7').value, 'TOTAL TRANSAKSI', 'transaction footer label');
assertFormula(transactionSheet.getCell('G7').value, 'SUM(G5:G6)', 205000, 'transaction footer total');
assertEqual(transactionSheet.getColumn(5).width, 40, 'transaction item column is wide enough for item names');

assertEqual(
  getCompleteReportExcelFilename('Bulan Ini'),
  'Laporan_Lengkap_Suma_Barbershop_Bulan_Ini.xlsx',
  'filename is dynamic from active period',
);

assert(
  typeof transactionSheet.getCell('G5').value === 'number',
  'transaction total cell uses numeric type',
);

const serializedWorkbook = await styledWorkbook.xlsx.writeBuffer();
const reloadedWorkbook = new ExcelJS.Workbook();
await reloadedWorkbook.xlsx.load(serializedWorkbook);
const reloadedSummary = reloadedWorkbook.getWorksheet('Ringkasan Finansial');

if (!reloadedSummary) throw new Error('serialized workbook can be read back');
assertEqual((reloadedSummary.getCell('A1').fill as any).fgColor.argb, 'FF0F3F31', 'serialized workbook keeps title fill');
assertEqual(reloadedSummary.getCell('B8').value, 1250000, 'serialized workbook keeps numeric source value');
