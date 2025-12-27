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
        Clara isn't just a chatbot—she's a high-performance logic engine designed to handle the complexity of academic life.
        She cross-references official course data with thousands of peer reviews to give you the truth about your degree.
      </p>

      <div className={`${styles.claraGrid} ${stacked ? styles.claraStack : ""}`}>
        {/* Info card */}
        <div className={styles.claraCard}>
          <h3 className={styles.claraH3}>Advanced Capabilities</h3>
          <ul className={styles.claraList}>
            <li><strong>Sentiment Analysis:</strong> Summarizes Reddit consensus to identify "Hidden Gem" electives and "GPA Killer" courses.</li>
            <li><strong>Professor Insight:</strong> Correlates RateMyProf ratings with specific course sections for better scheduling.</li>
            <li><strong>Prerequisite Logic:</strong> Understands complex "and/or" course dependencies to prevent enrollment errors.</li>
            <li><strong>Live Catalog Access:</strong> Direct integration with the Concordia course registry for sub-second data retrieval.</li>
          </ul>
          <p className={styles.muted}>Pro Tip: Try asking "Compare COMP 352 with SOEN 331 difficulty."</p>
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
