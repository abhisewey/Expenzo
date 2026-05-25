import React, { useContext, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ExpenseContext } from '../../context/ExpenseContext';
import { getMonthlySpending, filterExpensesByPeriod } from '../../utils/analyticsHelpers';
import ChartCard from './ChartCard';
import styles from '../../styles/analytics.module.css';

/**
 * MonthlyBarChart – displays spending trends for the last 6 months.
 * Props:
 *   - filterOptions: dropdown options (e.g., All Time, Last 12 months)
 *   - defaultFilter: default selection
 */
const MonthlyBarChart = ({ filterOptions = [], defaultFilter = '6months' }) => {
  const { expenses } = useContext(ExpenseContext);
  const [filter, setFilter] = useState(defaultFilter);

  const filteredExpenses = useMemo(
    () => filterExpensesByPeriod(expenses, filter),
    [expenses, filter]
  );

  const data = useMemo(() => getMonthlySpending(filteredExpenses, 6), [filteredExpenses]);

  const handleFilterChange = (e) => setFilter(e.target.value);

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{name}</p>
          <p className={styles.tooltipValue}>₹{value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((d) => d.value));
    const dataMin = Math.min(...data.map((d) => d.value));
    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }
    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <ChartCard title="Monthly Spending" filterOptions={filterOptions} onFilterChange={handleFilterChange}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6d28d9" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip content={renderCustomTooltip} />
          <Bar dataKey="value" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default MonthlyBarChart;
