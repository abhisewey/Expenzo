import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './Footer.module.css';

const Footer = () => {
  const { isAuthenticated, user } = useAuth();
  const currentYear = new Date().getFullYear();

  if (!isAuthenticated) {
    return (
      <footer className={`${styles.footer} ${styles.authFooter}`}>
        <div className={styles.copyright}>
          &copy; {currentYear} Expenzo. Crafted for financial clarity.
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◓</span> Expenzo
        </div>
        <div className={styles.copyright}>
          &copy; {currentYear} Expenzo Inc. All rights reserved.
        </div>
      </div>
      
      <div className={styles.userInfo}>
        Logged in as <span className={styles.userName}>{user?.username}</span>
      </div>

      <div className={styles.links}>
        <Link to="#" className={styles.link}>Privacy</Link>
        <Link to="#" className={styles.link}>Terms</Link>
        <Link to="#" className={styles.link}>Support</Link>
      </div>
    </footer>
  );
};

export default Footer;
