import React, { useContext, useMemo } from 'react';
import { FiTrendingUp, FiDollarSign, FiTruck, FiCreditCard, FiArrowUpRight, FiTag } from 'react-icons/fi';
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
  const { expenses, transactions, activeTimeFilter } = useContext(ExpenseContext);

  // Pre-filter expenses by the active time range — memoized
  const filteredExpenses = useMemo(
    () => filterTransactionsByDateRange(expenses, activeTimeFilter),
    [expenses, activeTimeFilter]
  );

  // All insight computations — memoized on filtered data
  const insights = useMemo(() => {
    const periodLabel = PERIOD_LABELS[activeTimeFilter] || 'Selected Period';

    // Edge case: no filtered expenses
    if (!filteredExpenses.length) {
      return [
        { icon: FiDollarSign, metric: '₹0', subtitle: `Avg Daily Spend (${periodLabel})`, trend: null, bgColor: 'var(--secondary)' },
        { icon: FiTruck, metric: '₹0', subtitle: 'No expenses recorded', trend: null, bgColor: '#f97316' },
        { icon: FiCreditCard, metric: '-', subtitle: 'No payment data', trend: null, bgColor: '#34d399' },
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
    const avgDaily = getAverageDailySpend(filteredExpenses, activeTimeFilter);

    // Biggest single expense in period
    const biggest = getBiggestExpense(filteredExpenses);

    // Most frequent payment method in period
    const method = getMostFrequentMethod(filteredExpenses);

    // Spending trend vs previous month (only meaningful for this_month)
    const trend = getSpendingTrend(filteredExpenses, transactions, activeTimeFilter);

    // Savings opportunity from period data
    const savings = getSavingsOpportunity(filteredExpenses);

    return [
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
        icon: FiTrendingUp,
        metric: `Save ₹${Number(savings.reduction).toLocaleString()}`,
        subtitle: `Savings Opportunity (${savings.category})`,
        trend: null,
        bgColor: '#60a5fa',
      },
    ];
  }, [filteredExpenses, activeTimeFilter, transactions]);


  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem', width: '100%' }}>
      {insights.map((insight, idx) => (
        <InsightCard key={idx} {...insight} />
      ))}
    </div>
  );
};

export default InsightsPanel;
