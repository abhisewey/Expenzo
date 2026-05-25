import React, { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import TransactionCard from './TransactionCard';
import EmptyState from './EmptyState';
import ConfirmDialog from './ConfirmDialog';
import styles from '../../styles/expense.module.css';
import { FiSearch, FiFilter, FiCalendar } from 'react-icons/fi';
import { expenseCategories, incomeCategories } from '../../data/categories';

const TransactionList = ({ onEdit, onAddClick }) => {
  const { transactions, deleteExpense } = useExpense();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'amount-high', 'amount-low'
  const [deleteId, setDeleteId] = useState(null); // Track transaction queued for deletion confirmation

  // Construct dynamic category anchors automatically
  const allCategories = ['all', ...new Set([...expenseCategories, ...incomeCategories].map(c => c.name))];

  // Filtering & Sorting evaluation
  const filteredAndSorted = transactions
    .filter(txn => {
      const matchesSearch = 
        txn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (txn.merchant && txn.merchant.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = 
        selectedCategory === 'all' ? true : txn.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'amount-high') {
        return Number(b.amount) - Number(a.amount);
      }
      if (sortBy === 'amount-low') {
        return Number(a.amount) - Number(b.amount);
      }
      return 0;
    });

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteExpense(deleteId);
      setDeleteId(null);
    }
  };

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
          <EmptyState onAddClick={onAddClick} />
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
