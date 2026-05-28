/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';
import { generateId } from '../utils/generateId';
import { useAuth } from './AuthContext';
import { expenseCategories, incomeCategories } from '../data/categories';
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



// Default seed custom categories (extends the static ones stored in data/categories.js)
const seedCustomCategories = [];

export const ExpenseProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [toast, setToast] = useState(null);
  // budgets: payment-method account balances (UPI, Cash, Credit Card, etc.)
  const [budgets, setBudgets] = useState([]);

  // customCategories: user-defined categories persisted to localStorage
  const [customCategories, setCustomCategories] = useState([]);
  const [userSettings, setUserSettings] = useState({ income: 0, currency: 'INR', theme: 'dark' });
  const [filters, setFilters] = useState({ search: '', categories: [], methods: [], dateRange: 'this_month', customFrom: null, customTo: null, amountRange: [0, Infinity], sort: 'latest' });
  // Loading state for user-switch transitions
  const [isLoading, setIsLoading] = useState(true);
  // Shared active time filter for cross-component synchronization
  const [activeTimeFilter, setActiveTimeFilter] = useState('this_month');
  // Track previous user to detect user switches
  const prevUserRef = useRef(null);
  const { user } = useAuth();

  // Derived expenses array
  const expenses = useMemo(() =>
    transactions.filter(t => t.type === 'expense'),
    [transactions]
  );

  // Dynamic localStorage key generator — scoped per user email
  const getUserKey = useCallback((type) => {
    if (!user || !user.email) return null;
    return `${type}_${user.email}`;
  }, [user]);

  const keys = useMemo(() => ({
    transactions: getUserKey('transactions'),
    budgets: getUserKey('wallets'),       // kept as 'wallets' for backward compat
    customCategories: getUserKey('custom_categories'),
    settings: getUserKey('settings')
  }), [getUserKey]);

  // Load all user data on mount / user switch
  const loadUserData = useCallback(() => {
    const currentEmail = user?.email || null;
    const isUserSwitch = prevUserRef.current !== currentEmail;
    if (isUserSwitch) {
      setIsLoading(true);
      prevUserRef.current = currentEmail;
    }

    if (keys.transactions) {
      const storedTxns = getFromLocalStorage(keys.transactions, null);
      if (storedTxns === null) {
        setTransactions(seedTransactions);
        saveToLocalStorage(keys.transactions, seedTransactions);
      } else {
        setTransactions(storedTxns);
      }

      setBudgets(getFromLocalStorage(keys.budgets, []));

      setCustomCategories(getFromLocalStorage(keys.customCategories, seedCustomCategories));
      setUserSettings(getFromLocalStorage(keys.settings, { income: 0, currency: 'INR', theme: 'dark' }));
    } else {
      setTransactions([]);
      setBudgets([]);
      setCustomCategories([]);
      setUserSettings({ income: 0, currency: 'INR', theme: 'dark' });
    }

    if (isUserSwitch) {
      setActiveTimeFilter('this_month');
      requestAnimationFrame(() => setIsLoading(false));
    }
  }, [keys, user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Persist all state to localStorage on change
  useEffect(() => {
    if (keys.transactions && transactions.length > 0) saveToLocalStorage(keys.transactions, transactions);
    if (keys.budgets) saveToLocalStorage(keys.budgets, budgets);
    if (keys.customCategories) saveToLocalStorage(keys.customCategories, customCategories);
    if (keys.settings) saveToLocalStorage(keys.settings, userSettings);
  }, [transactions, budgets, customCategories, userSettings, keys]);

  // ─── Toast helpers ────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // ─── Transaction CRUD ─────────────────────────────────────────────────────
  const addExpense = useCallback((txnData) => {
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



  // ─── Category CRUD ────────────────────────────────────────────────────────
  const addCustomCategory = useCallback((catData) => {
    const newCat = { ...catData, id: generateId(), isCustom: true, createdAt: new Date().toISOString() };
    setCustomCategories(prev => [...prev, newCat]);
    showToast('Category created!', 'success');
    return newCat;
  }, [showToast]);

  const updateCustomCategory = useCallback((id, updatedData) => {
    setCustomCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
    showToast('Category updated!', 'success');
  }, [showToast]);

  const deleteCustomCategory = useCallback((id) => {
    setCustomCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted.', 'info');
  }, [showToast]);



  // ─── All available categories (static + custom) ───────────────────────────
  const allExpenseCategories = useMemo(() => [
    ...expenseCategories,
    ...customCategories.filter(c => c.type === 'expense')
  ], [customCategories]);

  const allIncomeCategories = useMemo(() => [
    ...incomeCategories,
    ...customCategories.filter(c => c.type === 'income')
  ], [customCategories]);

  // ─── Derived analytics ────────────────────────────────────────────────────
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
    const allCats = [...expenseCategories, ...incomeCategories, ...customCategories];
    const expenseByCategory = {};
    transactions.filter(t => t.type === 'expense').forEach(txn => {
      expenseByCategory[txn.category] = (expenseByCategory[txn.category] || 0) + Number(txn.amount);
    });
    const categoryBreakdown = Object.entries(expenseByCategory).map(([cat, amt]) => {
      const cfg = allCats.find(c => c.name === cat) || { color: '#94a3b8' };
      return { category: cat, amount: amt, percentage: totalExpenses ? Math.round((amt / totalExpenses) * 100) : 0, color: cfg.color };
    }).sort((a, b) => b.amount - a.amount);
    return { totalIncome, totalExpenses, totalBalance, savingsRate: savingsRate.toFixed(1), categoryBreakdown };
  }, [transactions, customCategories]);

  // ─── Filtered transactions ────────────────────────────────────────────────
  const filteredTransactions = useMemo(() => {
    const { search, categories, methods, dateRange, customFrom, customTo, amountRange, sort } = filters;
    let result = [...transactions];
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(t => (`${t.title || ''} ${t.merchant || ''}`).toLowerCase().includes(lower));
    }
    if (categories.length) result = result.filter(t => categories.includes(t.category));
    if (methods.length) result = result.filter(t => methods.includes(t.paymentMethod));
    if (dateRange && dateRange !== 'custom') {
      result = filterTransactionsByDateRange(result, dateRange);
    } else if (dateRange === 'custom') {
      const start = customFrom ? new Date(customFrom) : null;
      const end = customTo ? new Date(customTo) : null;
      if (start && end) {
        end.setHours(23, 59, 59, 999);
        result = result.filter(t => {
          const d = new Date(t.date);
          return d >= start && d <= end;
        });
      }
    }
    const [minAmt, maxAmt] = amountRange;
    result = result.filter(t => {
      const val = Number(t.amount);
      return val >= minAmt && val <= maxAmt;
    });
    if (sort === 'latest') result.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sort === 'oldest') result.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sort === 'high') result.sort((a, b) => Number(b.amount) - Number(a.amount));
    else if (sort === 'low') result.sort((a, b) => Number(a.amount) - Number(b.amount));
    return result;
  }, [transactions, filters]);

  // ─── Context value ────────────────────────────────────────────────────────
  const value = useMemo(() => ({
    expenses, transactions, filteredTransactions, stats,
    budgets, setBudgets,
    customCategories, allExpenseCategories, allIncomeCategories,
    addCustomCategory, updateCustomCategory, deleteCustomCategory,
    userSettings, setUserSettings,
    filters, setFilters,
    toast, showToast, hideToast,
    addExpense, updateExpense, deleteExpense,
    isLoading, activeTimeFilter, setActiveTimeFilter,
  }), [
    expenses, transactions, filteredTransactions, stats,
    budgets,
    customCategories, allExpenseCategories, allIncomeCategories,
    addCustomCategory, updateCustomCategory, deleteCustomCategory,
    userSettings, filters, toast, showToast,
    hideToast, addExpense, updateExpense, deleteExpense, isLoading, activeTimeFilter
  ]);

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
