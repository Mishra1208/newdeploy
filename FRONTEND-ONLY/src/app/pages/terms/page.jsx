"use client";
import React from "react";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import { motion } from "framer-motion";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function TermsPage() {
    return (
        <main className={body.className} style={{ background: '#fafafa', minHeight: '100vh', paddingBottom: 100 }}>

            {/* --- HERO SECTION --- */}
            <section style={{
                background: '#1a1a1a', // Darker for Terms (Serious)
                padding: '120px 24px 80px',
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Abstract Pattern */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 20%)',
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
                        <span style={{ color: '#db9e1e' }}>⚖️</span> Legal Agreement
                    </div>
                    <h1 className={display.className} style={{ fontSize: '48px', marginBottom: 16, color: 'white' }}>Terms of Service</h1>
                    <p style={{ fontSize: '18px', opacity: 0.8, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
                        Guidelines for using ConU Planner responsibly and ethically.
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
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>ConU Planner Legal</span>
                </div>

                <div className="prose" style={{ lineHeight: 1.8, fontSize: '17px', color: '#333' }}>

                    <PolicySection title="1. Acceptance of Terms" icon="✍️">
                        <p>
                            By accessing ConU Planner, you agree to be bound by these Terms of Service. This is a binding legal agreement between you and the ConU Planner development team. If you do not agree to these terms, you must discontinue use immediately.
                        </p>
                    </PolicySection>

                    <PolicySection title="2. Unofficial Tool Disclaimer" icon="📢">
                        <p style={{ background: '#fff4e5', color: '#663c00', padding: '16px', borderRadius: 8, borderLeft: '4px solid #db9e1e' }}>
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
                        <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', display: 'grid', gap: 12 }}>
                            <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <span style={{ color: '#d32f2f' }}>✖</span> Use automated scrapers or "bots" to harvest our data.
                            </li>
                            <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <span style={{ color: '#d32f2f' }}>✖</span> Attempt to reverse-engineer our source code (aside from Open Source components).
                            </li>
                            <li style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <span style={{ color: '#d32f2f' }}>✖</span> Use the platform to sell or distribute course notes/exams.
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
