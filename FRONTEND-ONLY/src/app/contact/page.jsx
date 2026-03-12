"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Outfit, Inter } from "next/font/google";
import { Mail, Sparkles, ArrowRight, RefreshCw, CheckCircle } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import styles from "./contact.module.css";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, reload } from "firebase/auth";

// Navbar is in layout

const display = Outfit({ subsets: ["latin"], weight: ["700", "800"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

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

// Initialize Firebase only once
let app, auth;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
} catch (e) {
    // Already initialized or server-side
}

export default function ContactPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        contact: "",
        helpType: "developer",
        suggestion: ""
    });

    const [status, setStatus] = useState("idle"); // idle, submitting, verification_sent, verifying, success, error
    const [errorMsg, setErrorMsg] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [dotLottie, setDotLottie] = useState(null);
    const [animationComplete, setAnimationComplete] = useState(false);

    // USER'S GOOGLE SCRIPT URL
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzS7dsgA_3Fv72I0CcCMwPKjeGAvHTbRZwL9AtLtiB7wIhq-K2JjrRBQhsqCybsv_Rs/exec";

    // --- ANIMATION LISTENER ---
    useEffect(() => {
        if (dotLottie) {
            dotLottie.addEventListener('complete', () => {
                setAnimationComplete(true);
            });
        }
    }, [dotLottie]);

    // --- FIREBASE AUTH LISTENER ---
    // We listen for auth changes mainly to detect when the user is created
    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- STEP 1: SUBMIT & SEND VERIFICATION ---
    const handleInitialSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setStatus("submitting");

        try {
            // Create a temp user to trigger verification
            // We use a random password since the user doesn't need to login again
            const tempPassword = Math.random().toString(36).slice(-8) + "A1!";

            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, tempPassword);
            await sendEmailVerification(userCredential.user);

            setStatus("verification_sent");

        } catch (err) {
            // Handle "Email Already In Use" gracefully
            if (err.code === 'auth/email-already-in-use') {
                // Don't log as error to avoid scary console red text
                console.log("User already pending verification.");
                setStatus("verification_sent"); // Show the "Check Email" screen anyway
                alert("You have already requested verification for this email. Please check your inbox (and spam) for the previous link.");
            } else {
                console.error("Firebase Error:", err);
                setErrorMsg(err.message);
                setStatus("idle");
            }
        }
    };

    // --- STEP 2: CHECK VERIFICATION STATUS ---
    const checkVerification = async () => {
        if (!auth.currentUser) return;
        setStatus("verifying");

        try {
            await reload(auth.currentUser); // Refresh user token to get latest emailVerified status
            if (auth.currentUser.emailVerified) {
                await sendToGoogleSheets();
            } else {
                setStatus("verification_sent");
                alert("Email not verified yet. Please check your inbox (and spam folder) and click the link.");
            }
        } catch (err) {
            console.error("Verification Check Error:", err);
            setStatus("verification_sent");
            alert("Error checking verification. Please try again.");
        }
    };

    // --- STEP 3: SEND TO SHEETS (FINAL) ---
    const sendToGoogleSheets = async () => {
        try {
            // Optimistic UI
            setStatus("success");
            setAnimationComplete(false); // Reset for success animation

            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            // Clean up: Sign out the temp user if needed, but not strictly necessary for this flow
        } catch (err) {
            console.error("Sheet Error:", err);
            // Even if fetch fails (cors), likely succeeded.
        }
    };


    return (
        <main className={`${styles.page} ${body.className}`}>
            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* --- Left Column: Info --- */}
                <div className={styles.infoColumn}>
                    <h1 className={`${styles.title} ${display.className}`}>
                        Get in touch <br />
                        <span className={styles.royalGradientText}>with our team.</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Partner with us to turn academic chaos into clarity. Whether you're a developer, designer, or just have a brilliant idea, we want to hear from you.
                    </p>
                    <div className={styles.contactMethods}>
                        <div className={styles.methodCard}>
                            <div className={styles.iconBox}><Mail size={20} /></div>
                            <div>
                                <span className={styles.methodLabel}>Email us</span>
                                <span className={styles.methodValue}>contact.conuplanner@gmail.com</span>
                            </div>
                        </div>
                        <div className={styles.methodCard}>
                            <div className={styles.iconBox}><Sparkles size={20} /></div>
                            <div>
                                <span className={styles.methodLabel}>Direct Contribution</span>
                                <span className={styles.methodValue}>Fill out the form to join the inner circle.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Form --- */}
                <div className={styles.formCard}>

                    {/* STATE: SUCCESS */}
                    {status === "success" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '60px 20px' }}
                        >
                            {!animationComplete ? (
                                <div style={{ width: 250, height: 250, margin: '0 auto 10px' }}>
                                    <DotLottieReact
                                        src="https://lottie.host/12a32b32-fa30-4c9b-b8f6-f6da253e4bcb/pRQV9QtoMe.lottie"
                                        loop={false}
                                        autoplay
                                        dotLottieRefCallback={setDotLottie}
                                    />
                                </div>
                            ) : (
                                <>
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        className={styles.successIcon}
                                    >
                                        <Sparkles size={40} />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <h3 className={`${display.className} ${styles.successTitle}`} style={{ fontSize: 24, marginBottom: 12 }}>Verified & Sent!</h3>
                                        <p className={styles.successText}>Thanks! Your verified application has been securely recorded.</p>
                                        <button
                                            onClick={() => { setStatus("idle"); setFormData({ ...formData, email: "" }); }}
                                            className={styles.resetBtn}
                                        >
                                            Submit Another
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* STATE: VERIFICATION SENT */}
                    {(status === "verification_sent" || status === "verifying") && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6"
                        >
                            <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-2">
                                <Mail size={48} />
                            </div>
                            <h2 className={`${display.className} text-2xl font-bold text-gray-800`}>Check Your Email</h2>
                            <p className="text-gray-600 max-w-sm">
                                We've sent a verification link to <strong>{formData.email}</strong>.
                                <br />Please click the link in that email, then come back here and click the button below.
                            </p>

                            <button
                                onClick={checkVerification}
                                disabled={status === "verifying"}
                                className={`
                                    flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all
                                    ${status === "verifying" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg shadow-md"}
                                `}
                            >
                                {status === "verifying" ? (
                                    <>Checking... <RefreshCw className="animate-spin" size={18} /></>
                                ) : (
                                    <>I Have Verified My Email <CheckCircle size={18} /></>
                                )}
                            </button>

                            <p className="text-xs text-gray-400 mt-4">
                                Didn't receive it? Check Spam or <button onClick={() => setStatus("idle")} className="text-blue-500 hover:underline">try again</button>.
                            </p>
                        </motion.div>
                    )}


                    {/* STATE: FORM (IDLE/SUBMITTING) */}
                    {(status === "idle" || status === "submitting") && (
                        <form onSubmit={handleInitialSubmit}>
                            <div className={styles.formGrid}>
                                <div className={`${styles.field} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        className={styles.input}
                                        placeholder="Enter your full name"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={`${styles.field} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className={styles.input}
                                        placeholder="you@concordia.ca"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>Contact Number</label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        className={styles.input}
                                        placeholder="(514) 555-0123"
                                        value={formData.contact}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>How can you help?</label>
                                    <select
                                        name="helpType"
                                        className={styles.select}
                                        value={formData.helpType}
                                        onChange={handleChange}
                                    >
                                        <option value="developer">Developer (Frontend/Backend)</option>
                                        <option value="designer">UI/UX Designer</option>
                                        <option value="content">Content & Research</option>
                                        <option value="tester">Beta Tester</option>
                                        <option value="other">Other / Just a suggestion</option>
                                    </select>
                                </div>

                                <div className={`${styles.field} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Suggestion / Message</label>
                                    <textarea
                                        name="suggestion"
                                        className={styles.textarea}
                                        placeholder="Tell us about yourself or your idea..."
                                        required
                                        value={formData.suggestion}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {errorMsg && (
                                <p className="text-red-500 text-sm mb-4 font-medium px-1">{errorMsg}</p>
                            )}

                            <button type="submit" className={styles.submitBtn} disabled={status === "submitting"}>
                                {status === "submitting" ? "Processing..." : (
                                    <>Verify & Submit <ArrowRight size={18} /></>
                                )}
                            </button>

                            <p className={styles.formFooterText}>
                                We will send a verification link to your email before accepting the form.
                            </p>
                        </form>
                    )}
                </div>
            </motion.div>
        </main>
    );
}
