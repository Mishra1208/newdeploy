"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useRef } from "react";

export default function TiltCard({ children, className }) {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    function onMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;

        // Rotate X is based on Y position (tilt up/down)
        // Rotate Y is based on X position (tilt left/right)
        x.set(xPct);
        y.set(yPct);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

    // Shine effect moving opposite to mouse
    const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
    const shineY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{
                perspective: 1000,
                transformStyle: "preserve-3d",
                rotateX,
                rotateY,
            }}
            className={className}
        >
            <div style={{ transform: "translateZ(20px)" }}>
                {children}
            </div>

            {/* 3D Reflection/Shine overlay */}
            <motion.div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(125deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
                    opacity: useTransform(mouseX, [-0.5, 0.5], [0, 0.3]), // Only show when interacting
                    backgroundPositionX: shineX,
                    backgroundPositionY: shineY,
                    pointerEvents: "none",
                    mixBlendMode: "overlay",
                    zIndex: 10
                }}
            />
        </motion.div>
    );
}
