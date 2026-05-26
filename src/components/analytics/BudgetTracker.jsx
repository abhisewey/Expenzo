import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { ExpenseContext } from '../../context/ExpenseContext';
import { filterTransactionsByDateRange } from '../../utils/dateHelpers';
import {
  getBudgets,
  recalculateSpent,
  updateBudgetLimit,
  getProgressColor,
} from '../../utils/budgetHelpers';
import BudgetCard from './BudgetCard';
import BudgetModal from './BudgetModal';
import styles from '../../styles/analytics.module.css';
import { FiPlus, FiTarget } from 'react-icons/fi';

/**
 * Period label map for empty state messages
 */
const PERIOD_LABELS = {
  this_month: 'This Month',
  previous_month: 'Previous Month',
  last_3_months: 'Last 3 Months',
  this_year: 'This Year',
};

/**
 * BudgetTracker – manages monthly budgets per category.
 * Now supports time-filtered budget progress calculations.
 * Recalculates spent amounts based on the active time period.
 */
const BudgetTracker = () => {
  const { expenses, transactions } = useContext(ExpenseContext);
  const [budgets, setBudgetsLocal] = useState(getBudgets());
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [filter, setFilter] = useState('this_month');

  // Filter expenses by the active time range — memoized
  const filteredExpenses = useMemo(
    () => filterTransactionsByDateRange(expenses, filter),
    [expenses, filter]
  );

  // Recalculate spent whenever filtered expenses change
  useEffect(() => {
    recalculateSpent(filteredExpenses);
    setBudgetsLocal(getBudgets());
  }, [filteredExpenses]);

  // Memoized budget cards data — avoids recalculating on every render
  const budgetCards = useMemo(() => {
    return Object.entries(budgets).map(([category, { limit, spent }]) => {
      const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
      const color = getProgressColor(percent);
      const remaining = limit - spent;
      return { category, limit, spent, percent, color, remaining };
    });
  }, [budgets]);

  const handleAdd = useCallback(() => {
    setEditCategory(null);
    setShowModal(true);
  }, []);

  const handleEdit = useCallback((category) => {
    setEditCategory(category);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => setShowModal(false), []);

  // When modal saves, refresh budgets from storage
  const handleSave = useCallback(() => {
    setBudgetsLocal(getBudgets());
    closeModal();
  }, [closeModal]);

  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  return (
    <div className={styles.budgetTracker}>
      <div className={styles.budgetHeader}>
        <h3 className={styles.title}>Monthly Budgets</h3>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            className={styles.filterSelect}
            value={filter}
            onChange={handleFilterChange}
            style={{ minWidth: '130px' }}
          >
            <option value="this_month">This Month</option>
            <option value="previous_month">Previous Month</option>
            <option value="last_3_months">Last 3 Months</option>
            <option value="this_year">This Year</option>
          </select>
          <button className={styles.addBtn} onClick={handleAdd}>
            <FiPlus className={styles.addIcon} /> Add Budget
          </button>
        </div>
      </div>

      {/* Budget cards grid or empty state */}
      {budgetCards.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '3rem 1.5rem', gap: '1rem',
          background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
          border: '1px dashed rgba(255,255,255,0.08)'
        }}>
          <div style={{
            background: 'rgba(139,92,246,0.1)', padding: '1rem',
            borderRadius: '16px', display: 'flex'
          }}>
            <FiTarget size={28} style={{ color: '#8b5cf6' }} />
          </div>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '320px', lineHeight: 1.6 }}>
            No budgets set for {PERIOD_LABELS[filter] || 'this period'}. Create a budget to start tracking your spending goals.
          </p>
          <button className={styles.addBtn} onClick={handleAdd} style={{ marginTop: '0.5rem' }}>
            <FiPlus /> Set Your First Budget
          </button>
        </div>
      ) : (
        <div className={styles.budgetGrid}>
          {budgetCards.map(card => (
            <BudgetCard
              key={card.category}
              {...card}
              onEdit={() => handleEdit(card.category)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <BudgetModal
          category={editCategory}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default BudgetTracker;
