import React, { useContext, useMemo, useState, useCallback } from 'react';
import { FiTrendingUp, FiDollarSign, FiTruck, FiCreditCard, FiArrowUpRight, FiArrowDownRight, FiTag } from 'react-icons/fi';
import { ExpenseContext } from '../../context/ExpenseContext';
import InsightCard from './InsightCard';
import styles from '../../styles/analytics.module.css';
import { getCategoryTotals } from '../../utils/analyticsHelpers';
import { filterTransactionsByDateRange } from '../../utils/dateHelpers';
import {
  getAverageDailySpend,
  getBiggestExpense,
  getMostFrequentMethod,
  getSpendingTrend,
  getSavingsOpportunity,
} from '../../utils/insightHelpers';

/**
 * Period label map for dynamic subtitle generation
 */
const PERIOD_LABELS = {
  this_month: 'This Month',
  previous_month: 'Previous Month',
  last_3_months: 'Last 3 Months',
  this_year: 'This Year',
};

/**
 * InsightsPanel – renders six dynamic insight cards.
 * Now fully reactive to the active time filter.
 * Uses useMemo for all expensive computations.
 */
const InsightsPanel = () => {
  const { expenses, transactions } = useContext(ExpenseContext);
  const [filter, setFilter] = useState('this_month');

  // Pre-filter expenses by the active time range — memoized
  const filteredExpenses = useMemo(
    () => filterTransactionsByDateRange(expenses, filter),
    [expenses, filter]
  );

  // All insight computations — memoized on filtered data
  const insights = useMemo(() => {
    const periodLabel = PERIOD_LABELS[filter] || 'Selected Period';

    // Edge case: no filtered expenses
    if (!filteredExpenses.length) {
      return [
        { icon: FiTag, metric: '-', subtitle: `No spending in ${periodLabel}`, trend: null, bgColor: 'var(--primary)' },
        { icon: FiDollarSign, metric: '₹0', subtitle: `Avg Daily Spend (${periodLabel})`, trend: null, bgColor: 'var(--secondary)' },
        { icon: FiTruck, metric: '₹0', subtitle: 'No expenses recorded', trend: null, bgColor: '#f97316' },
        { icon: FiCreditCard, metric: '-', subtitle: 'No payment data', trend: null, bgColor: '#34d399' },
        { icon: FiArrowUpRight, metric: '0%', subtitle: 'Spending Trend', trend: 0, bgColor: '#10b981' },
        { icon: FiTrendingUp, metric: 'Save ₹0', subtitle: 'Add expenses to unlock insights', trend: null, bgColor: '#60a5fa' },
      ];
    }

    // Highest spending category
    const categoryTotals = getCategoryTotals(filteredExpenses);
    const totalSpend = categoryTotals.reduce((sum, cur) => sum + cur.value, 0);
    const highestCat = categoryTotals.reduce(
      (prev, cur) => (cur.value > prev.value ? cur : prev),
      categoryTotals[0] || { name: '-', value: 0 }
    );
    const highest = {
      name: highestCat.name,
      percent: totalSpend ? ((highestCat.value / totalSpend) * 100).toFixed(1) : 0,
    };

    // Average daily spend — respects active period length
    const avgDaily = getAverageDailySpend(filteredExpenses, filter);

    // Biggest single expense in period
    const biggest = getBiggestExpense(filteredExpenses);

    // Most frequent payment method in period
    const method = getMostFrequentMethod(filteredExpenses);

    // Spending trend vs previous month (only meaningful for this_month)
    const trend = getSpendingTrend(filteredExpenses, transactions, filter);

    // Savings opportunity from period data
    const savings = getSavingsOpportunity(filteredExpenses);

    return [
      {
        icon: FiTag,
        metric: `${highest.name} (${highest.percent}%)`,
        subtitle: `Top Category (${periodLabel})`,
        trend: null,
        bgColor: 'var(--primary)',
      },
      {
        icon: FiDollarSign,
        metric: `₹${Number(avgDaily).toLocaleString()}`,
        subtitle: `Avg Daily Spend (${periodLabel})`,
        trend: null,
        bgColor: 'var(--secondary)',
      },
      {
        icon: FiTruck,
        metric: `₹${biggest.amount}`,
        subtitle: `Biggest Expense (${biggest.category})`,
        trend: null,
        bgColor: '#f97316',
      },
      {
        icon: FiCreditCard,
        metric: method,
        subtitle: `Top Payment Method (${periodLabel})`,
        trend: null,
        bgColor: '#34d399',
      },
      {
        icon: FiArrowUpRight,
        metric: `${trend.percent}%`,
        subtitle: filter === 'this_month' ? 'Trend vs Last Month' : `Trend (${periodLabel})`,
        trend: Number(trend.percent),
        bgColor: trend.percent >= 0 ? '#10b981' : '#ef4444',
      },
      {
        icon: FiTrendingUp,
        metric: `Save ₹${Number(savings.reduction).toLocaleString()}`,
        subtitle: `Savings Opportunity (${savings.category})`,
        trend: null,
        bgColor: '#60a5fa',
      },
    ];
  }, [filteredExpenses, filter, transactions]);

  // Memoized filter change handler
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  return (
    <div className={styles.insightsPanel}>
      {/* Time filter dropdown — unified with all analytics components */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1rem' }}>
        <h3 className={styles.title} style={{ margin: 0 }}>Smart Insights</h3>
        <select
          className={styles.filterSelect}
          value={filter}
          onChange={handleFilterChange}
          style={{ minWidth: '140px' }}
        >
          <option value="this_month">This Month</option>
          <option value="previous_month">Previous Month</option>
          <option value="last_3_months">Last 3 Months</option>
          <option value="this_year">This Year</option>
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', width: '100%' }}>
        {insights.map((insight, idx) => (
          <InsightCard key={idx} {...insight} />
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
