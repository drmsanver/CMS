import Link from 'next/link';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Decorative blurred blobs for premium aesthetic */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
      
      <div className={`glass-panel animate-slide-up ${styles.heroCard}`}>
        <h1 className={styles.title}>EduCare Next</h1>
        <h2 className={styles.subtitle}>K-12 Counseling & Guidance Platform</h2>
        <p className={styles.description}>
          A secure, MEB-compliant, and scalable management system designed to track student development across multiple campuses seamlessly.
        </p>
        <div className={styles.actions}>
          <Link href="/login" className="btn-primary">Counselor Portal Login</Link>
          <Link href="/about" className="btn-secondary">Learn More</Link>
        </div>
      </div>
    </div>
  );
}
