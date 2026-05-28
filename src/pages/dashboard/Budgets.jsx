import { useContext, useMemo } from 'react';
import { ExpenseContext } from '../../context/ExpenseContext';
import { FiCreditCard, FiSmartphone, FiBriefcase, FiDollarSign, FiPlusCircle } from 'react-icons/fi';
import styles from '../../styles/components/budgetsPage.module.css';
import { formatCurrency } from '../../utils/formatCurrency';
import { enrichBudgetsWithStats } from '../../utils/budgetHelpers';
import EmptyState from '../../components/common/EmptyState';

const BUDGET_TYPES = {
  Cash: { icon: FiDollarSign, color: '#10b981' },
  UPI: { icon: FiSmartphone, color: '#8b5cf6' },
  'Bank Transfer': { icon: FiBriefcase, color: '#3b82f6' },
  'Credit Card': { icon: FiCreditCard, color: '#f43f5e' },
  'Debit Card': { icon: FiCreditCard, color: '#06b6d4' },
};

const Budgets = () => {
  const { budgets, transactions } = useContext(ExpenseContext);
  
  // Dynamic budget stats
  const enrichedBudgets = useMemo(() => {
    return enrichBudgetsWithStats(budgets, transactions);
  }, [budgets, transactions]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Budgets</h1>
          <p className={styles.subtitle}>Manage accounts, cards, and cash balances.</p>
        </div>
      </div>
      
      {enrichedBudgets.length === 0 ? (
        <EmptyState
          icon={FiPlusCircle}
          title="No payment accounts yet"
          description="Add transactions with different payment methods (UPI, Cash, Credit Card) to automatically track your account balances here."
        />
      ) : (
        <div className={styles.grid}>
          {enrichedBudgets.map(budget => {
            const typeConfig = BUDGET_TYPES[budget.type] || BUDGET_TYPES['Bank Transfer'];
            const Icon = typeConfig.icon;
            
            return (
              <div 
                key={budget.id} 
                className={`${styles.card} ${budget.currentBalance < 0 ? styles.cardNegative : ''}`}
                style={{ '--glow-color': budget.currentBalance < 0 ? '#ef4444' : typeConfig.color }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <Icon />
                  </div>
                  <span className={styles.cardType}>{budget.type}</span>
                </div>
                
                <div className={styles.cardBody}>
                  <p className={styles.budgetName}>{budget.name}</p>
                  <h3 className={styles.balance}>{formatCurrency(Math.max(0, budget.currentBalance))}</h3>
                  
                  <div className={styles.statsGrid}>
                    <div className={styles.statColumn}>
                      <span className={styles.statLabel}>Spent This Month</span>
                      <span className={styles.statValue}>{formatCurrency(budget.spentThisMonth)}</span>
                    </div>
                    <div className={styles.statColumn} style={{ alignItems: 'flex-end' }}>
                      <span className={styles.statLabel}>Remaining Budget</span>
                      <span className={styles.statValue}>{formatCurrency(Math.max(0, budget.currentBalance))}</span>
                    </div>
                  </div>
                  
                  <div className={styles.progressContainer}>
                    <div 
                      className={styles.progressBar}
                      style={{ 
                        width: `${budget.currentBalance < 0 ? 100 : Math.max(0, Math.min(100, budget.progress))}%`,
                        background: budget.progress >= 100 || budget.currentBalance < 0
                          ? 'linear-gradient(90deg, #f43f5e, #ef4444)' 
                          : budget.progress > 80 
                            ? 'linear-gradient(90deg, #f59e0b, #f97316)' 
                            : 'linear-gradient(90deg, #06b6d4, #8b5cf6)'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Budgets;
