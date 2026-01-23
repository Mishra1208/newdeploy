"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavLink from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function DynamicNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Always visible
    const navClass = "site-nav";

    return (
        <>
            <header className={navClass}>
                <nav className="site-nav__inner">
                    <Link href="/" className="brand" aria-label="ConU Planner">
                        <img src="/logo2.png" alt="ConU Planner" className="brandLogo" />
                    </Link>

                    <ul>
                        <li><NavLink href="/">Home</NavLink></li>
                        <li><NavLink href="/pages/seat-finder">Seat Finder</NavLink></li>
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
        </>
    );
}
