import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginSignup from './pages/auth/LoginSignup';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/dashboard/Transactions';
import Analytics from './pages/dashboard/Analytics';
import Wallets from './pages/dashboard/Wallets';
import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';

const AppRoutes = () => {
  const location = useLocation();
  // Check if we are on a dashboard-related route
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                           location.pathname.startsWith('/analytics') || 
                           location.pathname.startsWith('/transactions') ||
                           location.pathname.startsWith('/goals') ||
                           location.pathname.startsWith('/settings') ||
                           location.pathname.startsWith('/wallets');

  return (
    <>
      {/* Global Navbar only for marketing/auth pages */}
      {!isDashboardRoute && <Navbar />}
      
      <div style={!isDashboardRoute ? { flex: 1, display: 'flex', flexDirection: 'column' } : { width: '100%' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<LoginSignup />} />
          
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/wallets" element={<Wallets />} />
          </Route>
          
          {/* Catch all to redirect to auth */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>

      {/* Global Footer only for marketing/auth pages */}
      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default AppRoutes;
