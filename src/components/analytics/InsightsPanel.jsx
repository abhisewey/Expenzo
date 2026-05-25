import React, { useContext, useMemo } from 'react';
import { FiTrendingUp, FiDollarSign, FiTruck, FiCreditCard, FiArrowUpRight, FiArrowDownRight, FiTag } from 'react-icons/fi';
import { ExpenseContext } from '../../context/ExpenseContext';
import InsightCard from './InsightCard';
import styles from '../../styles/analytics.module.css';
import { getCategoryTotals, filterExpensesByPeriod } from '../../utils/analyticsHelpers';
import {
  getAverageDailySpend,
  getBiggestExpense,
  getMostFrequentMethod,
  getSpendingTrend,
  getSavingsOpportunity,
} from '../../utils/insightHelpers';

/**
 * InsightsPanel – renders six dynamic insight cards using the ExpenseContext.
 */
const InsightsPanel = () => {
  const { expenses } = useContext(ExpenseContext);

  const insights = useMemo(() => {
    // Highest spending category using analyticsHelpers for totals
    const categoryTotals = getCategoryTotals(expenses);
    const totalSpend = categoryTotals.reduce((sum, cur) => sum + cur.value, 0);
    const highestCat = categoryTotals.reduce((prev, cur) => (cur.value > prev.value ? cur : prev), categoryTotals[0] || { name: '-', value: 0, percent: 0 });
    const highest = { name: highestCat.name, percent: totalSpend ? ((highestCat.value / totalSpend) * 100).toFixed(1) : 0 };
    const avgDaily = getAverageDailySpend(expenses);
    const biggest = getBiggestExpense(expenses);
    const method = getMostFrequentMethod(expenses);
    const trend = getSpendingTrend(expenses);
    const savings = getSavingsOpportunity(expenses);

    return [
      {
        icon: FiTag,
        metric: `${highest.name} (${highest.percent}%)`,
        subtitle: 'Highest Spending Category',
        trend: null,
        bgColor: 'var(--primary)',
      },
      {
        icon: FiDollarSign,
        metric: `₹${Number(avgDaily).toLocaleString()}`,
        subtitle: 'Avg Daily Spend (this month)',
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
        subtitle: 'Most Frequent Payment Method',
        trend: null,
        bgColor: '#34d399',
      },
      {
        icon: FiArrowUpRight,
        metric: `${trend.percent}%`,
        subtitle: 'Spending Trend vs Last Month',
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
  }, [expenses]);

  return (
    <div className={styles.insightsPanel}>
      {insights.map((insight, idx) => (
        <InsightCard key={idx} {...insight} />
      ))}
    </div>
  );
};

export default InsightsPanel;
