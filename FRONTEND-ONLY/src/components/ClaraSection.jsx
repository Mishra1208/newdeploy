// components/ClaraSection.jsx
"use client";
import React, { useState, useEffect } from "react";
import { Brain, GraduationCap, Sparkles, Zap, ArrowRight } from "lucide-react";

export default function ClaraSection({ styles, displayClass, stacked = false }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <section className={styles.claraSection}>
      <div className={styles.claraContainer}>

        {/* Left Column: Content */}
        <div className={styles.claraContent}>
          <h2 className={`${styles.claraHeader} ${displayClass}`}>
            Meet <span className={styles.royalGradientText}>Clara.</span>
          </h2>

          <p className={styles.claraLead}>
            Your Academic Oracle. Not just a chatbot—a logic engine that cross-references
            official data with peer wisdom to reveal the truth about your degree.
          </p>

          <div className={styles.capabilitiesGrid}>
            <div className={styles.capabilityCard}>
              <Brain size={24} className={styles.capIcon} />
              <span className={styles.capTitle}>Sentiment Analysis</span>
              <p className={styles.capDesc}>Detects "GPA Killers" vs "Hidden Gems" from Reddit threads.</p>
            </div>

            <div className={styles.capabilityCard}>
              <GraduationCap size={24} className={styles.capIcon} />
              <span className={styles.capTitle}>Professor Insight</span>
              <p className={styles.capDesc}>Matches RateMyProf ratings to specific course sections.</p>
            </div>

            <div className={styles.capabilityCard}>
              <Zap size={24} className={styles.capIcon} />
              <span className={styles.capTitle}>Prerequisite Logic</span>
              <p className={styles.capDesc}>Navigates complex "AND/OR" trees to prevent enrollment errors.</p>
            </div>

            <div className={styles.capabilityCard}>
              <Sparkles size={24} className={styles.capIcon} />
              <span className={styles.capTitle}>Live Catalog</span>
              <p className={styles.capDesc}>Direct hooks into the course registry for sub-second data.</p>
            </div>
          </div>

          <div className={styles.proTip}>
            <Sparkles size={14} color="#C5A059" fill="#C5A059" />
            <span>Pro Tip:</span> Ask "Compare COMP 352 vs SOEN 331 difficulty"
          </div>
        </div>

        {/* Right Column: Visual/Demo */}
        <div className={styles.claraVisual}>
          <div suppressHydrationWarning={true} style={{ width: '100%', height: '100%' }}>
            {mounted && (
              <video
                className={styles.claraVideo}
                src="/videos/clara-demo.mp4"
                poster="/videos/thumbnail.jpg"
                controls
                preload="metadata"
                playsInline
              />
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
