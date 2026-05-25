import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';
import { generateId } from '../utils/generateId';
import { useAuth } from './AuthContext';
import { expenseCategories, incomeCategories } from '../data/categories';
import { getBudgets, setBudgets, updateBudgetLimit, recalculateSpent, getProgress } from '../utils/budgetHelpers';
import { getFromLocalStorage as getLS, saveToLocalStorage as saveLS } from '../utils/localStorage';

const ExpenseContext = createContext();

export const useExpense = () => {
  return useContext(ExpenseContext);
};

// Rich initial onboarding seed data mapping to the established categories
const seedTransactions = [
  { id: 's1', title: 'Salary Credit', merchant: 'Tech Corp Inc.', category: 'Salary', amount: 85000, type: 'income', date: '2026-05-25', status: 'Completed', paymentMethod: 'Bank Transfer' },
  { id: 's2', title: 'Grocery Shopping', merchant: 'D-Mart', category: 'Groceries', amount: 4200, type: 'expense', date: '2026-05-24', status: 'Completed', paymentMethod: 'UPI' },
  { id: 's3', title: 'Electricity Bill', merchant: 'State Power Board', category: 'Bills', amount: 1450, type: 'expense', date: '2026-05-23', status: 'Completed', paymentMethod: 'UPI' },
  { id: 's4', title: 'Netflix Subscription', merchant: 'Netflix India', category: 'Entertainment', amount: 649, type: 'expense', date: '2026-05-21', status: 'Completed', paymentMethod: 'Credit Card' },
  { id: 's5', title: 'Cab Ride', merchant: 'Uber', category: 'Transport', amount: 350, type: 'expense', date: '2026-05-19', status: 'Completed', paymentMethod: 'UPI' },
  { id: 's6', title: 'New Sneakers', merchant: 'Nike Store', category: 'Shopping', amount: 8500, type: 'expense', date: '2026-05-18', status: 'Completed', paymentMethod: 'Credit Card' },
  { id: 's7', title: 'Coffee Run', merchant: 'Starbucks', category: 'Food', amount: 320, type: 'expense', date: '2026-05-18', status: 'Completed', paymentMethod: 'UPI' },
  { id: 's8', title: 'Freelance Design', merchant: 'Upwork Client', category: 'Freelance', amount: 24500, type: 'income', date: '2026-05-15', status: 'Completed', paymentMethod: 'Bank Transfer' }
];

