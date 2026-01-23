"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    const pathname = usePathname(); // Get current path
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setScrolled(latest > 50);
    });

    const isHome = pathname === "/";

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
                        <img src="/logo2.png" alt="Concordia University" className="brand-logo" />
                        <span className="brand-text">
                            Concordia<span className="brand-highlight">University</span>
                        </span>
                    </Link>

                    {/* DESKTOP LINKS */}
                    <nav className="desktop-links">
                        {!isHome && (
                            <Link href="/" className="nav-link-premium">Home</Link>
                        )}
                        <Link href="/pages/seat-finder" className="nav-link-premium">Seat Finder</Link>
                        <Link href="/pages/courses" className="nav-link-premium">Courses</Link>
                        <Link href="/pages/planner" className="nav-link-premium">Planner</Link>
                        <Link href="/about" className="nav-link-premium">About Us</Link>

                        {/* MORE DROPDOWN */}
                        <div
                            className="nav-dropdown-container"
                            onMouseEnter={() => setMoreDropdownOpen(true)}
                            onMouseLeave={() => setMoreDropdownOpen(false)}
                        >
                            <button className="nav-link-premium dropdown-trigger">
                                More <span style={{ fontSize: 10, marginLeft: 4 }}>▼</span>
                            </button>

                            <motion.div
                                className="nav-dropdown-menu"
                                initial="closed"
                                animate={moreDropdownOpen ? "open" : "closed"}
                                variants={{
                                    open: { opacity: 1, y: 0, pointerEvents: "auto", display: "block" },
                                    closed: { opacity: 0, y: 10, pointerEvents: "none", transitionEnd: { display: "none" } }
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link href="/pages/gpa" className="dropdown-item">GPA Calculator</Link>
                                <Link href="/pages/courses/descriptions" className="dropdown-item">Course Descriptions</Link>
                            </motion.div>
                        </div>

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
                        <NavLink href="/pages/seat-finder" onClick={() => setMenuOpen(false)}>Seat Finder</NavLink>
                        <NavLink href="/pages/courses" onClick={() => setMenuOpen(false)}>Courses</NavLink>
                        <NavLink href="/pages/planner" onClick={() => setMenuOpen(false)}>Planner</NavLink>
                        <NavLink href="/about" onClick={() => setMenuOpen(false)}>About Us</NavLink>

                        <div className="mobile-divider">More</div>
                        <NavLink href="/pages/gpa" onClick={() => setMenuOpen(false)}>GPA Calculator</NavLink>
                        <NavLink href="/pages/courses/descriptions" onClick={() => setMenuOpen(false)}>Course Descriptions</NavLink>

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
