/* src/utils/filterHelpers.js */
/**
 * Helper utilities for filtering, sorting and date calculations on expenses.
 * All functions are pure and do not depend on React.
 */

/**
 * Returns a Date object representing the start of the given period.
 * period can be:
 *  - "thisMonth"
 *  - "last3Months"
 *  - "custom" (requires {customStart, customEnd})
 */
export const getPeriodStart = (period, customStart) => {
  const now = new Date();
  if (period === 'thisMonth') {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  if (period === 'last3Months') {
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    return start;
  }
  if (period === 'custom' && customStart) {
    return new Date(customStart);
  }
  return null;
};

/**
 * Returns a Date object representing the end of the given period.
 * For "custom" you must provide customEnd.
 */
export const getPeriodEnd = (period, customEnd) => {
  const now = new Date();
  if (period === 'thisMonth') {
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }
  if (period === 'last3Months') {
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return end;
  }
  if (period === 'custom' && customEnd) {
    return new Date(customEnd);
  }
  return null;
};

/**
 * Core filter function.
 * @param {Array} expenses - array of expense objects {title, merchant, category, paymentMethod, amount, date}
 * @param {Object} filters - {search, categories, methods, datePeriod, customStart, customEnd, amountRange}
 * @returns filtered array
 */
export const filterExpenses = (expenses, filters) => {
  const {
    search = '',
    categories = [],
    methods = [],
    datePeriod = 'thisMonth',
    customStart,
    customEnd,
    amountRange = [0, Infinity],
  } = filters;

  const start = getPeriodStart(datePeriod, customStart);
  const end = getPeriodEnd(datePeriod, customEnd);

  return expenses.filter((exp) => {
    // search by title or merchant (case‑insensitive)
    const hay = `${exp.title || ''} ${exp.merchant || ''}`.toLowerCase();
    if (search && !hay.includes(search.toLowerCase())) return false;

    // category multi‑select
    if (categories.length && (!exp.category || !categories.includes(exp.category))) return false;

    // payment method multi‑select
    if (methods.length && (!exp.paymentMethod || !methods.includes(exp.paymentMethod))) return false;

    // date range
    if (start && end) {
      const d = new Date(exp.date);
      if (d < start || d > end) return false;
    }

    // amount range (inclusive)
    const amt = Number(exp.amount);
    if (amt < amountRange[0] || amt > amountRange[1]) return false;

    return true;
  });
};

/**
 * Sorting helper – returns a new sorted array.
 * sortOption values:
 *  - "latest"
 *  - "oldest"
 *  - "high"
 *  - "low"
 */
export const sortExpenses = (expenses, sortOption) => {
  const copy = [...expenses];
  switch (sortOption) {
    case 'latest':
      return copy.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'oldest':
      return copy.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'high':
      return copy.sort((a, b) => Number(b.amount) - Number(a.amount));
    case 'low':
      return copy.sort((a, b) => Number(a.amount) - Number(b.amount));
    default:
      return copy;
  }
};
