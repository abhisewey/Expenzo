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
    <div className={styles.insightCard} style={{ backgroundColor: bgColor ? `${bgColor}22` : 'rgba(255,255,255,0.02)' }}>
      <div className={styles.iconWrapper}>
        <Icon className={styles.insightIcon} />
      </div>
      <div className={styles.metric}>{metric}</div>
      <div className={styles.subtitle}>{subtitle}</div>
      {typeof trend === 'number' && (
        <div className={styles.trend} style={{ color: trendColor }}>
          <TrendIcon /> {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
};

export default InsightCard;
