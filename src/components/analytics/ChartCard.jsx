import React from 'react';
import styles from '../../styles/analytics.module.css';

/**
 * Reusable glassmorphic container for charts.
 * Props:
 * - title: string – chart title
 * - onExport: function (optional) – handler for exporting chart data
 * - children: React node – chart component
 */
const ChartCard = ({ title, onExport, children }) => {
  const handleExport = () => {
    if (onExport) onExport();
  };

  return (
    <div className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.headerControls}>

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
