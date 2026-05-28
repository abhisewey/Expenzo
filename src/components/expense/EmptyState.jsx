import styles from '../../styles/expense.module.css';
import { FiPlus, FiTrendingUp, FiInbox } from 'react-icons/fi';

/**
 * EmptyState – professional, context-aware empty state for transaction lists.
 * Props:
 *   onAddClick: function – opens the Add Expense modal
 *   periodLabel: string – human-readable label for the active time filter (e.g. "This Month")
 *   hasTransactions: boolean – whether the user has ANY transactions at all (distinguishes
 *                              "new user" from "no data in this period")
 */
const EmptyState = ({ onAddClick, periodLabel = 'this period', hasTransactions = false }) => {
  // Context-aware: distinguish between a brand-new user and a filtered-empty state
  const isNewUser = !hasTransactions;

  return (
    <div className={styles.emptyState}>
      {/* Decorative Premium Icon */}
      <div className={styles.emptyStateIconWrapper}>
        {isNewUser ? (
          <FiTrendingUp className={styles.emptyStateIcon} />
        ) : (
          <FiInbox className={styles.emptyStateIcon} />
        )}
      </div>

      <h3 className={styles.emptyStateTitle}>
        {isNewUser
          ? "No expenses yet. Let's start tracking!"
          : `No spending in ${periodLabel}`
        }
      </h3>

      <p className={styles.emptyStateText}>
        {isNewUser
          ? 'Start managing your financial budget by logging your first income or expense today.'
          : `There are no transactions recorded for ${periodLabel}. Try adjusting your filters or add a new expense.`
        }
      </p>

      <button className={styles.emptyStateBtn} onClick={onAddClick}>
        <FiPlus /> {isNewUser ? 'Add Your First Expense' : 'Add Expense'}
      </button>
    </div>
  );
};

export default EmptyState;
