// import React from 'react';
// import { FiX } from 'react-icons/fi';
// import styles from '../../styles/analytics.module.css';

// /**
//  * BudgetCard – displays budget status for a single category.
//  * Props:
//  *   category: string – category name / id
//  *   limit: number – budget limit
//  *   spent: number – amount spent this month
//  *   percent: number – progress percentage (0-100)
//  *   color: string – progress bar color (hex or css var)
//  *   remaining: number – limit - spent (can be negative)
//  *   onEdit: function – callback to open edit modal
//  */
// const BudgetCard = ({ category, limit, spent, percent, color, remaining, onEdit }) => {
//   const isNearLimit = percent >= 90 && percent < 100;
//   const isOver = percent >= 100;
//   return (
//     <div className={styles.budgetCard} style={{ borderColor: isOver ? 'var(--error)' : isNearLimit ? '#f59e0b' : color }}>
//       <div className={styles.cardHeader}>
//         <h4 className={styles.cardTitle}>{category}</h4>
//         <button className={styles.editBtn} onClick={onEdit} aria-label="Edit budget">
//           <FiX />
//         </button>
//       </div>
//       <div className={styles.amountInfo}>
//         <span className={styles.limit}>₹{Number(limit).toLocaleString()}</span>
//         <span className={styles.spent}>/ ₹{Number(spent).toLocaleString()}</span>
//       </div>
//       <div className={styles.progressBarContainer}>
//         <div className={styles.progressBarBg}>
//           <div
//             className={styles.progressBar}
//             style={{ width: `${percent}%`, backgroundColor: color, filter: isNearLimit || isOver ? 'brightness(1.2)' : 'none' }}
//           />
//         </div>
//         <span className={styles.percentLabel}>{percent}%</span>
//       </div>
//       <div className={styles.remaining} style={{ color: remaining < 0 ? 'var(--error)' : 'var(--text-main)' }}>
//         {remaining >= 0 ? 'Remaining' : 'Over'}: ₹{Math.abs(remaining).toLocaleString()}
//       </div>
//     </div>
//   );
// };

// export default BudgetCard;
