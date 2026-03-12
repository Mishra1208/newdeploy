"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, Shield, User, MessageSquare } from 'lucide-react';

export default function ReviewModal({ isOpen, onClose, onSubmit }) {
    const [rating, setRating] = useState(5);
    const [role, setRole] = useState("Student");
    const [text, setText] = useState("");
    const [name, setName] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text) return;

        setIsSubmitting(true);
        await onSubmit({ name, role, text, rating, isAnonymous });
        setIsSubmitting(false);
        onClose();
        // Reset form
        setText("");
        setRating(5);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black tracking-tighter text-white flex items-center gap-3 uppercase">
                                    <Star className="text-[#db9e1e] fill-[#db9e1e]" size={24} />
                                    Leave a Review
                                </h3>
                                <p className="text-xs text-blue-200/60 uppercase tracking-[0.2em] font-bold mt-1">Share your academic journey</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="relative z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/10 group"
                            >
                                <X size={20} className="text-white group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            {/* Rating */}
                            <div className="flex flex-col items-center gap-4 py-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Overall Rating</label>
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="p-1 transition-all hover:scale-125 active:scale-90 focus:outline-none group/star"
                                        >
                                            <Star
                                                size={36}
                                                className={`${star <= rating ? "text-[#db9e1e] fill-[#db9e1e] drop-shadow-[0_0_8px_rgba(219,158,30,0.4)]" : "text-gray-200 dark:text-white/5 group-hover/star:text-gray-300"} transition-all`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Role & Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-2 block">Your Role</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a8a] transition text-gray-900 dark:text-white"
                                    >
                                        <option>Student</option>
                                        <option>Alumni</option>
                                        <option>Prospective Student</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-2 block">Name (Optional)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={isAnonymous}
                                            placeholder={isAnonymous ? "Anonymous User" : "Your Name"}
                                            className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#1e3a8a] transition disabled:opacity-50 text-gray-900 dark:text-white"
                                        />
                                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Review Text */}
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-2 block">Your Review</label>
                                <div className="relative">
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="How has ConU Planner helped you?"
                                        rows={4}
                                        className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-4 py-3 text-sm focus:outline-none focus:border-[#1e3a8a] transition resize-none text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Anonymity Toggle */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isAnonymous ? "bg-[#1e3a8a]" : "bg-gray-300 dark:bg-gray-600"}`}>
                                    <input
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                        className="hidden"
                                    />
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isAnonymous ? "translate-x-6" : "translate-x-0"}`} />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Shield size={16} className={isAnonymous ? "text-[#1e3a8a] dark:text-[#db9e1e]" : "text-gray-400"} />
                                    Stay Anonymous
                                </span>
                            </label>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 rounded-2xl bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#0f172a] text-white font-black shadow-[0_15px_30px_rgba(30,58,138,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.25em] text-sm border border-white/10 group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2 animate-pulse">
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                                    </span>
                                ) : (
                                    <>
                                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        Post Review
                                    </>
                                )}
                            </button>

                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
