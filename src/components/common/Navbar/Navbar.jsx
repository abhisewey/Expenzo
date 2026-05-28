import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoIcon}>◓</span>
        Expenzo
      </Link>

      {/* Hamburger Menu Icon */}
      <div className={styles.hamburger} onClick={toggleMobileMenu}>
        <span style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }}></span>
        <span style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
        <span style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></span>
      </div>

      {/* Navigation Links */}
      <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
        {!isAuthenticated ? (
          <>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/#features" className={styles.navLink}>Features</Link>
            <Link to="/#pricing" className={styles.navLink}>Pricing</Link>
            
            {/* Mobile Actions for Unauthenticated */}
            <div className={styles.navActionsMobile}>
              <button 
                className={styles.getStartedBtn} 
                onClick={() => navigate('/auth')}
              >
                Get Started
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
            <Link to="/budgets" className={styles.navLink}>Budgets</Link>
            
            {/* Mobile Actions for Authenticated */}
            <div className={styles.navActionsMobile}>
              <div className={styles.profileMenuMobile}>
                 <div className={styles.avatar} style={{ backgroundColor: user?.avatarColor || '#8b5cf6' }}>
                  {getInitials(user?.username)}
                </div>
                <span className={styles.usernameMobile}>{user?.username}</span>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </div>
          </>
        )}
      </div>

      {/* Desktop Actions */}
      <div className={styles.navActions}>
        {!isAuthenticated ? (
          <button className={styles.getStartedBtn} onClick={() => navigate('/auth')}>
            Get Started
          </button>
        ) : (
          <div className={styles.profileMenu}>
            <span className={styles.username}>{user?.username}</span>
            <div 
              className={styles.avatar} 
              style={{ backgroundColor: user?.avatarColor || '#8b5cf6' }}
              title={user?.email}
            >
              {getInitials(user?.username)}
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
