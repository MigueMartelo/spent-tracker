/**
 * Format a number as Colombian Pesos (COP)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as Colombian Pesos with sign prefix
 */
export function formatCurrencyWithSign(amount: number, type: 'income' | 'outcome'): string {
  const formatted = formatCurrency(Math.abs(amount));
  return type === 'income' ? `+${formatted}` : `-${formatted}`;
}

