import React from 'react';
import styles from '../../styles/expense.module.css';
import { FiPlus, FiTrendingUp } from 'react-icons/fi';

const EmptyState = ({ onAddClick }) => {
  return (
    <div className={styles.emptyState}>
      {/* Decorative Premium Financial Growth Icon Illustration */}
      <div className={styles.emptyStateIconWrapper}>
        <FiTrendingUp className={styles.emptyStateIcon} />
      </div>
      <h3 className={styles.emptyStateTitle}>No expenses yet. Let’s start tracking!</h3>
      <p className={styles.emptyStateText}>
        Start managing your financial budget by logging your first income or expense today.
      </p>
      <button className={styles.emptyStateBtn} onClick={onAddClick}>
        <FiPlus /> Add Your First Expense
      </button>
    </div>
  );
};

export default EmptyState;
