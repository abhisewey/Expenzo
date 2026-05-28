import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ExpenseProvider } from './context/ExpenseContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ExpenseProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ExpenseProvider>
    </AuthProvider>
  </StrictMode>,
);
