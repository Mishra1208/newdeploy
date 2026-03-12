"use client";

import ScrollStack, { ScrollStackItem } from "./ScrollStack/ScrollStack";
import { TreeMockup, GPAMockup, PlannerMockup, CatalogMockup, SeatMockup } from "./FeatureMockups";
import Link from 'next/link';

const features = [
    {
        title: "Interactive Tech Tree",
        desc: "Visualize your entire degree prerequisites as a dynamic network graph. Spot bottlenecks and unlock paths instantly.",
        mockup: <TreeMockup />,
        link: "/pages/tree",
        color: "#fff",
        accent: "#06B6D4" // Cyan/Blue
    },
    {
        title: "Academic Standing",
        desc: "Weighted credit calculation with real-time GPA forecasting. Stay on top of your game.",
        mockup: <GPAMockup />,
        link: "/pages/gpa",
        color: "#fff",
        accent: "#10B981" // Emerald/Green
    },
    {
        title: "Smart Sequence Planner",
        desc: "Build your multi-year sequence with automated prerequisite validation. No more spreadsheets.",
        mockup: <PlannerMockup />,
        link: "/pages/planner",
        color: "#fff",
        accent: "#8B5CF6" // Violet/Purple
    },
    {
        title: "Complete Course Catalog",
        desc: "Search instantly across all departments. Filter by credits, terms, and prerequisites.",
        mockup: <CatalogMockup />,
        link: "/pages/courses",
        color: "#fff",
        accent: "#F472B6" // Pink/Rose
    },
    {
        title: "Seat Finder",
        desc: "Never miss a class. Real-time alerts when seats open up in full courses.",
        mockup: <SeatMockup />,
        link: "/pages/seat-finder",
        color: "#fff",
        accent: "#F59E0B" // Amber/Orange
    }
];

export default function FeaturesStack() {
    return (
        <div style={{ width: '100%', position: 'relative' }}>
            <ScrollStack
                useWindowScroll={true}
                itemDistance={80} // More breathing room
                itemScale={0.05}
                itemStackDistance={30}
                stackPosition="15%" // Show more of the top card
                baseScale={0.92} // Larger cards
            >
                {features.map((feat, i) => (
                    <ScrollStackItem key={i}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', height: '100%', width: '100%', color: 'inherit' }}>

                            {/* Visual Side (Dynamic Premium Gradient) */}
                            <div style={{
                                position: 'relative',
                                background: 'var(--bg-panel)', // Restored to clean background
                                borderRight: '1px solid var(--nav-border)',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '40px'
                            }}>
                                {/* Ambient Glow behind mockup */}
                                <div style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    background: `radial-gradient(circle at center, ${feat.accent}15 0%, transparent 70%)`,
                                    filter: 'blur(40px)',
                                    pointerEvents: 'none'
                                }} />

                                <div style={{ transform: 'scale(1.35)', transformOrigin: 'center', position: 'relative', zIndex: 2 }}>
                                    {feat.mockup}
                                </div>
                            </div>

                            {/* Content Side (Clean White via Variables) */}
                            <div style={{
                                padding: '48px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                background: 'var(--bg-panel)'
                            }}>
                                <h3 style={{
                                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                                    fontSize: '32px', // More refined size
                                    fontWeight: 700,
                                    marginBottom: '12px',
                                    letterSpacing: '-0.02em',
                                    color: 'var(--ink-primary)',
                                    lineHeight: 1.15
                                }}>
                                    {feat.title}
                                </h3>
                                <p style={{
                                    fontSize: '16px', // Sleeker text
                                    color: 'var(--ink-secondary)',
                                    lineHeight: 1.6,
                                    maxWidth: '92%',
                                    fontWeight: 500
                                }}>
                                    {feat.desc}
                                </p>
                                <Link href={feat.link} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        marginTop: '32px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 20px',
                                        background: '#f5f5f7',
                                        borderRadius: '100px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: feat.accent,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        border: `1px solid ${feat.accent}20`
                                    }}>
                                        <span>Explore Feature</span>
                                        <span style={{ fontSize: '1.1em' }}>→</span>
                                    </div>
                                </Link>
                            </div>

                        </div>
                    </ScrollStackItem>
                ))}
            </ScrollStack>
        </div>
    );
}
