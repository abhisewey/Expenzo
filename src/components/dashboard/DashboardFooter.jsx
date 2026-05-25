import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/components/dashboard.module.css';

const DashboardFooter = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.dashboardFooter}>
      <div className={styles.dashboardFooterLeft}>
        <span className={styles.footerLogoIcon}>◓</span> 
        <span className={styles.footerText}>Expenzo © {currentYear}</span>
      </div>
      <div className={styles.dashboardFooterRight}>
        Logged in as <span className={styles.footerHighlight}>{user?.username}</span>
      </div>
    </footer>
  );
};

export default DashboardFooter;
