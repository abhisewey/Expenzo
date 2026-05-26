// Additional analytics helper functions for Insight calculations
import { getCategoryTotals } from './analyticsHelpers';

/**
 * Returns the category with the highest total spend and its percentage of overall spend.
 */
export const getHighestSpendingCategory = (expenses) => {
  const totals = getCategoryTotals(expenses);
  const totalSpend = totals.reduce((sum, cur) => sum + cur.value, 0);
  if (!totalSpend) return { name: '-', percent: 0 };
  const highest = totals.reduce((prev, cur) => (cur.value > prev.value ? cur : prev), totals[0]);
  return { name: highest.name, percent: ((highest.value / totalSpend) * 100).toFixed(1) };
};

/**
 * Average daily spend for the current period.
 */
export const getAverageDailySpend = (expenses, rangeType = 'this_month') => {
  if (!expenses.length) return '0.00';
  
  // Determine days in the active period
  let daysInPeriod = 30; // default
  const now = new Date();
  
  if (rangeType === 'this_month') {
    daysInPeriod = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  } else if (rangeType === 'previous_month') {
    daysInPeriod = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  } else if (rangeType === 'last_3_months') {
    daysInPeriod = 90;
  } else if (rangeType === 'this_year') {
    daysInPeriod = (now.getFullYear() % 4 === 0) ? 366 : 365;
  }
  
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  return (total / daysInPeriod).toFixed(2);
};

/**
 * Biggest single expense (amount and category).
 */
export const getBiggestExpense = (expenses) => {
  if (!expenses.length) return { amount: 0, category: '-' };
  const biggest = expenses.reduce((prev, cur) => (Number(cur.amount) > Number(prev.amount) ? cur : prev), expenses[0]);
  return { amount: Number(biggest.amount).toLocaleString(), category: biggest.category || 'Uncategorized' };
};

/**
 * Most frequent payment method.
 */
export const getMostFrequentMethod = (expenses) => {
  const freq = {};
  expenses.forEach((e) => {
    const method = e.paymentMethod || 'Other';
    freq[method] = (freq[method] || 0) + 1;
  });
  const entries = Object.entries(freq);
  if (!entries.length) return '-';
  const [method] = entries.reduce((prev, cur) => (cur[1] > prev[1] ? cur : prev), entries[0]);
  return method;
};

/**
 * Spending trend compared to previous equivalent period (percentage change).
 * For simplicity, we compare the filtered expenses against the previous month
 * manually here if the active range is this_month. Otherwise, return 0 if unsupported.
 */
export const getSpendingTrend = (expenses, allExpenses, rangeType = 'this_month') => {
  if (rangeType !== 'this_month') return { percent: 0 };
  
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevExpenses = allExpenses.filter((e) => {
    const d = new Date(e.date);
    return e.type === 'expense' && d.getFullYear() === prevMonth.getFullYear() && d.getMonth() === prevMonth.getMonth();
  });
  
  const sumCurr = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const sumPrev = prevExpenses.reduce((s, e) => s + Number(e.amount), 0);
  
  if (!sumPrev) return { percent: 0 };
  const change = ((sumCurr - sumPrev) / sumPrev) * 100;
  return { percent: change.toFixed(1) };
};

/**
 * Suggest a savings opportunity – the category with the highest spend but low frequency.
 * Simple heuristic: highest spend / number of transactions.
 */
export const getSavingsOpportunity = (expenses) => {
  const catMap = {};
  expenses.forEach((e) => {
    const cat = e.category || 'Uncategorized';
    if (!catMap[cat]) catMap[cat] = { total: 0, count: 0 };
    catMap[cat].total += Number(e.amount);
    catMap[cat].count += 1;
  });
  const entries = Object.entries(catMap);
  if (!entries.length) return { category: '-', reduction: 0 };
  // compute spend per transaction ratio, higher means possible waste
  const best = entries.reduce((prev, cur) => {
    const curRatio = cur[1].total / cur[1].count;
    const prevRatio = prev[1].total / prev[1].count;
    return curRatio > prevRatio ? cur : prev;
  }, entries[0]);
  const reduction = (best[1].total * 0.1).toFixed(0); // suggest 10% cut
  return { category: best[0], reduction };
};
