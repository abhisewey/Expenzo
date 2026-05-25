import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import SummaryCards from '../components/dashboard/SummaryCards';
import SpendingOverview from '../components/dashboard/SpendingOverview';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import FloatingActionButton from '../components/dashboard/FloatingActionButton';
import DashboardFooter from '../components/dashboard/DashboardFooter';
import AddExpenseModal from '../components/expense/AddExpenseModal';
import Toast from '../components/expense/Toast';
import { useExpense } from '../context/ExpenseContext';
import styles from '../styles/components/dashboard.module.css';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null); // Track targeted transaction in edit state
  
  const { toast, hideToast } = useExpense();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeMobileMenu = () => setIsSidebarOpen(false);

  const handleEditTrigger = (txn) => {
    setEditTransaction(txn);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditTransaction(null);
  };

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar isOpen={isSidebarOpen} closeMobileMenu={closeMobileMenu} />
      
      <div className={styles.mainContent}>
        <Topbar toggleSidebar={toggleSidebar} />
        
        <main className={styles.contentWrapper}>
          <SummaryCards />
          
          <div className={styles.mainGrid}>
            <div className={styles.leftColumn}>
              <SpendingOverview />
              <RecentTransactions 
                onEdit={handleEditTrigger}
                onAddClick={() => setIsModalOpen(true)}
              />
            </div>
            <div className={styles.rightColumn}>
              <CategoryBreakdown />
            </div>
          </div>
        </main>
        
        <DashboardFooter />
        <FloatingActionButton onOpen={() => setIsModalOpen(true)} />
        
        <AddExpenseModal 
          isOpen={isModalOpen} 
          onClose={handleModalClose} 
          transactionToEdit={editTransaction}
        />

        {/* Global Floating Notification Toast */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={hideToast} 
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
