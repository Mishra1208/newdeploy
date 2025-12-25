// components/ClaraSection.jsx
"use client";
import React from "react";

export default function ClaraSection({ styles, displayClass, stacked = false }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>
        Meet <span className={displayClass}>Clara.</span> <br />
        <span style={{ fontSize: '0.8em', opacity: 0.7 }}>Your Academic Oracle.</span>
      </h2>

      <p className={styles.lead}>
        Clara isn't just a bot. She's a synthesis of every course review, every grading pattern,
        and every prerequisite rule.
        <em> She knows if COMP 352 is hard so you don't have to guess.</em>
      </p>

      <div className={`${styles.claraGrid} ${stacked ? styles.claraStack : ""}`}>
        {/* Info card */}
        <div className={styles.claraCard}>
          <h3 className={styles.claraH3}>Omniscient Intelligence</h3>
          <ul className={styles.claraList}>
            <li><strong>Hive Mind:</strong> Instant summaries of student consensus from Reddit.</li>
            <li><strong>Professor Pulse:</strong> Knowing who teaches best (and who to avoid).</li>
            <li><strong>Policy Expert:</strong> Credits, prerequisites, and obscure rules—memorized.</li>
            <li><strong>Natural Chat:</strong> Just talk to her. She gets it.</li>
          </ul>
          <p className={styles.muted}>Pro Tip: Ask "What's the vibe of SOEN 287?"</p>
        </div>

        {/* Video block */}
        <div className={`${styles.claraVideoWrap} ${stacked ? styles.videoFull : ""}`}>
          <video
            className={styles.claraVideo}
            src="/videos/clara-demo.mp4"
            poster="/videos/humbnail.jpg"
            controls
            preload="metadata"
            playsInline
          />
        </div>
      </div>
    </section>
  );
}
