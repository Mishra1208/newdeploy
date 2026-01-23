"use client";

import ScrollStack, { ScrollStackItem } from "./ScrollStack/ScrollStack";
import { TreeMockup, GPAMockup, PlannerMockup } from "./FeatureMockups";
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
        accent: "#1d1d1f" // Tech Black
    },
    {
        title: "Complete Course Catalog",
        desc: "Search instantly across all departments. Filter by credits, terms, and prerequisites.",
        mockup: (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F7', fontSize: '8rem' }}>
                📚
            </div>
        ),
        link: "/pages/courses",
        color: "#fff",
        accent: "#7a1d2f" // Dark Burgundy
    },
    {
        title: "Seat Finder",
        desc: "Never miss a class. Real-time alerts when seats open up in full courses.",
        mockup: (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F7', fontSize: '8rem' }}>
                🪑
            </div>
        ),
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
                        <Link href={feat.link} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', height: '100%', width: '100%', textDecoration: 'none', color: 'inherit' }}>

                            {/* Visual Side (Premium Grey Background) */}
                            <div style={{
                                position: 'relative',
                                background: '#F5F5F7', // Apple Light Grey
                                borderRight: '1px solid rgba(0,0,0,0.05)',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '60px'
                            }}>
                                <div style={{ transform: 'scale(1.1)', transformOrigin: 'center' }}>
                                    {feat.mockup}
                                </div>
                            </div>

                            {/* Content Side (Clean White) */}
                            <div style={{
                                padding: '64px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                background: 'white'
                            }}>
                                <h3 style={{
                                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                                    fontSize: '42px',
                                    fontWeight: 700,
                                    marginBottom: '20px',
                                    letterSpacing: '-0.02em',
                                    color: feat.accent,
                                    lineHeight: 1.1
                                }}>
                                    {feat.title}
                                </h3>
                                <p style={{
                                    fontSize: '20px',
                                    color: '#555557', // Premium dark grey
                                    lineHeight: 1.5,
                                    maxWidth: '90%',
                                    fontWeight: 400
                                }}>
                                    {feat.desc}
                                </p>
                                <div style={{
                                    marginTop: '40px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: feat.accent
                                }}>
                                    <span style={{ borderBottom: `2px solid ${feat.accent}30` }}>Explore Feature</span>
                                    <span style={{ transition: 'transform 0.2s' }}>→</span>
                                </div>
                            </div>

                        </Link>
                    </ScrollStackItem>
                ))}
            </ScrollStack>
        </div>
    );
}
