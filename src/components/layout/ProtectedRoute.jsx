import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Global loading state for auth check
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f0f1a' }}>
        <div style={{ color: '#ffffff', fontFamily: 'Inter, sans-serif', fontSize: '1.5rem', fontWeight: '500' }}>
          Loading Expenzo...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to /auth and remember the intended location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
