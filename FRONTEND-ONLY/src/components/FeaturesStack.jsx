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
        accent: "var(--primary)" // Burgundy
    },
    {
        title: "Academic Standing",
        desc: "Weighted credit calculation with real-time GPA forecasting. Stay on top of your game.",
        mockup: <GPAMockup />,
        link: "/pages/gpa",
        color: "#fff",
        accent: "var(--secondary)" // Gold
    },
    {
        title: "Smart Sequence Planner",
        desc: "Build your multi-year sequence with automated prerequisite validation. No more spreadsheets.",
        mockup: <PlannerMockup />,
        link: "/pages/planner",
        color: "#fff",
        accent: "#7C3AED" // Vibrant Violet
    },
    {
        title: "Complete Course Catalog",
        desc: "Search instantly across all departments. Filter by credits, terms, and prerequisites.",
        mockup: <CatalogMockup />,
        link: "/pages/courses",
        color: "#fff",
        accent: "#7a1d2f" // Dark Burgundy
    },
    {
        title: "Seat Finder",
        desc: "Never miss a class. Real-time alerts when seats open up in full courses.",
        mockup: <SeatMockup />,
        link: "/pages/seat-finder",
        color: "#fff",
        accent: "#db9e1e" // Gold
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
                                background: `linear-gradient(135deg, ${feat.accent}12 0%, #FAFAFA 100%)`, // Subtle tint of accent
                                borderRight: '1px solid rgba(0,0,0,0.04)',
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

                            {/* Content Side (Clean White) */}
                            <div style={{
                                padding: '48px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                background: 'white'
                            }}>
                                <h3 style={{
                                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                                    fontSize: '32px', // More refined size
                                    fontWeight: 700,
                                    marginBottom: '12px',
                                    letterSpacing: '-0.02em',
                                    color: '#1a1a1a',
                                    lineHeight: 1.15
                                }}>
                                    {feat.title}
                                </h3>
                                <p style={{
                                    fontSize: '16px', // Sleeker text
                                    color: '#666',
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
