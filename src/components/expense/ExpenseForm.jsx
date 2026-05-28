import { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { expenseCategories, incomeCategories } from '../../data/categories';
import styles from '../../styles/expense.module.css';
import { FiTag, FiCreditCard, FiCalendar, FiDollarSign, FiEdit3 } from 'react-icons/fi';

const ExpenseForm = ({ onClose, transactionToEdit }) => {
  const { addExpense, updateExpense } = useExpense();
  const [type, setType] = useState(transactionToEdit ? transactionToEdit.type : 'expense');
  
  // Conditionally initialize values based on whether we are in creation or update modes
  const [formData, setFormData] = useState(transactionToEdit ? {
    title: transactionToEdit.title,
    amount: transactionToEdit.amount.toString(),
    category: transactionToEdit.category,
    date: transactionToEdit.date,
    paymentMethod: transactionToEdit.paymentMethod || 'UPI',
    notes: transactionToEdit.notes || ''
  } : {
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    notes: ''
  });

  // Track user focus interactions to avoid pre-submit error warnings
  const [touched, setTouched] = useState({
    title: false,
    amount: false,
    category: false,
    date: false
  });

  // Robust real-time active form validation schema calculated during render
  const errors = {};
  if (!formData.title.trim()) errors.title = 'Title is required';
  else if (formData.title.trim().length < 3) errors.title = 'Title must be at least 3 characters';
  
  if (!formData.amount) errors.amount = 'Amount is required';
  else if (isNaN(formData.amount) || Number(formData.amount) <= 0) errors.amount = 'Amount must be a positive number greater than 0';
  
  if (!formData.category) errors.category = 'Category is required';
  if (!formData.date) errors.date = 'Date is required';

  const isValid = Object.keys(errors).length === 0;

  const handleTypeChange = (newType) => {
    setType(newType);
    if (!transactionToEdit) {
      const categories = newType === 'expense' ? expenseCategories : incomeCategories;
      setFormData(prev => ({ ...prev, category: categories[0]?.name || '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleCustomChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Force all fields to be marked as touched to trigger any validation messages on click
    setTouched({
      title: true,
      amount: true,
      category: true,
      date: true
    });

    if (!isValid) return;

    // Build the clean unified transaction model
    const txnData = {
      ...formData,
      amount: parseFloat(formData.amount),
      type,
      // Map matching color schemes dynamically from data categories mapping config
      iconBg: type === 'expense' 
        ? expenseCategories.find(c => c.name === formData.category)?.color + '25' 
        : incomeCategories.find(c => c.name === formData.category)?.color + '25',
      iconColor: type === 'expense'
        ? expenseCategories.find(c => c.name === formData.category)?.color
        : incomeCategories.find(c => c.name === formData.category)?.color,
      status: 'Completed'
    };

    // Execute state push (add or update depending on mode context)
    if (transactionToEdit) {
      updateExpense(transactionToEdit.id, txnData);
    } else {
      addExpense(txnData);
    }
    
    // Clear and reset state clean
    setFormData({
      title: '',
      amount: '',
      category: type === 'expense' ? expenseCategories[0]?.name : incomeCategories[0]?.name,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      notes: ''
    });
    setTouched({
      title: false,
      amount: false,
      category: false,
      date: false
    });

    onClose();
  };

  const activeCategories = type === 'expense' ? expenseCategories : incomeCategories;

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer} noValidate>
      {/* Segmented Expense/Income selector toggle */}
      <div className={styles.typeSelector}>
        <button 
          type="button" 
          className={`${styles.typeBtn} ${type === 'expense' ? styles.activeExpense : ''}`}
          onClick={() => setType('expense')}
          disabled={!!transactionToEdit} // Disable toggling ledger type when editing to preserve consistency
          style={transactionToEdit ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          Expense
        </button>
        <button 
          type="button" 
          className={`${styles.typeBtn} ${type === 'income' ? styles.activeIncome : ''}`}
          onClick={() => setType('income')}
          disabled={!!transactionToEdit} // Disable toggling ledger type when editing to preserve consistency
          style={transactionToEdit ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          Income
        </button>
      </div>

      {/* Title Field (Floating label style) */}
      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            name="title"
            id="title"
            className={`${styles.inputField} ${touched.title && errors.title ? styles.inputError : ''} ${formData.title ? styles.hasValue : ''}`}
            placeholder=" "
            value={formData.title}
            onChange={(e) => handleCustomChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            required
          />
          <label htmlFor="title" className={styles.floatingLabel}>
            <FiEdit3 className={styles.fieldIcon} /> Title / Merchant
          </label>
        </div>
        {touched.title && errors.title && <span className={styles.errorText}>{errors.title}</span>}
      </div>

      {/* Amount Field (Floating label style) */}
      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <input 
            type="number" 
            name="amount"
            id="amount"
            className={`${styles.inputField} ${touched.amount && errors.amount ? styles.inputError : ''} ${formData.amount ? styles.hasValue : ''}`}
            placeholder=" "
            value={formData.amount}
            onChange={(e) => handleCustomChange('amount', e.target.value)}
            onBlur={() => handleBlur('amount')}
            step="any"
            required
          />
          <label htmlFor="amount" className={styles.floatingLabel}>
            <FiDollarSign className={styles.fieldIcon} /> Amount (₹)
          </label>
        </div>
        {touched.amount && errors.amount && <span className={styles.errorText}>{errors.amount}</span>}
      </div>

      {/* Category Selection Dropdown */}
      <div className={styles.inputGroup}>
        <label className={styles.normalLabel}>
          <FiTag className={styles.fieldIcon} /> Category
        </label>
        <div className={styles.selectWrapper}>
          <select 
            name="category"
            value={formData.category}
            onChange={(e) => handleCustomChange('category', e.target.value)}
            onBlur={() => handleBlur('category')}
            className={`${styles.selectField} ${touched.category && errors.category ? styles.inputError : ''}`}
          >
            {activeCategories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        {touched.category && errors.category && <span className={styles.errorText}>{errors.category}</span>}
      </div>

      {/* Date & Payment Method grids */}
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label className={styles.normalLabel}>
            <FiCalendar className={styles.fieldIcon} /> Date
          </label>
          <input 
            type="date" 
            name="date"
            className={`${styles.datePicker} ${touched.date && errors.date ? styles.datePickerError : ''}`}
            value={formData.date}
            onChange={(e) => handleCustomChange('date', e.target.value)}
            onBlur={() => handleBlur('date')}
            required
          />
          {touched.date && errors.date && <span className={styles.errorText}>{errors.date}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.normalLabel}>
            <FiCreditCard className={styles.fieldIcon} /> Payment Method
          </label>
          <div className={styles.selectWrapper}>
            <select 
              name="paymentMethod"
              className={styles.selectField}
              value={formData.paymentMethod}
              onChange={(e) => handleCustomChange('paymentMethod', e.target.value)}
            >
              <option value="UPI">UPI (GPay/PhonePe)</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional optional Notes */}
      <div className={styles.inputGroup}>
        <label className={styles.normalLabel}>Notes (Optional)</label>
        <textarea 
          name="notes"
          rows="3"
          className={styles.textareaField}
          placeholder="Add description, tags, etc..."
          value={formData.notes}
          onChange={(e) => handleCustomChange('notes', e.target.value)}
        />
      </div>

      {/* Actions Section */}
      <div className={styles.formActions}>
        <button 
          type="button" 
          className={styles.cancelBtn} 
          onClick={onClose}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={!isValid}
        >
          {transactionToEdit ? 'Save Changes' : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
