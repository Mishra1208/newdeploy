"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Space_Grotesk } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });

export default function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success

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
        <section style={{
            maxWidth: 600,
            margin: "0 auto 80px",
            padding: "0 20px",
            position: "relative",
            zIndex: 10
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                    background: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(12px)",
                    borderRadius: 24,
                    padding: "32px 24px",
                    border: "1px solid rgba(255, 255, 255, 0.6)",
                    boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.05)",
                    textAlign: "center",
                    overflow: "hidden",
                    position: "relative"
                }}
                className="glass-surface"
            >
                {/* Subtle Gradient Glow */}
                <div style={{
                    position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
                    width: 300, height: 300,
                    background: 'radial-gradient(circle, rgba(219, 158, 30, 0.08) 0%, transparent 60%)',
                    pointerEvents: 'none'
                }} />

                <h3 className={display.className} style={{
                    fontSize: "24px",
                    marginBottom: "8px",
                    color: "var(--primary)",
                    background: "none",
                    WebkitTextFillColor: "initial"
                }}>
                    Join the Inner Circle <span style={{ color: "var(--secondary)" }}>🎓</span>
                </h3>

                <p style={{
                    color: "var(--ink-secondary)",
                    fontSize: "15px",
                    marginBottom: "24px",
                    lineHeight: 1.5
                }}>
                    Get notified about new features like the <b>Seat Finder</b> and <b>Schedule AI</b>. <br />
                    (No spam, strictly important updates only).
                </p>

                <AnimatePresence mode="wait">
                    {status === "success" ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                color: "#166534",
                                background: "#dcfce7",
                                padding: "12px 24px",
                                borderRadius: "50px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                fontWeight: 600
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                            style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}
                        >
                            <input
                                type="email"
                                placeholder="concordia.student@mail.concordia.ca"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(0,0,0,0.1)",
                                    background: "#FFFFFF",
                                    minWidth: "260px",
                                    fontSize: "15px",
                                    outline: "none",
                                    flex: 1
                                }}
                            />
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                style={{
                                    background: "var(--primary)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "12px 24px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    boxShadow: "0 4px 15px rgba(145, 35, 56, 0.3)",
                                    transition: "all 0.2s",
                                    minWidth: "120px"
                                }}
                                onMouseEnter={e => !status && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                onMouseLeave={e => !status && (e.currentTarget.style.transform = 'translateY(0)')}
                            >
                                {status === "loading" ? "..." : "Subscribe"}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
