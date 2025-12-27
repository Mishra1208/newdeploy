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

const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });

// --- Mockup Components (Scroll Triggered) ---

const TriggerOnScroll = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Only render children (animations play) when in view
  return <div ref={ref} style={{ width: '100%', height: '100%' }}>{isInView ? children : null}</div>;
};

const TreeMockup = () => (
  <TriggerOnScroll>
    <div className={styles.treeGraph}>
      {/* Explicit delays for sequential "growing" effect */}
      <div className={styles.treeNode} style={{ top: "50%", left: "10%", animationDelay: "0ms" }} />
      <div className={styles.treeLine} style={{ top: "50%", left: "10%", width: "30%", transform: "rotate(0deg)", animationDelay: "100ms" }} />

      <div className={styles.treeNode} style={{ top: "30%", left: "40%", animationDelay: "300ms" }} />
      <div className={styles.treeLine} style={{ top: "30%", left: "40%", width: "20%", transform: "rotate(20deg)", animationDelay: "400ms" }} />

      <div className={styles.treeNode} style={{ top: "70%", left: "40%", animationDelay: "300ms" }} />
      <div className={styles.treeLine} style={{ top: "70%", left: "40%", width: "20%", transform: "rotate(-20deg)", animationDelay: "400ms" }} />

      <div className={styles.treeNode} style={{ top: "40%", left: "60%", animationDelay: "600ms" }} />
      <div className={styles.treeNode} style={{ top: "20%", left: "60%", animationDelay: "700ms" }} />
    </div>
  </TriggerOnScroll>
);

const PlannerMockup = () => (
  <TriggerOnScroll>
    <div className={styles.plannerGrid}>
      {/* Columns with staggered cascade */}
      <div style={{ display: 'grid', gap: 4 }}>
        <div className={styles.plannerBlock} style={{ background: 'rgba(167, 139, 250, 0.2)', height: 40, animationDelay: "0ms" }} />
        <div className={styles.plannerBlock} style={{ animationDelay: "100ms" }} />
      </div>
      <div style={{ display: 'grid', gap: 4, paddingTop: 20 }}>
        <div className={styles.plannerBlock} style={{ animationDelay: "200ms" }} />
        <div className={styles.plannerBlock} style={{ height: 50, animationDelay: "300ms" }} />
      </div>
      <div style={{ display: 'grid', gap: 4 }}>
        <div className={styles.plannerBlock} style={{ background: 'rgba(236, 72, 153, 0.2)', animationDelay: "400ms" }} />
      </div>
      <div style={{ display: 'grid', gap: 4, paddingTop: 10 }}>
        <div className={styles.plannerBlock} style={{ animationDelay: "500ms" }} />
      </div>
      <div style={{ display: 'grid', gap: 4 }}>
        <div className={styles.plannerBlock} style={{ background: 'rgba(167, 139, 250, 0.2)', animationDelay: "600ms" }} />
        <div className={styles.plannerBlock} style={{ animationDelay: "700ms" }} />
      </div>
    </div>
  </TriggerOnScroll>
);

