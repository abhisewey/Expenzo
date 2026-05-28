import React from 'react';
import { FiMenu, FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/components/dashboard.module.css';

const Topbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const today = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <button className={styles.mobileMenuBtn} onClick={toggleSidebar}>
          <FiMenu />
        </button>
        <div style={{ marginLeft: '1rem', fontWeight: 600, color: 'var(--text-main)', display: 'none' }} className={styles.desktopOnlyTitle}>
          Overview
        </div>
      </div>

      <div className={styles.topbarActions}>
        <div className={styles.dateDisplay}>
          {formattedDate}
        </div>
        
        <div className={styles.greeting}>
          Welcome back, <span>{user?.username}</span> 👋
        </div>

        <button className={styles.notificationBtn}>
          <FiBell />
          <span className={styles.badge}></span>
        </button>

        <div 
          className={`${styles.avatar} ${styles.topbarProfileAvatar}`} 
          style={{ backgroundColor: user?.avatarColor || '#8b5cf6' }}
          title={user?.email}
        >
          {getInitials(user?.username)}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
