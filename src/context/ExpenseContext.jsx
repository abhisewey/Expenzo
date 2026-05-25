import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';
import { generateId } from '../utils/generateId';
import { useAuth } from './AuthContext';
import { expenseCategories, incomeCategories } from '../data/categories';

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
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [toast, setToast] = useState(null);
  
  // Storage key mapped to logged in user ID so multiple users don't share data on the same machine
  const storageKey = user ? `expenzo_txns_${user.id}` : null;

  // Load transactions on mount or when user changes. Loads seed data if storage is completely clean.
  useEffect(() => {
    if (storageKey) {
      const storedTxns = getFromLocalStorage(storageKey, null);
      if (storedTxns === null) {
        // First-time onboarding seed
        setTransactions(seedTransactions);
        saveToLocalStorage(storageKey, seedTransactions);
      } else {
        setTransactions(storedTxns);
      }
    } else {
      setTransactions([]);
    }
  }, [storageKey]);

  // Persist to localStorage whenever transactions array updates
  useEffect(() => {
    if (storageKey && transactions.length > 0) {
      saveToLocalStorage(storageKey, transactions);
    }
  }, [transactions, storageKey]);

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

  // Derived Calculations computed dynamically in memory
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(txn => {
      const amount = Number(txn.amount);
      if (txn.type === 'income') {
        totalIncome += amount;
      } else if (txn.type === 'expense') {
        totalExpenses += amount;
      }
    });

    const totalBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Calculate Expense Category Breakdown
    const expenseByCategory = {};
    transactions.filter(t => t.type === 'expense').forEach(txn => {
      if (expenseByCategory[txn.category]) {
        expenseByCategory[txn.category] += Number(txn.amount);
      } else {
        expenseByCategory[txn.category] = Number(txn.amount);
      }
    });

    // Format breakdown for pie chart dynamically
    const categoryBreakdown = Object.keys(expenseByCategory).map(catName => {
      const amount = expenseByCategory[catName];
      const categoryConfig = [...expenseCategories, ...incomeCategories].find(c => c.name === catName) || { color: '#94a3b8' }; 
      
      return {
        category: catName,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
        color: categoryConfig.color
      };
    }).sort((a, b) => b.amount - a.amount); // sort largest first

    return {
      totalIncome,
      totalExpenses,
      totalBalance,
      savingsRate: savingsRate.toFixed(1),
      categoryBreakdown
    };
  }, [transactions]);

  const value = {
    transactions,
    stats,
    toast,
    showToast,
    hideToast,
    addExpense,
    updateExpense,
    deleteExpense
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
