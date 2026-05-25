import { formatCurrency } from './formatCurrency';

/**
 * Returns an array of category totals for a given list of expenses.
 * Each entry: { name: string, value: number, color: string }
 *   - name: category name
 *   - value: total amount spent in that category
 *   - color: a deterministic pastel color derived from the name
 */
export const getCategoryTotals = (expenses) => {
  const totals = {};
  expenses.forEach((exp) => {
    const cat = exp.category || 'Uncategorized';
    totals[cat] = (totals[cat] || 0) + Number(exp.amount);
  });
  return Object.entries(totals).map(([name, value]) => ({
    name,
    value,
    // deterministic pastel color based on string hash
    color: stringToColor(name),
  }));
};

/**
 * Filters expenses according to a period identifier.
 * period can be:
 *   - 'all'      : all expenses
 *   - 'month'    : current month
 *   - '6months'  : last 6 months
 *   - 'year'     : current year
 */
export const filterExpensesByPeriod = (expenses, period) => {
  if (!period || period === 'all') return expenses;
  const now = new Date();
  return expenses.filter((exp) => {
    const date = new Date(exp.date);
    if (period === 'month') {
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }
    if (period === '6months') {
      const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
      return diffMonths >= 0 && diffMonths < 6;
    }
    if (period === 'year') {
      return date.getFullYear() === now.getFullYear();
    }
    return true;
  });
};

/**
 * Returns an array of monthly spending aggregates for the last `months` months.
 * Each entry: { month: 'MMM YY', value: total }.
 */
export const getMonthlySpending = (expenses, months = 6) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
  const map = {};
  for (let i = 0; i < months; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    map[label] = 0;
  }
  expenses.forEach((exp) => {
    const date = new Date(exp.date);
    if (date >= start) {
      const label = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (label in map) {
        map[label] += Number(exp.amount);
      }
    }
  });
  return Object.entries(map).map(([month, value]) => ({ month, value }));
};

/**
 * Simple deterministic color generator from a string.
 */
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 55%)`;
};
