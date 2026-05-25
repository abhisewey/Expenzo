import React, { useContext, useEffect, useState } from 'react';
import { ExpenseContext } from '../../context/ExpenseContext';
import {
  getBudgets,
  recalculateSpent,
  updateBudgetLimit,
  getProgress,
  getProgressColor,
  getRemaining,
} from '../../utils/budgetHelpers';
import BudgetCard from './BudgetCard';
import BudgetModal from './BudgetModal';
import styles from '../../styles/analytics.module.css';
import { FiPlus } from 'react-icons/fi';

/**
 * BudgetTracker – main UI for managing monthly budgets per category.
 * It reads budgets from localStorage, recalculates spent amounts whenever
 * expenses change, and provides a modal to add / edit budgets.
 */
const BudgetTracker = () => {
  const { expenses } = useContext(ExpenseContext);
  const [budgets, setBudgets] = useState(getBudgets());
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  // Recalculate spent whenever expenses change
  useEffect(() => {
    recalculateSpent(expenses);
    setBudgets(getBudgets());
  }, [expenses]);

  const handleAdd = () => {
    setEditCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // When modal saves, refresh budgets from storage
  const handleSave = () => {
    setBudgets(getBudgets());
    closeModal();
  };

  const renderCards = Object.entries(budgets).map(([category, { limit, spent }]) => {
    const percent = getProgress(category);
    const color = getProgressColor(percent);
    const remaining = getRemaining(category);
    return (
      <BudgetCard
        key={category}
        category={category}
        limit={limit}
        spent={spent}
        percent={percent}
        color={color}
        remaining={remaining}
        onEdit={() => handleEdit(category)}
      />
    );
  });

  return (
    <div className={styles.budgetTracker}>
      <div className={styles.budgetHeader}>
        <h3 className={styles.title}>Monthly Budgets</h3>
        <button className={styles.addBtn} onClick={handleAdd}>
          <FiPlus className={styles.addIcon} /> Add Budget
        </button>
      </div>
      <div className={styles.budgetGrid}>{renderCards}</div>
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
