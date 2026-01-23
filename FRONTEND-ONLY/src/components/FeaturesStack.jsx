"use client";

import ScrollStack, { ScrollStackItem } from "./ScrollStack/ScrollStack";
import TreeMockup from "../app/pages/tree/TreeMockup";
import GPAMockup from "../app/pages/gpa/GPAMockup";
import PlannerMockup from "../app/pages/planner/PlannerMockup";
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
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB', fontSize: '3rem' }}>
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
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB', fontSize: '3rem' }}>
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
        <div style={{ height: '600px', width: '100%', position: 'relative' }}>
            <ScrollStack
                itemDistance={50}
                itemScale={0.05}
                itemStackDistance={30}
                stackPosition="10%"
                scaleEndPosition="5%"
                baseScale={0.9}
                rotationAmount={0}
                blurAmount={0} // Clean premium look, no blur
            >
                {features.map((feat, i) => (
                    <ScrollStackItem key={i}>
                        <Link href={feat.link} style={{ display: 'flex', height: '100%', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #eee', background: feat.color }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    {feat.mockup}
                                </div>
                            </div>
                            <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'white' }}>
                                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: 700, marginBottom: '16px', color: feat.accent }}>
                                    {feat.title}
                                </h3>
                                <p style={{ fontSize: '18px', color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
                                    {feat.desc}
                                </p>
                                <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', color: feat.accent, fontWeight: 600, gap: '8px' }}>
                                    Explore Feature <span>→</span>
                                </div>
                            </div>
                        </Link>
                    </ScrollStackItem>
                ))}
            </ScrollStack>
        </div>
    );
}
