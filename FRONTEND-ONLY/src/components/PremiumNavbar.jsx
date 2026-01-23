"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import NavLink from "@/components/NavLink";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Sun, Moon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                THEME TOGGLE                                */
/* -------------------------------------------------------------------------- */
function PremiumThemeToggle() {
    return (
        <button
            className="theme-toggle-premium"
            onClick={() => {
                const root = document.documentElement;
                const isDark = root.getAttribute("data-theme") === "dark";
                const newTheme = isDark ? "light" : "dark";
                root.setAttribute("data-theme", newTheme);
                document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
            }}
            aria-label="Toggle Theme"
        >
            <div className="toggle-track">
                <Sun className="icon-sun" size={16} />
                <Moon className="icon-moon" size={16} />
                <motion.div className="toggle-thumb" layout transition={{ type: "spring", stiffness: 700, damping: 30 }} />
            </div>
        </button>
    );
}

/* -------------------------------------------------------------------------- */
/*                               PREMIUM NAVBAR                               */
/* -------------------------------------------------------------------------- */
export default function PremiumNavbar() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setScrolled(latest > 50);
    });

    return (
        <>
            <motion.header
                className={`premium-nav ${scrolled ? "scrolled" : ""}`}
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-110%" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
            >
                <div className="premium-nav-inner">
                    {/* LOGO */}
                    <Link href="/" className="premium-brand">
                        <img src="/logo2.png" alt="ConU" className="brand-logo" />
                        <span className="brand-text">
                            ConU<span className="brand-highlight">Planner</span>
                        </span>
                    </Link>

                    {/* DESKTOP LINKS */}
                    <nav className="desktop-links">
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/pages/seat-finder">Seat Finder</NavLink>
                        <NavLink href="/pages/courses">Courses</NavLink>
                        <NavLink href="/pages/planner">Planner</NavLink>
                        <NavLink href="/pages/gpa">GPA</NavLink>

                        <div className="divider" />

                        <SignedOut>
                            <Link href="/login" className="login-btn-premium">
                                Log In
                            </Link>
                        </SignedOut>

                        <SignedIn>
                            <div className="user-avatar-premium">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>

                        <PremiumThemeToggle />
                    </nav>

                    {/* MOBILE HAMBURGER */}
                    <button
                        className="mobile-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <div className={`hamburger ${menuOpen ? "open" : ""}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                </div>

                {/* MOBILE MENU OVERLAY */}
                <motion.div
                    className="mobile-menu"
                    initial="closed"
                    animate={menuOpen ? "open" : "closed"}
                    variants={{
                        open: { opacity: 1, pointerEvents: "auto" },
                        closed: { opacity: 0, pointerEvents: "none" }
                    }}
                >
                    <div className="mobile-links">
                        <NavLink href="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
                        <NavLink href="/pages/courses" onClick={() => setMenuOpen(false)}>Courses</NavLink>
                        <NavLink href="/pages/planner" onClick={() => setMenuOpen(false)}>Planner</NavLink>
                        <NavLink href="/pages/gpa" onClick={() => setMenuOpen(false)}>GPA Calculator</NavLink>
                        <div style={{ height: 20 }} />
                        <PremiumThemeToggle />
                    </div>
                </motion.div>
            </motion.header>
        </>
    );
}

/* -------------------------------------------------------------------------- */
/*                          STYLES (INJECTED FOR NOW)                         */
/* -------------------------------------------------------------------------- */
/* We will move these to globals.css correctly in the next step, 
   but for this file to be self-contained in logic, we rely on classes. */
