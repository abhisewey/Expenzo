import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';
import { generateId } from '../utils/generateId';
import { useAuth } from './AuthContext';
import { expenseCategories, incomeCategories } from '../data/categories';
import { getBudgets, recalculateSpent, updateBudgetLimit } from '../utils/budgetHelpers';
import { filterTransactionsByDateRange } from '../utils/dateHelpers';

export const ExpenseContext = createContext();

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
  // Loading state for user-switch transitions — prevents stale data flash
  const [isLoading, setIsLoading] = useState(true);
  // Shared active time filter for cross-component synchronization
  const [activeTimeFilter, setActiveTimeFilter] = useState('this_month');
  // Track previous user to detect user switches
  const prevUserRef = useRef(null);
  const { user } = useAuth();
  // Derived expenses array (filtered from transactions)
  const expenses = useMemo(() =>
    transactions.filter(t => t.type === 'expense'),
    [transactions]
  );
  
  // Dynamic localStorage key generator
  const getUserKey = useCallback((type) => {
    if (!user || !user.email) return null;
    return `${type}_${user.email}`;
  }, [user]);

  // Memoize storage keys to prevent unnecessary re-renders
  const keys = useMemo(() => ({
    transactions: getUserKey('transactions'),
    budgets: getUserKey('budgets'),
    wallets: getUserKey('wallets'),
    settings: getUserKey('settings')
  }), [getUserKey]);

  // Load functions that automatically scope to current user
  const loadUserData = useCallback(() => {
    // Detect user switch — show loading indicator during transition
    const currentEmail = user?.email || null;
    const isUserSwitch = prevUserRef.current !== currentEmail;
    if (isUserSwitch) {
      setIsLoading(true);
      prevUserRef.current = currentEmail;
    }

    if (keys.transactions) {
      const storedTxns = getFromLocalStorage(keys.transactions, null);
      if (storedTxns === null) {
        // First-time user: seed with onboarding data
        setTransactions(seedTransactions);
        saveToLocalStorage(keys.transactions, seedTransactions);
      } else {
        setTransactions(storedTxns);
      }
      
      // Load budgets, wallets, settings — fully scoped to this user
      setBudgetsState(getFromLocalStorage(keys.budgets, {}));
      setWallets(getFromLocalStorage(keys.wallets, []));
      setUserSettings(getFromLocalStorage(keys.settings, { income: 0, currency: 'INR', theme: 'dark' }));
    } else {
      // Safe fallback to empty state for new/logged-out users
      setTransactions([]);
      setBudgetsState({});
      setWallets([]);
      setUserSettings({ income: 0, currency: 'INR', theme: 'dark' });
    }

    // Reset time filter on user switch to prevent stale filter state
    if (isUserSwitch) {
      setActiveTimeFilter('this_month');
      // Brief delay to allow React batch updates to flush before hiding loader
      requestAnimationFrame(() => setIsLoading(false));
    }
  }, [keys, user]);

  // Load data on mount or when user changes
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Persist to localStorage whenever core data updates
  useEffect(() => {
    if (keys.transactions && transactions.length > 0) {
      saveToLocalStorage(keys.transactions, transactions);
    }
    if (keys.budgets) {
      saveToLocalStorage(keys.budgets, budgets);
    }
    if (keys.wallets) {
      saveToLocalStorage(keys.wallets, wallets);
    }
    if (keys.settings) {
      saveToLocalStorage(keys.settings, userSettings);
    }
  }, [transactions, budgets, wallets, userSettings, keys]);

  // Toast controls — useCallback-wrapped for referential stability
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // CRUD Operations — wrapped in useCallback to prevent child re-renders
  const addExpense = useCallback((txnData) => {
    // Guard against future dates — clamp to today if ahead
    const today = new Date().toISOString().substring(0, 10);
    const txnDate = txnData.date && txnData.date > today ? today : txnData.date;
    const newTxn = {
      ...txnData,
      date: txnDate || today,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTxn, ...prev]);
    showToast(`${txnData.type === 'expense' ? 'Expense' : 'Income'} added successfully!`, 'success');
  }, [showToast]);

  const updateExpense = useCallback((id, updatedData) => {
    setTransactions(prev => 
      prev.map(txn => (txn.id === id ? { ...txn, ...updatedData, updatedAt: new Date().toISOString() } : txn))
    );
    showToast('Transaction updated successfully!', 'success');
  }, [showToast]);

  const deleteExpense = useCallback((id) => {
    setTransactions(prev => prev.filter(txn => txn.id !== id));
    showToast('Transaction deleted successfully!', 'success');
  }, [showToast]);

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
    // Date range handling via dateHelpers
    if (dateRange && dateRange !== 'custom') {
      result = filterTransactionsByDateRange(result, dateRange);
    } else if (dateRange === 'custom') {
      const start = customFrom ? new Date(customFrom) : null;
      const end = customTo ? new Date(customTo) : null;
      if (start && end) {
        // Normalize end date to end of day for inclusive filtering
        end.setHours(23, 59, 59, 999);
        result = result.filter(t => {
          const d = new Date(t.date);
          return d >= start && d <= end;
        });
      }
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

  // Budget operations wrappers — memoized
  const updateBudget = useCallback((categoryId, newLimit) => {
    updateBudgetLimit(categoryId, newLimit);
    const updated = getBudgets();
    setBudgetsState(updated);
  }, []);

  const recalcBudgets = useCallback(() => {
    recalculateSpent(transactions);
    setBudgetsState(getBudgets());
  }, [transactions]);

  // Watch transactions to recompute budgets automatically
  useEffect(() => {
    recalcBudgets();
  }, [recalcBudgets]);

  // Memoize context value to prevent unnecessary downstream re-renders
  const value = useMemo(() => ({
    expenses,
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
    setWallets,
    setUserSettings,
    // New: loading and time filter state for cross-component use
    isLoading,
    activeTimeFilter,
    setActiveTimeFilter,
  }), [
    expenses, transactions, filteredTransactions, stats, budgets, wallets,
    userSettings, filters, updateBudget, recalcBudgets, toast, showToast,
    hideToast, addExpense, updateExpense, deleteExpense, isLoading,
    activeTimeFilter
  ]);

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
