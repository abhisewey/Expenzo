import React from 'react';
import TransactionList from '../expense/TransactionList';
import styles from '../../styles/components/dashboard.module.css';

const RecentTransactions = ({ onEdit, onAddClick }) => {
  return (
    <div className={`${styles.card} ${styles.transactionsCard}`}>
      <h2 className={styles.sectionTitle} style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
        Ledger Overview
      </h2>
      <TransactionList onEdit={onEdit} onAddClick={onAddClick} />
    </div>
  );
};

export default RecentTransactions;
