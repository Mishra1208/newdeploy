"use client";

import React from "react";
import styles from "./about.module.css";
import Profile from "@/components/Profile";
import AnimatedBeamDemo from "@/components/widgets/AnimatedBeamDemo";
import ClaraSection from "@/components/ClaraSection";
import StatsTicker from "@/components/widgets/StatsTicker";
import TiltCard from "@/components/widgets/TiltCard";
import ConfettiButton from "@/components/widgets/ConfettiButton";
import { motion, useScroll, useTransform } from "motion/react";

// Fancy display/body fonts (zero CLS, no <link> tags needed)
import { Space_Grotesk, Inter } from "next/font/google";
const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "600"] });

const TEAM = [
  {
    name: "Narendra Mishra",
    role: "Founder & Dev",
    avatar: "/team/narendra.JPG",
    links: {
      github: "https://github.com/Mishra1208",
      instagram: "https://www.instagram.com/nar.endra_mis.hra?igsh=MWUyOWx0NHFxbm1sMg==",
      linkedin: "https://www.linkedin.com/in/narendra-mishra-3a0136240/",
    },
  },
  {
    name: "Aryan Kotecha",
    role: "Backend",
    avatar: "/team/aryan.JPG",
    links: {
      github: "https://github.com/aryann2212",
      instagram: "https://www.instagram.com/aryann.__.__?igsh=ZDJiNGJzY2syaDNu",
      linkedin: "https://www.linkedin.com/in/aryankotecha/",
    },
  },
  {
    name: "Neelendra Mishra",
    role: "Design",
    avatar: "/team/neelendra.jpeg",
    links: {
      github: "https://github.com/Neelendra-Mishra",
      instagram: "https://www.instagram.com/neelendra_mish.ra?igsh=Y3I5ZXE4ZG02eWY0",
      linkedin: "https://www.linkedin.com/in/neelendra-mishra-031045229/",
    },
  },
];

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
    <main className={`container ${styles.page} ${body.className}`}>

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
        <div className={`${styles.glassIsland} ${styles.glassNoise}`}>
          <p className={`${styles.kicker} ${display.className}`}>ConU Planner</p>
          <h1 className={`${styles.title} ${display.className}`}>
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
        </div>
      </motion.section>

      <section className={styles.section}>
        <div className={styles.narrativeGrid}>
          <motion.div
            className={`${styles.narrativeCard} ${styles.glassNoise}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className={`${styles.h2} ${display.className}`}>Our Vision</h2>
            <p className={styles.bodyText}>
              To become the definitive computational companion for students, transforming complex academic data into
              intuitive, actionable insights that empower better decision-making.
            </p>
          </motion.div>

          <motion.div
            className={`${styles.narrativeCard} ${styles.glassNoise}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <h2 className={`${styles.h2} ${display.className}`}>Our Mission</h2>
            <p className={styles.bodyText}>
              We bridge the gap between static university catalogs and the dynamic student experience by unifying
              official requirements with peer wisdom and modern planning tools.
            </p>
          </motion.div>
        </div>
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
      >
        <div className={`${styles.glassIsland} ${styles.glassNoise}`} style={{ padding: '60px 40px' }}>
          <h2 className={`${styles.h2} ${display.className}`}>How it Started</h2>
          <p className={styles.bodyText} style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            It started in a library with 12 open tabs, a confusing PDF course sequence, and a Reddit thread from 2018.
            We realized that "planning" shouldn't be a chore. We built ConU Planner to be the tool we wished we had:
            fast, interconnected, and actually smart.
          </p>
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

      {/* --- Holographic Features Grid --- */}
      <section className={styles.section}>
        <motion.h2
          className={`${styles.h2} ${display.className}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          Engineered for Success
        </motion.h2>

        <div className={styles.grid}>
          <TiltCard className={`${styles.card} ${styles.colSpan2} ${styles.glassNoise}`}>
            <h3 className={display.className}>Unified Intelligence</h3>
            <p className={styles.muted}>Stop tab-switching. We pull Reddit threads, Professor ratings, and Catalog data into one view.</p>
          </TiltCard>
          <TiltCard className={`${styles.card} ${styles.glassNoise}`}>
            <h3 className={display.className}>Contextual Search</h3>
            <p className={styles.muted}>
              Our engine understands prerequisites. It doesn't just find COMP 352; it knows what you need.
            </p>
          </TiltCard>
          <TiltCard className={`${styles.card} ${styles.rowSpan2} ${styles.glassNoise}`}>
            <h3 className={display.className}>Live GPA Math</h3>
            <p className={styles.muted}>
              Forecast your cumulative standing instantly with our weighted credit calculator. No more spreadsheets required.
            </p>
          </TiltCard>
          <TiltCard className={`${styles.card} ${styles.glassNoise}`}>
            <h3 className={display.className}>Peer-Driven Insights</h3>
            <p className={styles.muted}>
              Real-time consensus on course difficulty and vibes from thousands of students.
            </p>
          </TiltCard>
          <TiltCard className={`${styles.card} ${styles.glassNoise}`}>
            <h3 className={display.className}>Mobile-First Logic</h3>
            <p className={styles.muted}>A premium experience on every device. Plan semesters on the STM.</p>
          </TiltCard>
          <TiltCard className={`${styles.card} ${styles.colSpan2} ${styles.glassNoise}`}>
            <h3 className={display.className}>Future-Proof Tech</h3>
            <p className={styles.muted}>Built with Next.js and high-performance indexing for sub-second search speeds across the entire university catalog.</p>
          </TiltCard>
        </div>
      </section>

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
          stacked
        />
      </motion.div>

      {/* --- Team Profile Chips --- */}
      <motion.section
        className={styles.section}
        style={{ marginBottom: 40 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className={`${styles.h2} ${display.className}`}>Team and Collaborators</h2>
        <div className={styles.teamGrid}>
          {TEAM.map((m) => (
            <TiltCard key={m.name} style={{ background: "transparent", border: "none", boxShadow: "none" }}>
              {/* We wrap Profile in TiltCard to give it the effect */}
              <Profile name={m.name} role={m.role} avatar={m.avatar} links={m.links} />
            </TiltCard>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 60, marginBottom: 40 }}>
          <p className="body" style={{ opacity: 0.7, marginBottom: 20 }}>
            Want to contribute?
          </p>
          <ConfettiButton />
        </div>
      </motion.section>
    </main>
  );
}
