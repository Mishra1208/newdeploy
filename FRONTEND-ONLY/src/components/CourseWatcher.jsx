"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseWatcher() {
    const [subject, setSubject] = useState('COMP');
    const [number, setNumber] = useState('248');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheck = async () => {
        setLoading(true);
        setError('');
        setResults(null);

        try {
            const res = await fetch('/api/check-seats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, number }),
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
        <div className="w-full max-w-5xl mx-auto my-8 px-4">
            {/* 
        Light Glass Container matching the site's "Warm Academic Paper" theme.
        Uses bg-white/60 with backdrop-blur to blend.
      */}
            <div className="relative overflow-hidden rounded-3xl p-8 border border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)]">

                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                    <div className="text-left">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                                Seat Finder
                            </span>
                            <span className="text-2xl">⚡</span>
                        </h2>
                        <p className="text-slate-500 text-sm">
                            Instant availability check for any Concordia course.
                        </p>
                    </div>

                    <div className="flex w-full md:w-auto items-center gap-3 bg-white/80 p-1.5 rounded-full border border-slate-200 shadow-sm">
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value.toUpperCase())}
                            placeholder="COMP"
                            className="w-24 bg-transparent px-4 py-2 text-slate-900 font-bold placeholder-slate-400 focus:outline-none text-center tracking-wide"
                        />
                        <div className="w-px h-6 bg-slate-200" />
                        <input
                            type="text"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="248"
                            className="w-20 bg-transparent px-4 py-2 text-slate-900 font-bold placeholder-slate-400 focus:outline-none text-center tracking-wide"
                        />
                        <button
                            onClick={handleCheck}
                            disabled={loading}
                            className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            {loading ? 'Checking...' : 'Check'}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-4 text-center border border-red-100"
                        >
                            ⚠️ {error}
                        </motion.div>
                    )}

                    {results && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="overflow-hidden bg-white/50 rounded-2xl border border-white/50"
                        >
                            <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                                <table className="w-full text-left text-sm">
                                    <thead className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 shadow-sm">
                                        <tr className="text-slate-500 uppercase tracking-wider text-xs">
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold">Section</th>
                                            <th className="px-6 py-4 font-semibold">Time</th>
                                            <th className="px-6 py-4 font-semibold">Class #</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {results.map((section, i) => (
                                            <tr
                                                key={i}
                                                className="hover:bg-white/80 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-3.5">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${section.status === 'Open'
                                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                                : section.status === 'Closed'
                                                                    ? 'bg-red-50 text-red-600 border-red-100'
                                                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                                            }`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${section.status === 'Open' ? 'bg-emerald-500' :
                                                                section.status === 'Closed' ? 'bg-red-500' : 'bg-amber-500'
                                                            }`} />
                                                        {section.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3.5 font-medium text-slate-700">
                                                    {section.section}
                                                </td>
                                                <td className="px-6 py-3.5 text-slate-500 text-xs">
                                                    {section.time}
                                                </td>
                                                <td className="px-6 py-3.5 text-slate-400 font-mono text-xs">
                                                    {section.classNbr}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
