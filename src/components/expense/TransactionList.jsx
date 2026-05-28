import { useState, useMemo, useCallback } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { filterTransactionsByDateRange } from '../../utils/dateHelpers';
import TransactionCard from './TransactionCard';
import EmptyState from './EmptyState';
import ConfirmDialog from './ConfirmDialog';
import styles from '../../styles/expense.module.css';
import { FiSearch, FiFilter, FiCalendar, FiClock } from 'react-icons/fi';
import { expenseCategories, incomeCategories } from '../../data/categories';

/**
 * Period labels for context-aware empty state messages
 */
const PERIOD_LABELS = {
  all: 'All Time',
  this_month: 'This Month',
  previous_month: 'Previous Month',
  last_3_months: 'Last 3 Months',
  this_year: 'This Year',
};

const TransactionList = ({ onEdit, onAddClick }) => {
  const { transactions, deleteExpense } = useExpense();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [timeFilter, setTimeFilter] = useState('this_month');
  const [deleteId, setDeleteId] = useState(null);

  // Construct dynamic category anchors automatically — memoized
  const allCategories = useMemo(
    () => ['all', ...new Set([...expenseCategories, ...incomeCategories].map(c => c.name))],
    []
  );

  // Apply time filter first, then search/category/sort — all memoized
  const filteredAndSorted = useMemo(() => {
    // Step 1: Time filter via dateHelpers (handles edge cases, leap years, etc.)
    let result = timeFilter === 'all'
      ? [...transactions]
      : filterTransactionsByDateRange(transactions, timeFilter);

    // Step 2: Search filter
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(txn =>
        txn.title.toLowerCase().includes(lower) ||
        txn.category.toLowerCase().includes(lower) ||
        (txn.merchant && txn.merchant.toLowerCase().includes(lower))
      );
    }

    // Step 3: Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(txn => txn.category === selectedCategory);
    }

    // Step 4: Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-high') return Number(b.amount) - Number(a.amount);
      if (sortBy === 'amount-low') return Number(a.amount) - Number(b.amount);
      return 0;
    });

    return result;
  }, [transactions, searchQuery, selectedCategory, sortBy, timeFilter]);

  const handleConfirmDelete = useCallback(() => {
    if (deleteId) {
      deleteExpense(deleteId);
      setDeleteId(null);
    }
  }, [deleteId, deleteExpense]);

  return (
    <div className={styles.listContainer}>
      {/* Search and Filters Header */}
      <div className={styles.listHeader}>
        <div className={styles.listSearchWrapper}>
          <FiSearch className={styles.listSearchIcon} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className={styles.listSearchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.listFilters}>
          {/* Time Filter Dropdown */}
          <div className={styles.filterDropdownWrapper}>
            <FiClock className={styles.filterIconInside} />
            <select 
              className={styles.listSelect}
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="this_month">This Month</option>
              <option value="previous_month">Previous Month</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="this_year">This Year</option>
            </select>
          </div>

          {/* Category Dropdown Selector */}
          <div className={styles.filterDropdownWrapper}>
            <FiFilter className={styles.filterIconInside} />
            <select 
              className={styles.listSelect}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {allCategories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown Selector */}
          <div className={styles.filterDropdownWrapper}>
            <FiCalendar className={styles.filterIconInside} />
            <select 
              className={styles.listSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Highest Amount</option>
              <option value="amount-low">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Scrollable Area */}
      <div className={styles.listScrollArea}>
        {filteredAndSorted.length === 0 ? (
          <EmptyState
            onAddClick={onAddClick}
            periodLabel={PERIOD_LABELS[timeFilter] || 'this period'}
            hasTransactions={transactions.length > 0}
          />
        ) : (
          <div className={styles.listGrid}>
            {filteredAndSorted.map((txn, index) => (
              <div 
                key={txn.id} 
                className={styles.staggerItem}
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <TransactionCard 
                  transaction={txn} 
                  onEdit={onEdit} 
                  onDelete={(id) => setDeleteId(id)} 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Elegant Deletion Confirmation Modal Overlay */}
      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone and will immediately recalculate your dashboard stats."
      />
    </div>
  );
};

export default TransactionList;
