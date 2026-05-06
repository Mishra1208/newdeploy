"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLink from "@/components/NavLink";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Sun, Moon } from "lucide-react";
import StaggeredMenu from "@/components/staggered/StaggeredMenu";


/* -------------------------------------------------------------------------- */
/*                               PREMIUM NAVBAR                               */
/* -------------------------------------------------------------------------- */
export default function PremiumNavbar() {
    const { scrollY } = useScroll();
    const pathname = usePathname(); // Get current path
    const { isSignedIn } = useUser();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true); // Hide main nav
        } else {
            setHidden(false); // Show main nav
        }
        setScrolled(latest > 50);
    });

    const isHome = pathname === "/";

    // Configuration for Staggered Menu
    const menuItems = [
        { label: 'Home', link: '/' },
        { label: 'Seat Finder', link: '/pages/seat-finder' },
        { label: 'Courses', link: '/pages/courses' },
        { label: 'Course Desc.', link: '/pages/courses/descriptions' },
        { label: 'Planner', link: '/pages/planner' },
        { label: 'Schedule Builder', link: '/pages/schedule-builder' },
        { label: 'Insights', link: '/insights' },
        { label: 'Prof. Compare', link: '/pages/professor-comparison' },
        { label: 'GPA Calc', link: '/pages/gpa' },
        { label: 'Degree Pathfinder', link: '/pages/degree-tracker' },
        { label: 'About Us', link: '/about' },
        { label: 'Contact', link: '/contact' }
    ];

    if (!isSignedIn) {
        menuItems.push({ label: 'Log In', link: '/login' });
    }

    const socialItems = [
        { label: 'Contact Us', link: '/contact' }
    ];

    return (
        <>
            {/* Standard "Premium" Navbar (Hides on Scroll) */}
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
                        <Link href="/pages/schedule-builder" className="nav-link-premium flex items-center gap-1">
                            Schedule Builder
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase tracking-wide">
                                New
                            </span>
                        </Link>
                        <Link href="/insights" className="nav-link-premium">Insights</Link>
                        <Link href="/pages/degree-tracker" className="nav-link-premium flex items-center gap-1">
                            Degree Pathfinder
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#912338]/10 text-[#912338] border border-[#912338]/20 uppercase tracking-wide">
                                Pro
                            </span>
                        </Link>

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
                                <Link href="/pages/professor-comparison" className="dropdown-item">Professor Insights & Comparison</Link>
                                <Link href="/about" className="dropdown-item">About Us</Link>
                            </motion.div>
                        </div>

                        <div className="divider" />

                        {mounted && (
                            <>
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
                            </>
                        )}

                    </nav>

                </div>


            </motion.header>

            {/* STAGGERED MENU (Show only on scroll or specifically for mobile visibility) */}
            {scrolled && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        height: '100vh',
                        zIndex: 11001, // Ensure above ChatWidget (11000)
                        pointerEvents: 'none',
                    }}
                >
                    <div style={{ pointerEvents: 'auto', height: '100%' }}>
                        <StaggeredMenu
                            items={menuItems}
                            socialItems={socialItems}
                            displaySocials={true}
                            displayItemNumbering={true}
                            menuButtonColor="#ffffff"
                            openMenuButtonColor="#ffffff"
                            changeMenuColorOnOpen={true}
                            colors={['#f8fafc', '#f1f5f9']}
                            accentColor="#912338"
                            onMenuOpen={() => document.body.classList.add('staggered-menu-open')}
                            onMenuClose={() => document.body.classList.remove('staggered-menu-open')}
                        />
                    </div>
                </motion.div>
            )}
        </>
    );
}

/* -------------------------------------------------------------------------- */
/*                          STYLES (INJECTED FOR NOW)                         */
/* -------------------------------------------------------------------------- */
/* We will move these to globals.css correctly in the next step, 
   but for this file to be self-contained in logic, we rely on classes. */
