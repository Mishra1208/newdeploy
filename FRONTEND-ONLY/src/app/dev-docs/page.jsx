"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Folder, File, Terminal, Server, Layers, Globe, Database, Shield, Check, Star, GitBranch, Rocket, Settings, Lock, Eye, EyeOff, Puzzle, Download, CalendarDays } from "lucide-react";

// ... (abbrev) ...

const SECTIONS = [
    { id: "overview", label: "Project Overview", icon: Globe },
    { id: "status", label: "Status & Roadmap", icon: Shield },
    { id: "tech-stack", label: "Tech Stack", icon: Layers },
    { id: "directory", label: "Folder Structure", icon: Folder },
    { id: "env", label: "Environment & Config", icon: Settings },
    { id: "commands", label: "Commands & Installation", icon: Terminal },
    { id: "page-guide", label: "Page Dictionary", icon: File },
    { id: "component-map", label: "Component Map", icon: Database },
    { id: "features", label: "Feature Spotlights", icon: Star },
    { id: "git", label: "Git & Version Control", icon: GitBranch },
    { id: "deploy", label: "Deployments", icon: Rocket },
    { id: "moodle", label: "Moodle Integration", icon: Puzzle },
];

// ... (existing code) ...



const ARCHITECTURE_DIAGRAM = `
graph TD
    User((User)) -->|HTTPS| CDN[Vercel CDN]
    CDN -->|Next.js App| FE[Frontend (Next.js 15)]
    
    subgraph Client [Client Side]
        FE -->|React Components| UI[UI Interface]
        FE -->|Zustand| State[Global State]
    end

    subgraph API_Layer [API Routes]
        FE -- /api/smart-chat --> ChatAPI[Next.js Chat API]
        FE -- /api/verify --> VerifyAPI[Email Verification]
    end

    subgraph Backend_Services [Backend Services]
        ChatAPI -- HTTP --> CommunityServer[ConU Community Server (Express)]
        CommunityServer -- GraphQL --> RMP[RateMyProfessors API]
        CommunityServer -- API --> Reddit[Reddit API]
    end

    subgraph Database_Layer [Data Persistence]
        FE -- Clerk SDK --> Auth[Clerk Auth]
        VerifyAPI --> Supabase[Supabase DB]
    end
`;

