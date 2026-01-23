"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Space_Grotesk } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });

export default function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success

    // Parallax Ref
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Parallax Values
    const textY = useTransform(scrollYProgress, [0, 1], [0, 30]);
    const capY = useTransform(scrollYProgress, [0, 1], [80, -80]);
    const floatY = useTransform(scrollYProgress, [0, 1], [0, -60]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus("success");
                setEmail("");
            } else {
                console.error("Subscription failed:", res.statusIcon);
                setStatus("idle");
                alert("Something went wrong. Please try again.");
            }
        } catch (e) {
            console.error(e);
            setStatus("idle");
            alert("Error submitting. Please try later.");
        }
    };

    return (
        <section
            ref={ref}
            style={{
                maxWidth: 800,
                margin: "0 auto 120px",
                padding: "0 20px",
                position: "relative",
                zIndex: 10,
                textAlign: 'center'
            }}
        >
            {/* Subtle Gradient Glow (Matches Login) */}
            <div style={{
                position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
                width: 600, height: 400,
                background: 'radial-gradient(circle, rgba(145, 35, 56, 0.04) 0%, transparent 70%)', // Subtle Burgundy Glow
                pointerEvents: 'none'
            }} />

            {/* --- Floating Elements --- */}
            <motion.div style={{
                position: 'absolute',
                top: '-20%',
                left: '2%', // Different side from Login for balance
                fontSize: '80px',
                opacity: 0.08,
                y: capY,
                rotate: -15,
                zIndex: 0,
                pointerEvents: 'none'
            }}>
                🎓
            </motion.div>

            <motion.div style={{
                position: 'absolute',
                bottom: '10%',
                right: '5%',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(145, 35, 56, 0.15) 0%, transparent 70%)',
                y: floatY,
                opacity: 0.5,
                zIndex: 0,
                pointerEvents: 'none',
                filter: 'blur(30px)'
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
                <motion.div style={{ y: textY }}>
                    <h3 className={display.className} style={{
                        fontSize: "56px", // Premium Headline
                        marginBottom: "16px",
                        color: "#111",
                        letterSpacing: '-0.03em',
                        lineHeight: 1.1,
                        fontWeight: 800
                    }}>
                        Join the Inner Circle <span style={{ fontSize: '0.9em' }}>🎓</span>
                    </h3>

                    <p style={{
                        color: "#666",
                        fontSize: "20px", // Editorial Size
                        marginBottom: "40px",
                        lineHeight: 1.6,
                        fontWeight: 500
                    }}>
                        Get notified about new features like the <b>Seat Finder</b> and <b>Schedule AI</b>. <br />
                        (No spam, strictly important updates only).
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {status === "success" ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                color: "#166534",
                                background: "#dcfce7",
                                padding: "16px 32px",
                                borderRadius: "100px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                                fontWeight: 600,
                                fontSize: "18px"
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            You're on the list!
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleSubmit}
                            style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", maxWidth: '500px', margin: '0 auto' }}
                        >
                            <input
                                type="email"
                                placeholder="concordia.student@mail.concordia.ca"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    padding: "16px 24px",
                                    borderRadius: "100px", // Capsule
                                    border: "1px solid rgba(0,0,0,0.1)",
                                    background: "rgba(255,255,255,0.8)",
                                    backdropFilter: "blur(10px)",
                                    minWidth: "280px",
                                    fontSize: "16px",
                                    outline: "none",
                                    flex: 1,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                                    transition: "all 0.2s"
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#912338"}
                                onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,0.1)"}
                            />
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                style={{
                                    background: "#912338", // Brand Burgundy
                                    color: "white",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "100px", // Pill
                                    padding: "16px 32px",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    boxShadow: "0 8px 25px rgba(145, 35, 56, 0.25)",
                                    transition: "all 0.2s",
                                    minWidth: "140px"
                                }}
                                onMouseEnter={e => !status && (e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)')}
                                onMouseLeave={e => !status && (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
                            >
                                {status === "loading" ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                        <style jsx>{`
                                            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                                        `}</style>
                                    </svg>
                                ) : "Subscribe"}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
