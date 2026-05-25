import React, { useEffect } from 'react';
import styles from '../../styles/expense.module.css';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'success', onClose }) => {
  // Safe auto-dismiss timeout adjusted to exactly 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle />;
      case 'error':
        return <FiAlertCircle />;
      case 'info':
      default:
        return <FiInfo />;
    }
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.toastIcon}>
        {getIcon()}
      </div>
      <div className={styles.toastMessage}>{message}</div>
      <button 
        className={styles.toastClose} 
        onClick={onClose} 
        aria-label="Close Notification"
      >
        <FiX />
      </button>
    </div>
  );
};

export default Toast;
