/* eslint-disable react-hooks/set-state-in-effect */
import React, { useContext } from 'react';
import { ExpenseContext } from '../../context/ExpenseContext';
import MonthlyBarChart from '../../components/analytics/MonthlyBarChart';
import ExpensePieChart from '../../components/analytics/ExpensePieChart';
import InsightsPanel from '../../components/analytics/InsightsPanel';
import styles from '../../styles/components/analyticsPage.module.css';
import { filterTransactionsByDateRange } from '../../utils/dateHelpers';
import { getSpendingTrend, getHighestSpendingCategory } from '../../utils/insightHelpers';
import { FiActivity, FiPieChart } from 'react-icons/fi';

const AnimatedNumber = ({ value, prefix = '' }) => {
  const [displayValue, setDisplayValue] = React.useState(0);
  
  React.useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end)) return;
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    
    let current = start;
    const duration = 1000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{prefix}{displayValue.toLocaleString('en-IN')}</span>;
};

const Analytics = () => {
  const { expenses, transactions, activeTimeFilter, setActiveTimeFilter } = useContext(ExpenseContext);
  const [isFiltering, setIsFiltering] = React.useState(false);

  const handleFilterChange = (e) => {
    setIsFiltering(true);
    setActiveTimeFilter(e.target.value);
    setTimeout(() => setIsFiltering(false), 300);
  };
  
  const filteredExpenses = React.useMemo(
    () => filterTransactionsByDateRange(expenses, activeTimeFilter),
    [expenses, activeTimeFilter]
  );
  
  const totalSpent = React.useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [filteredExpenses]);

  const trendInfo = React.useMemo(() => {
    return getSpendingTrend(filteredExpenses, transactions, activeTimeFilter);
  }, [filteredExpenses, transactions, activeTimeFilter]);

  const topCategory = React.useMemo(() => {
    return getHighestSpendingCategory(filteredExpenses);
  }, [filteredExpenses]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Financial Intelligence Hub</h1>
          <p className={styles.subtitle}>Deep dive into your spending patterns and trends.</p>
        </div>
        <select
          className={styles.globalFilterSelect}
          value={activeTimeFilter}
          onChange={handleFilterChange}
        >
          <option value="this_month">This Month</option>
          <option value="previous_month">Previous Month</option>
          <option value="last_3_months">Last 3 Months</option>
          <option value="this_year">This Year</option>
        </select>
      </div>
      
      <div style={{ opacity: isFiltering ? 0.4 : 1, transition: 'opacity 0.3s ease', pointerEvents: isFiltering ? 'none' : 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className={styles.topStats}>
          <div className={styles.statCard} style={{ '--card-color': '#8b5cf6' }}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Total Spent</span>
              <div className={styles.statIconWrapper}>
                <FiActivity />
              </div>
            </div>
            <h2 className={styles.statValue}>
              <AnimatedNumber value={totalSpent} prefix="₹" />
            </h2>
            <div className={styles.statTrend}>
              {trendInfo.percent !== 0 && activeTimeFilter === 'this_month' ? (
                <span className={trendInfo.percent > 0 ? styles.trendNegative : styles.trendPositive}>
                  {trendInfo.percent > 0 ? '↑' : '↓'} {Math.abs(trendInfo.percent)}%
                </span>
              ) : null}
              <span className={styles.trendContext}>
                {activeTimeFilter === 'this_month' ? 'vs last month' : 'In selected period'}
              </span>
            </div>
          </div>
          
          <div className={styles.statCard} style={{ '--card-color': '#10b981' }}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Top Category</span>
              <div className={styles.statIconWrapper}>
                <FiPieChart />
              </div>
            </div>
            <h2 className={styles.statValue}>
              {topCategory.name}
            </h2>
            <div className={styles.statTrend}>
              <span className={styles.trendContext}>{topCategory.percent}% of total expenses</span>
            </div>
          </div>
        </div>

        <div className={styles.insightsRow}>
          <InsightsPanel />
        </div>

        <div className={styles.chartsGrid}>
          <div>
            <MonthlyBarChart />
          </div>
          <div>
            <ExpensePieChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
