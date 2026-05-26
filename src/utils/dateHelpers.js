/**
 * src/utils/dateHelpers.js
 * Robust date utilities for time-based analytics using native Date API.
 */

// Helper to format Date to ISO string date part (YYYY-MM-DD)
// This avoids timezone shifting issues seen with native toISOString()
const toISODate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start: toISODate(start), end: toISODate(end) };
};

export const getPreviousMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  return { start: toISODate(start), end: toISODate(end) };
};

export const getLastThreeMonthsRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start: toISODate(start), end: toISODate(end) };
};

export const getThisYearRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 12, 0, 23, 59, 59, 999);
  return { start: toISODate(start), end: toISODate(end) };
};

export const filterTransactionsByDateRange = (transactions, rangeType) => {
  if (!transactions || !Array.isArray(transactions)) return [];
  
  let range;
  switch (rangeType) {
    case 'current_month':
    case 'this_month':
      range = getCurrentMonthRange();
      break;
    case 'previous_month':
      range = getPreviousMonthRange();
      break;
    case 'last_3_months':
      range = getLastThreeMonthsRange();
      break;
    case 'this_year':
      range = getThisYearRange();
      break;
    default:
      return transactions;
  }
  
  // Guard: clamp end date to today to exclude future-dated transactions
  const today = toISODate(new Date());
  if (range.end > today) range.end = today;
  
  // Use string comparison since YYYY-MM-DD is alphabetically sortable
  return transactions.filter(t => {
    if (!t.date) return false;
    const tDate = t.date.substring(0, 10);
    return tDate >= range.start && tDate <= range.end;
  });
};

export const groupTransactionsByMonth = (transactions, rangeType) => {
  const filtered = filterTransactionsByDateRange(transactions, rangeType);
  
  // Determine the start and end dates to generate the list of months
  let startMonth, endMonth, startYear, endYear;
  const now = new Date();
  
  switch(rangeType) {
    case 'previous_month':
      startMonth = endMonth = now.getMonth() - 1;
      startYear = endYear = now.getFullYear();
      if (startMonth < 0) {
        startMonth = endMonth = 11;
        startYear = endYear = now.getFullYear() - 1;
      }
      break;
    case 'last_3_months':
      startMonth = now.getMonth() - 2;
      startYear = now.getFullYear();
      endMonth = now.getMonth();
      endYear = now.getFullYear();
      if (startMonth < 0) {
        startMonth += 12;
        startYear -= 1;
      }
      break;
    case 'this_year':
      startMonth = 0;
      endMonth = 11;
      startYear = endYear = now.getFullYear();
      break;
    case 'current_month':
    default:
      startMonth = endMonth = now.getMonth();
      startYear = endYear = now.getFullYear();
      break;
  }
  
  // Generate the zero-filled map for the months in range
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dataMap = new Map();
  
  let currentY = startYear;
  let currentM = startMonth;
  
  // Loop until we pass the end month/year
  while (currentY < endYear || (currentY === endYear && currentM <= endMonth)) {
    // Format: 'Jan 2026' or 'Jan' based on preference. Including year guarantees uniqueness
    const key = `${monthNames[currentM]} ${currentY}`;
    dataMap.set(key, { name: key, income: 0, expense: 0 });
    
    currentM++;
    if (currentM > 11) {
      currentM = 0;
      currentY++;
    }
  }
  
  // Aggregate data dynamically
  filtered.forEach(t => {
    const d = new Date(t.date);
    const m = d.getMonth();
    const y = d.getFullYear();
    const key = `${monthNames[m]} ${y}`;
    
    if (dataMap.has(key)) {
      const entry = dataMap.get(key);
      const amount = Number(t.amount) || 0;
      if (t.type === 'expense') {
        entry.expense += amount;
      } else if (t.type === 'income') {
        entry.income += amount;
      }
    }
  });
  
  return Array.from(dataMap.values());
};

export const groupExpensesByCategory = (transactions, rangeType) => {
  const filtered = filterTransactionsByDateRange(transactions, rangeType).filter(t => t.type === 'expense');
  
  const categoryMap = {};
  filtered.forEach(t => {
    const cat = t.category || 'Other';
    const amount = Number(t.amount) || 0;
    if (!categoryMap[cat]) {
      categoryMap[cat] = 0;
    }
    categoryMap[cat] += amount;
  });
  
  return Object.entries(categoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const groupTransactionsForBarChart = (transactions, rangeType) => {
  const filtered = filterTransactionsByDateRange(transactions, rangeType);
  
  const now = new Date();
  let dataMap = new Map();
  
  if (rangeType === 'this_month' || rangeType === 'previous_month') {
    // Weekly breakdown
    const targetDate = rangeType === 'this_month' ? now : new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const numWeeks = Math.ceil(daysInMonth / 7);
    for (let i = 1; i <= numWeeks; i++) {
      dataMap.set(`Week ${i}`, { month: `Week ${i}`, value: 0 });
    }
    
    filtered.forEach(t => {
      if (t.type === 'expense') {
        const d = new Date(t.date).getDate();
        const week = Math.ceil(d / 7);
        const key = `Week ${week}`;
        if (dataMap.has(key)) {
          dataMap.get(key).value += Number(t.amount) || 0;
        }
      }
    });
  } else {
    // Month-level breakdown
    const monthlyGroups = groupTransactionsByMonth(transactions, rangeType);
    monthlyGroups.forEach(g => {
      dataMap.set(g.name, { month: g.name, value: g.expense });
    });
  }
  
  return Array.from(dataMap.values());
};
