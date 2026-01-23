"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./home.module.css";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Space_Grotesk, Inter } from "next/font/google";
import { SignedOut, SignInButton } from "@clerk/nextjs";

// --- Components ---
import MagneticButton from "@/components/widgets/MagneticButton";
import TrustedMarquee from "@/components/widgets/TrustedMarquee";
import TiltCard from "@/components/widgets/TiltCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import FeaturesStack from "@/components/FeaturesStack";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });

// --- Mockup Components moved to @/components/FeatureMockups.jsx ---


const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function HomePage() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholders = ["COMP 352", "Electives", "GPA Prediction", "SOEN 287"];

  // Workflow Cycle: Plan (Purple) -> Search (Blue) -> Add (Green) -> Done (Pink)
  const [workflowIndex, setWorkflowIndex] = useState(0);
  const workflowSteps = [
    { text: "Plan.", color: "#a78bfa" },
    { text: "Search.", color: "#22d3ee" },
    { text: "Add.", color: "#4ade80" },
    { text: "Done.", color: "#f472b6" }
  ];

  useEffect(() => {
    // Cycle placeholder for Omnibar
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    // Cycle workflow words
    const workflowInterval = setInterval(() => {
      setWorkflowIndex((prev) => (prev + 1) % workflowSteps.length);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(workflowInterval);
    };
  }, []);

  // Force refresh v2
  return (
    <main className={`${styles.page} ${body.className}`}>

      {/* Precision Background */}
      <div className={styles.gridBackground} />

      {/* --- HERO SECTION --- */}
      <section className={styles.hero}>

        {/* Pro Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.proBadge}
        >
          <span style={{ color: "var(--secondary)" }}>✨</span> UNOFFICIAL • PREMIUM • FREE
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "circOut" }}
        >
          Your Academic <br />
          <span className={styles.gradientText}>Weapon.</span>
        </motion.h1>

        {/* Rotating Action Text */}
        <motion.div
          className={styles.workflowRow}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <span className={styles.workflowStatic}>Plan. Track. Crush.</span>
        </motion.div>

        {/* Subtitle / Status */}
        <motion.p
          className={styles.heroSubtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className={styles.statusDot}></span> System Operational • Used by 5,000+ Students
        </motion.p>

        {/* Command Palette */}
        <div className={styles.omnibarContainer}>
          <div className={styles.searchIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            className={styles.commandPalette}
            placeholder={`Search for "${placeholders[placeholderIndex]}"...`}
            readOnly
            onClick={() => window.location.href = '/pages/courses'}
            style={{ cursor: "text" }}
          />
          <div style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            display: 'flex', gap: 6, pointerEvents: 'none'
          }}>
            <span style={{ padding: '2px 6px', background: 'var(--background)', borderRadius: 4, fontSize: 12, border: '1px solid rgba(0,0,0,0.1)', opacity: 0.6 }}>⌘K</span>
          </div>
        </div>

        <div className={styles.ctaRow} style={{ justifyContent: 'center', marginTop: 32 }}>
          <MagneticButton className={styles.btnPrimary} onClick={() => window.location.href = '/pages/courses'}>
            Browse Catalog
          </MagneticButton>
          <MagneticButton className={styles.btnGhost} onClick={() => window.location.href = '/pages/planner'}>
            Try Planner
          </MagneticButton>
        </div>


      </section>

      {/* --- FEATURE SHOWCASE (BENTO Grid) --- */}
      <section style={{ marginBottom: 60 }}>
        <TrustedMarquee />
      </section>

      {/* --- FEATURE SHOWCASE (BENTO Grid) --- */}
      {/* --- FEATURE SHOWCASE (SCROLL STACK) --- */}
      <section style={{ marginBottom: 120 }}>
        <FeaturesStack />
      </section>

      {/* --- LOGIN PROMO WIDGET (Only for SignedOut) --- */}
      <SignedOut>
        <motion.section
          className={`${styles.loginPromoWidget} ${styles.glassNoise}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          style={{
            maxWidth: '900px',
            margin: '0 auto 120px auto',
            padding: '40px 20px',
            textAlign: 'center',
            position: 'relative',
            background: 'radial-gradient(circle at center, rgba(219, 158, 30, 0.03) 0%, transparent 70%)', // Very subtle glow
          }}
        >
          <div className={styles.glintOverlay} />

          <h2 className={`${styles.promoTitle} h2`} style={{
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '64px', // Big & Bold
            fontWeight: 800,
            letterSpacing: '-0.04em',
            marginBottom: '24px',
            lineHeight: 1.1,
            color: '#111'
          }}>
            Save Your Progress. <br />
            <span style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)', // Richer Gold
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              paddingBottom: '10px' // Prevent clipper cut-off
            }}>Sync Across Devices.</span>
          </h2>
          <p className={styles.promoText} style={{
            fontSize: '22px',
            color: '#555',
            lineHeight: 1.6,
            maxWidth: '640px',
            margin: '0 auto 48px auto',
            fontWeight: 500
          }}>
            Don't lose your perfect schedule. Connect your GitHub or Gmail to save your planner and GPA data instantly.
          </p>

          <SignInButton mode="modal">
            <button style={{
              background: '#0a0a0a',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '18px 42px',
              borderRadius: '100px',
              fontSize: '17px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
              }}
            >
              <span style={{ fontSize: 20 }}>🎓</span> Connect with Git / Gmail
            </button>
          </SignInButton>

          <div style={{ marginTop: 16, fontSize: 12, opacity: 0.5 }}>
            100% Free • Secure Authentication via Clerk
          </div>
        </motion.section>
      </SignedOut>

      {/* --- NEWSLETTER SIGNUP --- */}
      <NewsletterSignup />

    </main >
  );
}
