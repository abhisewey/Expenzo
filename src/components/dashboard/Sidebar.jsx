import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiPieChart, FiCreditCard, FiCrosshair, FiFolder, FiBriefcase, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/components/dashboard.module.css';

const Sidebar = ({ isOpen, closeMobileMenu }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`${styles.sidebarOverlay} ${isOpen ? styles.show : ''}`} 
        onClick={closeMobileMenu}
      />
      
      {/* Sidebar Container */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <NavLink to="/dashboard" className={styles.sidebarLogo} onClick={closeMobileMenu}>
            <img
              src="https://imgcdn.stablediffusionweb.com/2024/12/2/918e2693-1775-4c5d-81a0-99d43657b73e.jpg"
              alt="Expenzo Logo"
              className={styles.sidebarLogoImg}
            />
            Expenzo
          </NavLink>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          <div className={styles.navSection}>MENU</div>
          
          <NavLink to="/dashboard" end className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`} onClick={closeMobileMenu}>
            <FiHome className={styles.navIcon} /> Dashboard
          </NavLink>
          
          <NavLink to="/transactions" className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`} onClick={closeMobileMenu}>
            <FiCreditCard className={styles.navIcon} /> Transactions
          </NavLink>
          
          <NavLink to="/analytics" className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`} onClick={closeMobileMenu}>
            <FiPieChart className={styles.navIcon} /> Analytics
          </NavLink>
          
          <NavLink to="/budgets" className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`} onClick={closeMobileMenu}>
            <FiCrosshair className={styles.navIcon} /> Budgets
          </NavLink>
          
          <NavLink to="/wallets" className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`} onClick={closeMobileMenu}>
            <FiBriefcase className={styles.navIcon} /> Wallets
          </NavLink>
          
          <NavLink to="/categories" className={({isActive}) => `${styles.navItem} ${isActive ? styles.active : ''}`} onClick={closeMobileMenu}>
            <FiFolder className={styles.navIcon} /> Categories
          </NavLink>
        </nav>

        {/* Bottom Section: Profile & Logout */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userProfileCard}>
            <div className={styles.userProfileAvatar} style={{ backgroundColor: user?.avatarColor || '#8b5cf6' }}>
              {getInitials(user?.username)}
            </div>
            <div className={styles.userProfileInfo}>
              <span className={styles.userProfileName}>{user?.username}</span>
              <span className={styles.userProfileEmail}>{user?.email}</span>
            </div>
          </div>
          
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut className={styles.logoutIcon} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
