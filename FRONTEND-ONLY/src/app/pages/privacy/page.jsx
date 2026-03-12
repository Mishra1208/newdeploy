"use client";
import React from "react";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import { motion } from "framer-motion";

import styles from "./privacy.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function PrivacyPage() {
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
                        <span className={styles.badgeIcon}>🛡️</span> Official Policy
                    </div>
                    <h1 className={`${display.className} ${styles.heroTitle}`}>Privacy & Data Integrity</h1>
                    <p className={styles.heroDesc}>
                        Our commitment to academic privacy, data minimization, and transparency.
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
                    <span className={styles.cardBrand}>ConU Planner Trust Center</span>
                </div>

                <div className={`prose ${styles.prose}`}>

                    <PolicySection title="1. Local-First Architecture" icon="🔒">
                        <p>
                            ConU Planner operates on a <strong>"local-first"</strong> philosophy. By default, your schedule, selected courses, and GPAs are stored strictly on your device's local storage. We have zero visibility into this data.
                        </p>
                        <p>
                            If you choose to sync your data across devices, we use encrypted cloud storage via <a href="https://clerk.com" className={styles.link}>Clerk Authentication</a>. We only store the synchronization payload and never use it for analytics or marketing.
                        </p>
                    </PolicySection>

                    <PolicySection title="2. Academic Integrity Standards" icon="🎓">
                        <p>
                            This platform is an UNOFFICIAL tool designed to aid in course discovery and visualization. It is <strong>strictly prohibited</strong> to use this tool for:
                        </p>
                        <ul className={styles.list}>
                            <li>Sharing or distributing copyrighted course materials.</li>
                            <li>Facilitating academic dishonesty or collaborative cheating.</li>
                            <li>Misrepresenting these unofficial plans as offical university advice.</li>
                        </ul>
                        <p>
                            We adhere strictly to Concordia University's <em>Academic Code of Conduct</em> and will cooperate with university officials if illicit usage is detected.
                        </p>
                    </PolicySection>

                    <PolicySection title="3. No Data Selling. Ever." icon="🚫">
                        <p>
                            <strong>We do not sell, rent, or trade your personal information.</strong> This project is built by students, for students. Our operating costs are covered by donations and our own contributions, not by monetizing your academic history.
                        </p>
                    </PolicySection>

                    <PolicySection title="4. Cookies & Analytics" icon="🍪">
                        <p>
                            We use cookies for two purposes:
                        </p>
                        <ul className={styles.list}>
                            <li><strong>Essential:</strong> To keep you logged in (provided by Clerk). These cannot be disabled.</li>
                            <li><strong>Analytics:</strong> To understand site traffic (provided by Vercel). These are <strong>optional</strong>.</li>
                        </ul>
                        <p>
                            You have full control. You can decline analytics cookies via our banner, or change your mind at any time using the <em>"Cookie Settings"</em> link in the footer.
                        </p>
                    </PolicySection>

                    <PolicySection title="5. External Data Sources" icon="☁️">
                        <p>
                            Course data is aggregated from public Concordia University course catalogues. While we strive for accuracy, official university data (on the Student Hub) always supersedes the information presented here.
                        </p>
                    </PolicySection>

                    <PolicySection title="6. Browser Extension (ConU Planner Ultimate)" icon="🧩">
                        <p>
                            ConU Planner Ultimate ("we", "our", or "us") is an open-source browser extension designed to help Concordia University students plan their schedules and analyze grade distributions. We prioritize your privacy and anonymity.
                        </p>
                        <h4 className="font-bold text-gray-900 dark:text-white mt-4 mb-2">Information We Collect</h4>
                        <p>We collect the following information only when you explicitly interact with the extension features:</p>
                        <ul className={styles.list}>
                            <li><strong>Transcript Data:</strong> When you click "✨ Sync Academic History" on the Unofficial Transcript page, the extension extracts your course history, grades, and academic standing.</li>
                            <li><strong>Grade Distribution Data:</strong> When you click "Sync Grades" on the Student Centre page, we collect aggregated course statistics (e.g., Course Code, Term, and the count of A+, A, B, etc.).</li>
                            <li><strong>Anonymity (Grades):</strong> We do not collect your Student ID, Name, GPA, or individual record for grade distribution syncing. Only class-wide averages are processed.</li>
                            <li><strong>Visual Schedule Builder (VSB) Data:</strong> When you export your schedule, the extension reads the schedule structure to generate an ICS calendar file. This occurs locally on your device.</li>
                        </ul>

                        <h4 className="font-bold text-gray-900 dark:text-white mt-4 mb-2">How We Use Information</h4>
                        <ul className={styles.list}>
                            <li><strong>Dashboard Sync:</strong> Transcript data is transmitted securely to your personal account on the ConU Planner dashboard to populate your progress charts and prerequisites. This data is entirely private and visible only to you.</li>
                            <li><strong>Academic Insight Engine:</strong> The aggregated grade data is used to calculate "Difficulty Scores" and provide insights (e.g., "Top 10 Easiest Electives") for the student community.</li>
                            <li><strong>Schedule Export:</strong> VSB data is used solely to generate your calendar file.</li>
                        </ul>

                        <h4 className="font-bold text-gray-900 dark:text-white mt-4 mb-2">Data Sharing & User Consent</h4>
                        <ul className={styles.list}>
                            <li>We do not sell, trade, or rent your personal identification information to others.</li>
                            <li>The aggregated, anonymous grade data may be shared publicly as part of the project's open-source dataset to benefit other students.</li>
                            <li>By using the "Sync Grades" feature, you <strong>consent</strong> to the anonymous contribution of that specific page's data to our community database.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="7. Contact & Data Removal" icon="📩">
                        <p>
                            You have the right to request full deletion of your synced account data at any time. For privacy inquiries or to report a vulnerability, contact the development team directly at:
                        </p>
                        <ul className={styles.list}>
                            <li><strong>General Inquiries:</strong> <a href="mailto:contact.conuplanner@gmail.com" className={styles.emailLink}>contact.conuplanner@gmail.com</a></li>
                            <li><strong>Extension Support & Developer Contact:</strong> <a href="mailto:mishranarendra1208@gmail.com" className={styles.emailLink}>mishranarendra1208@gmail.com</a></li>
                        </ul>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            <em>For extension-specific questions, you may also contact the publisher via the Chrome Web Store support link.</em>
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
