import React from 'react';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import styles from '../../styles/analytics.module.css';

/**
 * InsightCard – displays a single proactive insight.
 * Props:
 *   icon: React component (e.g., <FiTrendingUp />)
 *   metric: string or number (prominent value)
 *   subtitle: descriptive text
 *   trend: number – positive for improvement, negative for decline
 *   bgColor: optional background accent (any CSS color)
 */
const InsightCard = ({ icon: Icon, metric, subtitle, trend, bgColor }) => {
  const isPositive = trend >= 0;
  const TrendIcon = isPositive ? FiArrowUpRight : FiArrowDownRight;
  const trendColor = isPositive ? 'var(--trend-positive)' : 'var(--trend-negative)';

  return (
    <div className={styles.insightCard} style={{ backgroundColor: bgColor ? `${bgColor}15` : 'var(--hover-bg)' }}>
      <div className={styles.iconWrapper} style={{ color: bgColor || 'var(--text-main)', backgroundColor: bgColor ? `${bgColor}25` : 'var(--hover-bg)' }}>
        <Icon className={styles.insightIcon} />
      </div>
      <div className={styles.metric} title={metric}>{metric}</div>
      <div className={styles.subtitle} title={subtitle}>{subtitle}</div>
      {typeof trend === 'number' && (
        <div className={styles.trend} style={{ color: trendColor }}>
          <TrendIcon /> {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
};

export default InsightCard;
