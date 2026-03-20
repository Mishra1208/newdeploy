"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });

const changelogData = [
    {
        date: "Mar 15, 2026",
        version: "v2.5",
        title: "Bulletproof Sync & Extension Delivery",
        description: "A crucial reliability patch to keep your academic timeline perfectly intact, alongside our final Chrome Extension push.",
        color: "#0ea5e9", // Sky Blue
        features: [
            "Squashed a bug: all your planned courses now safely and beautifully sync to the cloud instantly",
            "Upgraded the Chrome Extension to aggressively fetch your grades on initial page load",
            "Broadened extension table recognition to survive any Concordia portal CSS updates",
            "Finalized Extension v2.5 without localhost permissions for the Chrome Web Store"
        ]
    },
    {
        date: "Feb 26, 2026",
        version: "v2.4",
        title: "Chrome Extension Ultimate",
        description: "Massive upgrade to the browser extension introducing direct transcript syncing and grade distribution analytics.",
        color: "#912338", // ConU Maroon
        features: [
            "Seamlessly sync unofficial transcripts to your dashboard",
            "Unlock community Grade Distribution insights",
            "RateMyProfessors ratings directly inside VSB",
        ],
        link: "https://chromewebstore.google.com/detail/conuplanner-ultimate/klkkheopnkioincbkkkoanbgaffenoic",
        linkLabel: "Add to Chrome"
    },
    {
        date: "Feb 20, 2026",
        version: "v2.1",
        title: "Professor Comparison Hub",
        description: "Making informed scheduling decisions has never been easier with our dedicated professor analytics engine.",
        color: "#2563eb", // Blue
        features: [
            "Side-by-side difficulty and 'Would Take Again' comparisons",
            "Instant visual scorecards based on 1000s of reviews",
        ],
        link: "/pages/professor-comparison"
    },
    {
        date: "Jan 15, 2026",
        version: "v1.0",
        title: "VSB Exporter Launch",
        description: "The original ConU Planner browser extension launched to solve the most annoying part of scheduling.",
        color: "#10b981", // Emerald
        features: [
            "1-Click Export from Visual Schedule Builder to Google Calendar",
            "Download schedule as standard .ICS file",
        ],
        link: "https://chromewebstore.google.com/detail/conuplanner-ultimate/klkkheopnkioincbkkkoanbgaffenoic",
        linkLabel: "View Extension"
    },
    {
        date: "Dec 10, 2025",
        version: "Beta",
        title: "Seat Finder Automation",
        description: "Automated monitoring for notoriously full classes to ensure you never miss an open seat again.",
        color: "#f59e0b", // Amber
        features: [
            "Real-time class capacity tracking",
            "Instant email notifications when seats open",
        ],
        link: "/pages/seat-finder"
    },
    {
        date: "Nov 1, 2025",
        version: "Launch",
        title: "Platform Genesis",
        description: "The foundation of ConU Planner released to the student body, replacing broken spreadsheets.",
        color: "#8b5cf6", // Violet
        features: [
            "Interactive Prerequisite Tech Tree",
            "Weighted GPA Forecaster",
            "Smart Multi-Year Sequence Planner",
            "Complete Searchable Course Catalog",
        ],
        link: "/pages/courses"
    }
];

