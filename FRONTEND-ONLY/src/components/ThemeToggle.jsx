"use client";
import { useEffect, useState } from "react";

function readTheme() {
  if (typeof window === "undefined") return "light";
  // 1) DOM (truth) 2) localStorage 3) cookie 4) system
  const dom = document.documentElement.getAttribute("data-theme");
  if (dom === "dark" || dom === "light") return dom;

  try {
    const ls = localStorage.getItem("theme");
    if (ls === "dark" || ls === "light") return ls;
  } catch { }

  try {
    const m = document.cookie.match(/(?:^|; )theme=(dark|light)/);
    if (m && m[1]) return m[1];
  } catch { }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(next) {
  const root = document.documentElement;
  root.dataset.theme = next;
  root.style.colorScheme = next;

  // persist everywhere (cookie must be site-wide so SSR sees it on any route)
  try { localStorage.setItem("theme", next); } catch { }
  try {
    document.cookie = `theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
  } catch { }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const t = readTheme();
    applyTheme(t);
    setTheme(t);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      className="theme-toggle"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={toggle}
    >
      {/* Sun */}
      <svg className="sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <g strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M4.93 4.93l-1.41 1.41M20.48 20.48l-1.41-1.41M19.07 4.93l1.41 1.41M4.93 19.07l1.41-1.41" />
        </g>
      </svg>

      {/* Moon */}
      <svg className="moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
