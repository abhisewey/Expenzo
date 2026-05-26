import React, { useMemo, useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { groupTransactionsForBarChart } from '../../utils/dateHelpers';
import styles from '../../styles/components/dashboard.module.css';

const SpendingOverview = () => {
  const { transactions, stats } = useExpense();

  const [filter, setFilter] = useState('this_month');

  // Compute actual spending dynamically using robust date helpers
  const monthlySpending = useMemo(() => {
    const rawData = groupTransactionsForBarChart(transactions, filter);
    
    // Extract maximum value to determine dynamic chart heights
    let maxSpent = 0;
    rawData.forEach(m => {
      if (m.value > maxSpent) maxSpent = m.value;
    });

    // Construct final percentages heights for CSS rendering
    return rawData.map(m => {
      let label = m.month;
      // Shorten label for UI if needed
      if (label.includes('Week')) {
        label = `W${label.split(' ')[1]}`;
      } else if (label.includes(' ')) {
        label = label.split(' ')[0]; // Extract just the month name (e.g. "Jan" from "Jan 2026")
      }
      
      return {
        label: label,
        amount: m.value,
        value: maxSpent > 0 ? Math.round((m.value / maxSpent) * 100) : 0
      };
    });
  }, [transactions, filter]);

  // Compute true running average
  const monthlyAverage = useMemo(() => {
    if (monthlySpending.length === 0) return 0;
    const total = monthlySpending.reduce((sum, item) => sum + item.amount, 0);
    return Math.round(total / monthlySpending.length);
  }, [monthlySpending]);
  
  const totalSpent = useMemo(() => {
    return monthlySpending.reduce((sum, item) => sum + item.amount, 0);
  }, [monthlySpending]);

  return (
    <div className={styles.card}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Spending Overview</h2>
        <select 
          className={styles.filterSelect} 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="this_month">This Month</option>
          <option value="previous_month">Previous Month</option>
          <option value="last_3_months">Last 3 Months</option>
          <option value="this_year">This Year</option>
        </select>
      </div>

      <div className={styles.miniStats}>
        <div className={styles.miniStat}>
          <span className={styles.miniStatLabel}>Total Spent</span>
          <span className={styles.miniStatValue}>₹{totalSpent.toLocaleString('en-IN')}</span>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniStatLabel}>Average</span>
          <span className={styles.miniStatValue}>₹{monthlyAverage.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Dynamic Pure CSS Bar Graph Mapping */}
      <div className={styles.chartContainer}>
        {monthlySpending.map((data, index) => (
          <div key={index} className={styles.barGroup} title={`Spent: ₹${data.amount.toLocaleString('en-IN')}`}>
            <div className={styles.barTrack}>
              <div 
                className={styles.barFill} 
                style={{ 
                  height: `${data.value > 0 ? data.value : 2}%`, // subtle base layout if zero
                  background: data.value > 80 
                    ? 'linear-gradient(180deg, #f43f5e 0%, rgba(244,63,94,0.1) 100%)' 
                    : 'linear-gradient(180deg, #8b5cf6 0%, rgba(139,92,246,0.1) 100%)'
                }}
              ></div>
            </div>
            <span className={styles.barLabel}>{data.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingOverview;