export const ExpenseProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [toast, setToast] = useState(null);
  const [budgets, setBudgetsState] = useState({});
  const [wallets, setWallets] = useState([]);
  const [userSettings, setUserSettings] = useState({ income: 0, currency: 'INR', theme: 'dark' });
  const [filters, setFilters] = useState({ search: '', categories: [], methods: [], dateRange: 'this_month', customFrom: null, customTo: null, amountRange: [0, Infinity], sort: 'latest' });
  const { user } = useAuth();
  // Derived expenses array (filtered from transactions)
  const expenses = useMemo(() =>
    transactions.filter(t => t.type === 'expense'),
    [transactions]
  );
  
  // Storage keys per user
  const storageKey = user ? `expenzo_txns_${user.id}` : null;
  const budgetsKey = user ? `expenzo_budgets_${user.id}` : null;
  const walletsKey = user ? `expenzo_wallets_${user.id}` : null;
  const settingsKey = user ? `expenzo_settings_${user.id}` : null;

  // Load transactions and auxiliary data on mount or when user changes.
  useEffect(() => {
    if (storageKey) {
      const storedTxns = getFromLocalStorage(storageKey, null);
      if (storedTxns === null) {
        setTransactions(seedTransactions);
        saveToLocalStorage(storageKey, seedTransactions);
      } else {
        setTransactions(storedTxns);
      }
      // Load budgets, wallets, settings
      const storedBudgets = getFromLocalStorage(budgetsKey, {});
      setBudgetsState(storedBudgets);
      const storedWallets = getFromLocalStorage(walletsKey, []);
      setWallets(storedWallets);
      const storedSettings = getFromLocalStorage(settingsKey, { income: 0, currency: 'INR', theme: 'dark' });
      setUserSettings(storedSettings);
    } else {
      setTransactions([]);
      setBudgetsState({});
      setWallets([]);
      setUserSettings({ income: 0, currency: 'INR', theme: 'dark' });
    }
  }, [storageKey]);

  // Persist to localStorage whenever core data updates
  useEffect(() => {
    if (storageKey && transactions.length > 0) {
      saveToLocalStorage(storageKey, transactions);
    }
    if (budgetsKey) {
      saveToLocalStorage(budgetsKey, budgets);
    }
    if (walletsKey) {
      saveToLocalStorage(walletsKey, wallets);
    }
    if (settingsKey) {
      saveToLocalStorage(settingsKey, userSettings);
    }
  }, [transactions, budgets, wallets, userSettings, storageKey, budgetsKey, walletsKey, settingsKey]);

  // Toast controls
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  // CRUD Operations
  const addExpense = (txnData) => {
    const newTxn = {
      ...txnData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTxn, ...prev]);
    showToast(`${txnData.type === 'expense' ? 'Expense' : 'Income'} added successfully!`, 'success');
  };

  const updateExpense = (id, updatedData) => {
    setTransactions(prev => 
      prev.map(txn => (txn.id === id ? { ...txn, ...updatedData, updatedAt: new Date().toISOString() } : txn))
    );
    showToast('Transaction updated successfully!', 'success');
  };

  const deleteExpense = (id) => {
    setTransactions(prev => prev.filter(txn => txn.id !== id));
    showToast('Transaction deleted successfully!', 'success');
  };

  // Derived analytics – memoized for performance
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    transactions.forEach(txn => {
      const amount = Number(txn.amount);
      if (txn.type === 'income') totalIncome += amount;
      else if (txn.type === 'expense') totalExpenses += amount;
    });
    const totalBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    // Category breakdown for analytics
    const expenseByCategory = {};
    transactions.filter(t => t.type === 'expense').forEach(txn => {
      expenseByCategory[txn.category] = (expenseByCategory[txn.category] || 0) + Number(txn.amount);
    });
    const categoryBreakdown = Object.entries(expenseByCategory).map(([cat, amt]) => {
      const cfg = [...expenseCategories, ...incomeCategories].find(c => c.name === cat) || { color: '#94a3b8' };
      return { category: cat, amount: amt, percentage: totalExpenses ? Math.round((amt / totalExpenses) * 100) : 0, color: cfg.color };
    }).sort((a, b) => b.amount - a.amount);
    return { totalIncome, totalExpenses, totalBalance, savingsRate: savingsRate.toFixed(1), categoryBreakdown };
  }, [transactions]);

  // Filtered transactions based on UI filters
  const filteredTransactions = useMemo(() => {
    // Simple filter logic – can be expanded using filterHelpers
    const { search, categories, methods, dateRange, customFrom, customTo, amountRange, sort } = filters;
    let result = [...transactions];
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(t => (`${t.title || ''} ${t.merchant || ''}`).toLowerCase().includes(lower));
    }
    if (categories.length) result = result.filter(t => categories.includes(t.category));
    if (methods.length) result = result.filter(t => methods.includes(t.paymentMethod));
    // Date range handling (basic)
    const now = new Date();
    const start = dateRange === 'this_month' ? new Date(now.getFullYear(), now.getMonth(), 1) :
                  dateRange === 'last_3_months' ? new Date(now.getFullYear(), now.getMonth() - 2, 1) :
                  customFrom ? new Date(customFrom) : null;
    const end = dateRange === 'this_month' ? new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999) :
                dateRange === 'last_3_months' ? new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999) :
                customTo ? new Date(customTo) : null;
    if (start && end) {
      result = result.filter(t => {
        const d = new Date(t.date);
        return d >= start && d <= end;
      });
    }
    // Amount range
    const [minAmt, maxAmt] = amountRange;
    result = result.filter(t => {
      const val = Number(t.amount);
      return val >= minAmt && val <= maxAmt;
    });
    // Sorting
    if (sort === 'latest') result.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sort === 'oldest') result.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sort === 'high') result.sort((a, b) => Number(b.amount) - Number(a.amount));
    else if (sort === 'low') result.sort((a, b) => Number(a.amount) - Number(b.amount));
    return result;
  }, [transactions, filters]);

  // Budget operations wrappers
  const updateBudget = (categoryId, newLimit) => {
    updateBudgetLimit(categoryId, newLimit);
    const updated = getBudgets();
    setBudgetsState(updated);
  };
  const recalcBudgets = () => {
    recalculateSpent(transactions);
    setBudgetsState(getBudgets());
  };

  // Watch transactions to recompute budgets automatically
  useEffect(() => {
    recalcBudgets();
  }, [transactions]);

  const value = {
    expenses,
    // existing values
    transactions,
    filteredTransactions,
    stats,
    budgets,
    wallets,
    userSettings,
    filters,
    setFilters,
    updateBudget,
    recalcBudgets,
    toast,
    showToast,
    hideToast,
    addExpense,
    updateExpense,
    deleteExpense,
    // wallet management
    setWallets,
    setUserSettings,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
