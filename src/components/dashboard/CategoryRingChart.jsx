import React, { useMemo } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { filterTransactionsByDateRange } from '../../utils/dateHelpers';
import { expenseCategories, incomeCategories } from '../../data/categories';
import styles from '../../styles/components/dashboard.module.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * CategoryRingChart — Dynamic analytics visualization.
 * Renders a donut/ring chart showing expense distribution by category for a selected time period.
 */
// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        color: 'var(--text-main)',
        fontSize: '0.9rem'
      }}>
        <div style={{ fontWeight: 600, color: data.color, marginBottom: '4px' }}>{data.category}</div>
        <div>{formatCurrency(data.amount)} ({data.percentage}%)</div>
      </div>
    );
  }
  return null;
};

const CategoryRingChart = () => {
  const { transactions, activeTimeFilter, setActiveTimeFilter } = useExpense();

  // Compute category breakdown and total dynamically based on time filter
  const { categoryBreakdown, totalExpenses } = useMemo(() => {
    // 1. Filter by time
    const filtered = filterTransactionsByDateRange(transactions, activeTimeFilter);
    
    // 2. Filter for expenses only and aggregate amounts
    let total = 0;
    const categoryMap = {};
    
    filtered.forEach(txn => {
      if (txn.type === 'expense') {
        const amount = Number(txn.amount) || 0;
        total += amount;
        categoryMap[txn.category] = (categoryMap[txn.category] || 0) + amount;
      }
    });

    // 3. Format into array with percentages and colors
    const allCategories = [...expenseCategories, ...incomeCategories];
    const breakdown = Object.entries(categoryMap)
      .map(([category, amount]) => {
        const config = allCategories.find(c => c.name === category) || { color: '#94a3b8' };
        return {
          category,
          amount,
          percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
          color: config.color
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return { categoryBreakdown: breakdown, totalExpenses: total };
  }, [transactions, activeTimeFilter]);

  return (
    <div className={`${styles.card} ${styles.pieChartContainer}`} style={{ gap: '1.5rem', height: '100%' }}>
      <div className={styles.sectionHeader} style={{ width: '100%', marginBottom: '0' }}>
        <h3 className={styles.sectionTitle}>Expense Breakdown</h3>
        <select 
          className={styles.filterSelect} 
          value={activeTimeFilter} 
          onChange={(e) => setActiveTimeFilter(e.target.value)}
        >
          <option value="this_month">This Month</option>
          <option value="previous_month">Previous Month</option>
          <option value="last_3_months">Last 3 Months</option>
          <option value="this_year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {!categoryBreakdown.length ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
          <p>No expense data found.</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>No transactions match this time period.</p>
        </div>
      ) : (
        <>
          {/* Recharts Donut Ring Chart */}
          <div className={styles.donutWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="amount"
                  stroke="none"
                  cornerRadius={5}
                >
                  {categoryBreakdown.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={CustomTooltip} 
                  offset={40} 
                  allowEscapeViewBox={{ x: true, y: true }}
                  wrapperStyle={{ zIndex: 1000 }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label showing total */}
            <div className={styles.donutHole} style={{ width: '130px', height: '130px' }}>
              <span className={styles.donutTotal}>{formatCurrency(totalExpenses)}</span>
              <span className={styles.donutLabel}>Total Spent</span>
            </div>
          </div>

          {/* Category Legend */}
          <div className={styles.categoryLegend}>
            {categoryBreakdown.map((cat) => (
              <div key={cat.category} className={styles.legendItem}>
                <div className={styles.legendLeft}>
                  <div className={styles.legendDot} style={{ backgroundColor: cat.color }} />
                  <span className={styles.legendName}>{cat.category}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                  <span className={styles.legendValue} style={{ color: 'var(--text-main)' }}>{formatCurrency(cat.amount)}</span>
                  <span className={styles.legendValue} style={{ fontSize: '0.8rem' }}>{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryRingChart;
