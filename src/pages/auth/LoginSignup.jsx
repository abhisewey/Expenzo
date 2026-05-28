import HeroSection from '../../components/auth/HeroSection/HeroSection';
import AuthCard from '../../components/auth/AuthCard/AuthCard';
import styles from './LoginSignup.module.css';

const LoginSignup = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <HeroSection />
      </div>
      <div className={styles.rightSide}>
        <AuthCard />
      </div>
    </div>
  );
};

export default LoginSignup;
