"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, LogIn, MousePointerClick, CheckCircle, ShieldCheck, AlertCircle, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

export default function SyncGuidePage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans text-gray-900 dark:text-white selection:bg-teal-500/30">

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[100px] mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-bold mb-6 border border-teal-200 dark:border-teal-500/30 shadow-sm"
                    >
                        <Zap className="w-4 h-4 fill-current" />
                        Unlock Analytics
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white"
                    >
                        How to Sync Your Grades
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Follow this 4-step guide to securely import your academic history and unlock the full power of the <strong>Insight Engine</strong>.
                    </motion.p>
                </div>

                {/* STEPS CONTAINER */}
                <div className="space-y-12 relative animate-fade-in-up">
                    {/* Vertical Line for timeline effect */}
                    <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-white/10 hidden md:block" />

                    {/* STEP 1 */}
                    <StepCard
                        number="1"
                        title="Log in to My Account"
                        description="Go to your Concordia Student Hub and log in to your account."
                        icon={LogIn}
                        delay={0.3}
                    >
                        <div className="flex gap-4">
                            <a
                                href="https://hub.concordia.ca/students/account.html"
                                target="_blank"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-900/20 mb-4"
                            >
                                Open My Account <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>
                        <ImagePlaceholder
                            src="/STEPS/STEP 0.jpg"
                            alt="Step 1 - Login"
                            caption="Navigate to your student account page."
                        />
                    </StepCard>

                    {/* STEP 2 (NEW) */}
                    <StepCard
                        number="2"
                        title="Navigate to 'View My Grades'"
                        description="On the homepage left panel, expand the 'Academics' dropdown and select 'View My Grades'. Then select 'Change Term' at the bottom to view all your terms."
                        icon={MousePointerClick}
                        delay={0.35}
                    >
                        <ImagePlaceholder
                            src="/STEPS/STEP 2.jpg"
                            alt="Step 2 - Menu Navigation"
                            caption="Select 'View My Grades' from the Academics menu."
                        />
                    </StepCard>

                    {/* STEP 3 (NEW) */}
                    <StepCard
                        number="3"
                        title="Select Your Term"
                        description="After clicking the Change Term button, select the desired term from the list and hit Continue."
                        icon={MousePointerClick}
                        delay={0.4}
                    >
                        <ImagePlaceholder
                            src="/STEPS/STEP 3.jpg"
                            alt="Step 3 - Select Term"
                            caption="Choose a term (e.g., Fall 2025) and click Continue."
                        />
                    </StepCard>

                    {/* STEP 4 */}
                    <StepCard
                        number="4"
                        title="Select Grade Distribution"
                        description="On the right of the official grade, click the dropdown and select 'Grade Distribution'."
                        icon={MousePointerClick}
                        delay={0.45}
                    >
                        <ImagePlaceholder
                            src="/STEPS/STEP 4.jpg"
                            alt="Step 4 - Select Grade Distribution"
                            caption="Select 'Grade Distribution' from the dropdown."
                        />
                    </StepCard>

                    {/* STEP 5 */}
                    <StepCard
                        number="5"
                        title="Click 'Sync Grades'"
                        description="You will see a floating 'Sync Grades' button on the top. Click on it. You will then see the popup 'campus.concordia.ca says'. Click OK to upload."
                        icon={Zap}
                        delay={0.5}
                    >
                        <ImagePlaceholder
                            src="/STEPS/STEP 5.jpg"
                            alt="Step 5 - Click Sync"
                            caption="Click the Sync button and confirm the popup."
                        />
                    </StepCard>

                    {/* STEP 6 */}
                    <StepCard
                        number="6"
                        title="Upload Successful"
                        description="You will see a new popup that says 'Upload Successful'."
                        icon={CheckCircle}
                        delay={0.55}
                    >
                        <ImagePlaceholder
                            src="/STEPS/STEP 6.jpg"
                            alt="Step 6 - Success"
                            caption="Upload process completed."
                        />
                    </StepCard>

                    {/* STEP 7 */}
                    <StepCard
                        number="7"
                        title="Repeat for Other Terms"
                        description="Repeat these steps for all other terms. So we have more data and we can be more accurate."
                        icon={CheckCircle}
                        delay={0.6}
                        isFinal
                    >
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 rounded-xl mb-4 text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Note:</strong> After a one-time upload, you will see 'DONE' in the top just click that you won't see Sync Data.
                        </div>
                        <ImagePlaceholder
                            src="/STEPS/STEP 7.jpg"
                            alt="Step 7 - Repeat"
                            caption="Improve the dataset by syncing all your terms!"
                        />
                    </StepCard>

                </div>

                {/* FAQ / Trust Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck className="w-8 h-8 text-green-500" />
                        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-gray-400" />
                                Is my data safe?
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Absolutely. We <strong>do not</strong> collect your Student ID, Name, or even your specific letter grades.
                                We only scrape the <em>Grade Distribution Table</em> (how many A's, B's, etc. were in the class) to build our analytics.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-gray-400" />
                                Can I get banned?
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                No. The extension works locally on your browser. It simply reads the HTML of the page you are already looking at.
                                It does not perform any automated bot actions that would flag security systems.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Final CTA */}
                <div className="mt-16 text-center pb-20">
                    <p className="text-gray-500 mb-4">Ready to contribute?</p>
                    <Link
                        href="/insights"
                        className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                    >
                        Back to Insights Dashboard
                    </Link>
                </div>

            </div>
        </div>
    );
}

