"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Users, Award, BookOpen, AlertCircle, Swords, ArrowRight, ArrowLeft, SquareArrowOutUpRight } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function ProfessorAnalyticsPage() {
    const [theme, setTheme] = useState("light"); // 'light' | 'dark'
    const [mode, setMode] = useState("single"); // 'single' | 'compare'

    // Sync with global theme managed by Navbar
    useEffect(() => {
        const updateTheme = () => {
            if (typeof document !== 'undefined') {
                const current = document.documentElement.getAttribute("data-theme") || "light";
                setTheme(current);
            }
        };

        updateTheme(); // Initial check

        // Watch for changes to the <html> data-theme attribute
        const observer = new MutationObserver(updateTheme);
        if (typeof document !== 'undefined') {
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        }

        return () => observer.disconnect();
    }, []);

    const [query, setQuery] = useState("");
    const [query2, setQuery2] = useState("");

    const [p1, setP1] = useState(null);
    const [p2, setP2] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isDark = theme === "dark";

    const fetchProfessor = async (name) => {
        if (!name) return null;
        const res = await fetch(`/api/rmp?name=${encodeURIComponent(name)}`);
        const data = await res.json();

        if (data.top) {
            let p = data.top;
            if (p.quality && !p.avgRating) p.avgRating = parseFloat(p.quality);
            if (p.difficulty && !p.avgDifficulty) p.avgDifficulty = parseFloat(p.difficulty);
            if (p.wouldTakeAgain && !p.wouldTakeAgainPercent) p.wouldTakeAgainPercent = parseFloat(p.wouldTakeAgain);

            if (!p.firstName && p.name) {
                const parts = p.name.trim().split(/\s+/);
                if (parts.length >= 2) {
                    p.firstName = parts[0];
                    p.lastName = parts[1];
                }
            }
            return p;
        }
        return null;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setP1(null);
        setP2(null);

        try {
            if (mode === "single") {
                if (!query.trim()) return;
                const prof = await fetchProfessor(query);
                if (prof) setP1(prof);
                else setError("Professor not found.");
            } else {
                if (!query.trim() || !query2.trim()) {
                    setError("Please enter names for both professors.");
                    setLoading(false);
                    return;
                }
                const [prof1, prof2] = await Promise.all([
                    fetchProfessor(query),
                    fetchProfessor(query2)
                ]);

                if (prof1) setP1(prof1);
                if (prof2) setP2(prof2);

                if (!prof1 && !prof2) setError("Neither professor was found.");
                else if (!prof1) setError(`Could not find "${query}".`);
                else if (!prof2) setError(`Could not find "${query2}".`);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    const getQualityColor = (rating) => {
        if (rating >= 4) return "#10b981"; // Emerald-500
        if (rating >= 3) return "#f59e0b"; // Amber-500
        return "#ef4444"; // Red-500
    };

    const getDifficultyColor = (rating) => {
        if (rating >= 4) return "#ef4444";
        if (rating >= 3) return "#f59e0b";
        return "#10b981";
    };

    // Helper to robustly get RMP ID
    const getRmpId = (prof) => {
        if (!prof) return null;
        if (prof.legacyId) return prof.legacyId;
        if (prof.id) {
            try {
                // RMP IDs are often "Teacher-12345" base64 encoded
                const decoded = atob(prof.id);
                if (decoded && decoded.includes('-')) {
                    return decoded.split('-')[1];
                }
            } catch (e) {
                console.error("Failed to decode ID", e);
            }
        }
        return null;
    };

    // Dynamic classes based on theme
    // Light mode: "Professional & Smart" -> Slate/Zinc palette, crisp borders, deep text.
    const bgClass = isDark ? "bg-black text-white" : "bg-[#F8FAFC] text-slate-900"; // Slate-50 background

    // Sleek Glass/Gradient Card Style - "GSAP Feel"
    const cardClass = isDark
        ? "bg-gradient-to-br from-[#111] to-[#050505] border-white/10 shadow-2xl backdrop-blur-md"
        : "bg-gradient-to-br from-white to-slate-50 border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-500";

    const textMuted = isDark ? "text-gray-400" : "text-slate-500";
    const inputBg = isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-slate-400"; // More definition on light mode
    const inputText = isDark ? "text-white" : "text-slate-900";

    return (
        <div className={`min-h-screen p-8 pt-24 font-sans transition-colors duration-300 ${bgClass} relative overflow-hidden`}>
            {/* Engineering Grid Background */}
            <div className={`absolute inset-0 pointer-events-none ${isDark ? "opacity-[0.08]" : "opacity-[0.03]"}`}
                style={{ backgroundImage: `linear-gradient(${isDark ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#fff' : '#000'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
            />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border ${isDark ? "bg-white/5 border-white/10 text-white/70" : "bg-slate-200 border-slate-300 text-slate-600"}`}>
                        <TrendingUp size={12} />
                        Academic Intelligence
                    </div>
                    <h1 className={`text-5xl md:text-6xl font-black mb-6 tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}>
                        Professor <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Analytics</span>
                    </h1>
                    <p className={`text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed ${textMuted}`}>
                        Data-driven insights to help you engineer your perfect semester.
                    </p>

                    {/* Mode Switcher */}
                    <div className={`inline-flex p-1 rounded-2xl border relative ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
                        <div className={`absolute w-1/2 h-full top-0 left-0 rounded-xl transition-all duration-300 ${isDark ? "bg-white/10" : "bg-slate-100 shadow-inner"} ${mode === 'compare' ? 'translate-x-full' : ''}`} />
                        <button
                            onClick={() => setMode("single")}
                            className={`relative z-10 px-6 py-2 rounded-xl text-sm font-semibold transition-colors ${mode === "single" ? (isDark ? "text-white" : "text-slate-900") : textMuted}`}
                        >
                            Single Analysis
                        </button>
                        <button
                            onClick={() => setMode("compare")}
                            className={`relative z-10 px-6 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${mode === "compare" ? (isDark ? "text-white" : "text-slate-900") : textMuted}`}
                        >
                            <Swords size={14} /> Compare
                        </button>
                    </div>
                </motion.div>

                {/* Search Bar */}
                <motion.form
                    onSubmit={handleSearch}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-3xl mx-auto mb-16 relative group"
                >
                    {/* Visual Glow removed for professional look */}
                    <div className={`relative border rounded-2xl flex items-center p-2 gap-2 overflow-hidden transition-all duration-300 ${inputBg}`}>

                        <div className="flex-1 flex items-center bg-transparent px-4">
                            <Search className={`${textMuted} mr-3`} size={20} />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={mode === "compare" ? "Professor A..." : "Search professor name..."}
                                className={`w-full bg-transparent border-none py-3 focus:outline-none text-lg ${inputText} placeholder:${isDark ? "text-gray-600" : "text-slate-400"}`}
                            />
                        </div>

                        {mode === "compare" && (
                            <>
                                <div className={`w-px h-8 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                                <div className="flex-1 flex items-center bg-transparent px-4">
                                    <input
                                        type="text"
                                        value={query2}
                                        onChange={(e) => setQuery2(e.target.value)}
                                        placeholder="Professor B..."
                                        className={`w-full bg-transparent border-none py-3 focus:outline-none text-lg ${inputText} placeholder:${isDark ? "text-gray-600" : "text-slate-400"}`}
                                    />
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 rounded-xl font-bold transition disabled:opacity-50 whitespace-nowrap text-white ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-slate-900 hover:bg-slate-800"}`}
                        >
                            {loading ? "Scanning..." : mode === "compare" ? "Compare" : "Analyze"}
                        </button>
                    </div>
                </motion.form>

                {/* Loading Animation */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center mb-16"
                        >
                            <div className="w-[300px] h-[300px]">
                                <DotLottieReact
                                    src="https://lottie.host/1ef83d9e-0614-4e52-9cae-c939908319c4/AIvOUkuPoT.lottie"
                                    loop
                                    autoplay
                                />
                            </div>
                            <p className={`mt-4 text-lg font-medium animate-pulse ${textMuted}`}>Scanning database...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error State */}
                {error && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-md mx-auto bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl flex items-center justify-center gap-3 mb-10 font-medium"
                    >
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </motion.div>
                )}

                {/* --- SINGLE VIEW --- */}
                <AnimatePresence>
                    {mode === "single" && p1 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 120, damping: 20 }} // Premium spring feel
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        >
                            {/* Profile Card */}
                            <div className="lg:col-span-1 space-y-8">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className={`${cardClass} border rounded-3xl p-8 relative overflow-hidden`}
                                >
                                    {/* Removed colored background glow */}
                                    <div className="relative z-10">
                                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold border shadow-sm mb-6 ${isDark ? "bg-gray-900 border-white/5" : "bg-slate-100 border-slate-200 text-slate-800"}`}>
                                            {(p1.firstName || "")[0] || "?"}{(p1.lastName || "")[0] || "?"}
                                        </div>
                                        <h2 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{p1.firstName || "Unknown"} {p1.lastName || "Professor"}</h2>
                                        <div className={`flex items-center gap-2 mb-6 ${textMuted}`}>
                                            <BookOpen size={16} />
                                            <span className="font-medium">{p1.department}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
                                            <Award size={16} />
                                            <span>{p1.school}</span>
                                        </div>
                                    </div>
                                </motion.div>
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div whileHover={{ y: -5 }} className={`${cardClass} border rounded-2xl p-6 text-center`}>
                                        <div className={`${textMuted} text-xs uppercase tracking-wider mb-2 font-semibold`}>Ratings</div>
                                        <div className="text-3xl font-bold">{p1.numRatings}</div>
                                    </motion.div>
                                    <motion.a
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        href={p1.url || `https://www.ratemyprofessors.com/professor/${getRmpId(p1)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${cardClass} border rounded-2xl p-6 text-center flex flex-col items-center justify-center transition-colors group cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5`}
                                    >
                                        <div className={`${textMuted} text-xs uppercase tracking-wider mb-2 font-semibold group-hover:text-blue-500 transition-colors`}>View Profile</div>
                                        <div className={`text-sm font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                                            RateMyProfessors <SquareArrowOutUpRight size={14} />
                                        </div>
                                    </motion.a>
                                </div>
                            </div>

                            {/* Analytics Charts */}
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className={`${cardClass} border rounded-3xl p-8 flex flex-col items-center justify-center relative`}>
                                    <h3 className={`${textMuted} font-semibold mb-6 flex items-center gap-2 uppercase tracking-wide text-xs`}>
                                        <TrendingUp size={16} /> Overall Quality
                                    </h3>
                                    <div className="relative w-full h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadialBarChart
                                                innerRadius="80%" outerRadius="100%" barSize={12}
                                                data={[{ name: 'Quality', value: p1.avgRating, fill: getQualityColor(p1.avgRating) }]}
                                                startAngle={180} endAngle={0}
                                            >
                                                <PolarAngleAxis type="number" domain={[0, 5]} tick={false} />
                                                <RadialBar minAngle={15} background={{ fill: isDark ? '#222' : '#f1f5f9' }} clockWise dataKey="value" cornerRadius={6} />
                                            </RadialBarChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8">
                                            <span className="text-6xl font-bold tracking-tighter" style={{ color: getQualityColor(p1.avgRating) }}>{p1.avgRating}</span>
                                            <span className={`${textMuted} text-sm font-medium mt-1`}>out of 5.0</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${cardClass} border rounded-3xl p-8 flex flex-col items-center justify-center relative`}>
                                    <h3 className={`${textMuted} font-semibold mb-6 flex items-center gap-2 uppercase tracking-wide text-xs`}>
                                        <AlertCircle size={16} /> Difficulty Level
                                    </h3>
                                    <div className="relative w-full h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadialBarChart
                                                innerRadius="80%" outerRadius="100%" barSize={12}
                                                data={[{ name: 'Difficulty', value: p1.avgDifficulty, fill: getDifficultyColor(p1.avgDifficulty) }]}
                                                startAngle={180} endAngle={0}
                                            >
                                                <PolarAngleAxis type="number" domain={[0, 5]} tick={false} />
                                                <RadialBar minAngle={15} background={{ fill: isDark ? '#222' : '#f1f5f9' }} clockWise dataKey="value" cornerRadius={6} />
                                            </RadialBarChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8">
                                            <span className="text-6xl font-bold tracking-tighter" style={{ color: getDifficultyColor(p1.avgDifficulty) }}>{p1.avgDifficulty}</span>
                                            <span className={`${textMuted} text-sm font-medium mt-1`}>out of 5.0</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`md:col-span-2 ${cardClass} border rounded-3xl p-8 relative overflow-hidden`}>
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                                <TrendingUp size={20} className={p1.wouldTakeAgainPercent >= 60 ? "text-emerald-500" : "text-amber-500"} />
                                                Retake Probability
                                            </h3>
                                            <p className={`${textMuted} text-sm`}>Percent of students performing a comeback.</p>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-3xl font-bold ${p1.wouldTakeAgainPercent >= 70 ? "text-emerald-600" : p1.wouldTakeAgainPercent >= 40 ? "text-amber-500" : "text-red-500"}`}>
                                                {p1.wouldTakeAgainPercent ? Math.round(p1.wouldTakeAgainPercent) : 0}%
                                            </div>
                                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                                                {p1.wouldTakeAgainPercent >= 75 ? "Excellent Choice" :
                                                    p1.wouldTakeAgainPercent >= 50 ? "Solid Option" :
                                                        "Risky Bet"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Advanced Progress Bar */}
                                    <div className={`w-full h-6 ${isDark ? "bg-gray-800" : "bg-slate-100"} rounded-full overflow-hidden relative shadow-inner`}>
                                        {/* Background Stripes */}
                                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }} />

                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${p1.wouldTakeAgainPercent || 0}%` }}
                                            transition={{ duration: 1.2, ease: "circOut" }}
                                            className={`h-full relative ${p1.wouldTakeAgainPercent >= 70 ? "bg-emerald-500" :
                                                p1.wouldTakeAgainPercent >= 40 ? "bg-amber-500" :
                                                    "bg-red-500"
                                                }`}
                                        >
                                            {/* Shimmer Effect */}
                                            <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '40px 40px' }} />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- COMPARE VIEW --- */}
                <AnimatePresence>
                    {mode === "compare" && p1 && p2 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`${cardClass} border rounded-3xl p-8 overflow-hidden`}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                                {/* P1 */}
                                <div className="text-center">
                                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl font-bold mb-4 ${isDark ? "bg-blue-900/20 text-blue-400 border border-blue-500/20" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
                                        {(p1.firstName || "")[0] || "?"}{(p1.lastName || "")[0] || "?"}
                                    </div>
                                    <h2 className="text-xl font-bold">{p1.firstName} {p1.lastName}</h2>
                                    <p className={`text-sm ${textMuted}`}>{p1.department}</p>
                                </div>

                                {/* VS Radar */}
                                <div className="h-80 relative flex flex-col items-center justify-center">
                                    <div className={`absolute top-0 text-sm tracking-widest font-bold ${textMuted}`}>VS</div>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart outerRadius="70%" data={[
                                            { subject: 'Quality', A: (p1.avgRating || 0) * 20, B: (p2.avgRating || 0) * 20, fullMark: 100 },
                                            { subject: 'Retake', A: p1.wouldTakeAgainPercent || 0, B: p2.wouldTakeAgainPercent || 0, fullMark: 100 },
                                            { subject: 'Easiness', A: (5 - (p1.avgDifficulty || 0)) * 20, B: (5 - (p2.avgDifficulty || 0)) * 20, fullMark: 100 },
                                        ]}>
                                            <PolarGrid stroke={isDark ? "#333" : "#e2e8f0"} />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#888' : '#64748b', fontSize: 12, fontWeight: 600 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name={p1.lastName} dataKey="A" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.2} /> {/* Blue */}
                                            <Radar name={p2.lastName} dataKey="B" stroke="#f59e0b" strokeWidth={3} fill="#f59e0b" fillOpacity={0.2} /> {/* Amber */}
                                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* P2 */}
                                <div className="text-center">
                                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl font-bold mb-4 ${isDark ? "bg-amber-900/20 text-amber-400 border border-amber-500/20" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
                                        {(p2.firstName || "")[0] || "?"}{(p2.lastName || "")[0] || "?"}
                                    </div>
                                    <h2 className="text-xl font-bold">{p2.firstName} {p2.lastName}</h2>
                                    <p className={`text-sm ${textMuted}`}>{p2.department}</p>
                                </div>
                            </div>

                            {/* Detailed Stats Comparison */}
                            <div className={`grid grid-cols-3 gap-y-6 gap-x-8 mt-12 border-t pt-12 items-center text-center ${isDark ? "border-white/5" : "border-slate-100"}`}>
                                <div className="text-4xl font-bold" style={{ color: getQualityColor(p1.avgRating) }}>{p1.avgRating}</div>
                                <div className={`${textMuted} uppercase text-xs tracking-wider font-semibold`}>Quality</div>
                                <div className="text-4xl font-bold" style={{ color: getQualityColor(p2.avgRating) }}>{p2.avgRating}</div>

                                <div className="text-4xl font-bold" style={{ color: getDifficultyColor(p1.avgDifficulty) }}>{p1.avgDifficulty}</div>
                                <div className={`${textMuted} uppercase text-xs tracking-wider font-semibold`}>Difficulty</div>
                                <div className="text-4xl font-bold" style={{ color: getDifficultyColor(p2.avgDifficulty) }}>{p2.avgDifficulty}</div>

                                <div className={`text-2xl font-bold ${isDark ? "text-gray-300" : "text-slate-800"}`}>{p1.numRatings}</div>
                                <div className={`${textMuted} uppercase text-xs tracking-wider font-semibold`}>Ratings</div>
                                <div className={`text-2xl font-bold ${isDark ? "text-gray-300" : "text-slate-800"}`}>{p2.numRatings}</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
