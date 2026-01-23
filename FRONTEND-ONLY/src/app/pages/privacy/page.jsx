"use client";
import React from "react";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import { motion } from "framer-motion";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function PrivacyPage() {
    return (
        <main className={body.className} style={{ background: '#fafafa', minHeight: '100vh', paddingBottom: 100 }}>

            {/* --- HERO SECTION --- */}
            <section style={{
                background: '#912338', // Brand Burgundy
                padding: '120px 24px 80px',
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Abstract Pattern */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.05) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(219,158,30,0.1) 0%, transparent 20%)',
                    pointerEvents: 'none'
                }} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: 100,
                        fontSize: 14, fontWeight: 600, marginBottom: 24, border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <span style={{ color: '#db9e1e' }}>🛡️</span> Official Policy
                    </div>
                    <h1 className={display.className} style={{ fontSize: '48px', marginBottom: 16 }}>Privacy & Data Integrity</h1>
                    <p style={{ fontSize: '18px', opacity: 0.8, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
                        Our commitment to academic privacy, data minimization, and transparency.
                    </p>
                </motion.div>
            </section>

            {/* --- CONTENT CARD --- */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{
                    maxWidth: 900,
                    margin: '-40px auto 0',
                    background: 'white',
                    borderRadius: 16,
                    padding: '60px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: 24, marginBottom: 40 }}>
                    <span style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, color: '#999' }}>Effective Date: January 2026</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#912338' }}>ConU Planner Trust Center</span>
                </div>

                <div className="prose" style={{ lineHeight: 1.8, fontSize: '17px', color: '#333' }}>

                    <PolicySection title="1. Local-First Architecture" icon="🔒">
                        <p>
                            ConU Planner operates on a <strong>"local-first"</strong> philosophy. By default, your schedule, selected courses, and GPAs are stored strictly on your device's local storage. We have zero visibility into this data.
                        </p>
                        <p>
                            If you choose to sync your data across devices, we use encrypted cloud storage via <a href="https://clerk.com" style={{ color: '#db9e1e', textDecoration: 'underline' }}>Clerk Authentication</a>. We only store the synchronization payload and never use it for analytics or marketing.
                        </p>
                    </PolicySection>

                    <PolicySection title="2. Academic Integrity Standards" icon="🎓">
                        <p>
                            This platform is an UNOFFICIAL tool designed to aid in course discovery and visualization. It is <strong>strictly prohibited</strong> to use this tool for:
                        </p>
                        <ul style={{ listStyle: 'disc', paddingLeft: 24, margin: '16px 0', color: '#555' }}>
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

                    <PolicySection title="4. External Data Sources" icon="☁️">
                        <p>
                            Course data is aggregated from public Concordia University course catalogues. While we strive for accuracy, official university data (on the Student Hub) always supersedes the information presented here.
                        </p>
                    </PolicySection>

                    <PolicySection title="5. Contact & Data Removal" icon="📩">
                        <p>
                            You have the right to request full deletion of your synced account data at any time. For privacy inquiries or to report a vulnerability, contact the development team directly at:
                        </p>
                        <a href="mailto:privacy@conuplanner.app" style={{ display: 'inline-block', marginTop: 12, color: '#912338', fontWeight: 600, fontSize: 18 }}>privacy@conuplanner.app</a>
                    </PolicySection>

                </div>

            </motion.div>

            <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Link href="/" style={{ color: '#999', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                    ← Return to Homepage
                </Link>
            </div>

        </main>
    );
}

// Helper Component for Sections
function PolicySection({ title, children, icon }) {
    return (
        <div style={{ marginBottom: 48 }}>
            <h3 className={display.className} style={{ fontSize: 22, color: '#111', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ background: '#f5f5f5', width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</span>
                {title}
            </h3>
            <div style={{ paddingLeft: 52 }}>{children}</div>
        </div>
    )
}
