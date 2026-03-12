"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import styles from "./feature-network.module.css";
import { Outfit } from "next/font/google";

const display = Outfit({ subsets: ["latin"], weight: ["700", "800"] });

/* --- Reusable Animated Beam (SVG) --- */
function AnimatedBeam({
    containerRef,
    fromRef,
    toRef,
    curvature = 0,
    reverse = false,
}) {
    const [d, setD] = useState("");
    const [size, setSize] = useState({ w: 0, h: 0 });

    const compute = React.useCallback(() => {
        const c = containerRef?.current, a = fromRef?.current, b = toRef?.current;
        if (!c || !a || !b) return;
        const cb = c.getBoundingClientRect();
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();

        const ax = ar.left - cb.left + ar.width / 2;
        const ay = ar.top - cb.top + ar.height / 2;
        const bx = br.left - cb.left + br.width / 2;
        const by = br.top - cb.top + br.height / 2;

        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2 + curvature;

        setD(`M ${ax},${ay} Q ${mx},${my} ${bx},${by}`);
        setSize({ w: cb.width, h: cb.height });
    }, [containerRef, fromRef, toRef, curvature]);

    useEffect(() => {
        const on = () => compute();
        const ro = new ResizeObserver(on);
        if (containerRef?.current) ro.observe(containerRef.current);

        // Initial and periodic checks
        on();
        window.addEventListener("resize", on);
        window.addEventListener("scroll", on, true);
        const t = setInterval(on, 1000); // Failsafe check

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", on);
            window.removeEventListener("scroll", on, true);
            clearInterval(t);
        };
    }, [compute, containerRef]);

    return (
        <svg className={styles.beamSvg} width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
            <path d={d} className={styles.beamPathBase} />
            <path
                d={d}
                className={styles.beamPathActive}
                style={{ animationDirection: reverse ? "reverse" : "normal" }}
            />
        </svg>
    );
}

/* --- Feature Node --- */
const FeatureNode = React.forwardRef(({ title, desc, align = "left", delay = 0 }, ref) => {
    return (
        <motion.div
            ref={ref}
            className={styles.nodeWrapper}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
        >
            <div className={`${styles.nodeCard} ${align === "right" ? styles.alignRight : styles.alignLeft}`}>
                <h3 className={display.className}>{title}</h3>
                <p>{desc}</p>
            </div>
            <div className={styles.nodeDot} />
        </motion.div>
    );
});

FeatureNode.displayName = "FeatureNode";

export default function FeatureNetwork() {
    const containerRef = useRef(null);
    const hubRef = useRef(null);
    const refs = useRef(Array(6).fill(0).map(() => React.createRef()));
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

    const FEATURES = [
        { title: "Unified Intelligence", desc: "Reddit, RateMyProf, & Catalog data in one view." },
        { title: "Contextual Search", desc: "Understand prerequisites intelligently." },
        { title: "Live GPA Math", desc: "Forecast your standing instantly." },
        { title: "Peer-Driven Insights", desc: "Real-time consensus on difficulty." },
        { title: "Mobile-First Logic", desc: "Plan semesters on the go." },
        { title: "Future-Proof Tech", desc: "Sub-second search speeds." },
    ];

    return (
        <div ref={containerRef} className={styles.networkContainer}>

            {/* Background Ambience */}
            <div className={styles.ambientGlow} />

            <div className={styles.networkGrid}>

                {/* Left Column */}
                <div className={styles.column}>
                    {FEATURES.slice(0, 3).map((f, i) => (
                        <FeatureNode
                            key={i}
                            ref={refs.current[i]}
                            title={f.title}
                            desc={f.desc}
                            align="right"
                            delay={i * 0.1}
                        />
                    ))}
                </div>

                {/* Center Hub */}
                <div className={styles.centerColumn}>
                    <motion.div
                        ref={hubRef}
                        className={styles.hubCore}
                        style={{ y, rotate }}
                    >
                        <div className={styles.hubLogo}>
                            <img src="/brands/concordia.png" alt="ConU" />
                        </div>
                        <div className={styles.hubRing} />
                        <div className={styles.hubRingOuter} />
                    </motion.div>
                </div>

                {/* Right Column */}
                <div className={styles.column}>
                    {FEATURES.slice(3, 6).map((f, i) => (
                        <FeatureNode
                            key={i + 3}
                            ref={refs.current[i + 3]}
                            title={f.title}
                            desc={f.desc}
                            align="left"
                            delay={0.3 + (i * 0.1)}
                        />
                    ))}
                </div>
            </div>

            {/* Beams */}
            {refs.current.map((ref, i) => (
                <AnimatedBeam
                    key={i}
                    containerRef={containerRef}
                    fromRef={i < 3 ? ref : hubRef} // Left: Node -> Hub
                    toRef={i < 3 ? hubRef : ref}   // Right: Hub -> Node (Outward flow)
                    curvature={i % 2 === 0 ? 50 : -50}
                    reverse={i < 3} // Flow towards center for left side
                />
            ))}
        </div>
    );
}
