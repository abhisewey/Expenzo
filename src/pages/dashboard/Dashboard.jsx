import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';
import { useExpense } from '../../context/ExpenseContext';
import CountUp from 'react-countup';

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
  const { stats, transactions, userSettings } = useExpense();
  const { totalIncome, totalExpenses, totalBalance, savingsRate } = stats;

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
        {/* Total Balance */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Total Balance</span>
            <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>💰</div>
          </div>
          <div className={styles.statValue}>
            <CountUp start={0} end={totalBalance} duration={1.2} separator="," prefix="₹" />
          </div>
          {/* No trend for balance */}
        </div>

        {/* Monthly Income */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Monthly Income</span>
            <div className={styles.statIcon} style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>💵</div>
          </div>
          <div className={styles.statValue}>
            <CountUp start={0} end={userSettings.income} duration={1.2} separator="," prefix="₹" />
          </div>
          {/** Trend calculation for income */}
          {(() => {
            const now = new Date();
            const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const prevIncome = transactions
              .filter(t => t.type === 'income' && new Date(t.date).getFullYear() === prevMonth.getFullYear() && new Date(t.date).getMonth() === prevMonth.getMonth())
              .reduce((sum, t) => sum + Number(t.amount), 0);
            const change = prevIncome ? ((userSettings.income - prevIncome) / prevIncome) * 100 : 0;
            const isPositive = change >= 0;
            const colorClass = isPositive ? styles.changePositive : styles.changeNegative;
            return (
              <div className={`${styles.statChange} ${colorClass}`}>\
                <span>{isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%</span> vs last month
              </div>
            );
          })()}
        </div>

        {/* Monthly Expenses */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Monthly Expenses</span>
            <div className={styles.statIcon} style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>📉</div>
          </div>
          <div className={styles.statValue}>
            <CountUp start={0} end={totalExpenses} duration={1.2} separator="," prefix="₹" />
          </div>
          {(() => {
            const now = new Date();
            const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const prevExp = transactions
              .filter(t => t.type === 'expense' && new Date(t.date).getFullYear() === prevMonth.getFullYear() && new Date(t.date).getMonth() === prevMonth.getMonth())
              .reduce((sum, t) => sum + Number(t.amount), 0);
            const change = prevExp ? ((totalExpenses - prevExp) / prevExp) * 100 : 0;
            const isPositive = change <= 0; // lower expense is positive
            const colorClass = isPositive ? styles.changePositive : styles.changeNegative;
            return (
              <div className={`${styles.statChange} ${colorClass}`}>\
                <span>{isPositive ? '↓' : '↑'} {Math.abs(change).toFixed(1)}%</span> vs last month
              </div>
            );
          })()}
        </div>

        {/* Savings Rate */}
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Savings Rate</span>
            <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>📈</div>
          </div>
          <div className={styles.statValue}>\
            {totalIncome > 0 ? ( ((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : '0' }%\
          </div>
          {(() => {
            const now = new Date();
            const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const prevIncome = transactions
              .filter(t => t.type === 'income' && new Date(t.date).getFullYear() === prevMonth.getFullYear() && new Date(t.date).getMonth() === prevMonth.getMonth())
              .reduce((sum, t) => sum + Number(t.amount), 0);
            const prevExp = transactions
              .filter(t => t.type === 'expense' && new Date(t.date).getFullYear() === prevMonth.getFullYear() && new Date(t.date).getMonth() === prevMonth.getMonth())
              .reduce((sum, t) => sum + Number(t.amount), 0);
            const prevRate = prevIncome > 0 ? ((prevIncome - prevExp) / prevIncome) * 100 : 0;
            const currRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
            const change = prevRate ? ((currRate - prevRate) / Math.abs(prevRate)) * 100 : 0;
            const isPositive = change >= 0;
            const colorClass = isPositive ? styles.changePositive : styles.changeNegative;
            return (
              <div className={`${styles.statChange} ${colorClass}`}>\
                <span>{isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%</span> vs last month
              </div>
            );
          })()}
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