export default function DevDocs() {
    const [activeSection, setActiveSection] = useState("overview");

    // --- Authentication State ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(""); // Track who logged in
    const [passwordInput, setPasswordInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Check session persistence (sessionStorage is cleared when tab closes)
        const isVerified = sessionStorage.getItem("dev_docs_verified");
        const savedUser = sessionStorage.getItem("dev_docs_user");
        if (isVerified === "true") {
            setIsAuthenticated(true);
            if (savedUser) setCurrentUser(savedUser);
        }
    }, []);


    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/docs-log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: passwordInput,
                    userAgent: navigator.userAgent,
                    locationInfo: Intl.DateTimeFormat().resolvedOptions().timeZone
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setIsAuthenticated(true);
                const userName = data.user || "Developer";
                setCurrentUser(userName);
                sessionStorage.setItem("dev_docs_verified", "true");
                sessionStorage.setItem("dev_docs_user", userName);
            } else {
                setError("Access Denied");
            }
        } catch (err) {
            setError("Connection Error");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-[9999] bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white flex items-center justify-center p-4 transition-colors duration-300">
                <div className="max-w-md w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-2xl transition-colors duration-300">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4 border border-purple-200 dark:border-purple-500/20 transition-colors">
                            <Lock className="text-purple-600 dark:text-purple-400" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                            Developer Access
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-500 mt-2 text-center">
                            This resource is restricted. Please authenticate to continue.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Enter Access Key"
                                className="w-full bg-gray-100 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition font-mono text-sm"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-white transition"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {error && (
                            <div className="text-red-700 dark:text-red-400 text-xs text-center font-medium bg-red-100 dark:bg-red-900/10 py-2 rounded-lg border border-red-200 dark:border-red-500/20">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${isLoading
                                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20"
                                }`}
                        >
                            {isLoading ? "Verifying..." : "Unlock Documentation"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                            Authorized Personnel Only
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white font-sans selection:bg-purple-500/30 transition-colors duration-300">

            {/* Sidebar */}
            <div className="fixed left-0 top-0 bottom-0 w-64 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-6 z-50 flex flex-col transition-colors duration-300">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-lg text-white">CP</div>
                    <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">Dev Docs</span>
                </div>

                <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
                    {SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeSection === section.id
                                ? "bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-600/30"
                                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                                }`}
                        >
                            <section.icon size={18} />
                            {section.label}
                        </button>
                    ))}

                    <div className="my-2 border-t border-gray-200 dark:border-white/10" />

                    <button
                        onClick={() => {
                            sessionStorage.removeItem("dev_docs_verified");
                            sessionStorage.removeItem("dev_docs_user");
                            setIsAuthenticated(false);
                            setCurrentUser("");
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300"
                    >
                        <Lock size={18} />
                        Logout
                    </button>
                </nav>

                <div className="mt-4">
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-xs text-red-800 dark:text-red-200">
                        ⚠️ <strong>INTERNAL USE ONLY</strong><br />
                        This overlay hides the main site.
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="pl-64 min-h-screen">
                <div className="max-w-5xl mx-auto p-12">

                    {/* Header */}
                    <header className="mb-16">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-4">
                            ConU Planner Developer Guide
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
                            The comprehensive architectural manual for the ConU Planner ecosystem.
                            Understanding how the Next.js frontend interacts with the Community Server and external APIs.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <a href="https://github.com/Mishra1208/newdeploy" target="_blank" rel="noopener noreferrer"
                                className="px-5 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium transition flex items-center gap-2 shadow-sm dark:shadow-none">
                                <GitBranch size={18} className="text-gray-500 dark:text-gray-400" />
                                <span>GitHub Repository</span>
                            </a>
                            <a href="https://www.conuplanner.com/" target="_blank" rel="noopener noreferrer"
                                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/20">
                                <Globe size={18} />
                                <span>Live Website</span>
                            </a>
                            <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer"
                                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-black dark:hover:bg-gray-900 border border-gray-800 dark:border-white/20 text-white font-medium transition flex items-center gap-2">
                                <Rocket size={18} className="text-white" />
                                <span>Vercel Dashboard</span>
                            </a>
                        </div>
                    </header>

                    {/* Content Sections */}
                    <div className="space-y-20">

                        {/* 1. OVERVIEW */}
                        <section id="overview" className={activeSection === 'overview' ? 'block' : 'hidden'}>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Globe className="text-purple-600 dark:text-purple-500" /> Welcome to the Team{currentUser ? `, ${currentUser}` : ""}
                            </h2>
                            <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                                <p className="leading-relaxed">
                                    Hey{currentUser ? ` ${currentUser}` : ""}! 👋 If you're reading this, you probably just joined the project. <strong className="text-gray-900 dark:text-white">Welcome aboard.</strong>
                                </p>
                                <p className="leading-relaxed">
                                    Let's be real: trying to plan your degree at Concordia is a nightmare. The official tools are clunky,
                                    information is scattered across a dozen websites, and you never really know what you're getting into
                                    until it's too late. <strong className="text-gray-900 dark:text-white">We built ConU Planner to fix that.</strong>
                                </p>
                                <p className="leading-relaxed">
                                    Our mission is simple: <strong className="text-gray-900 dark:text-white">Make academic planning actually feel good.</strong> We want to give students
                                    superpowers like seeing a professor's rating <em>before</em> they enroll, understanding prerequisites visually instead of
                                    reading boring text, and knowing the "vibe" of a class from real student discussions.
                                </p>
                                <p className="leading-relaxed">
                                    We aren't just building a utility; we're building a <strong className="text-gray-900 dark:text-white">premium experience</strong>. That's why everything looks sleek,
                                    moves smoothly, and feels responsive. We use "Chromatic" themes (Aurora, Deep Space, etc.) to make the boring
                                    task of course selection feel like exploring a universe.
                                </p>

                                <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 mt-8 shadow-sm">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How it all works (The "Big Picture")</h3>
                                    <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                                        <li className="flex gap-3">
                                            <span className="text-2xl">🎨</span>
                                            <div>
                                                <strong className="text-gray-900 dark:text-white">The Frontend (Your main playground)</strong>
                                                <p className="text-sm mt-1">
                                                    Located in <code className="bg-gray-100 dark:bg-white/10 px-1 py-0.5 rounded text-purple-600 dark:text-purple-400 font-mono">FRONTEND-ONLY/src</code>. This is where 90% of the magic happens. It's a <strong>Next.js 15</strong> app.
                                                    If you want to change how a button looks, add a new page, or fix a typo, you do it here.
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-2xl">🐙</span>
                                            <div>
                                                <strong className="text-gray-900 dark:text-white">The "Heavy Lifter" Backend</strong>
                                                <p className="text-sm mt-1">
                                                    Located in <code className="bg-gray-100 dark:bg-white/10 px-1 py-0.5 rounded text-purple-600 dark:text-purple-400 font-mono">conu-community-server</code>. The frontend is pretty, but it can't do everything.
                                                    We have a separate little server (Express.js) that handles the "dirty work" like scraping Rate My Professors
                                                    or fetching Reddit posts. The frontend calls this server when it needs that extra data.
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="p-6 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-500/20 mt-8">
                                    <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-2">🔥 Community Feedback Loop</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        We don't build in a vacuum. We have an active Reddit thread where students report bugs and request features.
                                        <strong className="text-gray-900 dark:text-white ml-1">It is your responsibility to monitor this thread.</strong>
                                    </p>
                                    <a href="https://www.reddit.com/r/Concordia/comments/1qi4ro7/built_a_better_course_planner_for_us_because_the/" target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-100 dark:bg-orange-500/10 hover:bg-orange-200 dark:hover:bg-orange-500/20 text-orange-700 dark:text-orange-400 font-bold transition border border-orange-200 dark:border-orange-500/20">
                                        <Globe size={16} />
                                        <span>View Feedback Board (Reddit)</span>
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* 1.5 STATUS & ROADMAP */}
                        <section id="status" className={activeSection === 'status' ? 'block' : 'hidden'}>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Shield className="text-purple-600 dark:text-purple-500" /> Status & Roadmap
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* LIVE FEATURES */}
                                <div className="p-6 rounded-3xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/20">
                                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-6 flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        Live & Operational
                                    </h3>
                                    <ul className="space-y-3">
                                        <StatusItem text="Course Search (7,900+ Courses)" active />
                                        <StatusItem text="Prerequisite Tree Visualization" active />
                                        <StatusItem text="Seat Finder (Open/Closed Only)" active />
                                        <StatusItem text="GPA Calculator (Semester & CGPA)" active />
                                        <StatusItem text="Academic Insights Engine (Course Analytics)" active />
                                        <StatusItem text="Professor Comparison Tool" active />
                                        <StatusItem text="Smart Chat Widget (RMP Support)" active highlight />
                                        <StatusItem text="Custom Branded Verification Page" active highlight />
                                        <StatusItem text="Dark Mode / Chromatic Themes" active />
                                    </ul>
                                </div>

                                {/* READY FOR PRODUCTION (STAGED) */}
                                <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20">
                                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-6 flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                                        Ready to Merge
                                    </h3>
                                    <ul className="space-y-3">
                                        <StatusItem text="VSB Calendar Exporter (Extension)" active highlight />
                                        <StatusItem text="Automated Term Dates Scraper" active highlight />
                                        <StatusItem text="Extension Premium UI & Branding" active />
                                        <StatusItem text="Extension Packaging Script" active />
                                        <li className="p-3 rounded-xl bg-blue-100 dark:bg-blue-800/20 border border-blue-200 dark:border-blue-500/30 mt-4">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5">🚀</div>
                                                <div>
                                                    <div className="font-bold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider">Merge Strategy</div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                                                        These features are verified on <code>fix/vsb-final-polish</code>. Merge to <code>main</code> to deploy live.
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* FUTURE ROADMAP */}
                                <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-500/20">
                                    <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-6 flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                                        Coming Soon
                                    </h3>
                                    <ul className="space-y-3">
                                        <StatusItem text="Professor Compass (RMP Overlay in VSB)" active highlight />
                                        <StatusItem text="Seat Sniper (Background Seat Alerts)" active highlight />
                                        <StatusItem text="Classmate Finder (Social Overlay)" active highlight />
                                        <StatusItem text="Moodle File Downloader (ZIP Bundle)" highlight />
                                        <StatusItem text="Moodle Calendar Sync (.ics)" highlight />
                                        <StatusItem text="Student Social Network (Chat & Friends)" highlight />
                                        <StatusItem text="Cloud Schedule Sync (Fix Data Loss)" highlight />
                                        <StatusItem text="Gamification (XP & Levels)" highlight />
                                        <StatusItem text="User Profiles & Saved Schedules (MongoDB)" highlight />
                                        <StatusItem text="Leaderboards (Top Contributors)" />
                                        <StatusItem text="1-Click Auto-Plan (Prerequisite-Aware)" />
                                        <StatusItem text="Anonymous Course Reviews Section" />
                                    </ul>
                                </div>
                            </div>

                            {/* UI REFINEMENT STRATEGY */}
                            <div className="mt-8 p-8 rounded-3xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-500/20">
                                <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-3">
                                    <Settings className="animate-spin-slow" /> UI Refinement & Strategy
                                </h3>
                                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                    <p>
                                        We are actively exploring <strong className="text-orange-700 dark:text-orange-400">Chakra UI</strong> integration specifically to elevate our <strong>typography and layout consistency</strong>.
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2 text-sm">
                                        <li>Improve text hierarchy and readability for course descriptions.</li>
                                        <li>Implement cleaner, more professional spacing across complex components.</li>
                                        <li>Maintain our custom "Tech-Elegant" animations while adopting more refined typography defaults.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* INTELLIGENT EXTENSION & AUTH STRATEGY */}
                            <div className="mt-8 p-8 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20">
                                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-3">
                                    <Puzzle className="w-6 h-6 animate-pulse" /> Intelligent Extension & Auth (Phase 17)
                                </h3>
                                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                    <p>
                                        We are building a <strong>Chrome Extension</strong> to automate the retrieval of degree audits from Concordia's portal, creating a seamless "One-Click" import experience.
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2 text-sm">
                                        <li><strong>Automation:</strong> Auto-expand all sections and scrape HTML from <code>campus.concordia.ca</code>.</li>
                                        <li><strong>Direct Send:</strong> Instantly transfer data to Localhost via memory (no file download needed).</li>
                                        <li><strong>Auth Integration:</strong> If user is logged in, automatically <strong className="text-green-600 dark:text-green-400">save progress</strong> to their database profile.</li>
                                        <li><strong>Privacy First:</strong> No data leaves the user's machine (except strictly for saving to their own account).</li>
                                    </ul>
                                </div>
                            </div>


                        </section>



                        {/* 1.6 FEATURE SPOTLIGHTS */}
                        <section id="features" className={activeSection === 'features' ? 'block' : 'hidden'}>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <Star className="text-purple-600 dark:text-purple-500" /> Feature Spotlights
                            </h2>

                            <div className="space-y-8">
                                <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">Planner Export System (Excel)</h3>
                                        <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase">
                                            Client-Side Logic
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Target Audience</div>
                                                <p className="text-gray-600 dark:text-gray-300">Students who need a tangible, offline copy of their semester schedules.</p>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Purpose (Why?)</div>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Provides portability. Students can save their planned courses, share the file, or print it.
                                                    It ensures they own their data outside of the browser's LocalStorage.
                                                </p>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Location</div>
                                                <p className="font-mono text-sm text-purple-600 dark:text-purple-400">src/lib/exportPlannerExcel.js</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">How It Works</div>
                                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-4">
                                                    <li>Fetches a blank template <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">/MyPlannedCourses.xlsx</code> from the public folder.</li>
                                                    <li>Uses <strong>xlsx-populate</strong> library to parse the file buffer.</li>
                                                    <li>Iterates through the user's LocalStorage planner data.</li>
                                                    <li>Injects data into specific cells (e.g., B10, C10) based on semester coordinates.</li>
                                                    <li>Generates a generic Blob object and triggers a browser download.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Feature 2: Inner Circle (Newsletter) */}
                                <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400">Inner Circle System (Google Sheets API)</h3>
                                        <div className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-bold uppercase">
                                            Server-Side Logic
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Purpose</div>
                                                <p className="text-gray-600 dark:text-gray-300">Collects emails for the newsletter ("Inner Circle"). Auto-deduplicates entries.</p>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Location</div>
                                                <p className="font-mono text-sm text-purple-600 dark:text-purple-400">src/app/api/subscribe/route.js</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">How It Works</div>
                                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-4">
                                                    <li>User submits email via Footer or Home modal.</li>
                                                    <li>Request hits Next.js API route <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">/api/subscribe</code>.</li>
                                                    <li>Server authenticates with Google using <strong>Service Account Credentials</strong>.</li>
                                                    <li>Checks for duplicates in the Sheet using <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">googleapis</code>.</li>
                                                    <li>Appends new row if unique.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Feature 3: Contact Form */}
                                <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Contact & Recruitment Form</h3>
                                        <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase">
                                            Client-Side Google Apps Script
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Purpose</div>
                                                <p className="text-gray-600 dark:text-gray-300">Receives applications for developers, designers, and feedback. Bypasses our backend.</p>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Location</div>
                                                <p className="font-mono text-sm text-purple-600 dark:text-purple-400">src/app/contact/page.jsx</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">How It Works</div>
                                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-4">
                                                    <li>Form data (Name, Email, Role) is captured in React state.</li>
                                                    <li>Submitted via <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">fetch()</code> to a public <a href="https://script.google.com/macros/s/AKfycbyR0Sk7Zo1fIqlUHWztNHKZj-6ywIbBNTh8iCYj1KfYWdavUySG-cOIYvsTvJuQFwPW/exec" target="_blank" className="text-blue-600 dark:text-blue-400 underline">Google Apps Script URL</a>.</li>
                                                    <li>Uses <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">mode: 'no-cors'</code> to avoid browser restrictions.</li>
                                                    <li>The Script appends the data to a private recruitment Google Sheet.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 1.7 GIT & VERSION CONTROL */}
                        <section id="git" className={activeSection === 'git' ? 'block' : 'hidden'}>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <GitBranch className="text-purple-600 dark:text-purple-500" /> Git & Version Control
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Workflow Info */}
                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                                        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Current Workflow</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                            Repository: <a href="https://github.com/Mishra1208/newdeploy" target="_blank" className="text-purple-600 dark:text-purple-400 underline font-mono">Mishra1208/newdeploy</a>
                                            <br />
                                            We use a <strong>Feature Branch Workflow</strong>.
                                            Direct commits to <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">main</code> are allowed only for hotfixes.
                                            For major changes, create a new branch, work on it, and then merge.
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="px-2 py-1 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-mono text-xs">main</div>
                                                <span className="text-gray-600 dark:text-gray-500">Production-ready code. Always stable.</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 font-mono text-xs">design-overhaul</div>
                                                <span className="text-gray-600 dark:text-gray-500">Active branch for UI rework.</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20">
                                        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Emergency & Recovery</h3>
                                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                            <li>
                                                <strong className="text-red-700 dark:text-red-200">Undo commit (keep changes):</strong>
                                                <div className="font-mono bg-white dark:bg-black/40 p-2 rounded mt-1 text-xs border border-red-100 dark:border-transparent">git reset --soft HEAD~1</div>
                                            </li>
                                            <li>
                                                <strong className="text-red-700 dark:text-red-200">Discard all local changes:</strong>
                                                <div className="font-mono bg-white dark:bg-black/40 p-2 rounded mt-1 text-xs border border-red-100 dark:border-transparent">git checkout .</div>
                                            </li>
                                            <li>
                                                <strong className="text-red-700 dark:text-red-200">Check history:</strong>
                                                <div className="font-mono bg-white dark:bg-black/40 p-2 rounded mt-1 text-xs border border-red-100 dark:border-transparent">git log --oneline --graph</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Common Commands */}
                                <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                                    <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4">Essential Commands</h3>
                                    <div className="space-y-4">
                                        <CmdItem cmd="git branch feature-name" desc="Create a new branch." />
                                        <CmdItem cmd="git checkout feature-name" desc="Switch to that branch." />
                                        <CmdItem cmd="git add ." desc="Stage all changes." />
                                        <CmdItem cmd="git commit -m 'message'" desc="Commit staged changes." />
                                        <CmdItem cmd="git push origin main" desc="Upload local commits to GitHub." />
                                        <CmdItem cmd="git pull" desc="Download latest changes." />
                                        <CmdItem cmd="git merge feature-name" desc="Merge changes from branch into current." />
                                        <CmdItem cmd="git status" desc="See which files have changed." />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 1.8 DEPLOYMENTS & DOMAINS */}
                        <section id="deploy" className={activeSection === 'deploy' ? 'block' : 'hidden'}>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <Rocket className="text-purple-600 dark:text-purple-500" /> Deployments & Domains
                            </h2>

                            <div className="space-y-8">
                                {/* Frontend Deployment */}
                                <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Frontend Deployment (Vercel)</h3>
                                        <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-bold uppercase text-gray-600 dark:text-gray-300">Next.js App</div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Infrastructure</div>
                                                <p className="text-gray-600 dark:text-gray-300">Hosted on <a href="https://vercel.com/dashboard" target="_blank" className="text-gray-900 dark:text-white font-bold hover:underline">Vercel</a>. Handles the Next.js App Router, serverless API routes, and global CDN.</p>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Git Integration</div>
                                                <p className="text-gray-600 dark:text-gray-300">Continuous Deployment (CD) linked to the <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">main</code> branch of our GitHub repository.</p>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Live URL</div>
                                                <a href="https://www.conuplanner.com/" target="_blank" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-mono text-sm">
                                                    https://www.conuplanner.com/
                                                </a>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Triggering a Build</div>
                                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-4">
                                                    <li><strong className="text-gray-900 dark:text-white">Push to Main:</strong> Triggers Production build (conuplanner.com).</li>
                                                    <li><strong className="text-gray-900 dark:text-white">Push to Branch:</strong> Triggers Preview build (unique URL).</li>
                                                </ul>
                                            </div>

                                            <div className="p-4 rounded-xl bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/30">
                                                <h4 className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
                                                    <GitBranch size={14} /> Professor Analytics Deployment
                                                </h4>
                                                <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                                                    The redesign and comparison features are currently on the <code className="bg-white/50 dark:bg-black/50 px-1 rounded font-mono">feature/professor-analytics-redesign</code> branch.
                                                    <strong> MUST be merged to main before New Term starts.</strong>
                                                </p>
                                                <div className="font-mono text-[10px] bg-white dark:bg-black/50 p-2 rounded border border-purple-200 dark:border-white/10 space-y-1">
                                                    <div>git checkout main</div>
                                                    <div>git merge feature/professor-analytics-redesign</div>
                                                    <div>git push origin main</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Backend Deployment */}
                                <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Backend Deployment (Render)</h3>
                                        <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase">Express Server</div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Infrastructure</div>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    The <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">conu-community-server</code> runs as a Web Service on <a href="https://dashboard.render.com/" target="_blank" className="text-gray-900 dark:text-white font-bold hover:underline">Render</a>.
                                                    It stays awake to handle scraping requests (Puppeteer/GraphQL) that are too heavy for Vercel Serverless.
                                                </p>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Service URL</div>
                                                <a href="https://newdeploy-zibv.onrender.com" target="_blank" className="text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 font-mono text-sm break-all">
                                                    https://newdeploy-zibv.onrender.com
                                                </a>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Deployment Logic</div>
                                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-4">
                                                    <li><strong className="text-gray-900 dark:text-white">Root Directory:</strong> Configured to deploy from <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">/conu-community-server</code>.</li>
                                                    <li><strong className="text-gray-900 dark:text-white">Build Command:</strong> <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">npm install</code></li>
                                                    <li><strong className="text-gray-900 dark:text-white">Start Command:</strong> <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">node server.js</code></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Domains */}
                                <div className="p-8 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Domain Management</h3>
                                        <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase">
                                            Automated SSL
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        Our custom domain is configured directly in Vercel settings.
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-4">
                                        <li>Vercel automatically provisions and renews <strong>SSL Certificates</strong> (HTTPS).</li>
                                        <li>It handles DNS routing to the nearest edge location for the user.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 2. PAGE GUIDE (Dictionary) */}
                        <section id="page-guide" className={activeSection === 'page-guide' ? 'block' : 'hidden'}>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <File className="text-purple-600 dark:text-purple-500" /> Page & Route Dictionary
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
                                A complete map of every user-facing page, where the code lives, and how it gets its data.
                            </p>

                            <div className="grid grid-cols-1 gap-6">

                                {/* Landing Page */}
                                <PageCard
                                    title="Landing Page"
                                    route="/"
                                    file="src/app/page.jsx"
                                    desc="The main entry point. Showcases the Hero section, Features grid, and Call-to-Actions."
                                    coordination="Purely presentation. Links to all other tools. Loads 'PremiumNavbar' from layout."
                                />

                                {/* Course Catalog */}
                                <PageCard
                                    title="Course Catalog"
                                    route="/pages/courses"
                                    file="src/app/pages/courses/page.jsx"
                                    desc="The core search engine. Users browse and filter 7,900+ Concordia courses."
                                    coordination="FETCH: Loads 'public/course_index.json' (client-side). No DB filtering—it's all in-memory for speed."
                                />

                                {/* Prerequisite Tree */}
                                <PageCard
                                    title="Prerequisite Tree"
                                    route="/pages/tree"
                                    file="src/app/pages/tree/page.jsx"
                                    desc="Interactive node graph showing course dependencies (Prereqs/Coreqs)."
                                    coordination="VIZ: Uses 'ReactFlow' library. Parsing logic runs client-side to build the graph nodes/edges."
                                />

                                {/* GPA Calculator */}
                                <PageCard
                                    title="GPA Calculator"
                                    route="/pages/gpa"
                                    file="src/app/pages/gpa/page.jsx"
                                    desc="Utility tool for calculating Semester and Cumulative GPA."
                                    coordination="LOGIC: Pure React state. No backend interaction. LocalStorage used for saving drafts."
                                />

                                {/* Seat Finder */}
                                <PageCard
                                    title="Seat Finder"
                                    route="/pages/seat-finder"
                                    file="src/app/pages/seat-finder/page.jsx"
                                    desc="Checks if a specific class section is full or open."
                                    coordination="BACKEND: Sends request to Community Server, which launches Puppeteer to scrape the Concordia My Student Center."
                                />

                                {/* About Us */}
                                <PageCard
                                    title="About Us"
                                    route="/about"
                                    file="src/app/about/page.jsx"
                                    desc="Team info, mission statement, and origins."
                                    coordination="STATIC: Presentation only."
                                />

                                {/* Professor Insights */}
                                <PageCard
                                    title="Professor Insights & Comparison"
                                    route="/pages/professor-comparison"
                                    file="src/app/pages/professor-comparison/page.jsx"
                                    desc="Detailed professor data and side-by-side comparison tool."
                                    coordination="LIVE: Fully integrated with RMP API."
                                    highlight
                                />

                                {/* Insights Landing */}
                                <PageCard
                                    title="Insights Engine"
                                    route="/insights"
                                    file="src/app/insights/page.jsx"
                                    desc="The main dashboard for course analytics and grade distribution."
                                    coordination="LIVE: Fetches data via Google Sheets Live Sync."
                                />

                                {/* API: Smart Chat */}
                                <PageCard
                                    title="API: Smart Chat"
                                    route="/api/smart-chat"
                                    file="src/app/api/smart-chat/route.js"
                                    desc="The AI backend route for the ChatWidget."
                                    coordination="ROUTER: Decisions -> If 'RMP' intent, call Community Server. If 'Course' intent, search local JSON. If 'Reddit', call Reddit API."
                                    isApi
                                />

                            </div>
                        </section>

                        {/* 2. TECH STACK */}
                        <section id="tech-stack" className={activeSection === 'tech-stack' ? 'block' : 'hidden'}>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <Layers className="text-purple-600 dark:text-purple-500" /> Technology Stack
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Frontend */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-white/10 pb-2">Frontend Core</h3>
                                    <TechItem name="Next.js 15" desc="React Framework (App Router)" tag="Core" color="bg-gray-800 text-white dark:bg-white dark:text-black" />
                                    <TechItem name="React 19" desc="UI Library" tag="UI" color="bg-blue-600 text-white" />
                                    <TechItem name="TailwindCSS" desc="Utility-first styling" tag="Style" color="bg-cyan-600 text-white" />
                                    <TechItem name="Framer Motion" desc="Complex animations & transitions" tag="Animation" color="bg-purple-600 text-white" />
                                    <TechItem name="ReactFlow" desc="Interactive prerequisite tree graphs" tag="Viz" color="bg-pink-600 text-white" />
                                </div>

                                {/* Backend & Data */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-white/10 pb-2">Backend & Data</h3>
                                    <TechItem name="Express.js" desc="Community Server API" tag="Server" color="bg-green-600 text-white" />
                                    <TechItem name="Google Gemini 1.5" desc="AI Chatbot Model" tag="AI" color="bg-blue-500 text-white" />
                                    <TechItem name="Puppeteer" desc="Headless browser for scraping" tag="Scraper" color="bg-emerald-600 text-white" />
                                    <TechItem name="Prisma + MongoDB" desc="User Data & Gamification (Phase 5)" tag="Database" color="bg-green-700 text-white" />
                                    <TechItem name="Clerk" desc="User Authentication" tag="Auth" color="bg-indigo-600 text-white" />
                                    <TechItem name="Google Sheets API" desc="Live Data Sync" tag="CMS" color="bg-green-500 text-white" />
                                </div>
                            </div>
                        </section>

                        {/* 3. ENVIRONMENT & CONFIG */}
                        <section id="env" className={activeSection === 'env' ? 'block' : 'hidden'}>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <Settings className="text-purple-600 dark:text-purple-500" /> Environment & Configuration
                            </h2>

                            <div className="space-y-8">
                                <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Required Variables (.env.local)</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        These keys are required for the application to run locally. Ensure they are present in your local environment file.
                                    </p>

                                    <div className="space-y-4">

                                        {/* Clerk Authentication */}
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</div>
                                                <div className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-[10px] uppercase">Public</div>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-500 mb-2">Public key for Clerk Auth SDK.</div>
                                            <div className="text-xs text-gray-700 dark:text-gray-600 bg-white dark:bg-white/5 p-2 rounded border border-gray-200 dark:border-white/5">
                                                <strong>Where to find:</strong> Clerk Dashboard &gt; API Keys
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">CLERK_SECRET_KEY</div>
                                                <div className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-[10px] uppercase">Secret</div>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-500 mb-2">Backend secret key for Clerk.</div>
                                            <div className="text-xs text-gray-700 dark:text-gray-600 bg-white dark:bg-white/5 p-2 rounded border border-gray-200 dark:border-white/5">
                                                <strong>Where to find:</strong> Clerk Dashboard &gt; API Keys
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5">
                                            <div className="flex flex-col gap-2 mb-2">
                                                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">NEXT_PUBLIC_CLERK_SIGN_IN_URL</span>
                                                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">NEXT_PUBLIC_CLERK_SIGN_UP_URL</span>
                                                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL</span>
                                                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL</span>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-500 mb-2">Redirect paths for authentication flows.</div>
                                            <div className="text-xs text-gray-700 dark:text-gray-600 bg-white dark:bg-white/5 p-2 rounded border border-gray-200 dark:border-white/5">
                                                <strong>Where to find:</strong> Clerk Dashboard &gt; Paths
                                            </div>
                                        </div>

                                        {/* Google Gemini AI */}
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-mono text-xs font-bold text-pink-600 dark:text-pink-400">GOOGLE_GENERATIVE_AI_API_KEY</div>
                                                <div className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-[10px] uppercase">Secret</div>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-500 mb-2">API Key for Gemini Models (AI Chat).</div>
                                            <div className="text-xs text-gray-700 dark:text-gray-600 bg-white dark:bg-white/5 p-2 rounded border border-gray-200 dark:border-white/5">
                                                <strong>Where to find:</strong> <a href="https://aistudio.google.com/" target="_blank" className="underline hover:text-black dark:hover:text-white">Google AI Studio</a> &gt; Get API Key
                                            </div>
                                        </div>

                                        {/* Google Sheets API */}
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-mono text-xs font-bold text-orange-600 dark:text-orange-400">GOOGLE_CLIENT_EMAIL</div>
                                                <div className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-[10px] uppercase">Secret</div>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-500 mb-2">Service Account Email for accessing Google Sheets (Inner Circle).</div>
                                            <div className="text-xs text-gray-700 dark:text-gray-600 bg-white dark:bg-white/5 p-2 rounded border border-gray-200 dark:border-white/5">
                                                <strong>Where to find:</strong> Google Cloud Console &gt; IAM & Admin &gt; Service Accounts
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-mono text-xs font-bold text-orange-600 dark:text-orange-400">GOOGLE_PRIVATE_KEY</div>
                                                <div className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-[10px] uppercase">Secret</div>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-500 mb-2">Service Account Private Key. (Must replace `\n` in Vercel).</div>
                                            <div className="text-xs text-gray-700 dark:text-gray-600 bg-white dark:bg-white/5 p-2 rounded border border-gray-200 dark:border-white/5">
                                                <strong>Where to find:</strong> Google Cloud Console &gt; Service Accounts &gt; Keys (Generate New JSON Key)
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">GOOGLE_SHEET_ID</div>
                                                <div className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-[10px] uppercase">Config</div>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-500 mb-2">The ID of the `ConU Planner - Early Access` Google Sheet.</div>
                                            <div className="text-xs text-gray-700 dark:text-gray-600 bg-white dark:bg-white/5 p-2 rounded border border-gray-200 dark:border-white/5">
                                                <strong>Where to find:</strong> The string between <code className="bg-gray-200 dark:bg-white/10 px-1 rounded">/d/</code> and <code className="bg-gray-200 dark:bg-white/10 px-1 rounded">/edit</code> in the Sheet URL.
                                            </div>
                                        </div>

                                        {/* Backend Coordination */}
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-mono text-xs font-bold text-green-600 dark:text-green-400">COMMUNITY_API_URL</div>
                                                <div className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-[10px] uppercase">Config</div>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-500 mb-2">URL of the backend server. Defaults to `http://localhost:4000`.</div>
                                            <div className="text-xs text-gray-700 dark:text-gray-600 bg-white dark:bg-white/5 p-2 rounded border border-gray-200 dark:border-white/5">
                                                <strong>Where to find:</strong> Your deployed backend URL (Render/Railway) or localhost port.
                                            </div>
                                        </div>

                                        {/* Database Config */}
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-mono text-xs font-bold text-green-600 dark:text-green-400">DATABASE_URL</div>
                                                <div className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-[10px] uppercase">Secret</div>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-500 mb-2">MongoDB Connection String (for Prisma).</div>
                                            <div className="text-xs text-gray-700 dark:text-gray-600 bg-white dark:bg-white/5 p-2 rounded border border-gray-200 dark:border-white/5">
                                                <strong>Where to find:</strong> MongoDB Atlas &gt; Connect &gt; Application
                                            </div>
                                        </div>

                                        {/* Key Storage Info */}
                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 text-xs text-gray-500">
                                            <strong className="text-purple-600 dark:text-purple-400">Storage Location:</strong>
                                            <ul className="list-disc pl-4 mt-1 space-y-1">
                                                <li><strong>Local:</strong> Create a <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">.env.local</code> file in `FRONTEND-ONLY/`.</li>
                                                <li><strong>Production:</strong> Add to Vercel Dashboard &gt; Settings &gt; Environment Variables.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. COMPONENT MAP */}
                        <section id="component-map" className={activeSection === 'component-map' ? 'block' : 'hidden'}>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Database className="text-purple-600 dark:text-purple-500" /> Component Coordination Map
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
                                This diagram visualizes how individual files and components talk to each other.
                                It shows the flow from the Layout down to specific pages and how they trigger backend actions.
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                                    <h3 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-4">Core Flow</h3>
                                    <ul className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">
                                        <li className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold text-xs">1</div>
                                            <div><strong>Root Layout (layout.jsx)</strong>wraps EVERYTHING. It holds the Navbar, Footer, and ChatWidget so they appear on every page.</div>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold text-xs">2</div>
                                            <div><strong>Pages (page.jsx)</strong> are injected inside the layout. Each folder in <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">app/</code> represents a route.</div>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold text-xs">3</div>
                                            <div><strong>ChatWidget</strong> is unique. It floats independently and calls <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">/api/smart-chat</code> to get answers.</div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center">
                                    <img
                                        src="/Devdocs dig.svg"
                                        alt="Component Diagram"
                                        className="w-full h-auto rounded-lg shadow-md"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 5. DIRECTORY STRUCTURE */}
                        <section id="directory" className={activeSection === 'directory' ? 'block' : 'hidden'}>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Folder className="text-purple-600 dark:text-purple-500" /> Key Directories
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                The project follows a <strong>Monorepo-style</strong> structure. The root directory contains the Next.js frontend, while the backend lives in its own isolated folder.
                            </p>
                            <div className="space-y-4">
                                <DirItem path="src/app" desc="Main application routes (Next.js App Router). Pages live here." />
                                <DirItem path="src/components" desc="Reusable UI components (Navbar, Buttons, Cards)." />
                                <DirItem path="conu-community-server" desc="Express backend for RMP/Reddit scraping. Runs on port 4000." />
                                <DirItem path="src/app/insights" desc="New Insights Engine pages." />
                                <DirItem path="src/components/insights" desc="Charts and analytics components." />
                                <DirItem path="public/data" desc="Static JSON files for course data (generated by scripts)." />
                                <DirItem path="scripts" desc="Python/Node scripts to generate course indexes from CSVs." />
                                <DirItem path="emails" desc="HTML email templates for notifications." />
                            </div>
                        </section>

                        {/* 6. COMMANDS & INSTALLATION */}
                        <section id="commands" className={activeSection === 'commands' ? 'block' : 'hidden'}>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Terminal className="text-purple-600 dark:text-purple-500" /> Commands & Installation
                            </h2>

                            {/* Quick Start Guide */}
                            <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-500/20 shadow-sm dark:shadow-none">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🚀 Quick Start Guide</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-xs uppercase font-bold text-gray-500 mb-2">1. Frontend Setup (Next.js)</div>
                                        <div className="bg-gray-100 dark:bg-black/50 p-4 rounded-lg border border-gray-200 dark:border-white/5 font-mono text-sm text-gray-700 dark:text-gray-300">
                                            <div className="flex gap-2"><span className="text-purple-600 dark:text-purple-400">$</span> cd FRONTEND-ONLY</div>
                                            <div className="flex gap-2"><span className="text-purple-600 dark:text-purple-400">$</span> npm install</div>
                                            <div className="flex gap-2"><span className="text-purple-600 dark:text-purple-400">$</span> npm run dev</div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Runs on <span className="text-gray-900 dark:text-white">localhost:3000</span>.</p>
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase font-bold text-gray-500 mb-2">2. Backend Setup (Express Microservice)</div>
                                        <div className="bg-gray-100 dark:bg-black/50 p-4 rounded-lg border border-gray-200 dark:border-white/5 font-mono text-sm text-gray-700 dark:text-gray-300">
                                            <div className="flex gap-2"><span className="text-purple-600 dark:text-purple-400">$</span> cd FRONTEND-ONLY/conu-community-server</div>
                                            <div className="flex gap-2"><span className="text-purple-600 dark:text-purple-400">$</span> npm install</div>
                                            <div className="flex gap-2"><span className="text-purple-600 dark:text-purple-400">$</span> node server.js</div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Runs on <span className="text-gray-900 dark:text-white">localhost:4000</span>.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Commands */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400 border-b border-green-200 dark:border-green-500/30 pb-2">Common Commands</h3>
                                    <CmdItem cmd="npm run dev" desc="Starts the Next.js development server." />
                                    <CmdItem cmd="npm run build" desc="Builds the application for production." />
                                    <CmdItem cmd="npm run start" desc="Starts the production build locally." />
                                    <CmdItem cmd="node scripts/generateCourseIndex.cjs" desc="Regenerates public/course_index.json from raw data." />
                                </div>

                                {/* Packages */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 border-b border-orange-200 dark:border-orange-500/30 pb-2">Key Packages</h3>
                                    <div className="space-y-3">
                                        <PkgItem name="framer-motion" use="Complex Animations" desc="Used for page transitions, layout animations, and interactive gesture controls." />
                                        <PkgItem name="gsap / @gsap/react" use="High-Performance Sequences" desc="Used for complex timelines (like the Hero text reveal) where perf matters." />
                                        <PkgItem name="lenis" use="Smooth Scroll" desc="Provides the luxury smooth scrolling experience across the site." />
                                        <PkgItem name="@clerk/nextjs" use="Authentication" desc="Handles user sign-in, sign-up, and protected routes logic." />
                                        <PkgItem name="lucide-react" use="Icons" desc="The main icon library used for consistent UI iconography." />
                                        <PkgItem name="@xyflow/react" use="Graph Viz" desc="Powers the interactive Prerequisite Tree visualization." />
                                        <PkgItem name="puppeteer" use="Scraping" desc="Headless browser automation for Seat Finder and RMP (Backend only)." />
                                        <PkgItem name="zod" use="Validation" desc="Schema validation for API inputs and data processing." />
                                        <PkgItem name="canvas-confetti" use="Visual Effects" desc="Used for celebration effects (e.g. on the About page)." />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 7. MOODLE INTEGRATION (PLANNED) */}
                        <section id="moodle" className={activeSection === 'moodle' ? 'block' : 'hidden'}>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <Puzzle className="text-purple-600 dark:text-purple-500" /> Moodle Integration (Phase 18)
                            </h2>

                            <div className="space-y-8">
                                {/* Moodle Feature 1: Download All Files */}
                                <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-500/20">
                                                <Download size={24} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">One-Click "Download All Course Files"</h3>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase">
                                            Extension Side
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Concept</div>
                                                <p className="text-gray-600 dark:text-gray-300">Scrape every file link (.pdf, .pptx, .docx) from a Moodle course page and bundle them into a single ZIP for offline access.</p>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Implementation Strategy</div>
                                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-4">
                                                    <li><strong>UI Injection:</strong> Injects a "✨ Download All" button into the Moodle course header using <code className="bg-gray-100 dark:bg-white/10 px-1 rounded font-mono">rmp_injector.js</code>.</li>
                                                    <li><strong>Link Extraction:</strong> Use the extension content script to query all anchors containing active document resources.</li>
                                                    <li><strong>Bundling:</strong> Use <code className="bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded font-mono">JSZip</code> to asynchronously fetch file blobs and generate a zip file client-side.</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5">
                                            <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">Target Logic (Snippet)</div>
                                            <pre className="font-mono text-[10px] text-purple-600 dark:text-purple-400 overflow-x-auto">
                                                {`// Logic for extracting Moodle files
const links = Array.from(document.querySelectorAll('.activityinstance a'))
  .filter(a => a.href.includes('mod/resource/view.php'))
  .map(a => ({ name: a.innerText.trim(), url: a.href }));

// Use JSZip to bundle blobs
const zip = new JSZip();
for (const file of links) {
  const blob = await fetch(file.url).then(r => r.blob());
  zip.file(file.name + '.pdf', blob);
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>

                                {/* Moodle Feature 2: Calendar Export */}
                                <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-2xl flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold border border-pink-200 dark:border-pink-500/20">
                                                <CalendarDays size={24} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Calendar Export (.ics)</h3>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400 text-xs font-bold uppercase">
                                            Hybrid Execution
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Concept</div>
                                                <p className="text-gray-600 dark:text-gray-300">Synchronize Moodle assignment deadlines and quiz dates directly with ConuPlanner and external calendars (Google/Apple).</p>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Implementation Strategy</div>
                                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-4">
                                                    <li><strong>Timeline Scraper:</strong> Scrapes the Moodle dashboard's "Timeline" block for deadline names and ISO timestamps.</li>
                                                    <li><strong>iCal Generation:</strong> Converts dates into the RFC 5545 format using a utility script in <code className="bg-gray-100 dark:bg-white/10 px-1 rounded font-mono">src/lib/calendar</code>.</li>
                                                    <li><strong>Dashboard Sync:</strong> Pushes deadlines to the ConuPlanner "Upcoming Tasks" widget via the existing extension post-method.</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5">
                                            <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">iCal Format (Target)</div>
                                            <pre className="font-mono text-[10px] text-pink-600 dark:text-pink-300 overflow-x-auto">
                                                {`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:COMP 346 - Assignment 3 Due
DTSTART:20261024T235900Z
DESCRIPTION:Imported from Moodle via ConuPlanner
END:VEVENT
END:VCALENDAR`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>


                    </div>
                </div >
            </main >
        </div >
    );
}

function TechItem({ name, desc, tag, color }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 hover:border-purple-500/50 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
            <div>
                <div className="font-bold text-lg text-gray-900 dark:text-gray-200">{name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{desc}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${color}`}>{tag}</span>
        </div>
    )
}

