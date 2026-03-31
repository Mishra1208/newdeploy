"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";

const space = Space_Grotesk({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default function MorphLabPage() {
  const [isDark, setIsDark] = useState(false);

  // Track the window scroll since the container determines page height
  const { scrollYProgress } = useScroll();

  // Background scales as we scroll down (the zoom effect!)
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.8]);
  
  // Title moves up and fades out
  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Sequential Reveal of feature cards
  const card1Opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.45, 0.55], [0, 1, 1, 0]);
  const card1Y = useTransform(scrollYProgress, [0.15, 0.25, 0.45, 0.55], [100, 0, 0, -100]);

  const card2Opacity = useTransform(scrollYProgress, [0.45, 0.55, 0.75, 0.85], [0, 1, 1, 0]);
  const card2Y = useTransform(scrollYProgress, [0.45, 0.55, 0.75, 0.85], [100, 0, 0, -100]);

  const card3Opacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 1]);
  const card3Y = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [100, 0, 0, 0]);

  // Escalator Parallax mapped mathematically to the global scroll
  // The page is 500vh total. Viewport is 100vh. Scrollable = 400vh.
  // Escalator enters viewport when scroll is at 300vh (3/4 = 0.75) and finishes at 400vh (1.0).
  const fwY = useTransform(scrollYProgress, [0.75, 1], [0, 750]);
  const fwX = useTransform(scrollYProgress, [0.75, 1], [0, -500]);
  const fmY = useTransform(scrollYProgress, [0.75, 1], [0, 250]);
  const fmX = useTransform(scrollYProgress, [0.75, 1], [0, 500]);
  const swY = useTransform(scrollYProgress, [0.75, 1], [0, 250]);
  const swX = useTransform(scrollYProgress, [0.75, 1], [0, -500]);
  const escY = useTransform(scrollYProgress, [0.75, 1], [0, 500]);
  const smY = useTransform(scrollYProgress, [0.75, 1], [0, 350]);
  const smX = useTransform(scrollYProgress, [0.75, 1], [0, -250]);

  // Mounted guard to prevent hydration mismatch with Client/Server themes
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={`transition-colors duration-1000 ${isDark ? "bg-[#08090A] text-white" : "bg-[#F3F4F6] text-black"}`}>
      
      {/* 400vh Scroll Container - this drives the main story progress */}
      <div className="relative w-full h-[400vh]">
        
        {/* STICKY BACKGROUND LAYER */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center z-0 bg-black">
          <motion.div 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ scale: bgScale }} 
            className="relative w-full h-full"
          >
            <img 
              src="/hall day.jpg" 
              alt="Concordia Hall Day" 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isDark ? "opacity-0" : "opacity-100"}`}
            />
            <img 
              src="/hall night.jpg" 
              alt="Concordia Hall Night" 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isDark ? "opacity-100" : "opacity-0"}`}
            />
            {/* Clean Vignette Overlay for Text Contrast */}
            <div className={`absolute inset-0 pointer-events-none transition-colors duration-1000 ${isDark ? "bg-black/60" : "bg-black/20"} `} />
          </motion.div>
        </div>

        {/* NAVIGATION & THEME TOGGLE */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none"
        >
          <Link href="/" className={`text-2xl font-bold ${space.className} ${isDark ? "text-white" : "text-white"} pointer-events-auto`}>
            ConU<span className="text-yellow-500">Planner</span>
          </Link>
        </motion.nav>

        {/* FLOATING THEME TOGGLE */}
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          onClick={() => setIsDark(!isDark)}
          className="fixed bottom-10 right-10 z-50 px-6 py-3 rounded-full backdrop-blur-xl bg-white/20 border border-white/30 hover:bg-white/30 transition-all font-bold text-white shadow-2xl pointer-events-auto"
        >
          {isDark ? "🌙 Night Mode" : "☀️ Day Mode"}
        </motion.button>

        {/* FOREGROUND CONTENT LAYER */}
        {/* Hero Title */}
        <motion.div 
          style={{ y: titleY, opacity: titleOpacity }}
          className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1 className={`text-6xl md:text-9xl font-extrabold tracking-tighter text-center uppercase text-white drop-shadow-2xl ${space.className}`}>
              ConU<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"> Planner</span>
            </h1>
            <p className={`mt-6 text-xl tracking-widest text-white drop-shadow-xl uppercase ${inter.className}`}>
              Scroll down to explore
            </p>
          </motion.div>
        </motion.div>

        {/* SCROLL CARDS CONTAINER */}
        <div className="fixed top-0 left-0 w-full h-screen pointer-events-none flex items-center justify-center z-20">
          
          {/* Card 1: Seat Alerts */}
          <motion.div 
            style={{ opacity: card1Opacity, y: card1Y }}
            className={`absolute w-[90%] md:w-[600px] p-10 md:p-14 rounded-3xl backdrop-blur-2xl border ${isDark ? "bg-black/60 border-white/10 text-white" : "bg-white/70 border-white/40 text-black shadow-2xl"} pointer-events-auto`}
          >
            <div className="text-sm font-bold tracking-widest text-yellow-500 mb-4 uppercase">Feature 01</div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${space.className}`}>Smart Seat Alerts</h2>
            <p className={`text-lg leading-relaxed ${inter.className} ${isDark ? "text-gray-300" : "text-gray-800"}`}>
              Never miss a spot in your required classes again. Our real-time notification engine monitors Concordia's student hub and alerts you the millisecond a waitlist opens up.
            </p>
          </motion.div>

          {/* Card 2: GPA Forecaster */}
          <motion.div 
            style={{ opacity: card2Opacity, y: card2Y }}
            className={`absolute w-[90%] md:w-[600px] p-10 md:p-14 rounded-3xl backdrop-blur-2xl border ${isDark ? "bg-black/60 border-white/10 text-white" : "bg-white/70 border-white/40 text-black shadow-2xl"} pointer-events-auto`}
          >
            <div className="text-sm font-bold tracking-widest text-orange-500 mb-4 uppercase">Feature 02</div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${space.className}`}>GPA Forecaster</h2>
            <p className={`text-lg leading-relaxed ${inter.className} ${isDark ? "text-gray-300" : "text-gray-800"}`}>
              Map out your academic future with our advanced grade prediction algorithms. See exactly what you need on your finals to secure that A+ and build a bulletproof graduation plan.
            </p>
          </motion.div>

          {/* Card 3: Professor Compass */}
          <motion.div 
            style={{ opacity: card3Opacity, y: card3Y }}
            className={`absolute w-[90%] md:w-[600px] p-10 md:p-14 rounded-3xl backdrop-blur-2xl border ${isDark ? "bg-black/60 border-white/10 text-white" : "bg-white/70 border-white/40 text-black shadow-2xl"} pointer-events-auto`}
          >
            <div className="text-sm font-bold tracking-widest text-emerald-500 mb-4 uppercase">Feature 03</div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${space.className}`}>Professor Compass</h2>
            <p className={`text-lg leading-relaxed ${inter.className} ${isDark ? "text-gray-300" : "text-gray-800"}`}>
              Dive deep into historical grading trends and comprehensive student reviews. Choose your professors logically based on data, not just hearsay, and optimize your schedule for success.
            </p>
            <button className="mt-8 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-yellow-400 transition-colors shadow-lg">
              Access the Portal
            </button>
          </motion.div>

        </div>
      </div>

      {/* NEW ESCALATOR PARALLAX SECTION */}
      <section 
        className={`relative h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000 z-30 ${isDark ? "bg-[#111116]" : "bg-[#f8f9fa]"}`}
      >
        <div className="absolute top-20 text-center z-50 text-emerald-500 drop-shadow-xl">
          <h2 className={`text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-4 ${space.className}`}>
            Always Moving Forward
          </h2>
          <p className={`text-xl font-medium tracking-wide ${inter.className}`}>
            We keep your academic journey on track.
          </p>
        </div>

        {/* We use framer-motion x and y to map the scroll values perfectly to the vector graphics! */}
        
        {/* First Woman */}
        <motion.img 
          style={{ x: fwX, y: fwY }}
          className="absolute inset-0 w-full h-full object-cover z-50 pointer-events-none drop-shadow-2xl"
          src="/woman01.svg?v=1" 
          alt="First woman" 
        />
        
        {/* First Man */}
        <motion.img 
          style={{ x: fmX, y: fmY }}
          className="absolute inset-0 w-full h-full object-cover z-40 pointer-events-none drop-shadow-2xl"
          src="/man01.svg?v=1" 
          alt="First man" 
        />
        
        {/* Second Woman */}
        <motion.img 
          style={{ x: swX, y: swY }}
          className="absolute inset-0 w-full h-full object-cover z-30 pointer-events-none drop-shadow-2xl"
          src="/woman02.svg?v=1" 
          alt="Second woman" 
        />
        
        {/* Escalator Base */}
        <motion.img 
          style={{ y: escY }}
          className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none"
          src="/escalator.svg?v=1" 
          alt="Escalator" 
        />
        
        {/* Second Man */}
        <motion.img 
          style={{ x: smX, y: smY }}
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none drop-shadow-2xl"
          src="/man02.svg?v=1" 
          alt="Second man" 
        />

        {/* Subtle gradient overlay at bottom to transition to matching theme */}
        <div className={`absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t to-transparent z-50 ${isDark ? "from-[#08090A]" : "from-[#F3F4F6]"}`}></div>
      </section>

    </div>
  );
}
