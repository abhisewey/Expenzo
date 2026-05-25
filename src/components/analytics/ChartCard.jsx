import React from 'react';
import styles from '../../styles/analytics.module.css';

/**
 * Reusable glassmorphic container for charts.
 * Props:
 * - title: string – chart title
 * - filterOptions: array of { value, label } – options for the time filter dropdown
 * - onFilterChange: function – callback when filter changes
 * - onExport: function (optional) – handler for exporting chart data
 * - children: React node – chart component
 */
const ChartCard = ({ title, filterOptions = [], onFilterChange, onExport, children }) => {
  const handleChange = (e) => {
    if (onFilterChange) onFilterChange(e.target.value);
  };
  const handleExport = () => {
    if (onExport) onExport();
  };

  return (
    <div className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.headerControls}>
          {filterOptions.length > 0 && (
            <select className={styles.filterSelect} onChange={handleChange}>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
          {onExport && (
            <button className={styles.exportBtn} onClick={handleExport} title="Export data">
              ⬇️
            </button>
          )}
        </div>
      </div>
      <div className={styles.chartContent}>{children}</div>
    </div>
  );
};

export default ChartCard;
