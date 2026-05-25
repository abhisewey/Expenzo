import React, { useContext, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ExpenseContext } from '../../context/ExpenseContext';
import { getCategoryTotals, filterExpensesByPeriod } from '../../utils/analyticsHelpers';
import ChartCard from './ChartCard';
import styles from '../../styles/analytics.module.css';
import { FiDollarSign } from 'react-icons/fi';

/**
 * ExpensePieChart – shows distribution of expenses by category.
 * Props:
 *  - filterOptions: array of { value, label } (e.g., [{value:'all',label:'All Time'},{value:'month',label:'This Month'}])
 *  - defaultFilter: default selected value
 */
const ExpensePieChart = ({ filterOptions = [], defaultFilter = 'all' }) => {
  const { expenses } = useContext(ExpenseContext);
  const [filter, setFilter] = useState(defaultFilter);

  const filteredExpenses = useMemo(
    () => filterExpensesByPeriod(expenses, filter),
    [expenses, filter]
  );

  const data = useMemo(() => getCategoryTotals(filteredExpenses), [filteredExpenses]);

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
      <ul className={styles.customLegend}>
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className={styles.legendItem}>
            <span
              className={styles.legendColorBox}
              style={{ backgroundColor: entry.color }}
            />
            <span className={styles.legendLabel}>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <ChartCard
      title="Expense Distribution"
      filterOptions={filterOptions}
      onFilterChange={handleFilterChange}
    >
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
    </ChartCard>
  );
};

export default ExpensePieChart;
