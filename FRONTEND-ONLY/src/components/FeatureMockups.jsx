"use client";

import React, { useRef } from "react";
import { useInView } from "framer-motion";
import styles from "../app/home.module.css";

// --- Mockup Components (Scroll Triggered) ---

export const TriggerOnScroll = ({ children }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Only render children (animations play) when in view
    return <div ref={ref} style={{ width: '100%', height: '100%' }}>{isInView ? children : null}</div>;
};

export const TreeMockup = () => (
    <TriggerOnScroll>
        <div className={styles.treeGraph}>
            {/* Explicit delays for sequential "growing" effect */}
            <div className={styles.treeNode} style={{ top: "50%", left: "10%", animationDelay: "0ms" }} />
            <div className={styles.treeLine} style={{ top: "50%", left: "10%", width: "30%", transform: "rotate(0deg)", animationDelay: "100ms" }} />

            <div className={styles.treeNode} style={{ top: "30%", left: "40%", animationDelay: "300ms" }} />
            <div className={styles.treeLine} style={{ top: "30%", left: "40%", width: "20%", transform: "rotate(20deg)", animationDelay: "400ms" }} />

            <div className={styles.treeNode} style={{ top: "70%", left: "40%", animationDelay: "300ms" }} />
            <div className={styles.treeLine} style={{ top: "70%", left: "40%", width: "20%", transform: "rotate(-20deg)", animationDelay: "400ms" }} />

            <div className={styles.treeNode} style={{ top: "40%", left: "60%", animationDelay: "600ms" }} />
            <div className={styles.treeNode} style={{ top: "20%", left: "60%", animationDelay: "700ms" }} />
        </div>
    </TriggerOnScroll>
);

export const PlannerMockup = () => (
    <TriggerOnScroll>
        <div className={styles.plannerGrid}>
            {/* Columns with staggered cascade */}
            <div style={{ display: 'grid', gap: 4 }}>
                <div className={styles.plannerBlock} style={{ background: 'rgba(167, 139, 250, 0.2)', height: 40, animationDelay: "0ms" }} />
                <div className={styles.plannerBlock} style={{ animationDelay: "100ms" }} />
            </div>
            <div style={{ display: 'grid', gap: 4, paddingTop: 20 }}>
                <div className={styles.plannerBlock} style={{ animationDelay: "200ms" }} />
                <div className={styles.plannerBlock} style={{ height: 50, animationDelay: "300ms" }} />
            </div>
            <div style={{ display: 'grid', gap: 4 }}>
                <div className={styles.plannerBlock} style={{ background: 'rgba(236, 72, 153, 0.2)', animationDelay: "400ms" }} />
            </div>
            <div style={{ display: 'grid', gap: 4, paddingTop: 10 }}>
                <div className={styles.plannerBlock} style={{ animationDelay: "500ms" }} />
            </div>
            <div style={{ display: 'grid', gap: 4 }}>
                <div className={styles.plannerBlock} style={{ background: 'rgba(167, 139, 250, 0.2)', animationDelay: "600ms" }} />
                <div className={styles.plannerBlock} style={{ animationDelay: "700ms" }} />
            </div>
        </div>
    </TriggerOnScroll>
);

export const GPAMockup = () => (
    <TriggerOnScroll>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div className={styles.gaugeContainer}>
                <div className={styles.gaugeArch} />
                <div className={styles.gaugeValue}>4.0</div>
            </div>
            <div style={{ fontSize: 12, opacity: 0.6, fontFamily: 'monospace' }}>DISTINCTION</div>
        </div>
    </TriggerOnScroll>
);
