import React, { useContext, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
const DEFAULT_FILTER_OPTIONS = [
  { value: 'this_month', label: 'This Month' },
  { value: 'previous_month', label: 'Previous Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'this_year', label: 'This Year' }
];

const ExpensePieChart = ({ filterOptions = DEFAULT_FILTER_OPTIONS, defaultFilter = 'this_month' }) => {
  const { expenses } = useContext(ExpenseContext);
  const [filter, setFilter] = useState(defaultFilter);

  const filteredAndGrouped = useMemo(
    () => groupExpensesByCategory(expenses, filter),
    [expenses, filter]
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
  const COLORS = data.map((d) => d.color);

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

  const renderCustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className={styles.customLegend} style={{ display: 'grid', gap: '0.5rem', padding: '1rem', listStyle: 'none', margin: 0 }}>
        {payload.map((entry, index) => {
          const { color, payload: dataItem } = entry;
          const Icon = dataItem.icon || FiDollarSign;
          return (
            <li key={`item-${index}`} className={styles.legendItem} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: `${color}20`, color, padding: '8px', borderRadius: '8px', display: 'flex' }}>
                  <Icon size={16} />
                </div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{dataItem.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{dataItem.value.toLocaleString()}</span>
                <span style={{ color: 'var(--text-muted)', width: '45px', textAlign: 'right' }}>{dataItem.percentage}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
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
      filterOptions={filterOptions}
      onFilterChange={handleFilterChange}
    >
      {data.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-muted)' }}>
          No expenses found for {getPeriodLabel(filter)}.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="value"
              nameKey="name"
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={renderCustomTooltip} />
            <Legend content={renderCustomLegend} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default ExpensePieChart;
