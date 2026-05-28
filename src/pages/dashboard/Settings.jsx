import { useState, useContext, useEffect, useCallback } from 'react';
import { ExpenseContext } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import { exportTransactionsToCSV } from '../../utils/exportCSV';
import {
  FiUser, FiMoon, FiSun, FiGlobe, FiShield, FiTrash2,
  FiBell, FiChevronRight, FiDollarSign, FiDownload
} from 'react-icons/fi';
import styles from '../../styles/components/dashboard.module.css';

/**
 * SettingRow — Reusable row for each setting item.
 */
const SettingRow = ({ icon: Icon, label, description, children, iconColor }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.1rem 1.5rem',
    borderBottom: '1px solid var(--border-subtle, var(--hover-bg))',
    gap: '1rem'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
      <div style={{
        width: '38px', height: '38px', borderRadius: '10px',
        background: `${iconColor || '#8b5cf6'}15`,
        color: iconColor || '#8b5cf6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', flexShrink: 0
      }}>
        <Icon />
      </div>
      <div>
        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{label}</div>
        {description && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>{description}</div>}
      </div>
    </div>
    {children}
  </div>
);

/**
 * ToggleSwitch — Premium animated toggle.
 */
const ToggleSwitch = ({ checked, onChange, activeGradient }) => (
  <div
    role="switch"
    aria-checked={checked}
    tabIndex={0}
    onClick={onChange}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange();
      }
    }}
    style={{
      width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
      background: checked
        ? (activeGradient || 'linear-gradient(90deg, #8b5cf6, #06b6d4)')
        : 'var(--border-subtle)',
      position: 'relative', transition: 'background 0.3s ease', flexShrink: 0
    }}
  >
    <div style={{
      position: 'absolute', top: '3px',
      left: checked ? '22px' : '3px',
      width: '18px', height: '18px', borderRadius: '50%',
      background: 'var(--text-main)', transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
    }} />
  </div>
);

/**
 * SectionHeader — Premium section header inside card blocks.
 */
const SectionHeader = ({ title }) => (
  <div style={{
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border-subtle, var(--hover-bg))',
    fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-muted)',
    letterSpacing: '1.5px', textTransform: 'uppercase'
  }}>
    {title}
  </div>
);

