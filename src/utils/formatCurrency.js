export const formatCurrency = (amount) => {
  if (isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};
