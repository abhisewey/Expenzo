/**
 * src/utils/walletHelpers.js
 * Utility functions for wallet balances and progress calculations.
 */

/**
 * Helper: Calculates the total historical balance for a specific payment method.
 * Income adds to the balance, expense subtracts from it.
 */
export const calculateWalletBalances = (transactions, paymentMethod, initialBalance = 0) => {
  const methodTxns = transactions.filter(t => t.paymentMethod === paymentMethod);
  const totalIncome = methodTxns
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = methodTxns
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  return initialBalance + totalIncome - totalExpense;
};

/**
 * Helper: Calculates how much was spent using a specific payment method this month.
 */
export const calculateWalletSpentThisMonth = (transactions, paymentMethod) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions
    .filter(t => t.paymentMethod === paymentMethod && t.type === 'expense')
    .filter(t => {
      const d = new Date(t.date);
      if (isNaN(d.getTime())) return false;
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);
};

/**
 * Helper: Calculates the percentage of the wallet balance consumed by current spending.
 */
export const calculateWalletProgress = (balance, spent) => {
  if (balance > 0) {
    // If we have money, progress is how much of current capacity we've burned
    return (spent / (balance + spent)) * 100;
  } else if (spent > 0) {
    return 100;
  }
  return 0;
};

/**
 * Helper: Calculates remaining balance based on absolute balance minus spent.
 * Note: Since calculateWalletBalances already subtracts expenses, this is useful
 * if calculating against a budget/target capacity instead of raw historical balance.
 */
export const calculateRemainingBalance = (balance, spent) => {
  return balance - spent;
};

/**
 * Computes live balances, monthly spends, and progress percentages for all wallets
 * based on the active transactions in the current month.
 */
export const enrichWalletsWithStats = (wallets, transactions) => {
  if (!transactions) return [];
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Define standard payment methods
  const defaultMethods = ['UPI', 'Cash', 'Credit Card', 'Bank Transfer'];
  
  // Discover any new payment methods used in transactions
  const usedMethods = new Set(transactions.filter(t => t.paymentMethod).map(t => t.paymentMethod));
  
  // Merge to ensure we always show at least the basics plus any custom ones
  const allMethods = new Set([...defaultMethods, ...usedMethods]);
  
  return Array.from(allMethods).map(method => {
    // See if the user manually added a wallet to set an initial balance
    const manualWallet = (wallets || []).find(w => w.type === method || w.name === method);
    const initialBalance = manualWallet ? Number(manualWallet.initialBalance || 0) : 0;
    
    // Utilize the clean helper functions
    const currentBalance = calculateWalletBalances(transactions, method, initialBalance);
    const spentThisMonth = calculateWalletSpentThisMonth(transactions, method);
    const progress = calculateWalletProgress(currentBalance, spentThisMonth);
    
    return {
      id: manualWallet ? manualWallet.id : method,
      name: manualWallet ? manualWallet.name : method,
      type: method,
      initialBalance,
      currentBalance,
      spentThisMonth,
      progress
    };
  }).filter(wallet => 
    // Show wallet if it has a balance, has spending, is a default method, or was manually created
    wallet.currentBalance !== 0 || 
    wallet.spentThisMonth > 0 || 
    defaultMethods.includes(wallet.type) || 
    (wallets && wallets.find(w => w.id === wallet.id))
  );
};
