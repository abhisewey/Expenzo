export const transactionsData = [
  { id: 1, title: 'Salary Credit', category: 'Income', amount: 85000, type: 'income', date: 'Today, 09:00 AM' },
  { id: 2, title: 'Grocery at D-Mart', category: 'Food & Groceries', amount: 4200, type: 'expense', date: 'Yesterday, 06:30 PM' },
  { id: 3, title: 'Electricity Bill', category: 'Utilities', amount: 1450, type: 'expense', date: '23 May 2026' },
  { id: 4, title: 'Netflix Subscription', category: 'Entertainment', amount: 649, type: 'expense', date: '21 May 2026' },
  { id: 5, title: 'Uber Ride', category: 'Transport', amount: 350, type: 'expense', date: '19 May 2026' },
];

export const extendedTransactionsData = [
  { id: 1, title: 'Salary Credit', merchant: 'Tech Corp Inc.', category: 'Income', amount: 85000, type: 'income', date: 'Today, 09:00 AM', status: 'Completed', iconBg: 'rgba(16, 185, 129, 0.15)', iconColor: '#10b981' },
  { id: 2, title: 'Grocery Shopping', merchant: 'D-Mart', category: 'Food & Groceries', amount: 4200, type: 'expense', date: 'Yesterday, 06:30 PM', status: 'Completed', iconBg: 'rgba(245, 158, 11, 0.15)', iconColor: '#f59e0b' },
  { id: 3, title: 'Electricity Bill', merchant: 'State Electricity Board', category: 'Utilities', amount: 1450, type: 'expense', date: '23 May 2026', status: 'Completed', iconBg: 'rgba(6, 182, 212, 0.15)', iconColor: '#06b6d4' },
  { id: 4, title: 'Netflix Subscription', merchant: 'Netflix', category: 'Entertainment', amount: 649, type: 'expense', date: '21 May 2026', status: 'Completed', iconBg: 'rgba(244, 63, 94, 0.15)', iconColor: '#f43f5e' },
  { id: 5, title: 'Uber Ride', merchant: 'Uber', category: 'Transport', amount: 350, type: 'expense', date: '19 May 2026', status: 'Completed', iconBg: 'rgba(139, 92, 246, 0.15)', iconColor: '#8b5cf6' },
  { id: 6, title: 'New Sneakers', merchant: 'Nike Store', category: 'Shopping', amount: 8500, type: 'expense', date: '18 May 2026', status: 'Pending', iconBg: 'rgba(236, 72, 153, 0.15)', iconColor: '#ec4899' },
  { id: 7, title: 'Coffee Run', merchant: 'Starbucks', category: 'Food & Groceries', amount: 320, type: 'expense', date: '18 May 2026', status: 'Completed', iconBg: 'rgba(245, 158, 11, 0.15)', iconColor: '#f59e0b' },
  { id: 8, title: 'Freelance Payment', merchant: 'Upwork', category: 'Income', amount: 24500, type: 'income', date: '15 May 2026', status: 'Completed', iconBg: 'rgba(16, 185, 129, 0.15)', iconColor: '#10b981' },
];

export const distributionData = [
  { category: 'Housing', percentage: 35, color: '#8b5cf6', amount: '₹18,500' },
  { category: 'Food', percentage: 20, color: '#06b6d4', amount: '₹10,500' },
  { category: 'Transport', percentage: 15, color: '#10b981', amount: '₹7,900' },
  { category: 'Utilities', percentage: 10, color: '#f59e0b', amount: '₹5,200' },
  { category: 'Entertainment', percentage: 10, color: '#ec4899', amount: '₹5,200' },
  { category: 'Others', percentage: 10, color: '#94a3b8', amount: '₹5,200' },
];

export const summaryStats = {
  totalBalance: 284750,
  balanceChange: 14.5,
  monthlyIncome: 115000,
  incomeChange: 8.2,
  monthlyExpenses: 52400,
  expensesChange: 12.4, 
  savingsRate: 45.6,
  savingsChange: 2.4,
};
