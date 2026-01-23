"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("conu_cookie_consent");
        if (!consent) {
            // Delay slightly for dramatic entrance
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("conu_cookie_consent", "accepted");
        window.dispatchEvent(new Event("conu_cookie_update"));
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("conu_cookie_consent", "declined");
        window.dispatchEvent(new Event("conu_cookie_update"));
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24, // Bottom right corner
                        zIndex: 9999,
                        maxWidth: 400,
                        width: 'calc(100% - 48px)',
                    }}
                    className={inter.className}
                >
                    {/* Glassmorphism Card */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.85)', // Light mode glass
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: 20,
                        padding: 24,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.4) inset',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        {/* Dark Mode Support via CSS @media if needed, but for now enforcing this premium light glass look which overlays nicely on both */}

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                            <div style={{ fontSize: 24 }}>🍪</div>
                            <div>
                                <h4 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 600, color: '#111' }}>
                                    Cookie Preferences
                                </h4>
                                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#555' }}>
                                    We use cookies to ensure you get the best experience and to keep your session secure. {" "}
                                    <Link href="/pages/privacy" style={{ color: '#912338', textDecoration: 'underline' }}>
                                        Read Policy
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={handleDecline}
                                style={{
                                    flex: 1,
                                    padding: '10px 0',
                                    borderRadius: 12,
                                    border: '1px solid #e5e5e5',
                                    background: 'transparent',
                                    color: '#666',
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => { e.target.style.background = '#f5f5f5'; e.target.style.color = '#333'; }}
                                onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#666'; }}
                            >
                                Decline
                            </button>
                            <button
                                onClick={handleAccept}
                                style={{
                                    flex: 1,
                                    padding: '10px 0',
                                    borderRadius: 12,
                                    border: 'none',
                                    background: '#912338', // Brand Burgundy
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(145, 35, 56, 0.25)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 16px rgba(145, 35, 56, 0.35)'; }}
                                onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(145, 35, 56, 0.25)'; }}
                            >
                                Accept All
                            </button>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
