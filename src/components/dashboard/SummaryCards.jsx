import React from 'react';
import { FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiActivity } from 'react-icons/fi';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from '../../styles/components/dashboard.module.css';

const SummaryCards = () => {
  const { stats } = useExpense();

  return (
    <div className={styles.statsGrid}>
      {/* Card 1: Total Balance */}
      <div className={`${styles.statCard} ${styles.stagger1}`}>
        <div className={styles.statGradient1}></div>
        <div className={styles.statHeader}>
          <div className={styles.statTitleWrapper}>
            <span className={styles.statTitle}>Total Balance</span>
            <span className={styles.statSubtitle}>Across all accounts</span>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <FiDollarSign />
          </div>
        </div>
        <div className={styles.statValue}>{formatCurrency(stats.totalBalance)}</div>
        <div className={styles.statFooter}>
          <div className={`${styles.statChange} ${styles.changePositive}`}>
            <FiArrowUpRight /> 14.5%
          </div>
          <span className={styles.statCompared}>vs last month</span>
        </div>
        {/* Decorative Trend Line */}
        <div className={styles.trendLineContainer}>
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className={styles.trendLine}>
            <path d="M0,20 C20,15 30,20 50,10 C70,0 80,10 100,2" stroke="#8b5cf6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>

      {/* Card 2: Monthly Income */}
      <div className={`${styles.statCard} ${styles.stagger2}`}>
        <div className={styles.statGradient2}></div>
        <div className={styles.statHeader}>
          <div className={styles.statTitleWrapper}>
            <span className={styles.statTitle}>Monthly Income</span>
            <span className={styles.statSubtitle}>Current month</span>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <FiArrowDownRight style={{ transform: 'rotate(180deg)' }} />
          </div>
        </div>
        <div className={styles.statValue}>{formatCurrency(stats.totalIncome)}</div>
        <div className={styles.statFooter}>
          <div className={`${styles.statChange} ${styles.changePositive}`}>
            <FiArrowUpRight /> 8.2%
          </div>
          <span className={styles.statCompared}>vs last month</span>
        </div>
        <div className={styles.trendLineContainer}>
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className={styles.trendLine}>
            <path d="M0,15 C25,20 35,5 60,10 C80,15 90,0 100,5" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>

      {/* Card 3: Monthly Expenses */}
      <div className={`${styles.statCard} ${styles.stagger3}`}>
        <div className={styles.statGradient3}></div>
        <div className={styles.statHeader}>
          <div className={styles.statTitleWrapper}>
            <span className={styles.statTitle}>Monthly Expenses</span>
            <span className={styles.statSubtitle}>Current month</span>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
            <FiArrowUpRight />
          </div>
        </div>
        <div className={styles.statValue}>{formatCurrency(stats.totalExpenses)}</div>
        <div className={styles.statFooter}>
          <div className={`${styles.statChange} ${styles.changeNegative}`}>
            <FiArrowUpRight /> 12.4%
          </div>
          <span className={styles.statCompared}>vs last month</span>
        </div>
        <div className={styles.trendLineContainer}>
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className={styles.trendLine}>
            <path d="M0,5 C20,10 40,0 60,15 C80,25 90,10 100,20" stroke="#f43f5e" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>

      {/* Card 4: Savings Rate */}
      <div className={`${styles.statCard} ${styles.stagger4}`}>
        <div className={styles.statGradient4}></div>
        <div className={styles.statHeader}>
          <div className={styles.statTitleWrapper}>
            <span className={styles.statTitle}>Savings Rate</span>
            <span className={styles.statSubtitle}>Of monthly income</span>
          </div>
          <div className={styles.statIcon} style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <FiActivity />
          </div>
        </div>
        <div className={styles.statValue}>{stats.savingsRate}%</div>
        <div className={styles.statFooter}>
          <div className={`${styles.statChange} ${styles.changePositive}`}>
            <FiArrowUpRight /> 2.4%
          </div>
          <span className={styles.statCompared}>vs last month</span>
        </div>
        <div className={styles.trendLineContainer}>
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className={styles.trendLine}>
            <path d="M0,18 C15,18 25,5 50,8 C70,10 85,0 100,2" stroke="#06b6d4" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
