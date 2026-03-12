"use client";
import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function OriginScribble({ displayClass }) {
    const trackRef = useRef(null);
    const stickyRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {

            // 1. Setup Strokes
            gsap.utils.toArray('.scribble-path').forEach(path => {
                try {
                    // Ensure strokeDasharray/offset are set via JS for animation
                    // But colors are handled by CSS now
                    const len = path.getTotalLength();
                    path.style.strokeDasharray = len;
                    path.style.strokeDashoffset = len;
                } catch (e) { /* ignore */ }
            });

            // 2. Initialize State
            gsap.set('.scribble-chunk', { autoAlpha: 0, y: 30 });

            const targets = {
                c1: '.chunk-1',
                c2: '.chunk-2',
                c3: '.chunk-3',
                c4: '.chunk-4',
                p1: '.path-1',
                p2: '.path-2',
                p3: '.path-3',
                p4: '.path-4',
                p5: '.path-5',
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: trackRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                }
            });

            // === SEQUENCE === (3 Steps)

            tl.addLabel("start", 0);

            // 1. 15 TABS
            tl.to(targets.c1, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power2.out' }, "start")
                .to(targets.p1, { strokeDashoffset: 0, duration: 0.2, ease: 'none' }, ">")
                .to(targets.c1, { autoAlpha: 0, y: -30, filter: 'blur(5px)', duration: 0.1 }, ">+=0.2");

            // 2. NIGHTMARE
            tl.to(targets.c2, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power2.out' }, ">")
                .to([targets.p2, targets.p3], { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, ">")
                .to(targets.c2, { autoAlpha: 0, y: -30, filter: 'blur(5px)', duration: 0.1 }, ">+=0.2");

            // 3. FIXED IT + ARROW
            tl.to(targets.c3, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power2.out' }, ">")
                .to(targets.p4, { strokeDashoffset: 0, duration: 0.2, ease: 'none' }, ">")
                .to(targets.c4, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'back.out' }, ">")
                .to(targets.p5, { strokeDashoffset: 0, duration: 0.2, ease: 'power2.inOut' }, ">");

        }, trackRef);

        return () => ctx.revert();
    }, []);

    const s = {
        track: {
            position: 'relative',
            width: '100%',
            height: '300vh',
        },
        stickyWrapper: {
            position: 'sticky',
            top: 0,
            width: '100%',
            height: 'auto',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflow: 'hidden',
            paddingTop: '4vh',
            paddingBottom: '5vh',
        },
        titleWrapper: {
            textAlign: 'center',
            marginBottom: '40px',
            zIndex: 10,
        },
        title: {
            fontSize: '4.5rem',
            lineHeight: 1.2,
            marginBottom: '10px',
            paddingBottom: '10px'
        },
        subtitle: {
            fontSize: '1.2rem', opacity: 0.6, fontWeight: 500, color: 'var(--ink-secondary)',
        },
        stackContainer: {
            position: 'relative',
            width: '100%',
            maxWidth: '700px',
            height: '210px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        // Removed inline color
        chunk: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            textAlign: 'center',
            fontSize: "2.2rem",
            lineHeight: "1.5",
            fontWeight: 600,
            opacity: 0,
            transform: 'translateY(30px)',
            willChange: 'transform, opacity'
        },
        highlightSpan: {
            position: 'relative',
            display: 'inline-block',
            zIndex: 1,
            whiteSpace: 'nowrap'
        },
        svgOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible',
            zIndex: -1
        }
    };

    return (
        <section ref={trackRef} className="origin-track" style={s.track}>
            <div ref={stickyRef} className="origin-sticky" style={s.stickyWrapper}>

                <div style={s.titleWrapper}>
                    <h2 className={`${displayClass} origin-title-gradient`} style={s.title}>
                        The Origin Story
                    </h2>
                    <div style={s.subtitle}>
                        From frustration to functional.
                    </div>
                </div>

                <div style={s.stackContainer}>
                    {/* 1. 15 TABS */}
                    <div className="scribble-chunk chunk-1" style={s.chunk}>
                        We built this because we were tired of having
                        <br />
                        <span style={s.highlightSpan}>
                            15 tabs open
                            <svg style={{ ...s.svgOverlay, top: '90%', transform: 'scale(1.1)' }} viewBox="0 0 200 20" preserveAspectRatio="none">
                                <path className="scribble-path path-1" d="M5,10 C50,12 150,8 195,10 M190,12 C140,14 60,8 10,12" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>{' '}
                        just to pick a schedule.
                    </div>

                    {/* 2. NIGHTMARE */}
                    <div className="scribble-chunk chunk-2" style={s.chunk}>
                        Between{' '}
                        <span style={s.highlightSpan}>
                            crash-prone SIS
                            <svg style={{ ...s.svgOverlay, top: '85%', left: '0%', transform: 'scale(1.1)' }} viewBox="0 0 200 30" preserveAspectRatio="none">
                                <path className="scribble-path path-2" d="M5,15 Q15,5 25,15 T45,15 T65,15 T85,15 T105,15 T125,15 T145,15 T165,15 T185,15" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>{' '}
                        and old threads...<br />it was a{' '}
                        <span style={{ ...s.highlightSpan, padding: '0 10px' }}>
                            nightmare
                            <svg style={{ ...s.svgOverlay, top: '-25%', left: '-15%', width: '130%', height: '150%' }} viewBox="0 0 120 70" preserveAspectRatio="none">
                                <path className="scribble-path path-3" d="M30,35 C20,10 50,5 80,10 C110,15 115,40 100,55 C80,70 40,65 25,50 C15,40 25,20 50,15" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>.
                    </div>

                    {/* 3. FIXED IT */}
                    <div className="scribble-chunk chunk-3" style={s.chunk}>
                        <span className="fixed-it-text" style={{ ...s.highlightSpan, fontWeight: 700 }}>
                            <span style={{ position: 'relative', zIndex: 2 }}>So we fixed it.</span>
                            <svg style={{ ...s.svgOverlay, top: '-15%', left: '-8%', width: '116%', height: '130%', zIndex: 0 }} viewBox="0 0 160 60" preserveAspectRatio="none">
                                <path className="scribble-path path-4" d="M5,10 L155,5 L150,55 L5,50 L8,12" fill="rgba(219, 158, 30, 0.15)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>{' '}
                        <br />
                        For ourselves, and now for everyone else.
                    </div>
                </div>

                {/* Footer Arrow (Chunk 4) */}
                <div className="scribble-chunk chunk-4" style={{
                    marginTop: '-20px',
                    height: '100px',
                    textAlign: 'center',
                    opacity: 0,
                    transform: 'translateY(10px)'
                }}>
                    <svg width="60" height="80" viewBox="0 0 60 80" style={{ transform: 'rotate(10deg)', margin: '0 auto', display: 'block' }}>
                        <path className="scribble-path path-5" d="M25,5 Q45,35 30,70 M30,70 L15,55 M30,70 L50,60" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="caffeine-pill" style={{
                        display: 'inline-block',
                        background: 'rgba(139, 92, 246, 0.15)',
                        color: '#a78bfa',
                        padding: '12px 30px',
                        borderRadius: '40px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        marginTop: '10px',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                        1,200+ hours of caffeine & code
                    </div>
                </div>

            </div>

            <style jsx>{`
                /* Chunk Colors */
                .scribble-chunk {
                    color: var(--ink-secondary);
                }
                .fixed-it-text {
                    color: #912338;
                }
                
                /* SVG Strokes - Default (Light Mode) */
                .path-1 { stroke: #912338; }
                .path-2 { stroke: rgba(145, 35, 56, 0.4); }
                .path-3 { stroke: #db9e1e; }
                .path-4 { stroke: #db9e1e; }
                .path-5 { stroke: #912338; }

                /* Title Gradient - Light */
                .origin-title-gradient {
                    background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                /* --- DARK MODE OVERRIDES --- */
                :global([data-theme="dark"]) .origin-title-gradient {
                    background: linear-gradient(135deg, #ffffff 0%, #db9e1e 50%, #ff6b6b 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                :global([data-theme="dark"]) .scribble-chunk {
                   color: #cbd5e1; /* Silver Gray */
                }

                :global([data-theme="dark"]) .fixed-it-text {
                   color: #db9e1e; /* Pure Gold focus */
                }

                :global([data-theme="dark"]) .path-1 { stroke: #ff6b6b; stroke-width: 4; }
                :global([data-theme="dark"]) .path-2 { stroke: rgba(255, 107, 107, 0.4); stroke-width: 4; }
                :global([data-theme="dark"]) .path-3 { stroke: #fcd34d; stroke-width: 4; } 
                :global([data-theme="dark"]) .path-4 { stroke: #fcd34d; stroke-width: 4; }
                :global([data-theme="dark"]) .path-5 { stroke: #ff6b6b; stroke-width: 4; }

                 @media (max-width: 768px) {
                    .scribble-chunk {
                        font-size: 1.6rem !important;
                        padding: 10px !important;
                    }
                }
            `}</style>
        </section>
    );
}
