import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { validateEmail, getPasswordStrengthMessage } from '../../../utils/validators';
import styles from './AuthCard.module.css';

// Minimal inline SVGs
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const SpinnerIcon = () => (
  <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const AuthCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, signup, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  // Form States
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  
  // Real-time validation tracking (touched inputs)
  const [loginTouched, setLoginTouched] = useState({ email: false, password: false });
  const [signupTouched, setSignupTouched] = useState({ username: false, email: false, password: false, confirmPassword: false });
  
  const [localError, setLocalError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Cleanup errors when auth error state changes externally
  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    clearError();
    setLocalError('');
    setShowPassword(false);
  };

  // Real-time validation helpers
  const getLoginInputClass = (field) => {
    if (!loginTouched[field]) return '';
    if (field === 'email') return validateEmail(loginForm.email) ? styles.success : styles.error;
    if (field === 'password') return loginForm.password.length > 0 ? styles.success : styles.error;
    return '';
  };

  const getSignupInputClass = (field) => {
    if (!signupTouched[field]) return '';
    if (field === 'username') return signupForm.username.trim().length >= 3 ? styles.success : styles.error;
    if (field === 'email') return validateEmail(signupForm.email) ? styles.success : styles.error;
    if (field === 'password') return !getPasswordStrengthMessage(signupForm.password) ? styles.success : styles.error;
    if (field === 'confirmPassword') return (signupForm.password === signupForm.confirmPassword && signupForm.confirmPassword) ? styles.success : styles.error;
    return '';
  };

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoginTouched({ email: true, password: true });
    
    if (!validateEmail(loginForm.email)) {
      return setLocalError('Please enter a valid email address.');
    }
    
    const success = await login(loginForm.email, loginForm.password);
    if (success) {
      showToast('Login successful! Redirecting...', 'success');
      setTimeout(() => navigate(from, { replace: true }), 1500);
    }
  };

  const onSignupSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSignupTouched({ username: true, email: true, password: true, confirmPassword: true });
    
    if (signupForm.username.trim().length < 3) return setLocalError('Username must be at least 3 characters.');
    if (!validateEmail(signupForm.email)) return setLocalError('Invalid email format.');
    
    const pwError = getPasswordStrengthMessage(signupForm.password);
    if (pwError) return setLocalError(pwError);
    
    if (signupForm.password !== signupForm.confirmPassword) {
      return setLocalError('Passwords do not match.');
    }

    const success = await signup(signupForm.username, signupForm.email, signupForm.password);
    if (success) {
      showToast('Account created successfully!', 'success');
      setTimeout(() => navigate(from, { replace: true }), 1500);
    }
  };

  return (
    <div className={`${styles.cardContainer} ${isFlipped ? styles.isFlipped : ''}`}>
      
      {/* Toast Notification */}
      <div className={`${styles.toast} ${toast.show ? styles.show : ''} ${toast.type === 'error' ? styles.error : ''}`}>
        {toast.type === 'success' && <CheckIcon />}
        {toast.message}
      </div>

      <div className={styles.cardFlipper}>
        
        {/* ================= LOGIN FRONT ================= */}
        <div className={styles.cardFront}>
          <div className={styles.header}>
            <h2>Welcome Back</h2>
            <p>Enter your details to access your dashboard</p>
          </div>

          <form className={styles.form} onSubmit={onLoginSubmit}>
            <div className={`${styles.inputGroup} ${getLoginInputClass('email')}`}>
              <input
                id="login-email"
                type="email"
                className={styles.input}
                placeholder=" "
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                onBlur={() => setLoginTouched({...loginTouched, email: true})}
              />
              <label htmlFor="login-email" className={styles.label}>Email Address</label>
            </div>

            <div className={`${styles.inputGroup} ${getLoginInputClass('password')}`}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                placeholder=" "
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                onBlur={() => setLoginTouched({...loginTouched, password: true})}
              />
              <label htmlFor="login-password" className={styles.label}>Password</label>
              <button 
                type="button" 
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className={styles.options}>
              <label className={styles.checkbox}>
                <input type="checkbox" /> Remember me
              </label>
              <button type="button" className={styles.forgotLink} onClick={() => showToast('Forgot password feature coming soon!', 'success')}>
                Forgot password?
              </button>
            </div>

            <div className={`${styles.errorContainer} ${localError ? styles.show : ''}`}>
              {localError && <div className={styles.errorText}>{localError}</div>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <><SpinnerIcon /> Authenticating...</> : 'Log In'}
            </button>
          </form>

          <p className={styles.switchText}>
            Don't have an account? 
            <button type="button" className={styles.switchBtn} onClick={handleFlip}>
              Sign up
            </button>
          </p>
        </div>

        {/* ================= SIGNUP BACK ================= */}
        <div className={styles.cardBack}>
          <div className={styles.header}>
            <h2>Create Account</h2>
            <p>Start mastering your money today</p>
          </div>

          <form className={styles.form} onSubmit={onSignupSubmit}>
            <div className={`${styles.inputGroup} ${getSignupInputClass('username')}`}>
              <input
                id="signup-username"
                type="text"
                className={styles.input}
                placeholder=" "
                value={signupForm.username}
                onChange={(e) => setSignupForm({...signupForm, username: e.target.value})}
                onBlur={() => setSignupTouched({...signupTouched, username: true})}
              />
              <label htmlFor="signup-username" className={styles.label}>Username</label>
            </div>

            <div className={`${styles.inputGroup} ${getSignupInputClass('email')}`}>
              <input
                id="signup-email"
                type="email"
                className={styles.input}
                placeholder=" "
                value={signupForm.email}
                onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                onBlur={() => setSignupTouched({...signupTouched, email: true})}
              />
              <label htmlFor="signup-email" className={styles.label}>Email Address</label>
            </div>

            <div className={`${styles.inputGroup} ${getSignupInputClass('password')}`}>
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                placeholder=" "
                value={signupForm.password}
                onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                onBlur={() => setSignupTouched({...signupTouched, password: true})}
              />
              <label htmlFor="signup-password" className={styles.label}>Password</label>
              <button 
                type="button" 
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className={`${styles.inputGroup} ${getSignupInputClass('confirmPassword')}`}>
              <input
                id="signup-confirm"
                type="password"
                className={styles.input}
                placeholder=" "
                value={signupForm.confirmPassword}
                onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                onBlur={() => setSignupTouched({...signupTouched, confirmPassword: true})}
              />
              <label htmlFor="signup-confirm" className={styles.label}>Confirm Password</label>
            </div>

            <div className={`${styles.errorContainer} ${localError ? styles.show : ''}`}>
              {localError && <div className={styles.errorText}>{localError}</div>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <><SpinnerIcon /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account? 
            <button type="button" className={styles.switchBtn} onClick={handleFlip}>
              Log in
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default AuthCard;
