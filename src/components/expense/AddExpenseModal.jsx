import React, { useEffect } from 'react';
import styles from '../../styles/expense.module.css';
import ExpenseForm from './ExpenseForm';
import { FiX } from 'react-icons/fi';

const AddExpenseModal = ({ isOpen, onClose, transactionToEdit }) => {
  // Listen for keyboard ESC key to trigger close action
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // block page scrolling under modal
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset'; // unblock scrolling
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle click trigger outside the modal boundary
  const handleOutsideClick = (e) => {
    if (e.target.id === 'modal-backdrop') onClose();
  };

  return (
    <div 
      className={styles.modalBackdrop} 
      id="modal-backdrop" 
      onClick={handleOutsideClick}
    >
      <div className={styles.modalContent}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>
              {transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
            </h3>
            <p className={styles.modalSubtitle}>
              {transactionToEdit ? 'Modify your registered cash flow details' : 'Track your cash flow instantly'}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Close (Esc)">
            <FiX />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className={styles.modalBody}>
          <ExpenseForm onClose={onClose} transactionToEdit={transactionToEdit} />
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
