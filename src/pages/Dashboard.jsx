import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SummaryCards from '../components/dashboard/SummaryCards';
import SpendingOverview from '../components/dashboard/SpendingOverview';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import styles from '../styles/components/dashboard.module.css';

const Dashboard = () => {
  const { handleEditTrigger, onAddClick } = useOutletContext();

  return (
    <>
      <SummaryCards />
      
      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <SpendingOverview />
          <RecentTransactions 
            onEdit={handleEditTrigger}
            onAddClick={onAddClick}
          />
        </div>
        <div className={styles.rightColumn}>
          <CategoryBreakdown />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
