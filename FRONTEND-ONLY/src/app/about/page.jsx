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
        <div className={styles.glassIsland}>
          <p className={`${styles.kicker} ${display.className}`}>ConU Planner</p>
          <h1 className={`${styles.title} ${display.className}`}>
            Dream It. <br /> Plan It. Done.
          </h1>

          <p className={styles.lead}>
            One beautiful interface for courses, credits, and community wisdom.
            Stop jumping between tabs—start designing your future.
          </p>

          <ul className={styles.chips} aria-label="Sources we unify">
            <li className={styles.chip}>Official Docs</li>
            <li className={styles.chip}>Student Reddit</li>
            <li className={styles.chip}>Professor Ratings</li>
            <li className={styles.chip}>Credit Math</li>
          </ul>
        </div>
      </motion.section>

      {/* --- Narrative --- */}
      <motion.p
        className={styles.bodyWide}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <strong>ConU Planner</strong> isn't just a search bar—it's peace of mind.
        We stitch together the scattered chaos of university data into a single,
        smooth experience so you can enroll with zero doubt.
        <span className={styles.note}> The beam below shows how everything connects.</span>
      </motion.p>

      {/* --- Stats Ticker --- */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <StatsTicker displayClass={display.className} />
      </motion.div>

      {/* --- Animated Beam --- */}
      <motion.section
        className={styles.section}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
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
          Why it feels magic
        </motion.h2>

        <div className={styles.grid}>
          <TiltCard className={styles.card}>
            <h3 className={display.className}>Designed for Humans</h3>
            <p className={styles.muted}>A UI that respects your time. Clean, intuitive, and remarkably fast.</p>
          </TiltCard>
          <TiltCard className={styles.card}>
            <h3 className={display.className}>Search Superpowers</h3>
            <p className={styles.muted}>
              Filter by anything: term, credits, session, even specific times.
            </p>
          </TiltCard>
          <TiltCard className={styles.card}>
            <h3 className={display.className}>Prerequisite Vision</h3>
            <p className={styles.muted}>
              See the path instantly: “MATH 204 + COMP 249 → COMP 352”. No manual checking.
            </p>
          </TiltCard>
          <TiltCard className={styles.card}>
            <h3 className={display.className}>Data, Harmonized</h3>
            <p className={styles.muted}>
              We normalize terms, subjects, and locations into one consistent language.
            </p>
          </TiltCard>
          <TiltCard className={styles.card}>
            <h3 className={display.className}>Built for Mobile</h3>
            <p className={styles.muted}>Plan your degree from your phone, tablet, or laptop. It just works.</p>
          </TiltCard>
          <TiltCard className={styles.card}>
            <h3 className={display.className}>The Future is Bright</h3>
            <p className={styles.muted}>Saved plans, auto-timetables, and more are on the horizon.</p>
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
