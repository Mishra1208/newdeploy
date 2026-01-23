"use client";

import React, { useRef } from "react";
import { useInView } from "framer-motion";

// --- Utility Wrapper ---
export const TriggerOnScroll = ({ children }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    return (
        <div ref={ref} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isInView ? children : null}
        </div>
    );
};

// --- 1. Tech Tree: Glowing Constellation ---
export const TreeMockup = () => (
    <TriggerOnScroll>
        <div style={{ position: 'relative', width: 200, height: 200 }}>
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7a1d2f" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#7a1d2f" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Connecting Lines */}
                <g stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" filter="url(#glow)">
                    <path d="M100 180 L 100 120" className="draw-path" style={{ strokeDasharray: 100, strokeDashoffset: 100, animation: 'draw 1s ease forwards 0.2s' }} />
                    <path d="M100 120 L 50 70" className="draw-path" style={{ strokeDasharray: 100, strokeDashoffset: 100, animation: 'draw 1s ease forwards 0.8s' }} />
                    <path d="M100 120 L 150 70" className="draw-path" style={{ strokeDasharray: 100, strokeDashoffset: 100, animation: 'draw 1s ease forwards 0.8s' }} />
                    <path d="M50 70 L 30 20" className="draw-path" style={{ strokeDasharray: 100, strokeDashoffset: 100, animation: 'draw 1s ease forwards 1.4s' }} />
                    <path d="M150 70 L 170 20" className="draw-path" style={{ strokeDasharray: 100, strokeDashoffset: 100, animation: 'draw 1s ease forwards 1.4s' }} />
                </g>

                {/* Nodes */}
                {[
                    { cx: 100, cy: 180, delay: '0s' },
                    { cx: 100, cy: 120, delay: '0.6s' },
                    { cx: 50, cy: 70, delay: '1.2s' },
                    { cx: 150, cy: 70, delay: '1.2s' },
                    { cx: 30, cy: 20, delay: '1.8s' },
                    { cx: 170, cy: 20, delay: '1.8s' }
                ].map((node, i) => (
                    <circle
                        key={i}
                        cx={node.cx}
                        cy={node.cy}
                        r="6"
                        fill="#7a1d2f"
                        style={{
                            opacity: 0,
                            animation: `popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${node.delay}`,
                            filter: 'drop-shadow(0 0 8px rgba(122, 29, 47, 0.6))'
                        }}
                    />
                ))}
            </svg>
            <style jsx>{`
                @keyframes draw { to { stroke-dashoffset: 0; } }
                @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    </TriggerOnScroll>
);

// --- 2. Planner: Glass Gantt Chart ---
export const PlannerMockup = () => (
    <TriggerOnScroll>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            width: 220,
            perspective: '1000px',
            transform: 'rotateY(-10deg) rotateX(5deg)'
        }}>
            {[
                { w: '70%', color: 'rgba(29, 29, 31, 0.8)', delay: 0 },
                { w: '40%', color: 'rgba(29, 29, 31, 0.4)', delay: 0.2 },
                { w: '90%', color: 'rgba(29, 29, 31, 0.6)', delay: 0.4 },
                { w: '60%', color: 'rgba(29, 29, 31, 0.8)', delay: 0.6 },
            ].map((bar, i) => (
                <div key={i} style={{
                    height: 24,
                    width: bar.w,
                    background: bar.color,
                    borderRadius: 6,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    transformOrigin: 'left',
                    opacity: 0,
                    animation: `slideRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards ${bar.delay}s`,
                    backdropFilter: 'blur(4px)'
                }} />
            ))}
            <style jsx>{`
                @keyframes slideRight { from { width: 0; opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    </TriggerOnScroll>
);

// --- 3. GPA: Modern Ring Gauge ---
export const GPAMockup = () => (
    <TriggerOnScroll>
        <div style={{ position: 'relative', width: 160, height: 160 }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle cx="80" cy="80" r="70" fill="none" stroke="#eee" strokeWidth="12" strokeLinecap="round" />
                {/* Active Ring */}
                <circle
                    cx="80" cy="80" r="70"
                    fill="none"
                    stroke="#db9e1e"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="440"
                    strokeDashoffset="440"
                    transform="rotate(-90 80 80)"
                    style={{ animation: 'fillGauge 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 0.2s' }}
                />
            </svg>
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>4.0</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#db9e1e', letterSpacing: '0.1em' }}>GPA</span>
            </div>
            <style jsx>{`
                @keyframes fillGauge { to { stroke-dashoffset: 40; } }
            `}</style>
        </div>
    </TriggerOnScroll>
);

// --- 4. Catalog: 3D Stack (Replaces Books) ---
export const CatalogMockup = () => (
    <TriggerOnScroll>
        <div style={{ position: 'relative', width: 140, height: 160, perspective: 800 }}>
            {[0, 1, 2].map((i) => (
                <div key={i} style={{
                    position: 'absolute',
                    top: i * -15,
                    left: i * 10,
                    width: '100%',
                    height: '100%',
                    background: i === 2 ? '#7a1d2f' : '#fff',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 12,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    zIndex: i,
                    transform: `translateZ(${i * 20}px) rotateY(-5deg)`,
                    opacity: 0,
                    animation: `stackUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards ${i * 0.2}s`
                }}>
                    {/* Abstract lines on card */}
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ height: 8, width: '60%', background: i === 2 ? 'rgba(255,255,255,0.3)' : '#eee', borderRadius: 4 }} />
                        <div style={{ height: 8, width: '80%', background: i === 2 ? 'rgba(255,255,255,0.3)' : '#eee', borderRadius: 4 }} />
                    </div>
                </div>
            ))}
            <style jsx>{`
                @keyframes stackUp { from { transform: translateY(50px) scale(0.9); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
            `}</style>
        </div>
    </TriggerOnScroll>
);

// --- 5. Seat Finder: Radar Pulse ---
export const SeatMockup = () => (
    <TriggerOnScroll>
        <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Core */}
            <div style={{
                width: 24,
                height: 24,
                background: '#db9e1e',
                borderRadius: '50%',
                zIndex: 10,
                boxShadow: '0 0 20px rgba(219, 158, 30, 0.5)'
            }} />

            {/* Ripples */}
            {[0, 1, 2].map((i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    border: '2px solid #db9e1e',
                    borderRadius: '50%',
                    opacity: 0,
                    animation: `ripple 2.5s cubic-bezier(0, 0.2, 0.8, 1) infinite ${i * 0.6}s`
                }} />
            ))}
            <style jsx>{`
                @keyframes ripple { from { transform: scale(0.2); opacity: 0.8; } to { transform: scale(1); opacity: 0; } }
            `}</style>
        </div>
    </TriggerOnScroll>
);
