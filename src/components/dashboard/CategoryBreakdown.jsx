import React, { useState, useMemo } from 'react';
import styles from '../../styles/components/dashboard.module.css';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { groupExpensesByCategory } from '../../utils/dateHelpers';
import { expenseCategories, incomeCategories } from '../../data/categories';
import { FiDollarSign } from 'react-icons/fi';

const CategoryBreakdown = () => {
  const { transactions } = useExpense();
  const [filter, setFilter] = useState('this_month');

  const { totalExpenses, actualBreakdown } = useMemo(() => {
    const grouped = groupExpensesByCategory(transactions, filter);
    const total = grouped.reduce((sum, item) => sum + item.amount, 0);
    
    return {
      totalExpenses: total,
      actualBreakdown: grouped.map(item => {
        const cfg = [...expenseCategories, ...incomeCategories].find(c => c.name === item.category) || { color: '#94a3b8', icon: FiDollarSign };
        return {
          category: item.category,
          amount: item.amount,
          percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0,
          color: cfg.color,
          icon: cfg.icon
        };
      })
    };
  }, [transactions, filter]);

  // If there are no expense transactions, show placeholder distribution
  const breakdown = actualBreakdown.length > 0 
    ? actualBreakdown 
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
    background: actualBreakdown.length > 0
      ? `conic-gradient(${gradientStops})`
      : 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)'
  };

  const getPeriodLabel = (f) => {
    switch (f) {
      case 'this_month': return 'This Month';
      case 'previous_month': return 'Previous Month';
      case 'last_3_months': return 'Last 3 Months';
      case 'this_year': return 'This Year';
      default: return 'this period';
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Categories</h2>
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

      <div className={styles.pieChartContainer}>
        <div className={styles.donutWrapper} style={donutStyle}>
          <div className={styles.donutHole}>
            <span className={styles.donutTotal}>{formatCurrency(totalExpenses)}</span>
            <span className={styles.donutLabel}>Total Spent</span>
          </div>
        </div>

        <div className={styles.categoryLegend}>
          {actualBreakdown.length === 0 ? (
            <div className={styles.legendItem} style={{ justifyContent: 'center', opacity: 0.6, padding: '2rem 0' }}>
              No expenses found for {getPeriodLabel(filter)}.
            </div>
          ) : (
            actualBreakdown.map((item, index) => {
              const Icon = item.icon || FiDollarSign;
              return (
                <div key={index} className={styles.legendItem} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <div className={styles.legendLeft} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: `${item.color}20`, color: item.color, padding: '8px', borderRadius: '8px', display: 'flex' }}>
                      <Icon size={16} />
                    </div>
                    <span className={styles.legendName} style={{ fontWeight: 500 }}>{item.category}</span>
                  </div>
                  <div className={styles.legendRight} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className={styles.legendAmount} style={{ fontWeight: 600 }}>{formatCurrency(item.amount)}</span>
                    <span className={styles.legendValue} style={{ color: 'var(--text-muted)', width: '40px', textAlign: 'right' }}>{item.percentage}%</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
