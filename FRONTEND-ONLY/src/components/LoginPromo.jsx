"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SignInButton } from "@clerk/nextjs";
import styles from "../app/home.module.css"; // Ensure styles are imported

// Re-using fadeInUp variant if needed, or defining new one
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function LoginPromo() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Parallax Values
    const textY = useTransform(scrollYProgress, [0, 1], [0, 40]); // Text moves slower (appears to drag down/stay)
    const capY = useTransform(scrollYProgress, [0, 1], [100, -100]); // Cap floats up
    const orbY = useTransform(scrollYProgress, [0, 1], [0, -50]); // Orb floats up slower
    const bookY = useTransform(scrollYProgress, [0, 1], [-50, 80]); // Book floats down
    const scrollY = useTransform(scrollYProgress, [0, 1], [60, -60]); // Scroll floats up

    return (
        <motion.section
            ref={ref}
            className={`${styles.loginPromoWidget} ${styles.glassNoise}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            style={{
                maxWidth: '900px',
                margin: '0 auto 120px auto',
                padding: '40px 20px',
                textAlign: 'center',
                position: 'relative',
                background: 'radial-gradient(circle at center, rgba(219, 158, 30, 0.03) 0%, transparent 70%)',
                overflow: 'visible' // Allow floating elements to peek out
            }}
        >
            {/* --- Floating Elements --- */}
            <motion.div style={{
                position: 'absolute',
                top: '-10%',
                right: '10%',
                fontSize: '80px',
                opacity: 0.1,
                y: capY,
                rotate: 15,
                zIndex: 0,
                pointerEvents: 'none'
            }}>
                🎓
            </motion.div>

            <motion.div style={{
                position: 'absolute',
                bottom: '15%',
                right: '5%',
                fontSize: '60px',
                opacity: 0.08,
                y: scrollY,
                rotate: -10,
                zIndex: 0,
                pointerEvents: 'none'
            }}>
                📜
            </motion.div>

            <motion.div style={{
                position: 'absolute',
                top: '5%',
                left: '8%',
                fontSize: '50px',
                opacity: 0.1,
                y: bookY,
                rotate: 20,
                zIndex: 0,
                pointerEvents: 'none'
            }}>
                📚
            </motion.div>

            <motion.div style={{
                position: 'absolute',
                bottom: '0%',
                left: '15%',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(219, 158, 30, 0.2) 0%, transparent 70%)',
                y: orbY,
                opacity: 0.6,
                zIndex: 0,
                pointerEvents: 'none',
                filter: 'blur(20px)'
            }} />

            {/* --- Content --- */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 className={`${styles.promoTitle} h2`} style={{
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '64px',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    marginBottom: '24px',
                    lineHeight: 1.1,
                    color: '#111'
                }}>
                    <motion.div style={{ y: textY }}>
                        Save Your Progress. <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            paddingBottom: '10px'
                        }}>Sync Across Devices.</span>
                    </motion.div>
                </h2>

                <motion.p className={styles.promoText} style={{
                    fontSize: '22px',
                    color: '#555',
                    lineHeight: 1.6,
                    maxWidth: '640px',
                    margin: '0 auto 48px auto',
                    fontWeight: 500,
                    y: textY // Sync paragraph with title
                }}>
                    Don't lose your perfect schedule. Connect your GitHub or Gmail to save your planner and GPA data instantly.
                </motion.p>

                <SignInButton mode="modal">
                    <button style={{
                        background: '#0a0a0a',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '18px 42px',
                        borderRadius: '100px',
                        fontSize: '17px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                        }}
                    >
                        <span style={{ fontSize: 20 }}>🎓</span> Connect with Git / Gmail
                    </button>
                </SignInButton>

                <div style={{ marginTop: 16, fontSize: 12, opacity: 0.5 }}>
                    100% Free • Secure Authentication via Clerk
                </div>
            </div>
        </motion.section>
    );
}
