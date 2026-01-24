"use client";

import React from "react";
import styles from "./about.module.css";
import Profile from "@/components/Profile";
import AnimatedBeamDemo from "@/components/widgets/AnimatedBeamDemo";
import ClaraSection from "@/components/ClaraSection";
import StatsTicker from "@/components/widgets/StatsTicker";
import TiltCard from "@/components/widgets/TiltCard";
import ConfettiButton from "@/components/widgets/ConfettiButton";
import EngineeredSticky from "@/components/widgets/EngineeredSticky";
import TeamSticky from "@/components/widgets/TeamSticky";
import { motion, useScroll, useTransform } from "motion/react";

// Fancy display/body fonts (zero CLS, no <link> tags needed)
import { Outfit, Inter } from "next/font/google";
const display = Outfit({ subsets: ["latin"], weight: ["700", "800"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "600"] });


const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function AboutPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, 400]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -300]);
  const y3 = useTransform(scrollY, [0, 2000], [0, 200]);

  return (
    <main className={`container mx-auto ${styles.page} ${body.className}`}>

      {/* --- Parallax Background --- */}
      <motion.div style={{ y: y1 }} className={`${styles.parallaxBlob} ${styles.blob1}`} />
      <motion.div style={{ y: y2 }} className={`${styles.parallaxBlob} ${styles.blob2}`} />
      <motion.div style={{ y: y3 }} className={`${styles.parallaxBlob} ${styles.blob3}`} />

      {/* --- Floating Glass Hero --- */}
      <motion.section
        className={styles.heroSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <motion.div
          className={styles.heroContent}
          style={{
            y: useTransform(scrollY, [0, 500], [0, 100]),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '100vw',
            textAlign: 'center'
          }}
        >
          <p className={`${styles.kicker} ${display.className}`}>ConU Planner</p>
          <h1 className={`${styles.title} ${display.className} ${styles.royalGradientText}`}>
            Dream It. <br /> Plan It. Done.
          </h1>

          <p className={styles.lead}>
            Born from frustration, built for clarity. We're on a mission to simplify the academic journey for every Concordia student.
          </p>

          <ul className={styles.chips} aria-label="Sources we unify">
            <li className={styles.chip}>Reddit Integration</li>
            <li className={styles.chip}>RateMyProf Data</li>
            <li className={styles.chip}>Course Catalog</li>
            <li className={styles.chip}>GPA Forecaster</li>
          </ul>
        </motion.div>
      </motion.section>

      {/* --- Team Sticky Scroll --- */}
      <TeamSticky />

      {/* --- Vision & Mission --- */}
      <section className={styles.section}>
        <motion.div
          className={styles.narrativeGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className={`${styles.narrativeCard} ${styles.glassNoise} ${styles.glint}`}
            variants={fadeInUp}
          >
            <div className={styles.glintOverlay} />
            <h2 className={`${styles.h2} ${display.className}`} style={{ textAlign: 'left', marginBottom: 20 }}>Our Vision</h2>
            <p className={styles.bodyText}>
              To become the definitive computational companion for students, transforming complex academic data into
              intuitive, actionable insights that empower better decision-making.
            </p>
          </motion.div>

          <motion.div
            className={`${styles.narrativeCard} ${styles.glassNoise} ${styles.glint}`}
            variants={fadeInUp}
            transition={{ delay: 0.15 }}
          >
            <div className={styles.glintOverlay} />
            <h2 className={`${styles.h2} ${display.className}`} style={{ textAlign: 'left', marginBottom: 20 }}>Our Mission</h2>
            <p className={styles.bodyText}>
              We bridge the gap between static university catalogs and the dynamic student experience by unifying
              official requirements with peer wisdom and modern planning tools.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* --- Stats Ticker --- */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        style={{ marginTop: 60 }}
      >
        <StatsTicker displayClass={display.className} />
      </motion.div>

      {/* --- Origin Story --- */}
      <motion.section
        className={styles.section}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        style={{ y: useTransform(scrollY, [600, 1800], [0, 80]), position: 'relative', overflow: 'visible' }}
      >
        {/* Parallax Emojis */}
        <motion.div style={{ position: 'absolute', top: '-10%', left: '10%', y: useTransform(scrollY, [1000, 2000], [0, -150]), fontSize: '3rem', opacity: 0.2 }}>☕️</motion.div>
        <motion.div style={{ position: 'absolute', top: '20%', right: '15%', y: useTransform(scrollY, [1000, 2000], [0, -80]), fontSize: '4rem', opacity: 0.15 }}>📚</motion.div>
        <motion.div style={{ position: 'absolute', bottom: '-20%', left: '20%', y: useTransform(scrollY, [1000, 2000], [0, -200]), fontSize: '2.5rem', opacity: 0.1 }}>💻</motion.div>
        <motion.div style={{ position: 'absolute', bottom: '10%', right: '5%', y: useTransform(scrollY, [1000, 2000], [0, -120]), fontSize: '3.5rem', opacity: 0.2 }}>🤯</motion.div>

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 className={`${styles.title} ${display.className} ${styles.originTitleGradient}`} style={{ fontSize: '4.5rem', marginBottom: '40px', lineHeight: 1.3, paddingBottom: '10px' }}>
            The Origin Story
          </h2>
          <p className={styles.lead} style={{ textAlign: "center", fontSize: "1.4rem", lineHeight: "1.6", fontWeight: 500, color: 'var(--ink-secondary)' }}>
            We didn't build this to launch a startup. We built it because we were tired of having 15 tabs open just to pick a schedule.
            <br /><br />
            Between the crash-prone SIS, Reddit threads from 4 years ago, and RateMyProf reviews that didn't match the section numbers... it was a nightmare. <span style={{ color: 'var(--primary)', fontWeight: 700 }}>So we fixed it.</span> For ourselves, and now for everyone else.
          </p>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <span className={styles.note} style={{ background: 'rgba(145, 35, 56, 0.08)', color: 'var(--primary)', padding: '10px 24px', borderRadius: '30px', fontSize: '1rem', fontWeight: 600 }}>
              1,200+ hours of caffeine & code
            </span>
          </div>
        </div>
      </motion.section>

      {/* --- Connection Beam --- */}
      <motion.section
        className={styles.section}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <p className={styles.bodyText} style={{ textAlign: 'center', marginBottom: 40, opacity: 0.8 }}>
          The visualization below demonstrates how we bridge scattered data points into one fluid experience.
        </p>
        <AnimatedBeamDemo />
      </motion.section>

      {/* --- Engineered Sticky Scroll --- */}
      <EngineeredSticky />

      {/* --- Meet Clara --- */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <ClaraSection
          styles={styles}
          displayClass={display.className}
          stacked={false}
        />
      </motion.div>

      {/* --- Footer Contribution --- */}
      <div style={{ textAlign: "center", marginTop: 120, marginBottom: 80 }}>
        <p className={styles.lead} style={{ marginBottom: 24, fontSize: '1.2rem', fontWeight: 600 }}>
          Want to contribute?
        </p>
        <ConfettiButton />
      </div>

    </main >
  );
}
