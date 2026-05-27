import React, { useContext, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ExpenseContext } from '../../context/ExpenseContext';
import { groupExpensesByCategory } from '../../utils/dateHelpers';
import ChartCard from './ChartCard';
import styles from '../../styles/analytics.module.css';
import { FiDollarSign } from 'react-icons/fi';
import { expenseCategories, incomeCategories } from '../../data/categories';

/**
 * ExpensePieChart – shows distribution of expenses by category.
 * Props:
 *  - filterOptions: array of { value, label } (e.g., [{value:'all',label:'All Time'},{value:'month',label:'This Month'}])
 *  - defaultFilter: default selected value
 */
const ExpensePieChart = () => {
  const { expenses, activeTimeFilter } = useContext(ExpenseContext);

  const filteredAndGrouped = useMemo(
    () => groupExpensesByCategory(expenses, activeTimeFilter),
    [expenses, activeTimeFilter]
  );

  const data = useMemo(() => {
    const total = filteredAndGrouped.reduce((sum, item) => sum + item.amount, 0);
    return filteredAndGrouped.map(item => {
      const cfg = [...expenseCategories, ...incomeCategories].find(c => c.name === item.category) || { color: '#94a3b8', icon: FiDollarSign };
      return {
        name: item.category,
        value: item.amount,
        percentage: total > 0 ? ((item.amount / total) * 100).toFixed(1) : 0,
        color: cfg.color,
        icon: cfg.icon
      };
    });
  }, [filteredAndGrouped]);

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, percent } = payload[0].payload;
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{name}</p>
          <p className={styles.tooltipValue}>₹{value.toLocaleString()} ({(percent * 100).toFixed(1)}%)</p>
        </div>
      );
    }
    return null;
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
    <ChartCard
      title="Expense Distribution"
    >
      {data.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-muted)' }}>
          No expenses found for {getPeriodLabel(activeTimeFilter)}.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="value"
                  nameKey="name"
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={70}
                  labelLine={false}
                  label={false}
                  isAnimationActive={true}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', padding: '0 0.5rem' }}>
            {data.map((dataItem, index) => {
              const Icon = dataItem.icon || FiDollarSign;
              return (
                <div key={`item-${index}`} className={styles.legendItem} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ background: `${dataItem.color}15`, color: dataItem.color, padding: '8px', borderRadius: '8px', display: 'flex' }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '1rem' }}>{dataItem.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}>₹{dataItem.value.toLocaleString('en-IN')}</span>
                    <span style={{ color: 'var(--text-muted)', width: '45px', textAlign: 'right', fontSize: '0.95rem' }}>{dataItem.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ChartCard>
  );
};

export default ExpensePieChart;
