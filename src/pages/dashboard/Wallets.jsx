import React, { useState, useContext, useMemo } from 'react';
import { ExpenseContext } from '../../context/ExpenseContext';
import { FiPlus, FiCreditCard, FiSmartphone, FiBriefcase, FiDollarSign, FiX } from 'react-icons/fi';
import styles from '../../styles/components/walletsPage.module.css';
import { formatCurrency } from '../../utils/formatCurrency';
import { enrichWalletsWithStats } from '../../utils/walletHelpers';

const WALLET_TYPES = {
  Cash: { icon: FiDollarSign, color: '#10b981' },
  UPI: { icon: FiSmartphone, color: '#8b5cf6' },
  'Bank Transfer': { icon: FiBriefcase, color: '#3b82f6' },
  'Credit Card': { icon: FiCreditCard, color: '#f43f5e' },
};

const Wallets = () => {
  const { wallets, setWallets, transactions } = useContext(ExpenseContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Wallet form state
  const [walletName, setWalletName] = useState('');
  const [walletType, setWalletType] = useState('Bank Transfer');
  const [walletBalance, setWalletBalance] = useState('');
  
  // Dynamic wallet stats
  const enrichedWallets = useMemo(() => {
    return enrichWalletsWithStats(wallets, transactions);
  }, [wallets, transactions]);
  
  const handleAddWallet = (e) => {
    e.preventDefault();
    if (!walletName || !walletBalance) return;
    
    const newWallet = {
      id: Date.now().toString(),
      name: walletName,
      type: walletType,
      initialBalance: Number(walletBalance),
      createdAt: new Date().toISOString()
    };
    
    setWallets(prev => [...prev, newWallet]);
    setIsModalOpen(false);
    setWalletName('');
    setWalletBalance('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Wallets</h1>
          <p className={styles.subtitle}>Manage accounts, cards, and cash balances.</p>
        </div>
        
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <FiPlus style={{ fontSize: '1.25rem' }} /> Add Wallet
        </button>
      </div>
      
      {enrichedWallets.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏦</div>
          <h2 className={styles.emptyTitle}>No wallets connected</h2>
          <p className={styles.emptyDesc}>
            Keep track of all your balances in one place. Add your bank accounts, credit cards, or cash wallets to get started.
          </p>
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <FiPlus style={{ fontSize: '1.25rem' }} /> Add Your First Wallet
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {enrichedWallets.map(wallet => {
            const typeConfig = WALLET_TYPES[wallet.type] || WALLET_TYPES['Bank Transfer'];
            const Icon = typeConfig.icon;
            
            return (
              <div 
                key={wallet.id} 
                className={styles.card}
                style={{ '--glow-color': typeConfig.color }}
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
                  
                  <div className={styles.stats}>
                    <span>Spent this month</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      {formatCurrency(wallet.spentThisMonth)}
                    </span>
                  </div>
                  
                  <div className={styles.progressContainer}>
                    <div 
                      className={styles.progressBar}
                      style={{ width: `${Math.min(wallet.progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add New Wallet</h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <FiX />
              </button>
            </div>
            
            <form className={styles.modalBody} onSubmit={handleAddWallet}>
              <div className={styles.inputGroup}>
                <label>Wallet Name</label>
                <input 
                  type="text" 
                  value={walletName}
                  onChange={e => setWalletName(e.target.value)}
                  placeholder="e.g. UPI, Credit Card, Cash"
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Wallet Type</label>
                <select value={walletType} onChange={e => setWalletType(e.target.value)}>
                  {Object.keys(WALLET_TYPES).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              
              <div className={styles.inputGroup}>
                <label>Initial Balance</label>
                <input 
                  type="number" 
                  value={walletBalance}
                  onChange={e => setWalletBalance(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <button type="submit" className={styles.submitBtn}>
                Save Wallet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallets;
