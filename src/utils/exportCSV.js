/**
 * exportCSV — Exports an array of transactions to a downloadable CSV file.
 *
 * @param {Array} transactions - Array of transaction objects
 * @param {string} [filename] - Optional filename (defaults to timestamped name)
 */
export const exportTransactionsToCSV = (transactions, filename) => {
  if (!transactions || transactions.length === 0) return;

  const headers = ['Date', 'Title', 'Category', 'Type', 'Amount', 'Payment Method', 'Merchant', 'Notes'];

  const rows = transactions.map(txn => [
    txn.date || '',
    `"${(txn.title || '').replace(/"/g, '""')}"`,
    txn.category || '',
    txn.type || '',
    txn.amount || 0,
    txn.paymentMethod || '',
    `"${(txn.merchant || '').replace(/"/g, '""')}"`,
    `"${(txn.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  // Create blob and trigger download
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const now = new Date();
  const defaultName = `expenzo_transactions_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  link.href = url;
  link.download = `${filename || defaultName}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
