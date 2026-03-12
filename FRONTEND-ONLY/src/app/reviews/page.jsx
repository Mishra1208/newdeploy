"use client";
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Plus, Quote, Loader2 } from 'lucide-react';
import ReviewModal from '@/components/ReviewModal';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ReviewsPage() {
    const { data, error, mutate } = useSWR('/api/reviews', fetcher, {
        refreshInterval: 0, // Manual refresh only on submission
        revalidateOnFocus: false
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Handle Dark Mode Syncing with Global Theme
    useEffect(() => {
        setMounted(true);

        const updateTheme = () => {
            const isDark = document.documentElement.classList.contains('dark') ||
                document.documentElement.getAttribute('data-theme') === 'dark';
            setIsDarkMode(isDark);
        };

        // Initial check
        updateTheme();

        // Observe changes to documentElement (where the global theme is applied)
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'data-theme']
        });

        return () => observer.disconnect();
    }, []);

    const handleSubmitReview = async (reviewData) => {
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to submit review');
            }

            // Mutate SWR to show new review immediately
            mutate();
        } catch (err) {
            console.error("Failed to submit review:", err);
            alert("Error: " + err.message);
        }
    };

    const isLoading = !data && !error;
    const reviews = data?.reviews || [];

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-[#0a0a0a]" : "bg-white"}`}>



            {/* Hero Section */}
            <div className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto relative">
                {/* Ambient Azure Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1e3a8a]/15 blur-[140px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1e3a8a]/10 dark:bg-[#1e3a8a]/20 border border-[#1e3a8a]/20 text-[#1e3a8a] dark:text-[#db9e1e] text-xs font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
                        <MessageSquare size={14} />
                        The Wall of Love
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-8 leading-[0.9]">
                        What Students Are <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e3a8a] to-[#0c4a6e] dark:from-[#db9e1e] dark:to-[#ffc107]">Saying About Us</span>
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Join <span className="font-bold text-gray-900 dark:text-white">{reviews.length > 0 ? reviews.length.toLocaleString() : "..."}</span> Concordia students who are mastering their academic journey.
                    </p>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-12 py-5 rounded-full bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] text-white font-black text-lg hover:scale(105) active:scale-95 transition-all shadow-[0_20px_40px_rgba(30,58,138,0.3)] flex items-center gap-3 mx-auto uppercase tracking-[0.25em] border border-white/10 group"
                    >
                        <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                        Write a Review
                    </button>
                </motion.div>
            </div>

            {/* Masonry Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-24">
                {isLoading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="animate-spin text-[#1e3a8a]" size={48} />
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-12">
                        {reviews.map((review, idx) => {
                            const shades = [
                                { bg: "bg-blue-50/80 dark:bg-blue-900/10", pin: "bg-blue-500", border: "border-blue-200/50" },
                                { bg: "bg-purple-50/80 dark:bg-purple-900/10", pin: "bg-purple-500", border: "border-purple-200/50" },
                                { bg: "bg-emerald-50/80 dark:bg-emerald-900/10", pin: "bg-emerald-500", border: "border-emerald-200/50" },
                                { bg: "bg-amber-50/80 dark:bg-amber-900/10", pin: "bg-[#db9e1e]", border: "border-amber-200/50" },
                                { bg: "bg-rose-50/80 dark:bg-rose-900/10", pin: "bg-rose-500", border: "border-rose-200/50" },
                                { bg: "bg-indigo-50/80 dark:bg-indigo-900/10", pin: "bg-indigo-500", border: "border-indigo-200/50" },
                            ];
                            const shade = shades[idx % shades.length];

                            // Define a permanent slight rotation based on index for a "bulletin board" feel
                            const rotations = [-1.2, 0.8, -0.5, 1.1, -0.9, 0.6];
                            const cardRotation = rotations[idx % rotations.length];

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30, rotate: cardRotation * 2 }}
                                    whileInView={{ opacity: 1, y: 0, rotate: cardRotation }}
                                    whileHover={{
                                        y: -12,
                                        scale: 1.02,
                                        rotate: cardRotation > 0 ? cardRotation + 0.5 : cardRotation - 0.5,
                                        transition: { type: "spring", stiffness: 400, damping: 10 }
                                    }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05, duration: 0.6, type: "spring" }}
                                    className={`break-inside-avoid ${shade.bg} backdrop-blur-xl p-10 pt-16 rounded-b-[2.5rem] border-x border-b ${shade.border} dark:border-white/5 transition-all duration-500 relative group shadow-2xl shadow-black/5 overflow-hidden`}
                                    style={{
                                        clipPath: "polygon(0% 5%, 2.5% 0%, 5% 5%, 7.5% 0%, 10% 5%, 12.5% 0%, 15% 5%, 17.5% 0%, 20% 5%, 22.5% 0%, 25% 5%, 27.5% 0%, 30% 5%, 32.5% 0%, 35% 5%, 37.5% 0%, 40% 5%, 42.5% 0%, 45% 5%, 47.5% 0%, 50% 5%, 52.5% 0%, 55% 5%, 57.5% 0%, 60% 5%, 62.5% 0%, 65% 5%, 67.5% 0%, 70% 5%, 72.5% 0%, 75% 5%, 77.5% 0%, 80% 5%, 82.5% 0%, 85% 5%, 87.5% 0%, 90% 5%, 92.5% 0%, 95% 5%, 97.5% 0%, 100% 5%, 100% 100%, 0% 100%)"
                                    }}
                                >
                                    {/* Paper Texture Overlay */}
                                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"
                                        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }} />
                                    {/* Board Pin */}
                                    <div className={`absolute top-2 z-20 transition-transform duration-500 group-hover:scale-110`}
                                        style={{ left: `${48 + (idx % 4)}%` }}>
                                        <div className={`w-5 h-5 rounded-full ${shade.pin} shadow-[2px_4px_8px_rgba(0,0,0,0.4)] relative overflow-hidden ring-1 ring-black/10`}>
                                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/40" />
                                            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white/60 rounded-full blur-[0.5px]" />
                                        </div>
                                        <div className="w-[1px] h-3 bg-gray-500/40 mx-auto -mt-0.5 blur-[0.2px]" />
                                    </div>

                                    {/* Quote Icon */}
                                    <div className="absolute top-14 right-10 text-gray-200 dark:text-white/5 group-hover:text-[#db9e1e]/10 transition-colors pointer-events-none">
                                        <Quote size={56} className="fill-current" />
                                    </div>

                                    {/* Stars */}
                                    <div className="flex gap-1.5 mb-8 relative z-10">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={20}
                                                className={`${i < review.rating ? "text-[#db9e1e] fill-[#db9e1e]" : "text-gray-200 dark:text-gray-800"}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Text */}
                                    <div className="relative mb-10 z-10">
                                        <p className="text-gray-800 dark:text-gray-100 leading-relaxed font-black italic text-xl tracking-tight">
                                            "{review.text}"
                                        </p>
                                    </div>

                                    {/* Author */}
                                    <div className="flex items-center gap-5 pt-8 border-t border-gray-200/30 dark:border-white/5 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#db9e1e] p-[2px] shadow-lg shadow-blue-900/10">
                                            <div className="w-full h-full rounded-[0.9rem] bg-white dark:bg-[#0f172a] flex items-center justify-center text-[#1e3a8a] dark:text-[#db9e1e] font-black text-xl">
                                                {review.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-extrabold text-gray-900 dark:text-white text-lg tracking-tight">
                                                {review.name}
                                            </div>
                                            <div className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] font-black mt-1">
                                                {review.role}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitReview}
            />

        </div>
    );
}
