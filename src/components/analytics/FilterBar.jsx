import React, { useState, useEffect, useContext } from 'react';
import styles from '../../styles/analytics.module.css';
import { FiSearch, FiChevronDown, FiChevronUp, FiFilter, FiX } from 'react-icons/fi';
import { ExpenseContext } from '../../context/ExpenseContext';
import { applyFilters, sortTransactions } from '../../utils/filterHelpers';

/**
 * FilterBar – compact glassmorphic bar for Transactions & Analytics pages.
 * Props:
 *   onFiltersChange: (filters) => void – called with the full filter object whenever any filter changes.
 */
const FilterBar = ({ onFiltersChange }) => {
  const { expenses } = useContext(ExpenseContext);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [dateRange, setDateRange] = useState('this_month'); // this_month | last_3_months | custom
  const [customDates, setCustomDates] = useState({ from: '', to: '' });
  const [amountRange, setAmountRange] = useState([0, 10000]);
  const [sortOption, setSortOption] = useState('latest');

  // Derive options from expenses
  const categoryOptions = Array.from(new Set(expenses.map(e => e.category)));
  const methodOptions = Array.from(new Set(expenses.map(e => e.paymentMethod)));

  const handleClearAll = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedMethods([]);
    setDateRange('this_month');
    setCustomDates({ from: '', to: '' });
    setAmountRange([0, 10000]);
    setSortOption('latest');
  };

  // Notify parent when any filter changes
  useEffect(() => {
    const filters = {
      search,
      categories: selectedCategories,
      methods: selectedMethods,
      dateRange,
      customDates,
      amountRange,
    };
    const sorted = sortOption;
    onFiltersChange({ filters, sortOption: sorted });
  }, [search, selectedCategories, selectedMethods, dateRange, customDates, amountRange, sortOption]);

  // Simple multi‑select UI – clicking toggles selection
  const toggleSelection = (value, setter, current) => {
    if (current.includes(value)) {
      setter(current.filter(v => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  return (
    <div className={styles.filterBar}>
      {/* Search */}
      <div className={styles.filterItem}>
        <FiSearch className={styles.icon} />
        <input
          type="text"
          placeholder="Search merchant or title"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Category Multi‑Select */}
      <div className={styles.filterItem}>
        <button
          type="button"
          className={styles.multiSelectBtn}
          onClick={() => {}}
        >
          Categories
          <FiChevronDown className={styles.icon} />
        </button>
        <div className={styles.multiSelectDropdown}>
          {categoryOptions.map(cat => (
            <label key={cat} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleSelection(cat, setSelectedCategories, selectedCategories)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Payment Method Multi‑Select */}
      <div className={styles.filterItem}>
        <button
          type="button"
          className={styles.multiSelectBtn}
          onClick={() => {}}
        >
          Methods
          <FiChevronDown className={styles.icon} />
        </button>
        <div className={styles.multiSelectDropdown}>
          {methodOptions.map(m => (
            <label key={m} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedMethods.includes(m)}
                onChange={() => toggleSelection(m, setSelectedMethods, selectedMethods)}
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className={styles.filterItem}>
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          className={styles.select}
        >
          <option value="this_month">This Month</option>
          <option value="previous_month">Previous Month</option>
          <option value="last_3_months">Last 3 Months</option>
          <option value="this_year">This Year</option>
          <option value="custom">Custom</option>
        </select>
        {dateRange === 'custom' && (
          <div className={styles.customDateInputs}>
            <input
              type="date"
              value={customDates.from}
              onChange={e => setCustomDates({ ...customDates, from: e.target.value })}
            />
            <span>–</span>
            <input
              type="date"
              value={customDates.to}
              onChange={e => setCustomDates({ ...customDates, to: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Amount Range Slider */}
      <div className={styles.filterItem}>
        <label className={styles.amountLabel}>Amount</label>
        <input
          type="range"
          min={0}
          max={10000}
          step={50}
          value={amountRange[1]}
          onChange={e => setAmountRange([0, Number(e.target.value)])}
          className={styles.amountSlider}
        />
        <span className={styles.amountValue}>₹{amountRange[1]}</span>
      </div>

      {/* Sorting */}
      <div className={styles.filterItem}>
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className={styles.select}
        >
          <option value="latest">Latest → Oldest</option>
          <option value="oldest">Oldest → Latest</option>
          <option value="high_amount">Highest Amount</option>
          <option value="low_amount">Lowest Amount</option>
        </select>
      </div>

      {/* Clear All */}
      <button type="button" className={styles.clearBtn} onClick={handleClearAll}>
        <FiX className={styles.icon} /> Clear All
      </button>
    </div>
  );
};

export default FilterBar;
