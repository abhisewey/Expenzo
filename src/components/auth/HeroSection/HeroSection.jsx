import React, { useState, useEffect } from 'react';
import styles from './HeroSection.module.css';

const phrases = [
  "Master Your Money",
  "Track Every Rupee",
  "Build Your Wealth",
  "Control Spending"
];

const HeroSection = () => {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing effect logic
  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeoutId;

    if (isDeleting) {
      timeoutId = setTimeout(() => {
        setText(currentPhrase.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }, 40); // Faster delete
    } else {
      timeoutId = setTimeout(() => {
        setText(currentPhrase.substring(0, text.length + 1));
        if (text.length === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 2500); // Pause on complete word
        }
      }, 80); // Typing speed
    }

    return () => clearTimeout(timeoutId);
  }, [text, isDeleting, phraseIndex]);

  return (
    <div className={styles.heroContainer}>
      {/* Animated gradient blobs in background */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
      
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span>Expenzo</span>
          <span className={styles.typingText}>{text}</span>
        </h1>
        <p className={styles.subtitle}>
          The modern, intelligent expense tracker designed to give you absolute control over your financial future. Stop guessing, start knowing.
        </p>
      </div>

      {/* Floating UI Elements indicating finance app features */}
      <div className={styles.floatingCards}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconPurple}`}>₹</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>2.4L+</span>
            <span className={styles.statLabel}>Average Saved</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconBlue}`}>%</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>87%</span>
            <span className={styles.statLabel}>Budget Control</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
