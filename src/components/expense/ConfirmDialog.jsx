import { useEffect } from 'react';
import styles from '../../styles/expense.module.css';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = "Confirm Delete", message = "Are you sure you want to delete this transaction? This action cannot be undone." }) => {
  // Keydown listener for Esc key to cancel dialog
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === 'confirm-dialog-backdrop') onClose();
  };

  return (
    <div 
      className={styles.dialogBackdrop} 
      id="confirm-dialog-backdrop"
      onClick={handleOutsideClick}
    >
      <div className={styles.dialogContent}>
        <div className={styles.dialogHeader}>
          <div className={styles.dialogWarningIconWrapper}>
            <FiAlertTriangle className={styles.dialogWarningIcon} />
          </div>
          <div>
            <h3 className={styles.dialogTitle}>{title}</h3>
            <p className={styles.dialogText}>{message}</p>
          </div>
        </div>
        
        <div className={styles.dialogActions}>
          <button className={styles.dialogCancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button 
            className={styles.dialogConfirmBtn} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
