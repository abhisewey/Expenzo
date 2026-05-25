import React from 'react';
import styles from '../../styles/components/dashboard.module.css';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatCurrency';

const CategoryBreakdown = () => {
  const { stats } = useExpense();

  // If there are no expense transactions, show placeholder distribution
  const breakdown = stats.categoryBreakdown.length > 0 
    ? stats.categoryBreakdown 
    : [{ category: 'No Expenses', percentage: 100, color: '#94a3b8', amount: 0 }];

  // Construct conic gradient string based on distribution data
  let currentPercentage = 0;
  const gradientStops = breakdown.map(item => {
    const start = currentPercentage;
    const end = currentPercentage + item.percentage;
    currentPercentage = end;
    return `${item.color} ${start}% ${end}%`;
  }).join(', ');

  const donutStyle = {
    background: breakdown.length > 0 && stats.categoryBreakdown.length > 0
      ? `conic-gradient(${gradientStops})`
      : 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)'
  };

  return (
    <div className={styles.card}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Categories</h2>
        <select className={styles.filterSelect} defaultValue="TM">
          <option value="TM">This Month</option>
          <option value="LM">Last Month</option>
        </select>
      </div>

      <div className={styles.pieChartContainer}>
        <div className={styles.donutWrapper} style={donutStyle}>
          <div className={styles.donutHole}>
            <span className={styles.donutTotal}>{formatCurrency(stats.totalExpenses)}</span>
            <span className={styles.donutLabel}>Total Spent</span>
          </div>
        </div>

        <div className={styles.categoryLegend}>
          {stats.categoryBreakdown.length === 0 ? (
            <div className={styles.legendItem} style={{ justifyContent: 'center', opacity: 0.6 }}>
              No expenses recorded yet.
            </div>
          ) : (
            stats.categoryBreakdown.map((item, index) => (
              <div key={index} className={styles.legendItem}>
                <div className={styles.legendLeft}>
                  <div className={styles.legendDot} style={{ background: item.color }}></div>
                  <span className={styles.legendName}>{item.category}</span>
                </div>
                <span className={styles.legendValue}>{item.percentage}%</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
