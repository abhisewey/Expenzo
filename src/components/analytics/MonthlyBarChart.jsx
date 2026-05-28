import React, { useContext, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { ExpenseContext } from '../../context/ExpenseContext';
import { groupTransactionsForBarChart } from '../../utils/dateHelpers';
import ChartCard from './ChartCard';
import EmptyState from '../common/EmptyState';
import { FiBarChart2 } from 'react-icons/fi';

/**
 * MonthlyBarChart – Fully dynamic spending trend visualization.
 * Reads activeTimeFilter from global ExpenseContext.
 * Shows polished EmptyState when no expense data exists.
 * Highlights the tallest bar in accent purple.
 */

// Custom glassmorphic tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { month, value } = payload[0].payload;
    return (
      <div style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        color: 'var(--text-main)',
        fontSize: '0.9rem'
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.8rem' }}>
          {month}
        </div>
        <div style={{ fontWeight: 700, color: '#8b5cf6', fontSize: '1.05rem' }}>
          ₹{value.toLocaleString('en-IN')}
        </div>
      </div>
    );
  }
  return null;
};

const MonthlyBarChart = () => {
  const { expenses, activeTimeFilter } = useContext(ExpenseContext);

  // Compute bar data for the selected time period
  const data = useMemo(
    () => groupTransactionsForBarChart(expenses, activeTimeFilter),
    [expenses, activeTimeFilter]
  );

  const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 0), [data]);
  const hasData = data.some(d => d.value > 0);

  return (
    <ChartCard title="Monthly Spending">
      {!hasData ? (
        <EmptyState
          icon={FiBarChart2}
          title="No spending data"
          description="No expenses recorded for this period. Start tracking your transactions to see your spending trends."
          compact
        />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#6d28d9" stopOpacity={0.25} />
              </linearGradient>
              <linearGradient id="barGradPeak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#c084fc" stopOpacity={1} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--hover-bg)" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="var(--text-muted)"
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="var(--text-muted)"
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
            />
            <Tooltip
              content={CustomTooltip}
              cursor={{ fill: 'rgba(139, 92, 246, 0.06)', radius: 8 }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value === maxValue && entry.value > 0 ? 'url(#barGradPeak)' : 'url(#barGrad)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default MonthlyBarChart;
