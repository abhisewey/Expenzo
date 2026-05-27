import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useExpense } from '../../context/ExpenseContext';
import { expenseCategories, incomeCategories } from '../../data/categories';
import { formatCurrency } from '../../utils/formatCurrency';
import { FiDollarSign, FiCreditCard } from 'react-icons/fi';
import styles from '../../styles/components/transactions.module.css';
import commonStyles from '../../styles/components/dashboard.module.css';
import { formatTime, formatDate } from '../../utils/dateHelpers';
import { filterTransactionsByPayment, groupTransactionsByMonthYear } from '../../utils/transactionHelpers';

const Transactions = () => {
  const { handleEditTrigger, onAddClick } = useOutletContext();
  const { transactions } = useExpense();
  
  const [paymentFilter, setPaymentFilter] = useState('All Methods');
  
  const filterOptions = ['All Methods', 'Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer'];

  const filteredAndGroupedTransactions = useMemo(() => {
    const filtered = filterTransactionsByPayment(transactions, paymentFilter);
    return groupTransactionsByMonthYear(filtered);
  }, [transactions, paymentFilter]);

  const getCategoryConfig = (catName) => {
    return [...expenseCategories, ...incomeCategories].find(c => c.name === catName) || {
      color: '#94a3b8',
      icon: FiDollarSign
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>All Transactions</h1>
          <button 
            onClick={onAddClick}
            className={commonStyles.primaryButton}
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.75rem', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>+</span> Add New
          </button>
        </div>
        
        <div className={styles.filterBar}>
          {filterOptions.map(option => (
            <button
              key={option}
              className={`${styles.filterChip} ${paymentFilter === option ? styles.active : ''}`}
              onClick={() => setPaymentFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {Object.keys(filteredAndGroupedTransactions).length === 0 ? (
          <div className={styles.emptyState}>
            <FiCreditCard className={styles.emptyIcon} />
            <h3>No transactions found</h3>
            <p>Try changing your payment method filter or add a new transaction.</p>
          </div>
        ) : (
          Object.entries(filteredAndGroupedTransactions).map(([month, data]) => (
            <div key={month} className={styles.group}>
              <div className={styles.groupHeader}>
                <span className={styles.monthTitle}>{month}</span>
                <span className={styles.monthSummary}>
                  {formatCurrency(data.totalSpent)} spent
                </span>
              </div>
              
              {data.transactions.map(txn => {
                const config = getCategoryConfig(txn.category);
                const Icon = config.icon;
                const isIncome = txn.type === 'income';
                
                return (
                  <div 
                    key={txn.id} 
                    className={styles.transactionCard}
                    onClick={() => handleEditTrigger(txn)}
                  >
                    <div className={styles.cardLeft}>
                      <div 
                        className={styles.iconWrapper} 
                        style={{ 
                          background: `${config.color}20`, 
                          color: config.color 
                        }}
                      >
                        <Icon />
                      </div>
                      <div className={styles.details}>
                        <div className={styles.titleWrapper}>
                          <span className={styles.txnTitle}>{txn.title || txn.merchant || txn.category}</span>
                          <span className={styles.badge} style={{ color: config.color, border: `1px solid ${config.color}40` }}>
                            {txn.category}
                          </span>
                        </div>
                        <div className={styles.meta}>
                          <span>{formatDate(txn.date)}</span>
                          <span className={styles.dot}></span>
                          <span>{txn.paymentMethod || 'Wallet'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.cardRight}>
                      <span className={`${styles.amount} ${isIncome ? styles.amountIncome : styles.amountExpense}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(txn.amount)}
                      </span>
                      <span className={styles.time}>{formatTime(txn.date)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;
