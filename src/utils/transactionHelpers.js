/**
 * src/utils/transactionHelpers.js
 * Utility functions for filtering, grouping, and processing transactions.
 */

/**
 * Filters transactions based on the selected payment method.
 */
export const filterTransactionsByPayment = (transactions, paymentFilter) => {
  if (!transactions) return [];
  if (paymentFilter === 'All Methods' || !paymentFilter) return [...transactions];
  return transactions.filter(t => t.paymentMethod === paymentFilter);
};

/**
 * Groups transactions chronologically by Month/Year format (e.g., 'May 2026').
 * Also calculates total spent per month group.
 */
export const groupTransactionsByMonthYear = (transactions) => {
  const grouped = {};
  
  // Sort descending by date
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  sorted.forEach(t => {
    const d = new Date(t.date);
    if (isNaN(d.getTime())) return;
    
    const monthYear = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = { transactions: [], totalSpent: 0 };
    }
    grouped[monthYear].transactions.push(t);
    
    if (t.type === 'expense') {
      grouped[monthYear].totalSpent += Number(t.amount) || 0;
    }
  });
  
  return grouped;
};
