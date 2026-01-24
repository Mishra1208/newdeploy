"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import styles from "./engineered-sticky.module.css";
import { Outfit } from "next/font/google";

const display = Outfit({ subsets: ["latin"], weight: ["700", "800"] });

const FEATURES = [
    {
        id: "01",
        title: "Unified Intelligence",
        desc: "Stop tab-switching. We pull Reddit threads, Professor ratings, and Catalog data into one view, giving you the complete picture instantly."
    },
    {
        id: "02",
        title: "Contextual Search",
        desc: "Our engine understands prerequisites. It doesn't just find COMP 352; it knows what you need before it and what comes next."
    },
    {
        id: "03",
        title: "Live GPA Math",
        desc: "Forecast your cumulative standing instantly with our weighted credit calculator. No more spreadsheets or guessing games required."
    },
    {
        id: "04",
        title: "Peer-Driven Insights",
        desc: "Real-time consensus on course difficulty and vibes from thousands of students. Know exactly what you're signing up for."
    },
    {
        id: "05",
        title: "Mobile-First Logic",
        desc: "A premium experience on every device. Plan your semesters on the STM, in a cafe, or wherever inspiration strikes."
    },
    {
        id: "06",
        title: "Future-Proof Tech",
        desc: "Built with Next.js and high-performance indexing for sub-second search speeds across the entire university course catalog."
    },
];

const FeatureItem = ({ feature, index }) => {
    return (
        <motion.div
            className={styles.featureItem}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <div className={styles.numberWrapper}>
                <span className={`${styles.number} ${display.className}`}>{feature.id}</span>
            </div>
            <div className={styles.content}>
                <h3 className={`${styles.itemTitle} ${display.className}`}>{feature.title}</h3>
                <p className={styles.itemDesc}>{feature.desc}</p>
            </div>
        </motion.div>
    );
};

export default function EngineeredSticky() {
    return (
        <section className={styles.container}>
            <div className={styles.stickyWrapper}>

                {/* Left Column: Sticky Heading */}
                <div className={styles.leftColumn}>
                    <div className={styles.stickyContent}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className={styles.kicker}>THE BLUEPRINT</span>
                            <h2 className={`${styles.heading} ${display.className}`}>
                                Engineered for <br />
                                <span className={styles.gradientText}>Success.</span>
                            </h2>
                            <p className={styles.intro}>
                                Guiding your academic evolution with tools built for the modern student.
                                Move beyond simple scheduling into strategic degree planning.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Column: Scrolling List */}
                <div className={styles.rightColumn}>
                    <div className={styles.list}>
                        {FEATURES.map((feature, i) => (
                            <FeatureItem key={feature.id} feature={feature} index={i} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
