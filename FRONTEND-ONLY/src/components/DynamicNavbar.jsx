"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavLink from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function DynamicNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showFab, setShowFab] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;

            // Top of page: Reset
            if (y < 100) {
                setIsScrolled(false);
                setShowFab(false);
                setMenuOpen(false); // Auto-close menu if we reach top
                return;
            }

            // Scrolling down: Hide nav, show FAB eventually
            if (y > 100) {
                setIsScrolled(true);
            }

            // Delay FAB appearance slightly for aesthetic stagger
            if (y > 300) {
                setShowFab(true);
            } else {
                setShowFab(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Logic: 
    // - If menuOpen is TRUE: Show Nav (force visible), Hide FAB.
    // - If isScrolled is TRUE (and !menuOpen): Hide Nav.
    // - Else (Top): Show Nav.

    const navClass = menuOpen
        ? "site-nav site-nav-force-visible"
        : isScrolled
            ? "site-nav site-nav-hidden"
            : "site-nav";

    return (
        <>
            <header className={navClass}>
                <nav className="site-nav__inner">
                    <Link href="/" className="brand" aria-label="ConU Planner">
                        <img src="/logo2.png" alt="ConU Planner" className="brandLogo" />
                    </Link>

                    <ul>
                        <li><NavLink href="/">Home</NavLink></li>
                        <li><NavLink href="/pages/courses">Courses</NavLink></li>
                        <li><NavLink href="/pages/courses/descriptions">Catalog</NavLink></li>
                        <li><NavLink href="/pages/planner">Planner</NavLink></li>
                        <li><NavLink href="/pages/gpa">GPA</NavLink></li>
                        <li><NavLink href="/about">About</NavLink></li>

                        <SignedOut>
                            <li>
                                <NavLink href="/login">Log In</NavLink>
                            </li>
                        </SignedOut>

                        <SignedIn>
                            <li className="user-avatar-fancy" style={{ display: 'flex', alignItems: 'center' }}>
                                <UserButton afterSignOutUrl="/" />
                            </li>
                        </SignedIn>

                        <li><ThemeToggle /></li>
                    </ul>

                    {/* Close button inside nav when forced open */}
                    {menuOpen && (
                        <button className="nav-close-btn" onClick={() => setMenuOpen(false)} aria-label="Close Menu">
                            ✕
                        </button>
                    )}
                </nav>
            </header>

            {/* Floating Action Button (Hamburger) */}
            <button
                className={`nav-fab ${showFab && !menuOpen ? "visible" : ""}`}
                onClick={toggleMenu}
                aria-label="Open Menu"
            >
                <span className="hamburger-icon">☰</span>
            </button>
        </>
    );
}
