import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseContext } from '../../context/ExpenseContext';
import styles from '../../styles/analytics.module.css';
import illustration from '../../assets/empty_analytics.png'; // place generated image here

/**
 * Empty state displayed when there is no expense data to analyse.
 * Updates instantly via ExpenseContext.
 */
const EmptyAnalyticsState = () => {
  const { expenses } = useContext(ExpenseContext);
  const navigate = useNavigate();

  // Show only when there are no expenses (or no analytical data)
  if (expenses && expenses.length > 0) return null;

  const handleAdd = () => {
    // Assuming route "/add-expense" opens the AddExpenseModal or similar
    navigate('/add-expense');
  };

  return (
    <div className={styles.emptyAnalyticsContainer}>
      <img src={illustration} alt="Empty analytics" className={styles.emptyIllustration} />
      <h2 className={styles.emptyTitle}>No data to analyze yet</h2>
      <p className={styles.emptySubtitle}>Add your first expense to unlock powerful insights.</p>
      <button className={styles.ctaButton} onClick={handleAdd}>
        Add Expense
      </button>
    </div>
  );
};

export default EmptyAnalyticsState;
