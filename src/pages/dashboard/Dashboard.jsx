import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';

// Mock Data
const transactions = [
  { id: 1, title: 'Salary Credit', category: 'Income', amount: 85000, type: 'income', date: 'Today, 09:00 AM', icon: '💰', iconBg: 'rgba(16, 185, 129, 0.15)', iconColor: '#10b981' },
  { id: 2, title: 'Grocery at D-Mart', category: 'Food & Groceries', amount: 4200, type: 'expense', date: 'Yesterday, 06:30 PM', icon: '🛒', iconBg: 'rgba(245, 158, 11, 0.15)', iconColor: '#f59e0b' },
  { id: 3, title: 'Electricity Bill', category: 'Utilities', amount: 1450, type: 'expense', date: '23 May 2026', icon: '⚡', iconBg: 'rgba(6, 182, 212, 0.15)', iconColor: '#06b6d4' },
  { id: 4, title: 'Netflix Subscription', category: 'Entertainment', amount: 649, type: 'expense', date: '21 May 2026', icon: '🎬', iconBg: 'rgba(244, 63, 94, 0.15)', iconColor: '#f43f5e' },
  { id: 5, title: 'Uber Ride', category: 'Transport', amount: 350, type: 'expense', date: '19 May 2026', icon: '🚕', iconBg: 'rgba(139, 92, 246, 0.15)', iconColor: '#8b5cf6' },
];

const distribution = [
  { category: 'Housing', percentage: 35, color: '#8b5cf6', amount: '₹18,500' },
  { category: 'Food', percentage: 20, color: '#06b6d4', amount: '₹10,500' },
  { category: 'Transport', percentage: 15, color: '#10b981', amount: '₹7,900' },
  { category: 'Utilities', percentage: 10, color: '#f59e0b', amount: '₹5,200' },
  { category: 'Entertainment', percentage: 10, color: '#ec4899', amount: '₹5,200' },
  { category: 'Others', percentage: 10, color: '#94a3b8', amount: '₹5,200' },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div>
          <h1>Welcome back, {user?.username}!</h1>
          <p>Here's your financial overview for this month.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Total Spent</span>
            <div className={styles.statIcon} style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>📉</div>
          </div>
          <div className={styles.statValue}>₹52,500</div>
          <div className={`${styles.statChange} ${styles.changeNegative}`}>
            <span>↑ 12%</span> vs last month
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Monthly Budget</span>
            <div className={styles.statIcon} style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>🎯</div>
          </div>
          <div className={styles.statValue}>₹85,000</div>
          <div className={`${styles.statChange} ${styles.changeNeutral}`}>
            <span>61%</span> consumed
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Savings Rate</span>
            <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>📈</div>
          </div>
          <div className={styles.statValue}>38%</div>
          <div className={`${styles.statChange} ${styles.changePositive}`}>
            <span>↑ 4%</span> vs last month
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Top Category</span>
            <div className={styles.statIcon} style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>🏠</div>
          </div>
          <div className={styles.statValue}>Housing</div>
          <div className={`${styles.statChange} ${styles.changeNeutral}`}>
            <span>35%</span> of total expenses
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Recent Transactions List */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Recent Transactions</h2>
          <div className={styles.transactionList}>
            {transactions.map(txn => (
              <div key={txn.id} className={styles.transactionItem}>
                <div className={styles.transactionLeft}>
                  <div className={styles.transactionIcon} style={{ background: txn.iconBg, color: txn.iconColor }}>
                    {txn.icon}
                  </div>
                  <div className={styles.transactionInfo}>
                    <h4>{txn.title}</h4>
                    <p>{txn.category} • {txn.date}</p>
                  </div>
                </div>
                <div className={`${styles.transactionAmount} ${txn.type === 'income' ? styles.amountPositive : styles.amountNegative}`}>
                  {txn.type === 'income' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Distribution CSS Chart */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Expense Distribution</h2>
          <div className={styles.chartList}>
            {distribution.map((item, index) => (
              <div key={index} className={styles.chartItem}>
                <div className={styles.chartItemHeader}>
                  <span>{item.category}</span>
                  <span>{item.percentage}% ({item.amount})</span>
                </div>
                <div className={styles.progressBarContainer}>
                  <div 
                    className={styles.progressBar} 
                    style={{ width: `${item.percentage}%`, background: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className={styles.fab} title="Add New Expense">
        +
      </button>
    </div>
  );
};

export default Dashboard;
