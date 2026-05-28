import React, { useContext, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ExpenseContext } from '../../context/ExpenseContext';
import { groupExpensesByCategory } from '../../utils/dateHelpers';
import ChartCard from './ChartCard';
import EmptyState from '../common/EmptyState';
import { FiPieChart, FiDollarSign } from 'react-icons/fi';
import { expenseCategories, incomeCategories } from '../../data/categories';

// Custom glassmorphic tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
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
        fontSize: '0.9rem',
        minWidth: '140px'
      }}>
        <div style={{ fontWeight: 700, color: item.color, marginBottom: '4px' }}>{item.name}</div>
        <div>₹{item.value.toLocaleString('en-IN')}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{item.percentage}% of total</div>
      </div>
    );
  }
  return null;
};

/**
 * ExpensePieChart – Fully dynamic expense distribution by category.
 * Reads activeTimeFilter from global ExpenseContext.
 * Shows a polished EmptyState when no data exists for the period.
 */
const ExpensePieChart = () => {
  const { expenses, activeTimeFilter } = useContext(ExpenseContext);

  // Group expenses by category for the selected time filter
  const filteredAndGrouped = useMemo(
    () => groupExpensesByCategory(expenses, activeTimeFilter),
    [expenses, activeTimeFilter]
  );

  // Build chart data: attach category colors and compute percentages
  const data = useMemo(() => {
    const total = filteredAndGrouped.reduce((sum, item) => sum + item.amount, 0);
    return filteredAndGrouped.map(item => {
      const cfg = [...expenseCategories, ...incomeCategories].find(c => c.name === item.category) || {
        color: '#94a3b8',
        icon: FiDollarSign
      };
      return {
        name: item.category,
        value: item.amount,
        percentage: total > 0 ? ((item.amount / total) * 100).toFixed(1) : 0,
        color: cfg.color,
        icon: cfg.icon
      };
    });
  }, [filteredAndGrouped]);

  const periodLabel = {
    this_month: 'this month', previous_month: 'last month',
    last_3_months: 'the last 3 months', this_year: 'this year'
  }[activeTimeFilter] || 'this period';

  return (
    <ChartCard title="Expense Distribution">
      {data.length === 0 ? (
        <EmptyState
          icon={FiPieChart}
          title="No expense data"
          description={`No expenses were recorded for ${periodLabel}. Add transactions to see your spending breakdown.`}
          compact
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          {/* Donut Chart */}
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
                  innerRadius={65}
                  labelLine={false}
                  label={false}
                  isAnimationActive={true}
                  animationDuration={600}
                  stroke="none"
                  paddingAngle={3}
                  cornerRadius={4}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  content={CustomTooltip}
                  offset={30}
                  allowEscapeViewBox={{ x: true, y: true }}
                  wrapperStyle={{ zIndex: 1000 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
            {data.map((item, index) => {
              const Icon = item.icon || FiDollarSign;
              return (
                <div
                  key={`item-${index}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.7rem 1rem',
                    background: 'rgba(255,255,255,0.025)',
                    borderRadius: '10px',
                    border: '1px solid var(--hover-bg)',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                >
                  {/* Left: Icon + Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      background: `${item.color}18`,
                      color: item.color,
                      padding: '6px',
                      borderRadius: '7px',
                      display: 'flex'
                    }}>
                      <Icon size={15} />
                    </div>
                    <span style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem' }}>
                      {item.name}
                    </span>
                  </div>

                  {/* Right: Amount + Percentage */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem' }}>
                      ₹{item.value.toLocaleString('en-IN')}
                    </span>
                    <span style={{
                      color: item.color,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: `${item.color}18`,
                      padding: '2px 8px',
                      borderRadius: '20px'
                    }}>
                      {item.percentage}%
                    </span>
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
