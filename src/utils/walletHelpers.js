/**
 * src/utils/walletHelpers.js
 * Utility functions for wallet balances and progress calculations.
 */

/**
 * Computes live balances, monthly spends, and progress percentages for all wallets
 * based on the active transactions in the current month.
 */
export const enrichWalletsWithStats = (wallets, transactions) => {
  if (!wallets || !transactions) return [];
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return wallets.map(wallet => {
    // Find transactions associated with this wallet during the current month
    const thisMonthTxns = transactions.filter(t => {
      const d = new Date(t.date);
      if (isNaN(d.getTime())) return false;
      
      return d.getMonth() === currentMonth && 
             d.getFullYear() === currentYear && 
             (t.paymentMethod === wallet.name || t.walletId === wallet.id);
    });
    
    const spentThisMonth = thisMonthTxns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const incomeThisMonth = thisMonthTxns
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const currentBalance = Number(wallet.initialBalance || 0) + incomeThisMonth - spentThisMonth;
    
    let progress = 0;
    if (currentBalance > 0) {
      progress = (spentThisMonth / (currentBalance + spentThisMonth)) * 100;
    } else if (spentThisMonth > 0) {
      progress = 100;
    }
    
    return {
      ...wallet,
      currentBalance,
      spentThisMonth,
      progress
    };
  });
};
