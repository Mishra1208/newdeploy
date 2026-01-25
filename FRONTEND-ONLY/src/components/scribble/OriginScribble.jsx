"use client";
import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function OriginScribble({ displayClass }) {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const paths = gsap.utils.toArray('.scribble-path');

            paths.forEach((path) => {
                const length = path.getTotalLength();
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

                gsap.to(path, {
                    strokeDashoffset: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: path.closest('span'),
                        start: "top 75%", // Start earlier
                        end: "bottom 25%", // End much later to prolong drawing
                        scrub: 2, // Slower, smoother scrub
                    }
                });
            });

            // Arrow Animation
            const arrow = document.querySelector('.scribble-arrow path');
            if (arrow) {
                const length = arrow.getTotalLength();
                gsap.set(arrow, { strokeDasharray: length, strokeDashoffset: length });
                gsap.to(arrow, {
                    strokeDashoffset: 0,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: '.scribble-arrow',
                        start: "top 85%",
                        end: "top 55%", // Extended scroll duration
                        scrub: 1.5,     // Smoother scrubbing
                    }
                })
            }

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const s = {
        container: {
            position: 'relative',
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '40px 20px',
        },
        title: {
            fontSize: '4.5rem',
            marginBottom: '60px',
            lineHeight: 1.1,
            paddingBottom: '10px',
            position: 'relative',
            display: 'inline-block'
        },
        lead: {
            fontSize: "1.6rem", // Increased form 1.4
            lineHeight: "1.8",
            fontWeight: 500,
            color: 'var(--ink-secondary)',
            position: 'relative',
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
        <div ref={containerRef} style={s.container}>
            <h2 className={`${displayClass} origin-title-gradient`} style={s.title}>
                The Origin Story
            </h2>

            <p style={s.lead} ref={textRef}>
                We didn't build this to launch a startup. We built it because we were tired of having{' '}

                {/* 1. UNDERLINE */}
                <span style={s.highlightSpan}>
                    15 tabs open
                    <svg style={{ ...s.svgOverlay, top: '85%', transform: 'scale(1.1)' }} viewBox="0 0 200 20" preserveAspectRatio="none">
                        {/* Messy double underline */}
                        <path className="scribble-path" d="M5,10 C50,12 150,8 195,10 M190,12 C140,14 60,8 10,12" fill="none" stroke="#912338" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>{' '}

                just to pick a schedule.
                <br /><br />
                Between the{' '}

                {/* 2. ZIGZAG STRIKE */}
                <span style={s.highlightSpan}>
                    crash-prone SIS
                    <svg style={{ ...s.svgOverlay, top: '30%', transform: 'scale(1.3)' }} viewBox="0 0 200 30" preserveAspectRatio="none">
                        {/* Sharp messy zigzag */}
                        <path className="scribble-path" d="M0,15 L10,5 L20,25 L30,5 L40,25 L50,5 L60,25 L70,5 L80,25 L90,5 L100,25 L110,5 L120,25 L130,5 L140,25 L150,5 L160,25 L170,5 L180,25 L190,5 L200,15" fill="none" stroke="rgba(145, 35, 56, 0.4)" strokeWidth="3" strokeLinejoin="bevel" />
                    </svg>
                </span>,{' '}

                Reddit threads from 4 years ago, and RateMyProf reviews that didn't match... it was a{' '}

                {/* 3. MESSY CIRCLE */}
                <span style={{ ...s.highlightSpan, padding: '0 8px' }}>
                    nightmare
                    <svg style={{ ...s.svgOverlay, top: '-25%', left: '-15%', width: '130%', height: '150%' }} viewBox="0 0 120 70" preserveAspectRatio="none">
                        {/* Looping messy circle */}
                        <path className="scribble-path" d="M20,35 C20,10 50,5 80,10 C110,15 115,40 100,55 C80,70 40,65 25,50 C15,40 25,20 50,15" fill="none" stroke="#db9e1e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>.
                <br /><br />

                {/* 4. BOX HIGHLIGHT */}
                <span style={{ ...s.highlightSpan, fontWeight: 700, color: '#912338', marginTop: '20px' }}>
                    <span style={{ position: 'relative', zIndex: 2 }}>So we fixed it.</span>
                    <svg style={{ ...s.svgOverlay, top: '-15%', left: '-8%', width: '116%', height: '130%', zIndex: 0 }} viewBox="0 0 160 60" preserveAspectRatio="none">
                        {/* Rough messy box */}
                        <path className="scribble-path" d="M5,10 L155,5 L150,55 L5,50 L8,12" fill="rgba(219, 158, 30, 0.15)" stroke="#db9e1e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>{' '}
                For ourselves, and now for everyone else.
            </p>

            {/* 5. ARROW */}
            <div className="scribble-arrow" style={{ marginTop: '40px', position: 'relative', height: '80px' }}>
                <svg width="60" height="80" viewBox="0 0 60 80" style={{ transform: 'rotate(10deg)' }}>
                    {/* Sketchy Arrow */}
                    <path className="scribble-path" d="M25,5 Q45,35 30,70 M30,70 L15,55 M30,70 L50,60" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{
                    display: 'block',
                    background: 'rgba(145, 35, 56, 0.08)',
                    color: '#912338',
                    padding: '10px 24px',
                    borderRadius: '30px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    width: 'fit-content',
                    margin: '10px auto 0 '
                }}>
                    1,200+ hours of caffeine & code
                </span>
            </div>

            <style jsx>{`
                .origin-title-gradient {
                    background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                :global([data-theme="dark"]) .origin-title-gradient {
                    background: linear-gradient(135deg, #ffffff 0%, #a5a5a5 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </div>
    );
}
