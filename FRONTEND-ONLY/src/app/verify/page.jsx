"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getAuth, applyActionCode } from "firebase/auth";
import confetti from "canvas-confetti";
import Link from "next/link";
import { Meteors } from "@/components/widgets/Meteors";


/* -------------------------------------------------------------------------- */
/*                              FIREBASE CONFIG                               */
/* -------------------------------------------------------------------------- */
const firebaseConfig = {
    apiKey: "AIzaSyCCIm5WlmYVBtJrgEFGqA1A981ednQ2th8",
    authDomain: "conuplanner-auth.firebaseapp.com",
    projectId: "conuplanner-auth",
    storageBucket: "conuplanner-auth.firebasestorage.app",
    messagingSenderId: "172147914882",
    appId: "1:172147914882:web:59ea8770d3de2d543b9c9b"
};

// Initialize Firebase
let app, auth;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
} catch (e) {
    // Already initialized
}

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");

    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("Securing your connection...");

    useEffect(() => {
        // --- TEST MODE ---
        if (mode === "test_success") {
            const timer = setTimeout(() => {
                setStatus("success");
                setMessage("Email successfully verified!");
                triggerConfetti();
            }, 1500);
            return () => clearTimeout(timer);
        }

        if (!oobCode) {
            setStatus("error");
            setMessage("Invalid verification link. Please check your email again.");
            return;
        }

        // Handle verifyEmail mode
        if (mode === "verifyEmail" || mode === "signIn") {
            const timer = setTimeout(() => {
                verifyEmail(oobCode);
            }, 1500); // Artificial delay to show off the cool animation
            return () => clearTimeout(timer);
        } else {
            setStatus("error");
            setMessage("Unknown verification mode.");
        }
    }, [mode, oobCode]);

    const verifyEmail = async (code) => {
        try {
            await applyActionCode(auth, code);
            setStatus("success");
            setMessage("Email successfully verified!");
            triggerConfetti();
        } catch (error) {
            console.error("Verification Error:", error);
            setStatus("error");
            if (error.code === 'auth/expired-action-code') {
                setMessage("This link has expired. Please request a new one.");
            } else if (error.code === 'auth/invalid-action-code') {
                setMessage("This link is invalid or has already been used.");
            } else {
                setMessage("Verification failed. Please try again.");
            }
        }
    };

    const triggerConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[60vh] w-full max-w-lg mx-auto text-center p-8 bg-white/40 dark:bg-black/40 backdrop-blur-2xl rounded-3xl border border-black/5 dark:border-white/10 shadow-2xl overflow-hidden mt-20 mb-20">

            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
                <Meteors number={20} />
            </div>

            {/* --- LOADING STATE --- */}
            {status === "verifying" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6 relative z-10 w-full"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/20 dark:bg-purple-500/30 blur-2xl rounded-full animate-pulse" />
                        <div className="relative w-24 h-24 flex items-center justify-center bg-white/60 dark:bg-black/40 rounded-full border border-purple-500/20 dark:border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)] dark:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            <Loader2 size={40} className="text-purple-600 dark:text-purple-400 animate-spin" />
                        </div>
                    </div>
                    <div className="space-y-4 w-full">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Verifying...</h2>
                        <div className="flex flex-col gap-2 items-center w-full max-w-[200px] mx-auto">
                            <p className="text-purple-600/60 dark:text-purple-200/60 text-xs font-mono tracking-widest uppercase">Encrypting Handshake</p>
                            <div className="h-1 bg-purple-200 dark:bg-purple-900/50 rounded-full w-full overflow-hidden">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="h-full bg-gradient-to-r from-transparent via-purple-500 dark:via-purple-400 to-transparent w-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* --- SUCCESS STATE --- */}
            {status === "success" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="flex flex-col items-center gap-6 relative z-10"
                >
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-2 border border-green-500/20 dark:border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)] dark:shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <CheckCircle size={48} />
                    </div>

                    <div>
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-400 dark:to-emerald-600 mb-3 drop-shadow-sm">
                            Verified!
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            Welcome to the inner circle. <br /> Your account is now fully active.
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="mt-6 group relative px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Access Dashboard <ArrowRight size={18} />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-200 dark:to-pink-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                </motion.div>
            )}

            {/* --- ERROR STATE --- */}
            {status === "error" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-6 relative z-10"
                >
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-600 dark:text-red-500 mb-2 border border-red-500/20 dark:border-red-500/30">
                        <XCircle size={48} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
                            Verification Failed
                        </h2>
                        <p className="text-gray-700 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                            {message}
                        </p>
                    </div>

                    <Link
                        href="/contact"
                        className="mt-4 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-colors"
                    >
                        Try Again
                    </Link>
                </motion.div>
            )}

        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/50 dark:from-purple-900/20 via-gray-50 dark:via-[#050505] to-gray-50 dark:to-[#050505] flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-center p-10 text-gray-900 dark:text-white">Loading Interface...</div>}>
                <VerifyContent />
            </Suspense>
        </div>
    );
}