const TimelineItem = ({ item, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    return (
        <div ref={ref} style={{ display: "flex", gap: "32px", marginBottom: "64px", position: "relative" }}>
            {/* Left side: Date & Version */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                style={{
                    width: "160px",
                    flexShrink: 0,
                    textAlign: "right",
                    color: "var(--ink-secondary)",
                    paddingTop: "32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                }}
                className="timeline-date-col"
            >
                <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--ink-primary)" }}>
                    {item.version}
                </span>
                <span style={{ fontSize: "14px" }}>
                    {item.date}
                </span>
            </motion.div>

            {/* Center Line & Node */}
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                        zIndex: 2,
                        marginTop: "32px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        border: `4px solid ${item.color}`,
                        boxShadow: `0 0 0 4px ${item.color}15`
                    }}
                />
                {/* The unbroken sleek line connecting nodes */}
                {index !== changelogData.length - 1 && (
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                        style={{
                            position: "absolute",
                            top: "48px", // directly below the 16px marker (32px top + 16px height)
                            bottom: "-96px", // spans the 64px row gap + 32px marker margin of the next row
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "2px",
                            backgroundColor: "var(--ink-secondary)", // visible solid line
                            opacity: 0.2,
                            transformOrigin: "top",
                            zIndex: 1
                        }}
                    />
                )}
            </div>

            {/* Right side: Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                style={{
                    flexGrow: 1,
                    maxWidth: "800px",
                    background: "var(--bg-panel)",
                    border: "1px solid var(--nav-border)",
                    borderRadius: "20px",
                    padding: "32px",
                    boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.05)",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {/* Subtle background glow based on entry color */}
                <div style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "150px",
                    height: "150px",
                    background: `radial-gradient(circle, ${item.color}15 0%, transparent 70%)`,
                    borderRadius: "50%",
                    pointerEvents: "none"
                }} />

                <h3 className={display.className} style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "var(--ink-primary)",
                    marginBottom: "12px",
                    lineHeight: 1.2
                }}>
                    {item.title}
                </h3>

                <p style={{
                    fontSize: "15px",
                    color: "var(--ink-secondary)",
                    lineHeight: 1.6,
                    marginBottom: "20px"
                }}>
                    {item.description}
                </p>

                <div style={{
                    background: "var(--bg-main)",
                    border: "1px solid var(--nav-border)",
                    borderRadius: "12px",
                    padding: "4px"
                }}>
                    <div style={{
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid var(--nav-border)"
                    }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--ink-secondary)" }}>
                            Improvements
                        </span>
                    </div>
                    <div style={{ padding: "16px" }}>
                        <ul style={{
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        }}>
                            {item.features.map((feat, i) => (
                                <li key={i} style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "10px",
                                    fontSize: "14px",
                                    color: "var(--ink-primary)",
                                    lineHeight: 1.5
                                }}>
                                    <div style={{
                                        marginTop: "6px",
                                        width: "4px",
                                        height: "4px",
                                        borderRadius: "50%",
                                        background: item.color,
                                        flexShrink: 0
                                    }} />
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {item.link && (
                    <Link href={item.link} target={item.link.startsWith("http") ? "_blank" : undefined} style={{ textDecoration: 'none', display: 'inline-block', marginTop: '24px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: item.color,
                            transition: 'all 0.2s ease',
                        }}
                            onMouseOver={(e) => Object.assign(e.currentTarget.style, { opacity: 0.8, gap: '8px' })}
                            onMouseOut={(e) => Object.assign(e.currentTarget.style, { opacity: 1, gap: '6px' })}
                        >
                            {item.linkLabel || "Explore Feature"} <span>→</span>
                        </div>
                    </Link>
                )}
            </motion.div>
        </div>
    );
};

export default function ChangelogTimeline() {
    return (
        <div style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "40px 20px"
        }} className={body.className}>

            <div style={{ textAlign: "center", marginBottom: "64px" }}>
                <h2
                    className={display.className}
                    style={{ fontSize: "36px", color: "var(--ink-primary)", marginBottom: "16px" }}
                >
                    Evolution of ConU Planner
                </h2>
                <p
                    style={{ fontSize: "16px", color: "var(--ink-secondary)", maxWidth: "500px", margin: "0 auto" }}
                >
                    A continuous journey to build the ultimate academic toolkit. See how the platform has grown to empower students.
                </p>
            </div>

            <div className="changelog-container" style={{ position: "relative" }}>
                {changelogData.map((item, index) => (
                    <TimelineItem key={index} item={item} index={index} />
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media (max-width: 768px) {
          .timeline-date-col {
            display: none !important;
          }
        }
      `}} />
        </div>
    );
}
