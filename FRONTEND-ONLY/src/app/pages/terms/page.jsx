"use client";
import React from "react";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import { motion } from "framer-motion";

import styles from "./terms.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function TermsPage() {
    return (
        <main className={`${body.className} ${styles.page}`}>

            {/* --- HERO SECTION --- */}
            <section className={styles.hero}>
                {/* Abstract Pattern */}
                <div className={styles.heroPattern} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className={styles.badge}>
                        <span className={styles.badgeIcon}>⚖️</span> Legal Agreement
                    </div>
                    <h1 className={`${display.className} ${styles.heroTitle}`}>Terms of Service</h1>
                    <p className={styles.heroDesc}>
                        Guidelines for using ConU Planner responsibly and ethically.
                    </p>
                </motion.div>
            </section>

            {/* --- CONTENT CARD --- */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className={styles.card}
            >
                <div className={styles.cardHeader}>
                    <span className={styles.cardDate}>Effective Date: January 2026</span>
                    <span className={styles.cardBrand}>ConU Planner Legal</span>
                </div>

                <div className={`prose ${styles.prose}`}>

                    <PolicySection title="1. Acceptance of Terms" icon="✍️">
                        <p>
                            By accessing ConU Planner, you agree to be bound by these Terms of Service. This is a binding legal agreement between you and the ConU Planner development team. If you do not agree to these terms, you must discontinue use immediately.
                        </p>
                    </PolicySection>

                    <PolicySection title="2. Unofficial Tool Disclaimer" icon="📢">
                        <p className={styles.disclaimerBox}>
                            <strong>IMPORTANT:</strong> ConU Planner is an independent, student-led project. It is <strong>NOT</strong> affiliated with, funded by, or operated by Concordia University.
                        </p>
                        <p style={{ marginTop: 16 }}>
                            For official degree audits, course registration, and academic advising, you strictly rely on the official student portal. We accept no liability for missed deadlines, graduation delays, or scheduling errors resulting from reliance on this tool.
                        </p>
                    </PolicySection>

                    <PolicySection title="3. Acceptable Use Policy" icon="✅">
                        <p>
                            We grant you a limited, non-exclusive license to use this tool for personal academic planning. You explicitly agree NOT to:
                        </p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>
                                <span className={styles.itemIcon}>✖</span> Use automated scrapers or "bots" to harvest our data.
                            </li>
                            <li className={styles.listItem}>
                                <span className={styles.itemIcon}>✖</span> Attempt to reverse-engineer our source code (aside from Open Source components).
                            </li>
                            <li className={styles.listItem}>
                                <span className={styles.itemIcon}>✖</span> Use the platform to sell or distribute course notes/exams.
                            </li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="4. Intellectual Property" icon="🧠">
                        <p>
                            The "ConU Planner" name, logo, and UI design are the intellectual property of the creators.
                        </p>
                        <p>
                            <em>Course Data:</em> All underlying course descriptions, credits, and prerequisite structures remain the intellectual property of Concordia University and are fair-use mapped for informational purposes.
                        </p>
                    </PolicySection>

                    <PolicySection title="5. Termination" icon="🛑">
                        <p>
                            We reserve the right to ban any user IP or account detected abusing the API, spamming the server, or attempting to compromise user data security, without prior notice.
                        </p>
                    </PolicySection>

                </div>

            </motion.div>

            <div className={styles.backLink}>
                <Link href="/">
                    ← Return to Homepage
                </Link>
            </div>

        </main>
    );
}

// Helper Component for Sections
function PolicySection({ title, children, icon }) {
    return (
        <div className={styles.policySection}>
            <h3 className={`${display.className} ${styles.policyTitle}`}>
                <span className={styles.iconBox}>{icon}</span>
                {title}
            </h3>
            <div className={styles.policyContent}>{children}</div>
        </div>
    )
}
