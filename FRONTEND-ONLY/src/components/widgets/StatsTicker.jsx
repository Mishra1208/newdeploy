"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

function Counter({ from = 0, to, duration = 2, suffix = "" }) {
    const nodeRef = useRef();
    const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
        const node = nodeRef.current;
        if (!node || !isInView) return;

        const controls = animate(from, to, {
            duration,
            ease: "easeOut",
            onUpdate(value) {
                node.textContent = Math.round(value).toLocaleString() + suffix;
            },
        });

        return () => controls.stop();
    }, [from, to, duration, isInView, suffix]);

    return <span ref={nodeRef} />;
}

export default function StatsTicker({ displayClass }) {
    const stats = [
        { label: "Courses Tracked", value: 25000, suffix: "+" },
        { label: "Community Members", value: 3500, suffix: "" },
        { label: "Price", value: 0, suffix: "$", prefix: "" }, // Special case for "Free"
    ];

    return (
        <div style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 40,
            margin: "60px auto",
            maxWidth: 1000,
            padding: "40px",
            background: "var(--panel)",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.4)",
            backdropFilter: "blur(12px)",
            boxShadow: "var(--shadow-lg)"
        }}>
            {stats.map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                    <div className={displayClass} style={{
                        fontSize: 48,
                        fontWeight: 800,
                        background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: 8
                    }}>
                        {s.value === 0 && s.suffix === "$" ? "Free" : (
                            <Counter to={s.value} suffix={s.suffix} />
                        )}
                    </div>
                    <div style={{ color: "var(--ink-dim)", fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {s.label}
                    </div>
                </div>
            ))}
        </div>
    );
}
