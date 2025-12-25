import React from "react";
import { Space_Grotesk } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });

const MarqueeItem = ({ text }) => (
    <span
        className={display.className}
        style={{
            display: "inline-block",
            margin: "0 40px",
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--ink)",
            opacity: 0.4,
            whiteSpace: "nowrap",
        }}
    >
        {text}
    </span>
);

export default function TrustedMarquee() {
    const departments = [
        "Gina Cody School of Engineering",
        "John Molson School of Business",
        "Faculty of Arts & Science",
        "Bioinformatics",
        "Software Engineering Society",
        "Computer Science & Software Engineering",
    ];

    return (
        <div style={{
            width: "100%",
            overflow: "hidden",
            padding: "40px 0",
            position: "relative",
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.05))" // subtle depth
        }}>

            {/* Label */}
            <div style={{
                textAlign: "center",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: "var(--ink-dim)",
                opacity: 0.6,
                marginBottom: 24,
                textTransform: "uppercase"
            }}>
                Trusted by students from
            </div>

            {/* Marquee Container */}
            <div style={{
                display: "flex",
                width: "fit-content",
                animation: "scroll 40s linear infinite"
            }}>
                {/* Double the content for seamless loop */}
                {[...departments, ...departments].map((dept, i) => (
                    <MarqueeItem key={i} text={dept} />
                ))}
            </div>

            {/* Fade Gradients */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100px",
                height: "100%",
                background: "linear-gradient(to right, var(--bg), transparent)",
                zIndex: 2,
                pointerEvents: "none"
            }} />
            <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100px",
                height: "100%",
                background: "linear-gradient(to left, var(--bg), transparent)",
                zIndex: 2,
                pointerEvents: "none"
            }} />

            <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
}
