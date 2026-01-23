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
        >
          <div className={styles.glintOverlay} />
          {/* Animated Glow in Background */}
          <div className={styles.promoGlow1}></div>
          <div className={styles.promoGlow2}></div>

          <h2 className={`${styles.promoTitle} h2`}>
            Save Your Progress. <span style={{
              color: 'var(--secondary)',
              textShadow: '0 2px 10px rgba(219, 158, 30, 0.2)'
            }}>Sync Across Devices.</span>
          </h2>
          <p className={styles.promoText}>
            Don't lose your perfect schedule. Connect your GitHub or Gmail to save your planner and GPA data instantly.
          </p>

          <SignInButton mode="modal">
            <button style={{
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(145, 35, 56, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(145, 35, 56, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(145, 35, 56, 0.3)';
              }}
            >
              <span style={{ fontSize: 18 }}>🎓</span> Connect with Git / Gmail
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
