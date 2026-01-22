"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

export default function SeatFinderPage() {
    const [subject, setSubject] = useState('');
    const [number, setNumber] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
                body: JSON.stringify({ subject: subject.toUpperCase(), number }),
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
        <div className="min-h-screen relative overflow-hidden text-slate-800 dark:text-gray-100 font-sans selection:bg-pink-100 selection:text-pink-900 transition-colors duration-300">

            {/* Background Decor - Mesh Gradient */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-300 dark:bg-purple-900 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-pink-200 dark:bg-indigo-900 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-blue-200 dark:bg-slate-800 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col items-center">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 max-w-2xl"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm text-sm font-bold text-slate-500 dark:text-slate-400 mb-6 tracking-wider uppercase">
                        Start Your Semester Right
                    </div>
                    <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Seat</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                        Don't let a full class stop you. Check real-time availability for any Concordia course instantly.
                    </p>
                </motion.div>

                {/* Search Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="w-full max-w-3xl"
                >
                    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-2 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/50 dark:ring-white/10">
                        <form onSubmit={handleCheck} className="flex flex-col md:flex-row items-center gap-2 p-2">

                            <div className="flex-1 w-full bg-white/60 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors rounded-2xl border border-transparent focus-within:border-purple-300 dark:focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-purple-500/10 p-4 flex flex-col justify-center h-24 group">
                                <label className="text-xs font-bold text-slate-400 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 uppercase tracking-wider ml-1 mb-1 transition-colors">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g. COMP"
                                    className="bg-transparent text-2xl font-bold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 outline-none w-full"
                                />
                            </div>

                            <div className="w-px h-16 bg-slate-200 dark:bg-slate-700 hidden md:block mx-2" />

                            <div className="flex-1 w-full bg-white/60 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors rounded-2xl border border-transparent focus-within:border-pink-300 dark:focus-within:border-pink-600 focus-within:ring-4 focus-within:ring-pink-500/10 p-4 flex flex-col justify-center h-24 group">
                                <label className="text-xs font-bold text-slate-400 group-focus-within:text-pink-600 dark:group-focus-within:text-pink-400 uppercase tracking-wider ml-1 mb-1 transition-colors">Course Number</label>
                                <input
                                    type="text"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    placeholder="e.g. 248"
                                    className="bg-transparent text-2xl font-bold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 outline-none w-full"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto h-24 px-10 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 dark:shadow-indigo-600/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-w-[200px]"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Checking...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Search</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </>
                                )}
                            </button>
                        </form>
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
                                className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-red-600 dark:text-red-300 text-center font-medium shadow-sm max-w-lg mx-auto backdrop-blur-sm"
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
                                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[2.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-200/60 dark:border-white/5 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
                                                    <th className="px-8 py-6">Status</th>
                                                    <th className="px-8 py-6">Section</th>
                                                    <th className="px-8 py-6">Time & Schedule</th>
                                                    <th className="px-8 py-6">Class Number</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100/50 dark:divide-white/5">
                                                {results.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-8 py-12 text-center text-slate-400 dark:text-slate-500 font-medium">No sections found for this course.</td>
                                                    </tr>
                                                ) : results.map((section, i) => (
                                                    <motion.tr
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="group hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors"
                                                    >
                                                        <td className="px-8 py-5">
                                                            <StatusBadge status={section.status} />
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="font-bold text-slate-800 dark:text-slate-100 text-lg group-hover:text-purple-900 dark:group-hover:text-purple-300 transition-colors">{section.section}</div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="text-slate-600 dark:text-slate-400 font-medium">{section.time}</div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="font-mono text-slate-400 dark:text-slate-500 text-sm bg-slate-100 dark:bg-slate-800/50 inline-block px-2 py-1 rounded-md">{section.classNbr}</div>
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
        Open: "bg-emerald-100/50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
        Closed: "bg-rose-100/50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
        Waitlist: "bg-amber-100/50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
        Unknown: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
    };

    const dotStyles = {
        Open: "bg-emerald-500",
        Closed: "bg-rose-500",
        Waitlist: "bg-amber-500",
        Unknown: "bg-slate-400"
    };

    const s = status || 'Unknown';

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${styles[s] || styles.Unknown}`}>
            <span className={`w-2 h-2 rounded-full ${dotStyles[s] || dotStyles.Unknown} ${s === 'Open' ? 'animate-pulse' : ''}`} />
            {s.toUpperCase()}
        </span>
    );
}
