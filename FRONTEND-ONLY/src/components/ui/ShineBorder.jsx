"use client";

import { motion } from "framer-motion";

export function ShineBorder({
  color = ["#C5A059", "#912338", "#C5A059"], // Concordia Gold & Burgundy
  duration = 8,
  borderWidth = 2,
  borderRadius = 32, // matches rounded-[2rem]
  children,
  className = "",
}) {
  const gradient = Array.isArray(color) 
    ? `conic-gradient(from 0deg, transparent 0%, transparent 20%, ${color[0]} 40%, ${color[1]} 60%, ${color[2]} 80%, transparent 100%)`
    : `conic-gradient(from 0deg, transparent 0%, transparent 30%, ${color} 65%, transparent 100%)`;

  return (
    <div 
      className={`relative ${className}`} 
      style={{ borderRadius: borderRadius, padding: borderWidth }}
    >
      {/* Animated Gradient Layer */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden" 
        style={{ borderRadius: borderRadius }}
      >
        <motion.div
           animate={{ rotate: [0, 360] }}
           transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 -ml-[150%] -mt-[150%] w-[300%] h-[300%] opacity-90 blur-[4px]"
           style={{
             background: gradient,
           }}
        />
      </div>
      
      {/* Content Layer with Inner Radius Background */}
      <div 
         className="relative z-10 w-full h-full bg-white flex flex-col"
         style={{
            borderRadius: borderRadius - borderWidth
         }}
      >
        {children}
      </div>
    </div>
  );
}
