import React, { useMemo } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import styles from '../../styles/components/dashboard.module.css';

const SpendingOverview = () => {
  const { transactions, stats } = useExpense();

  // Compute actual spending of the last 6 calendar months dynamically from transaction state
  const monthlySpending = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const spendingMap = {};
    
    // Auto-generate last 6 months timeline anchors
    const now = new Date();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = months[d.getMonth()];
      const yearVal = d.getFullYear();
      const key = `${monthLabel} ${yearVal}`;
      last6Months.push({ key, label: monthLabel, amount: 0 });
      spendingMap[key] = 0;
    }

    // Accumulate transaction values matching key month anchors
    transactions.filter(t => t.type === 'expense').forEach(txn => {
      const d = new Date(txn.date);
      const monthLabel = months[d.getMonth()];
      const yearVal = d.getFullYear();
      const key = `${monthLabel} ${yearVal}`;
      if (spendingMap[key] !== undefined) {
        spendingMap[key] += Number(txn.amount);
      }
    });

    // Extract maximum value to determine dynamic chart heights
    let maxSpent = 0;
    last6Months.forEach(m => {
      m.amount = spendingMap[m.key];
      if (m.amount > maxSpent) maxSpent = m.amount;
    });

    // Construct final percentages heights for CSS rendering
    return last6Months.map(m => ({
      label: m.label,
      amount: m.amount,
      value: maxSpent > 0 ? Math.round((m.amount / maxSpent) * 100) : 0
    }));
  }, [transactions]);

  // Compute true running average
  const monthlyAverage = useMemo(() => {
    if (monthlySpending.length === 0) return 0;
    const total = monthlySpending.reduce((sum, item) => sum + item.amount, 0);
    return Math.round(total / monthlySpending.length);
  }, [monthlySpending]);

  return (
    <div className={styles.card}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Spending Overview</h2>
        <select className={styles.filterSelect} defaultValue="6M">
          <option value="1M">This Month</option>
          <option value="3M">Last 3 Months</option>
          <option value="6M">Last 6 Months</option>
          <option value="1Y">This Year</option>
        </select>
      </div>

      <div className={styles.miniStats}>
        <div className={styles.miniStat}>
          <span className={styles.miniStatLabel}>Total Spent (6M)</span>
          <span className={styles.miniStatValue}>₹{stats.totalExpenses.toLocaleString('en-IN')}</span>
        </div>
        <div className={styles.miniStat}>
          <span className={styles.miniStatLabel}>Average / Month</span>
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
