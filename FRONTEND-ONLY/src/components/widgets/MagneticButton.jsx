"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

export default function MagneticButton({ children, className, onClick, style }) {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const mouseX = useSpring(x, springConfig);
    const mouseY = useSpring(y, springConfig);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        // Move button 40% of the distance to the mouse (magnetic pull)
        x.set(distanceX * 0.4);
        y.set(distanceY * 0.4);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            className={className}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                x: mouseX,
                y: mouseY,
                ...style
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    );
}