const GPAMockup = () => (
  <TriggerOnScroll>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div className={styles.gaugeContainer}>
        <div className={styles.gaugeArch} />
        <div className={styles.gaugeValue}>4.0</div>
      </div>
      <div style={{ fontSize: 12, opacity: 0.6, fontFamily: 'monospace' }}>DISTINCTION</div>
    </div>
  </TriggerOnScroll>
);


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

  return (
    <main className={`${styles.page} ${body.className}`}>

      {/* Precision Background */}
      <div className={styles.gridBackground} />

      {/* --- HERO SECTION --- */}
      <section className={styles.hero}>

        {/* Pro Badge */}
        <motion.div
          className={styles.proBadge}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>⚡ Unofficial Tool</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>Concordia University</span>
        </motion.div>

        <div className={styles.heroCentered}>
          <h1 className={`${styles.title} ${display.className}`}>
            Everything you need to <br />
            <AnimatePresence mode="wait">
              <motion.span
                key={workflowSteps[workflowIndex].text}
                initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ color: workflowSteps[workflowIndex].color, display: "inline-block" }}
              >
                {workflowSteps[workflowIndex].text}
              </motion.span>
            </AnimatePresence>
          </h1>

          {/* System Status Ticker */}
          <div style={{
            fontFamily: 'monospace',
            fontSize: 12,
            color: 'var(--ink-dim)',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: 0.7
          }}>
            <span style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }}></span>
            SYSTEM OPERATIONAL • USED BY 5000+ STUDENTS
          </div>

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

        </div>
      </section>

      {/* --- FEATURE SHOWCASE (BENTO Grid) --- */}
      <section style={{ marginBottom: 60 }}>
        <TrustedMarquee />
      </section>

      {/* --- FEATURE SHOWCASE (BENTO Grid) --- */}
      <section className={styles.bentoSection}>
        <motion.div
          className={styles.bentoGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Card 1: Tech Tree */}
          <motion.div variants={staggerItem} className={styles.colSpan2}>
            <Link href="/pages/tree" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <TiltCard className={`${styles.featureCard} ${styles.glassNoise}`} style={{ height: '100%' }}>
                <div className={styles.glintOverlay} />
                <div className={styles.mockupContainer}>
                  <TreeMockup />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardTitle}>Interactive Tech Tree</div>
                  <div className={styles.cardDesc}>
                    Visualize your entire degree prerequisites as a dynamic network graph.
                    Spot bottlenecks and unlock paths instantly.
                  </div>
                </div>
              </TiltCard>
            </Link>
          </motion.div>

          {/* Card 2: GPA */}
          <motion.div variants={staggerItem}>
            <Link href="/pages/gpa" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <TiltCard className={`${styles.featureCard} ${styles.glassNoise}`} style={{ height: '100%' }}>
                <div className={styles.glintOverlay} />
                <div className={styles.mockupContainer}>
                  <GPAMockup />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardTitle}>Academic Standing</div>
                  <div className={styles.cardDesc}>
                    Weighted credit calculation with real-time GPA forecasting.
                  </div>
                </div>
              </TiltCard>
            </Link>
          </motion.div>

          {/* Card 3: Planner */}
          <motion.div variants={staggerItem}>
            <Link href="/pages/planner" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <TiltCard className={`${styles.featureCard} ${styles.glassNoise}`} style={{ height: '100%' }}>
                <div className={styles.glintOverlay} />
                <div className={styles.mockupContainer}>
                  <PlannerMockup />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardTitle}>Smart Sequence Planner</div>
                  <div className={styles.cardDesc}>
                    Build your multi-year sequence with automated prerequisite validation.
                  </div>
                </div>
              </TiltCard>
            </Link>
          </motion.div>

          {/* Card 4: Catalog */}
          <motion.div variants={staggerItem} className={styles.colSpan2}>
            <Link href="/pages/courses" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <TiltCard className={`${styles.featureCard} ${styles.glassNoise}`} style={{ height: '100%' }}>
                <div className={styles.glintOverlay} />
                <div className={styles.cardContent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div className={styles.cardTitle}>Complete Course Catalog</div>
                    <div className={styles.cardDesc}>
                      Search instantly across all departments. Filter by credits, terms, and prerequisites.
                    </div>
                  </div>
                  <div style={{ fontSize: 24, padding: 12, background: 'rgba(34, 211, 238, 0.1)', borderRadius: 12, color: '#22d3ee' }}>
                    📚
                  </div>
                </div>
              </TiltCard>
            </Link>
          </motion.div>
        </motion.div>
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
              background: 'linear-gradient(to right, #8b1e3f, #d946ef)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Sync Across Devices.</span>
          </h2>
          <p className={styles.promoText}>
            Don't lose your perfect schedule. Connect your GitHub or Gmail to save your planner and GPA data instantly.
          </p>

          <SignInButton mode="modal">
            <button style={{
              background: '#171717', color: 'white', border: 'none',
              padding: '12px 24px', borderRadius: 50, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'transform 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: 18 }}>🚀</span> Connect with Git / Gmail
            </button>
          </SignInButton>

          <div style={{ marginTop: 16, fontSize: 12, opacity: 0.5 }}>
            100% Free • Secure Authentication via Clerk
          </div>
        </motion.section>
      </SignedOut>

    </main>
  );
}
