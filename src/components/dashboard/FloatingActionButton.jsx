import React from 'react';
import { FiPlus } from 'react-icons/fi';
import styles from '../../styles/components/dashboard.module.css';

const FloatingActionButton = ({ onOpen }) => {
  return (
    <button 
      className={styles.fab} 
      title="Add New Transaction"
      onClick={onOpen}
    >
      <FiPlus className={styles.fabIcon} />
    </button>
  );
};

export default FloatingActionButton;
