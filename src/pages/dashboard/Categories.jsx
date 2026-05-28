import { useState, useCallback } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatCurrency';
import EmptyState from '../../components/common/EmptyState';
import {
  FiGrid, FiTrash2, FiTrendingDown, FiTrendingUp, FiTag, FiLock
} from 'react-icons/fi';
import styles from '../../styles/components/dashboard.module.css';
import { expenseCategories as builtInExp, incomeCategories as builtInInc } from '../../data/categories';



const CategoryCard = ({ cat, spent, totalSpent, onDelete, isBuiltIn }) => {
  const pct = totalSpent > 0 ? Math.min(100, ((spent / totalSpent) * 100)).toFixed(1) : 0;
  const budgetPct = cat.budgetLimit > 0 ? Math.min(100, (spent / cat.budgetLimit) * 100) : null;
  const overBudget = budgetPct !== null && budgetPct >= 100;

  return (
    <div className={styles.card} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: `1px solid ${cat.color}22`, position: 'relative', overflow: 'hidden' }}>
      {/* Glow blob */}
      <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '80px', height: '80px', borderRadius: '50%', background: `radial-gradient(circle, ${cat.color}22, transparent)`, pointerEvents: 'none' }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
            {cat.emoji || cat.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{cat.name}</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '2px' }}>
              <span style={{ fontSize: '0.72rem', color: cat.type === 'expense' ? '#f43f5e' : '#10b981', background: cat.type === 'expense' ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)', padding: '1px 7px', borderRadius: '20px', fontWeight: 600, textTransform: 'capitalize' }}>
                {cat.type}
              </span>
              {isBuiltIn && (
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <FiLock size={9} /> Built-in
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons — only for custom categories */}
        {!isBuiltIn && (
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button onClick={() => onDelete(cat.id)} style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'var(--hover-bg)', border: '1px solid var(--hover-bg)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.15)'; e.currentTarget.style.color = '#f43f5e'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            ><FiTrash2 size={12} /></button>
          </div>
        )}
      </div>

      {/* Spend stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Spent this period</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', marginTop: '2px' }}>{formatCurrency(spent)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Share</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: cat.color }}>{pct}%</div>
        </div>
      </div>

      {/* Spend bar */}
      <div style={{ height: '5px', background: 'var(--hover-bg)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: '4px', opacity: 0.85, transition: 'width 0.8s ease' }} />
      </div>

      {/* Budget limit indicator */}
      {cat.budgetLimit > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Budget: {formatCurrency(cat.budgetLimit)}/mo
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: overBudget ? '#f43f5e' : '#10b981', background: overBudget ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '20px' }}>
            {overBudget ? `${(budgetPct - 100).toFixed(0)}% over` : `${(100 - budgetPct).toFixed(0)}% left`}
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Main Categories Page ─────────────────────────────────────────────────────
const Categories = () => {
  const {
    transactions,
    allExpenseCategories, allIncomeCategories,
    customCategories, deleteCustomCategory
  } = useExpense();

  const [activeTab, setActiveTab] = useState('expense');

  // Compute spent per category in the current time filter
  const { spentMap, totalExpenses, totalIncome } = (() => {
    const map = {};
    let totExp = 0, totInc = 0;
    transactions.forEach(txn => {
      const amt = Number(txn.amount) || 0;
      map[txn.category] = (map[txn.category] || 0) + amt;
      if (txn.type === 'expense') totExp += amt;
      else totInc += amt;
    });
    return { spentMap: map, totalExpenses: totExp, totalIncome: totInc };
  })();



  const handleDelete = useCallback((id) => {
    if (window.confirm('Delete this category? Existing transactions using it will remain unchanged.')) {
      deleteCustomCategory(id);
    }
  }, [deleteCustomCategory]);

  // Build display list — static categories + custom ones for active tab

  const displayList = activeTab === 'expense' ? allExpenseCategories : allIncomeCategories;
  const totalForTab = activeTab === 'expense' ? totalExpenses : totalIncome;

  const builtInIds = [...builtInExp, ...builtInInc].map(c => c.id);

  const tabBtn = (tab, label, Icon) => (
    <button onClick={() => setActiveTab(tab)} style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none',
      background: activeTab === tab ? (tab === 'expense' ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)') : 'var(--hover-bg)',
      color: activeTab === tab ? (tab === 'expense' ? '#f43f5e' : '#10b981') : 'var(--text-muted)',
      cursor: 'pointer', fontWeight: activeTab === tab ? 700 : 500, fontSize: '0.9rem',
      transition: 'all 0.2s'
    }}>
      <Icon size={15} /> {label}
    </button>
  );

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.pageHeader} style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className={styles.pageTitle}>Categories</h1>
          <p className={styles.pageSubtitle}>Manage spending groups, colors, icons, and budget limits.</p>
        </div>
      </header>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {tabBtn('expense', 'Expenses', FiTrendingDown)}
        {tabBtn('income', 'Income', FiTrendingUp)}
      </div>

      {displayList.length === 0 ? (
        <EmptyState
          icon={FiGrid}
          title="No categories yet"
          description="Start organizing your transactions by selecting from built-in categories."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))', gap: '1.25rem' }}>
          {displayList.map(cat => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              spent={spentMap[cat.name] || 0}
              totalSpent={totalForTab}
              onDelete={handleDelete}
              isBuiltIn={builtInIds.includes(cat.id)}
            />
          ))}
        </div>
      )}

      {/* Custom categories count badge */}
      {customCategories.length > 0 && (
        <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FiTag size={13} /> {customCategories.length} custom {customCategories.length === 1 ? 'category' : 'categories'} created
        </div>
      )}

    </div>
  );
};

export default Categories;
