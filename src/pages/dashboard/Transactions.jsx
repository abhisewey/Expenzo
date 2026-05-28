import { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useExpense } from '../../context/ExpenseContext';
import { expenseCategories, incomeCategories } from '../../data/categories';
import { formatCurrency } from '../../utils/formatCurrency';
import { exportTransactionsToCSV } from '../../utils/exportCSV';
import { FiDollarSign, FiSearch, FiX, FiInbox, FiFilter, FiDownload } from 'react-icons/fi';
import styles from '../../styles/components/transactions.module.css';
import commonStyles from '../../styles/components/dashboard.module.css';
import { formatTime, formatDate } from '../../utils/dateHelpers';
import { groupTransactionsByMonthYear } from '../../utils/transactionHelpers';
import EmptyState from '../../components/common/EmptyState';

const Transactions = () => {
  const { handleEditTrigger, onAddClick } = useOutletContext();
  const { filteredTransactions, filters, setFilters } = useExpense();
  
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, setFilters]);

  const filterOptions = ['All Methods', 'Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer'];

  const filteredAndGroupedTransactions = useMemo(() => {
    return groupTransactionsByMonthYear(filteredTransactions);
  }, [filteredTransactions]);

  const getCategoryConfig = (catName) => {
    return [...expenseCategories, ...incomeCategories].find(c => c.name === catName) || {
      color: '#94a3b8',
      icon: FiDollarSign
    };
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({ search: '', categories: [], methods: [], dateRange: 'this_month', customFrom: null, customTo: null, amountRange: [0, Infinity], sort: 'latest' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>All Transactions</h1>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => exportTransactionsToCSV(filteredTransactions)}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '0.75rem',
                background: 'var(--hover-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <FiDownload size={15} /> Export
            </button>
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
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(0,0,0,0.2)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
          </div>

          <button 
            onClick={clearAllFilters}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              background: 'rgba(244, 63, 94, 0.1)',
              color: '#f43f5e',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 500
            }}
          >
            <FiX /> Clear Filters
          </button>
        </div>

        <div className={styles.filterBar}>
          {filterOptions.map(option => {
            const isActive = option === 'All Methods' ? filters.methods.length === 0 : filters.methods.includes(option);
            return (
              <button
                key={option}
                className={`${styles.filterChip} ${isActive ? styles.active : ''}`}
                onClick={() => {
                  if (option === 'All Methods') {
                    setFilters(prev => ({ ...prev, methods: [] }));
                  } else {
                    setFilters(prev => ({ ...prev, methods: [option] }));
                  }
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.list}>
        {Object.keys(filteredAndGroupedTransactions).length === 0 ? (
          <EmptyState
            icon={filters.search || filters.methods.length ? FiFilter : FiInbox}
            title={filters.search || filters.methods.length ? 'No matching transactions' : 'No transactions yet'}
            description={
              filters.search || filters.methods.length
                ? 'Try adjusting your search or clearing your filters.'
                : 'Add your first transaction to start tracking your finances.'
            }
            action={{
              label: filters.search || filters.methods.length ? 'Clear Filters' : 'Add Transaction',
              onClick: filters.search || filters.methods.length ? clearAllFilters : onAddClick
            }}
          />
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
                          <span>{txn.paymentMethod || 'Budget'}</span>
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
