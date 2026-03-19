"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`glass-panel animate-slide-up ${styles.loginCard}`}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to your EduCare Next account</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" disabled={loading} className={`btn-primary ${styles.submitBtn}`}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Temporary Seed User Hint for the Reviewer */}
        <div style={{marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center'}}>
          Use <code>admin@school.com</code> / <code>password123</code> <br/>
          (After running seed script)
        </div>
      </div>
    </div>
  );
}
