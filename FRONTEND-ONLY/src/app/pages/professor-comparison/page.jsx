"use client";

import React from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { TrendingUp } from "lucide-react";

export default function ProfessorComparisonPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-black p-8 transition-colors duration-300 relative overflow-hidden">
            {/* Engineering Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.08]"
                style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 text-center flex flex-col items-center"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border bg-slate-200 border-slate-300 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-white/70">
                    <TrendingUp size={12} />
                    Coming Soon
                    <span className="ml-2 px-1 py-0.5 bg-blue-600 text-white rounded text-[10px] animate-pulse">New</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter text-slate-900 dark:text-white">
                    Professor <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Insights & Comparison</span>
                </h1>

                <p className="text-xl max-w-xl mx-auto mb-12 font-medium leading-relaxed text-slate-500 dark:text-gray-400">
                    We're engineering a powerful new way to view detailed ratings and compare academic performance Side-by-Side.
                </p>

                <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px]">
                    <DotLottieReact
                        src="https://lottie.host/dfc8109f-ca4c-4d1d-a345-46502eab68e5/e54wY9bcc7.lottie"
                        loop
                        autoplay
                    />
                </div>
            </motion.div>
        </div>
    );
}
