import React, { useContext, useMemo } from 'react';
import { ExpenseContext } from '../../context/ExpenseContext';
import { FiCreditCard, FiSmartphone, FiBriefcase, FiDollarSign } from 'react-icons/fi';
import styles from '../../styles/components/walletsPage.module.css';
import { formatCurrency } from '../../utils/formatCurrency';
import { enrichWalletsWithStats, calculateRemainingBalance } from '../../utils/walletHelpers';

const WALLET_TYPES = {
  Cash: { icon: FiDollarSign, color: '#10b981' },
  UPI: { icon: FiSmartphone, color: '#8b5cf6' },
  'Bank Transfer': { icon: FiBriefcase, color: '#3b82f6' },
  'Credit Card': { icon: FiCreditCard, color: '#f43f5e' },
  'Debit Card': { icon: FiCreditCard, color: '#06b6d4' },
};

const Wallets = () => {
  const { wallets, transactions } = useContext(ExpenseContext);
  
  // Dynamic wallet stats
  const enrichedWallets = useMemo(() => {
    return enrichWalletsWithStats(wallets, transactions);
  }, [wallets, transactions]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Wallets</h1>
          <p className={styles.subtitle}>Manage accounts, cards, and cash balances.</p>
        </div>
      </div>
      
      {enrichedWallets.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏦</div>
          <h2 className={styles.emptyTitle}>No wallets connected</h2>
          <p className={styles.emptyDesc}>
            Add transactions using different payment methods to automatically track your balances here.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {enrichedWallets.map(wallet => {
            const typeConfig = WALLET_TYPES[wallet.type] || WALLET_TYPES['Bank Transfer'];
            const Icon = typeConfig.icon;
            
            return (
              <div 
                key={wallet.id} 
                className={`${styles.card} ${wallet.currentBalance < 0 ? styles.cardNegative : ''}`}
                style={{ '--glow-color': wallet.currentBalance < 0 ? '#ef4444' : typeConfig.color }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <Icon />
                  </div>
                  <span className={styles.cardType}>{wallet.type}</span>
                </div>
                
                <div className={styles.cardBody}>
                  <p className={styles.walletName}>{wallet.name}</p>
                  <h3 className={styles.balance}>{formatCurrency(wallet.currentBalance)}</h3>
                  
                  <div className={styles.statsGrid}>
                    <div className={styles.statColumn}>
                      <span className={styles.statLabel}>Spent This Month</span>
                      <span className={styles.statValue}>{formatCurrency(wallet.spentThisMonth)}</span>
                    </div>
                    <div className={styles.statColumn} style={{ alignItems: 'flex-end' }}>
                      <span className={styles.statLabel}>Remaining</span>
                      <span className={styles.statValue}>{formatCurrency(wallet.currentBalance)}</span>
                    </div>
                  </div>
                  
                  <div className={styles.progressContainer}>
                    <div 
                      className={styles.progressBar}
                      style={{ 
                        width: `${wallet.currentBalance < 0 ? 100 : Math.min(wallet.progress, 100)}%`,
                        background: wallet.progress >= 100 || wallet.currentBalance < 0
                          ? 'linear-gradient(90deg, #f43f5e, #ef4444)' 
                          : wallet.progress > 80 
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

export default Wallets;
