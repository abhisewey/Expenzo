import React from 'react';
import { distributionData } from '../../data/dummyData';
import styles from '../../styles/components/dashboard.module.css';

const AnalyticsSection = () => {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Expense Distribution</h2>
      <div className={styles.chartList}>
        {distributionData.map((item, index) => (
          <div key={index} className={styles.chartItem}>
            <div className={styles.chartItemHeader}>
              <span>{item.category}</span>
              <span>{item.percentage}% ({item.amount})</span>
            </div>
            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${item.percentage}%`, background: item.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsSection;
