import React from 'react';
import styles from '../../styles/expense.module.css';
import { FiTrash2, FiEdit2, FiCreditCard } from 'react-icons/fi';
import { expenseCategories, incomeCategories } from '../../data/categories';

const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const { title, merchant, amount, type, date, category, paymentMethod } = transaction;

  const getCategoryConfig = () => {
    // Search combined categories to support standard config schema mappings
    const config = [...expenseCategories, ...incomeCategories].find(c => c.name === category);
    return config || { color: '#8b5cf6', icon: null };
  };

  const { color, icon: IconComponent } = getCategoryConfig();

  return (
    <div className={`${styles.txnCard} ${type === 'income' ? styles.incomeCard : styles.expenseCard}`}>
      {/* Left side: Icon & Title Block */}
      <div className={styles.txnCardLeft}>
        <div 
          className={styles.txnCardIcon}
          style={{ background: `${color}15`, color: color }}
        >
          {IconComponent ? React.createElement(IconComponent) : <FiCreditCard />}
        </div>
        <div className={styles.txnCardDetails}>
          <h4 className={styles.txnCardTitle}>{title}</h4>
          <span className={styles.txnCardMerchant}>{merchant || 'Self'}</span>
        </div>
      </div>

      {/* Center side: Category Badges & Date details */}
      <div className={styles.txnCardMeta}>
        <span 
          className={styles.txnCardBadge}
          style={{ color: color, background: `${color}12` }}
        >
          {category}
        </span>
        <div className={styles.txnCardDateRow}>
          <span className={styles.txnCardDate}>
            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className={styles.txnCardPayment}>
            <FiCreditCard className={styles.paymentIcon} /> {paymentMethod}
          </span>
        </div>
      </div>

      {/* Right side: Amount (Red/Green) & Actions Trigger Buttons */}
      <div className={styles.txnCardRight}>
        <span className={`${styles.txnCardAmount} ${type === 'income' ? styles.amountPositive : styles.amountNegative}`}>
          {type === 'income' ? '+' : '-'}₹{Number(amount).toLocaleString('en-IN')}
        </span>
        <div className={styles.txnCardActions}>
          <button 
            className={styles.actionBtnEdit} 
            onClick={() => onEdit(transaction)}
            title="Edit Transaction"
            aria-label="Edit Transaction"
          >
            <FiEdit2 />
          </button>
          <button 
            className={styles.actionBtnDelete} 
            onClick={() => onDelete(transaction.id)}
            title="Delete Transaction"
            aria-label="Delete Transaction"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