// Sub-components
function StepCard({ number, title, description, icon: Icon, children, delay, isFinal }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay }}
            className={`relative pl-0 md:pl-24 group ${isFinal ? '' : ''}`}
        >
            {/* Number Bubble (Desktop) */}
            <div className={`hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-2xl items-center justify-center text-2xl font-bold border-4 transition-colors z-10 ${isFinal
                ? "bg-teal-500 border-white dark:border-[#050505] text-white shadow-lg shadow-teal-500/30"
                : "bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-white/10 text-gray-400 group-hover:text-teal-500 group-hover:border-teal-500/30"
                }`}>
                {isFinal ? <Icon className="w-8 h-8" /> : number}
            </div>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center gap-4 mb-4">
                <div className={`flex w-12 h-12 rounded-xl items-center justify-center text-xl font-bold border-2 ${isFinal
                    ? "bg-teal-500 border-teal-600 text-white"
                    : "bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-white/10 text-gray-500"
                    }`}>
                    {number}
                </div>
                <h3 className="text-2xl font-bold">{title}</h3>
            </div>

            {/* Card Content */}
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="hidden md:block text-2xl font-bold mb-3 flex items-center gap-3">
                    {title}
                    {isFinal && <span className="text-xs bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 px-2 py-1 rounded-full uppercase tracking-wider">Complete</span>}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {description}
                </p>
                {children}
            </div>
        </motion.div>
    );
}

function ImagePlaceholder({ src, alt, caption }) {
    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/30">
            {/* 
                NOTE TO USER: 
                Replace the 'src' in the img tag below with your real image path.
                We use 'onError' to show a fallback box if the image isn't found yet.
            */}
            <div className="relative aspect-video w-full flex items-center justify-center bg-gray-100 dark:bg-black/20">
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />

                {/* Fallback Display (Shown if image missing) */}
                <div className="hidden absolute inset-0 flex-col items-center justify-center text-gray-400 p-4 text-center">
                    <div className="w-16 h-16 mb-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center">
                        <span className="font-mono text-xl font-bold opacity-50">IMG</span>
                    </div>
                    <p className="text-xs font-mono">{src}</p>
                    <p className="text-[10px] opacity-70 mt-1 uppercase tracking-wider">Place image here</p>
                </div>
            </div>
            {caption && (
                <div className="px-4 py-3 bg-gray-100/50 dark:bg-white/5 border-t border-gray-200 dark:border-white/5">
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 font-medium">
                        {caption}
                    </p>
                </div>
            )}
        </div>
    );
}
