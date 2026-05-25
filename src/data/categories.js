import { 
  FiCompass, 
  FiShoppingBag, 
  FiFileText, 
  FiFilm, 
  FiHeart, 
  FiBookOpen, 
  FiNavigation, 
  FiPackage,
  FiTrendingUp,
  FiBriefcase,
  FiDollarSign
} from 'react-icons/fi';

// FiUtensils does NOT exist in react-icons/fi (Feather icon set has no food icon).
// Using FaUtensils from react-icons/fa as the correct replacement for Food category.
import { FaUtensils } from 'react-icons/fa';

// Rich configurations for all expense categories in Expenzo
export const expenseCategories = [
  { id: 'cat_food',          name: 'Food',          color: '#f59e0b', icon: FaUtensils },
  { id: 'cat_travel',        name: 'Travel',        color: '#06b6d4', icon: FiCompass },
  { id: 'cat_shopping',      name: 'Shopping',      color: '#ec4899', icon: FiShoppingBag },
  { id: 'cat_bills',         name: 'Bills',         color: '#ef4444', icon: FiFileText },
  { id: 'cat_entertainment', name: 'Entertainment', color: '#8b5cf6', icon: FiFilm },
  { id: 'cat_health',        name: 'Health',        color: '#10b981', icon: FiHeart },
  { id: 'cat_education',     name: 'Education',     color: '#3b82f6', icon: FiBookOpen },
  { id: 'cat_transport',     name: 'Transport',     color: '#6366f1', icon: FiNavigation },
  { id: 'cat_groceries',     name: 'Groceries',     color: '#14b8a6', icon: FiPackage },
];

// Rich configurations for all income categories in Expenzo
export const incomeCategories = [
  { id: 'inc_salary',      name: 'Salary',       color: '#10b981', icon: FiBriefcase },
  { id: 'inc_freelance',   name: 'Freelance',    color: '#8b5cf6', icon: FiBriefcase },
  { id: 'inc_investments', name: 'Investments',  color: '#06b6d4', icon: FiTrendingUp },
  { id: 'inc_others',      name: 'Other Income', color: '#94a3b8', icon: FiDollarSign },
];
