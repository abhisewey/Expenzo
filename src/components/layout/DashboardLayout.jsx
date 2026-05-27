import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import Topbar from '../dashboard/Topbar';
import DashboardFooter from '../dashboard/DashboardFooter';
import FloatingActionButton from '../dashboard/FloatingActionButton';
import AddExpenseModal from '../expense/AddExpenseModal';
import Toast from '../expense/Toast';
import { useExpense } from '../../context/ExpenseContext';
import styles from '../../styles/components/dashboard.module.css';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const location = useLocation();
  
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
          <div key={location.pathname} style={{ animation: 'fadeIn 0.3s ease-out', width: '100%', height: '100%' }}>
            <Outlet context={{ handleEditTrigger, onAddClick: () => setIsModalOpen(true) }} />
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

export default DashboardLayout;
