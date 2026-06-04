'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FacultySelection() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black p-8 md:p-12 lg:p-24 flex items-center justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-stone-300/30 dark:bg-stone-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/10 dark:bg-amber-600/10 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-5xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Degree <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-800 to-amber-600 dark:from-stone-200 dark:to-amber-400">Pathfinder</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16">
            Select your faculty to access a tailored course sequencing engine, graduation planner, and intelligent requirement tracker.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Gina Cody Card */}
          <Link href="/pages/degree-tracker/gina-cody">
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group h-full flex flex-col items-start text-left p-8 rounded-3xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl shadow-xl hover:shadow-stone-500/10 hover:border-stone-500/30 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50 dark:from-stone-900/40 dark:to-stone-900/10 flex items-center justify-center mb-6 border border-stone-200/50 dark:border-stone-700/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-stone-600 dark:text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Gina Cody School</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Engineering and Computer Science programs including Software, Mechanical, Aerospace, and Computation Arts.
              </p>
              <div className="mt-auto flex items-center text-sm font-semibold text-stone-600 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300">
                Launch Planner 
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          </Link>

          {/* JMSB Card */}
          <Link href="/pages/degree-tracker/jmsb">
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group h-full flex flex-col items-start text-left p-8 rounded-3xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl shadow-xl hover:shadow-amber-500/10 hover:border-amber-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-amber-100/50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-amber-200/50 dark:border-amber-800/50">
                New
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/10 flex items-center justify-center mb-6 border border-amber-200/50 dark:border-amber-700/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">John Molson School</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Business programs including Accountancy, Finance, Management, Marketing, and BTM.
              </p>
              <div className="mt-auto flex items-center text-sm font-semibold text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                Launch Planner
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
