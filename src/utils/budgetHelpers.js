/* src/utils/budgetHelpers.js */
// Helper for storing and retrieving budgets per category in localStorage.
// Budgets shape: { [categoryId]: { limit: number, spent: number } }

const getStorageKey = () => {
  try {
    const sessionStr = localStorage.getItem('expenzo_session');
    if (sessionStr) {
      const user = JSON.parse(sessionStr);
      if (user && user.email) {
        return `budgets_${user.email}`;
      }
    }
  } catch (e) {
    // Ignore error
  }
  return 'expenzo_budgets'; // Fallback
};

/**
 * Get all budgets from localStorage.
 * Returns an object mapping categoryId to { limit, spent }.
 */
export const getBudgets = () => {
  try {
    const key = getStorageKey();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Failed to parse budgets from localStorage', e);
    return {};
  }
};

/**
 * Save budgets object to localStorage.
 */
export const setBudgets = (budgets) => {
  const key = getStorageKey();
  localStorage.setItem(key, JSON.stringify(budgets));
};

/**
 * Update budget limit for a specific category.
 * @param {string} categoryId
 * @param {number} newLimit
 */
export const updateBudgetLimit = (categoryId, newLimit) => {
  const budgets = getBudgets();
  const prev = budgets[categoryId] || { limit: 0, spent: 0 };
  budgets[categoryId] = { ...prev, limit: newLimit };
  setBudgets(budgets);
};

/**
 * Update spent amount for a category based on expenses.
 * Called whenever expenses change.
 * @param {Array} expenses – array of expense objects { amount, categoryId }
 */
export const recalculateSpent = (expenses) => {
  const budgets = getBudgets();
  // reset spent counters
  Object.keys(budgets).forEach((cat) => (budgets[cat].spent = 0));
  expenses.forEach((exp) => {
    const { category, amount } = exp;
    if (!budgets[category]) {
      budgets[category] = { limit: 0, spent: 0 };
    }
    budgets[category].spent += Number(amount);
  });
  setBudgets(budgets);
};

/**
 * Get progress percentage for a category (0-100).
 */
export const getProgress = (categoryId) => {
  const budgets = getBudgets();
  const b = budgets[categoryId];
  if (!b || b.limit === 0) return 0;
  return Math.min(100, Math.round((b.spent / b.limit) * 100));
};

/**
 * Determine progress bar color based on percentage.
 */
export const getProgressColor = (percent) => {
  if (percent < 70) return '#10b981'; // green
  if (percent < 90) return '#f59e0b'; // amber
  return '#ef4444'; // red
};

/**
 * Get remaining amount (positive if under budget, negative if over).
 */
export const getRemaining = (categoryId) => {
  const budgets = getBudgets();
  const b = budgets[categoryId];
  if (!b) return 0;
  return b.limit - b.spent;
};