function DirItem({ path, desc }) {
    return (
        <div className="flex gap-4 p-4 bg-gray-100 dark:bg-[#111] rounded-lg border-l-4 border-purple-600">
            <div className="font-mono text-purple-600 dark:text-purple-300 font-bold shrink-0">{path}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">{desc}</div>
        </div>
    )
}

function CmdItem({ cmd, desc }) {
    return (
        <div className="group relative">
            <div className="bg-gray-900 dark:bg-[#0f0f0f] border border-gray-800 dark:border-white/10 rounded-lg p-5 font-mono text-sm text-green-400 shadow-lg">
                <span className="select-none text-gray-500 mr-3">$</span>
                {cmd}
            </div>
            <div className="mt-2 text-gray-600 dark:text-gray-500 text-xs ml-4">{desc}</div>
        </div>
    )
}

function PageCard({ title, route, file, desc, coordination, isApi, highlight }) {
    return (
        <div className={`relative bg-white dark:bg-white/5 border ${highlight ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/50' : 'border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none'} rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300`}>
            {highlight && (
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-purple-600 text-white text-[10px] font-black uppercase tracking-tighter rounded-lg shadow-lg border border-purple-400 z-10 animate-bounce">
                    New Update
                </div>
            )}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                    <div className="flex items-center gap-3 text-sm font-mono">
                        <span className={`px-2 py-0.5 rounded ${isApi ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>
                            {route}
                        </span>
                        <span className="text-gray-500 text-xs">{file}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {desc}
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-white/5">
                    <div className="text-xs font-bold text-purple-500 dark:text-purple-400 mb-1 uppercase tracking-wider">Coordination & Data</div>
                    <div className="text-xs text-gray-700 dark:text-gray-400 font-mono bg-gray-100 dark:bg-black/30 p-2 rounded">
                        {coordination}
                    </div>
                </div>
            </div>
        </div>
    )
}

function PkgItem({ name, use, desc }) {
    return (
        <div className="flex items-start justify-between p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
            <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-1">
                    <div className="font-bold text-base text-gray-900 dark:text-gray-200">{name}</div>
                    <div className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wide">
                        {use}
                    </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{desc}</div>
            </div>
        </div>
    )
}

function StatusItem({ text, active, highlight }) {
    return (
        <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            {active ? (
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                </div>
            ) : (
                <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 text-transparent">
                    .
                </div>
            )}
            <span className={highlight ? "text-purple-600 dark:text-purple-300 font-bold" : ""}>
                {text}
            </span>
            {highlight && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-500/30 text-purple-600 dark:text-purple-300 uppercase tracking-wider">
                    Next
                </span>
            )}
        </li>
    )
}