const Settings = () => {
  const { userSettings, setUserSettings, filteredTransactions, transactions, showToast } = useContext(ExpenseContext);
  const { user } = useAuth();

  // Local state mirrors userSettings for instant UI, syncs back to context
  const [currency, setCurrency] = useState(userSettings?.currency || 'INR');
  const [monthlyIncome, setMonthlyIncome] = useState(userSettings?.income || 0);
  const [notifications, setNotifications] = useState(userSettings?.notifications !== false);
  const [theme, setTheme] = useState(userSettings?.theme || 'dark');

  // Apply theme to document on mount and when changed
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync settings to context + persist to localStorage
  const updateSetting = useCallback((key, value) => {
    setUserSettings(prev => ({ ...prev, [key]: value }));
  }, [setUserSettings]);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
    updateSetting('currency', e.target.value);
  };

  const handleIncomeChange = (e) => {
    const val = Number(e.target.value) || 0;
    setMonthlyIncome(val);
    updateSetting('income', val);
  };

  const handleThemeToggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    updateSetting('theme', next);
    showToast(`Switched to ${next} mode`, 'success');
  };

  const handleNotificationsToggle = () => {
    const next = !notifications;
    setNotifications(next);
    updateSetting('notifications', next);
  };

  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      showToast('No transactions to export', 'error');
      return;
    }
    exportTransactionsToCSV(filteredTransactions);
    showToast(`Exported ${filteredTransactions.length} transactions`, 'success');
  };

  const handleExportAll = () => {
    if (transactions.length === 0) {
      showToast('No transactions to export', 'error');
      return;
    }
    exportTransactionsToCSV(transactions, 'expenzo_all_transactions');
    showToast(`Exported all ${transactions.length} transactions`, 'success');
  };

  const handleClearData = () => {
    if (window.confirm('⚠️ This will permanently delete all your transactions and settings. Are you sure?')) {
      // Clear all user-scoped localStorage
      const email = user?.email;
      if (email) {
        const keysToRemove = ['transactions', 'custom_categories', 'settings'];
        keysToRemove.forEach(k => localStorage.removeItem(`${k}_${email}`));
      }
      showToast('All data cleared. Reload to start fresh.', 'info');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const inputStyle = {
    padding: '0.55rem 1rem',
    borderRadius: '8px',
    background: 'var(--input-bg, var(--hover-bg))',
    border: '1px solid var(--border-subtle, var(--border-subtle))',
    color: 'var(--text-main)',
    fontSize: '0.9rem',
    outline: 'none',
    width: '140px',
    textAlign: 'right'
  };

  const selectStyle = { ...inputStyle, cursor: 'pointer', width: 'auto', textAlign: 'left' };

  const exportBtnStyle = {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.6rem 1.1rem', borderRadius: '10px',
    background: 'var(--accent-gradient)',
    color: 'var(--text-main)', fontWeight: 600, fontSize: '0.85rem',
    cursor: 'pointer', border: 'none',
    boxShadow: '0 3px 10px rgba(139,92,246,0.25)',
    transition: 'transform 0.2s ease'
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageSubtitle}>Manage your account preferences and application settings.</p>
        </div>
      </header>

      {/* ─── Profile ──────────────────────────────────────────── */}
      <section className={styles.card} style={{ padding: 0, overflow: 'hidden', marginBottom: '1.25rem' }}>
        <SectionHeader title="Profile" />
        <SettingRow icon={FiUser} label={user?.username || 'User'} description={user?.email || 'Not signed in'}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Account <FiChevronRight />
          </span>
        </SettingRow>
      </section>

      {/* ─── Preferences ──────────────────────────────────────── */}
      <section className={styles.card} style={{ padding: 0, overflow: 'hidden', marginBottom: '1.25rem' }}>
        <SectionHeader title="Preferences" />

        <SettingRow icon={theme === 'dark' ? FiMoon : FiSun} label="Theme" description={`Currently using ${theme} mode`} iconColor={theme === 'dark' ? '#8b5cf6' : '#f59e0b'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </span>
            <ToggleSwitch
              checked={theme === 'light'}
              onChange={handleThemeToggle}
              activeGradient="linear-gradient(90deg, #f59e0b, #f97316)"
            />
          </div>
        </SettingRow>

        <SettingRow icon={FiGlobe} label="Currency" description="Used across all charts and reports">
          <select style={selectStyle} value={currency} onChange={handleCurrencyChange}>
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
            <option value="JPY">¥ JPY</option>
          </select>
        </SettingRow>

        <SettingRow icon={FiDollarSign} label="Monthly Income" description="Used for savings rate calculations" iconColor="#10b981">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>₹</span>
            <input
              style={inputStyle}
              type="number"
              min="0"
              placeholder="0"
              value={monthlyIncome || ''}
              onChange={handleIncomeChange}
              onBlur={() => updateSetting('income', monthlyIncome)}
            />
          </div>
        </SettingRow>

        <SettingRow icon={FiBell} label="Notifications" description="Budget alerts and spending reminders" iconColor="#06b6d4">
          <ToggleSwitch checked={notifications} onChange={handleNotificationsToggle} />
        </SettingRow>
      </section>

      {/* ─── Export ────────────────────────────────────────────── */}
      <section className={styles.card} style={{ padding: 0, overflow: 'hidden', marginBottom: '1.25rem' }}>
        <SectionHeader title="Data Export" />

        <SettingRow icon={FiDownload} label="Export Filtered" description={`Export ${filteredTransactions.length} filtered transactions as CSV`} iconColor="#10b981">
          <button
            style={exportBtnStyle}
            onClick={handleExport}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <FiDownload size={14} /> Export CSV
          </button>
        </SettingRow>

        <SettingRow icon={FiDownload} label="Export All" description={`Export all ${transactions.length} transactions`} iconColor="#3b82f6">
          <button
            style={{ ...exportBtnStyle, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', boxShadow: 'none', border: '1px solid rgba(59,130,246,0.2)' }}
            onClick={handleExportAll}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <FiDownload size={14} /> Export All
          </button>
        </SettingRow>
      </section>

      {/* ─── Security & Data ──────────────────────────────────── */}
      <section className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
        <SectionHeader title="Security & Data" />

        <SettingRow icon={FiShield} label="Security" description="Two-factor authentication and password" iconColor="#06b6d4">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Manage <FiChevronRight />
          </span>
        </SettingRow>

        <SettingRow icon={FiTrash2} label="Clear All Data" description="Permanently remove all transactions and settings" iconColor="#f43f5e">
          <button
            onClick={handleClearData}
            style={{
              padding: '0.5rem 1.1rem', borderRadius: '8px',
              background: 'rgba(244,63,94,0.1)', color: '#f43f5e',
              border: '1px solid rgba(244,63,94,0.2)',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; }}
          >
            Clear Data
          </button>
        </SettingRow>
      </section>
    </div>
  );
};

export default Settings;
