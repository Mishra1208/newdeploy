"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Read initial theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(currentTheme);

        // Watch for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    setTheme(document.documentElement.getAttribute('data-theme'));
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        // Check for consent
        const consent = localStorage.getItem("conu_cookie_consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => {
                clearTimeout(timer);
                observer.disconnect();
            };
        }
        return () => observer.disconnect();
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

    const isDark = theme === 'dark';

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
                        right: 24,
                        zIndex: 9999,
                        maxWidth: 400,
                        width: 'calc(100% - 48px)',
                    }}
                    className={inter.className}
                >
                    <div style={{
                        background: isDark ? 'rgba(10, 10, 10, 0.9)' : 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: 24,
                        padding: 24,
                        boxShadow: isDark
                            ? '0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1) inset'
                            : '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.4) inset',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                        transition: 'background 0.3s, border 0.3s'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                            <div style={{ fontSize: 28 }}>🍪</div>
                            <div>
                                <h4 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 700, color: isDark ? '#fff' : '#111' }}>
                                    Cookie Preferences
                                </h4>
                                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: isDark ? '#94a3b8' : '#555' }}>
                                    We use cookies to ensure you get the best experience and to keep your sessions secure. {" "}
                                    <Link href="/pages/privacy" style={{ color: isDark ? '#f43f5e' : '#912338', textDecoration: 'underline' }}>
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
                                    padding: '12px 0',
                                    borderRadius: 14,
                                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e5e5',
                                    background: isDark ? 'rgba(255,255,255,0.03)' : 'transparent',
                                    color: isDark ? '#d1d5db' : '#666',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Decline
                            </button>
                            <button
                                onClick={handleAccept}
                                style={{
                                    flex: 1,
                                    padding: '12px 0',
                                    borderRadius: 14,
                                    border: 'none',
                                    background: isDark ? '#f43f5e' : '#912338',
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: isDark ? '0 10px 25px rgba(244, 63, 94, 0.4)' : '0 4px 12px rgba(145, 35, 56, 0.25)',
                                    transition: 'all 0.2s'
                                }}
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
