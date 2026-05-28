import { useOutletContext } from 'react-router-dom';
import SummaryCards from '../components/dashboard/SummaryCards';
import SpendingOverview from '../components/dashboard/SpendingOverview';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import CategoryRingChart from '../components/dashboard/CategoryRingChart';
import styles from '../styles/components/dashboard.module.css';

const Dashboard = () => {
  const { handleEditTrigger, onAddClick } = useOutletContext();

  return (
    <>
      <SummaryCards />
      
      <div className={styles.mainGrid}>
        {/* Left column: Spending trends + recent activity */}
        <div className={styles.leftColumn}>
          <SpendingOverview />
          <RecentTransactions 
            onEdit={handleEditTrigger}
            onAddClick={onAddClick}
          />
        </div>

        {/* Right column: Category expense distribution ring chart */}
        <div className={styles.rightColumn}>
          <CategoryRingChart />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
