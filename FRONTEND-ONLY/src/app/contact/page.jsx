"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Outfit, Inter } from "next/font/google";
import { Mail, Phone, MapPin, Send, ArrowRight, Sparkles } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import styles from "./contact.module.css";
// Navbar is in layout

const display = Outfit({ subsets: ["latin"], weight: ["700", "800"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function ContactPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        contact: "",
        helpType: "developer",
        suggestion: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /* 
       TODO: PASTE YOUR DEPLOYED GOOGLE SCRIPT WEB APP URL HERE
       Example: "https://script.google.com/macros/s/AKfycbx.../exec"
    */
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyR0Sk7Zo1fIqlUHWztNHKZj-6ywIbBNTh8iCYj1KfYWdavUySG-cOIYvsTvJuQFwPW/exec";

    const [dotLottie, setDotLottie] = useState(null);
    const [animationComplete, setAnimationComplete] = useState(false);

    React.useEffect(() => {
        if (dotLottie) {
            dotLottie.addEventListener('complete', () => {
                setAnimationComplete(true);
            });
        }
    }, [dotLottie]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Reset animation state in case of re-submission logic
        setAnimationComplete(false);

        // Optimistic UI: Show success immediately
        setSubmitted(true);

        if (!GOOGLE_SCRIPT_URL) {
            console.warn("No Google Script URL provided. Simulating submission.");
        } else {
            // Send data using no-cors mode (fire and forget)
            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            }).catch(err => console.error("Error submitting form", err));
        }

        setIsSubmitting(false);
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
                            <div className={styles.iconBox}>
                                <Mail size={20} />
                            </div>
                            <div>
                                <span className={styles.methodLabel}>Email us</span>
                                <span className={styles.methodValue}>mishranarendra1208@gmail.com</span>
                            </div>
                        </div>

                        <div className={styles.methodCard}>
                            <div className={styles.iconBox}>
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <span className={styles.methodLabel}>Direct Contribution</span>
                                <span className={styles.methodValue}>Fill out the form to join the inner circle.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Form --- */}
                <div className={styles.formCard}>
                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '60px 20px' }}
                        >
                            {/* Switch between Animation and Static Icon */}
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
                                        <h3 className={`${display.className} ${styles.successTitle}`} style={{ fontSize: 24, marginBottom: 12 }}>Message Sent!</h3>
                                        <p className={styles.successText}>Thanks for reaching out. We've added your details to our list and will be in touch shortly.</p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className={styles.resetBtn}
                                        >
                                            Send another
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGrid}>
                                {/* Full Name */}
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

                                {/* Email */}
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

                                {/* Contact (Phone) */}
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

                                {/* How you can help */}
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

                                {/* Suggestion */}
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

                            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : (
                                    <>Submit Application <ArrowRight size={18} /></>
                                )}
                            </button>

                            <p className={styles.formFooterText}>
                                By clicking Submit, you agree to join our contributors list.
                            </p>
                        </form>
                    )}
                </div>

            </motion.div>
        </main>
    );
}
