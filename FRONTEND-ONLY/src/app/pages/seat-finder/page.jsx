"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function SeatFinderPage() {
    const [term, setTerm] = useState('2254'); // Default to Winter 2026
    const [subject, setSubject] = useState('');
    const [number, setNumber] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isTermAvailable = (t) => {
        // Only Winter 2026 (2254) is currently open
        return t === '2254';
    };

    const handleCheck = async (e) => {
        e.preventDefault();
        if (!subject || !number) return;

        setLoading(true);
        setError('');
        setResults(null);

        try {
            const res = await fetch('/api/check-seats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ term, subject: subject.toUpperCase(), number }),
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Failed to fetch');

            setResults(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-white dark:bg-black text-slate-800 dark:text-slate-200 font-sans selection:bg-[#F59E0B] selection:text-white transition-colors duration-300">

            {/* Premium Background Decor (Aurora) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#912338] dark:bg-purple-900 opacity-[0.03] dark:opacity-[0.2] rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-[#C5A059] dark:bg-amber-600 opacity-[0.05] dark:opacity-[0.15] rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col items-center">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 max-w-2xl"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-[#912338]/5 dark:bg-amber-500/10 border border-[#912338]/10 dark:border-amber-500/20 text-sm font-bold text-[#912338] dark:text-amber-500 mb-6 tracking-wider uppercase">
                        Concordia University
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 font-display">
                        Seat <span className="text-[#912338] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-amber-400 dark:to-orange-500">Finder</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        Secure your spot. Real-time availability for every course.
                    </p>
                </motion.div>

                {/* Search Card or Locked View */}
                <motion.div
                    key={term} // Re-animate when term changes
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="w-full max-w-4xl"
                >
                    <div className="bg-white dark:bg-[#0a0a0a] border border-slate-100 dark:border-white/10 p-3 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(145,35,56,0.15)] dark:shadow-[0_20px_50px_-12px_rgba(245,158,11,0.15)] ring-1 ring-slate-100 dark:ring-white/5 overflow-hidden relative transition-colors duration-300">

                        {/* Term Selector - Always Visible */}
                        <div className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-4 flex flex-col md:flex-row items-center justify-between gap-4 rounded-t-[1.5rem]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 text-[#912338] dark:text-amber-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Term</span>
                            </div>

                            <div className="relative group min-w-[200px]">
                                <select
                                    value={term}
                                    onChange={(e) => {
                                        setTerm(e.target.value);
                                        setResults(null); // Clear results on term change
                                    }}
                                    className="bg-white dark:bg-[#111] text-slate-800 dark:text-white font-bold text-lg py-2 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm outline-none appearance-none w-full cursor-pointer hover:border-[#912338]/30 dark:hover:border-amber-500/30 focus:border-[#912338] dark:focus:border-amber-500 focus:ring-4 focus:ring-[#912338]/5 dark:focus:ring-amber-500/10 transition-all"
                                >
                                    <option value="2254">Winter 2026</option>
                                    <option value="2261">Summer 2026</option>
                                    <option value="2262">Fall 2026</option>
                                    <option value="2263">Fall/Win 2026-27</option>
                                    <option value="2264">Winter 2027</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-[#912338] transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            {isTermAvailable(term) ? (
                                /* Active Search Form */
                                <form onSubmit={handleCheck} className="flex flex-col md:flex-row items-stretch gap-4">
                                    <div className="flex-1 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors rounded-2xl border border-transparent focus-within:border-[#912338]/30 dark:focus-within:border-amber-500/30 focus-within:ring-4 focus-within:ring-[#912338]/5 dark:focus-within:ring-amber-500/10 p-4 flex flex-col justify-center h-24 group relative">
                                        <label className="text-xs font-bold text-slate-400 group-focus-within:text-[#912338] dark:group-focus-within:text-amber-500 uppercase tracking-wider ml-1 mb-1 transition-colors">Subject</label>
                                        <input
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="e.g. COMP"
                                            className="bg-transparent text-2xl font-bold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-white/20 outline-none w-full uppercase"
                                        />
                                    </div>

                                    <div className="flex-1 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors rounded-2xl border border-transparent focus-within:border-[#C5A059]/50 dark:focus-within:border-amber-500/50 focus-within:ring-4 focus-within:ring-[#C5A059]/10 dark:focus-within:ring-amber-500/10 p-4 flex flex-col justify-center h-24 group">
                                        <label className="text-xs font-bold text-slate-400 group-focus-within:text-[#b08d4a] dark:group-focus-within:text-amber-500 uppercase tracking-wider ml-1 mb-1 transition-colors">Course Number</label>
                                        <input
                                            type="text"
                                            value={number}
                                            onChange={(e) => setNumber(e.target.value)}
                                            placeholder="e.g. 248"
                                            className="bg-transparent text-2xl font-bold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-white/20 outline-none w-full"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto px-10 bg-[#912338] dark:bg-gradient-to-r dark:from-amber-500 dark:to-orange-600 hover:bg-[#7a1d2f] dark:hover:to-orange-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#912338]/20 dark:shadow-orange-500/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-w-[160px]"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Searching</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Find</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                /* Locked View */
                                <div className="text-center py-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 mb-6">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Enrollment Opens March 4, 2026</h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                                        The schedule for this term hasn't been released yet. Sign up to get notified the second they drop.
                                    </p>

                                    {/* Embedded Newsletter (Scaled Down slightly if needed) */}
                                    <div className="transform scale-95 origin-top">
                                        <NewsletterSignup />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Results Section */}
                <div className="w-full max-w-5xl mt-16 pb-40">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-6 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-center font-bold shadow-sm max-w-lg mx-auto"
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}

                        {results && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="bg-white dark:bg-[#0a0a0a] border border-slate-100 dark:border-white/10 rounded-[2.5rem] shadow-[0_4px_30px_rgba(0,0,0,0.08)] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest bg-slate-50/50 dark:bg-white/5">
                                                    <th className="px-8 py-6">Status</th>
                                                    <th className="px-8 py-6">Section</th>
                                                    <th className="px-8 py-6">Time & Schedule</th>
                                                    <th className="px-8 py-6">Class Number</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                                {results.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-8 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">No sections found for this course.</td>
                                                    </tr>
                                                ) : results.map((section, i) => (
                                                    <motion.tr
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                                    >
                                                        <td className="px-8 py-6">
                                                            <StatusBadge status={section.status} />
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="font-bold text-slate-800 dark:text-slate-200 text-lg group-hover:text-[#912338] dark:group-hover:text-amber-500 transition-colors">{section.section}</div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="text-slate-600 dark:text-slate-400 font-medium">{section.time}</div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="font-mono text-slate-400 dark:text-slate-500 text-sm bg-slate-100 dark:bg-white/5 inline-block px-3 py-1 rounded-full">{section.classNbr}</div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Open: "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50",
        Closed: "bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800/50",
        Waitlist: "bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/50",
        Unknown: "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700/50"
    };

    const dotStyles = {
        Open: "bg-emerald-500",
        Closed: "bg-rose-500",
        Waitlist: "bg-amber-500",
        Unknown: "bg-slate-400"
    };

    const s = status || 'Unknown';

    return (
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${styles[s] || styles.Unknown}`}>
            <span className={`w-2 h-2 rounded-full ${dotStyles[s] || dotStyles.Unknown} ${s === 'Open' ? 'animate-pulse' : ''}`} />
            {s.toUpperCase()}
        </span>
    );
}
