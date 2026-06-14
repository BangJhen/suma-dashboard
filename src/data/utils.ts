/**
 * Format a number as Indonesian Rupiah.
 * e.g. 6750000 → "Rp 6.750.000"
 */
export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

/**
 * Format a compact rupiah for chart axes.
 * e.g. 6750000 → "Rp 6.75jt"
 */
export function formatRupiahCompact(amount: number): string {
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(0)}jt`;
  if (amount >= 1_000)     return `Rp ${(amount / 1_000).toFixed(0)}rb`;
  return `Rp ${amount}`;
}

/**
 * Format a percentage with sign.
 * e.g. 18.2 → "+18.2%"
 */
export function formatPct(pct: number): string {
  return `${pct > 0 ? '↑' : '↓'} ${Math.abs(pct).toFixed(1)}%`;
}
