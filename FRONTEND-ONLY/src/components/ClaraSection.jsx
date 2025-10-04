// components/ClaraSection.jsx
"use client";
import React from "react";

export default function ClaraSection({ styles, displayClass, stacked = false }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>
        Meet our AI chat bot — <span className={displayClass}>Clara</span>
      </h2>

      <p className={styles.lead}>
        Clara is your smart course sidekick. Ask things like
        <em> “Is COMP 352 hard?”, “Who to take for SOEN 228?”, “How many credits is ENCS 272?” </em>
           she blends our course index (CSV), Reddit chatter, and RateMyProfessors to answer fast.
      </p>

      <div className={`${styles.claraGrid} ${stacked ? styles.claraStack : ""}`}>
        {/* Info card */}
        <div className={styles.claraCard}>
          <h3 className={styles.claraH3}>What Clara can do</h3>
          <ul className={styles.claraList}>
            <li><strong>Community insight:</strong> Summaries from recent Reddit threads.</li>
            <li><strong>Professor pulse:</strong> Quality, difficulty, would-take-again from RMP.</li>
            <li><strong>Catalog facts:</strong> Credits, prereqs, terms, sessions, equivalents.</li>
            <li><strong>Fast answers:</strong> Ask naturally, Clara figures out intent.</li>
          </ul>
          <p className={styles.muted}>Tip: include a course code like <code>COMP 248</code> for best results.</p>
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
