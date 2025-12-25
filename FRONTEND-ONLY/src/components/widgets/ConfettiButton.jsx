"use client";

import confetti from "canvas-confetti";
import { useState } from "react";
import styles from "../../app/about/about.module.css";

export default function ConfettiButton() {
    const [isCopied, setIsCopied] = useState(false);

    const handleClick = (e) => {
        // 1. Copy to Clipboard
        navigator.clipboard.writeText("mishranarendra1208@gmail.com");
        setIsCopied(true);

        // 2. Trigger Confetti
        const rect = e.target.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        console.log("Confetti triggered!");
        confetti({
            origin: { x, y },
            particleCount: 100,
            spread: 70,
            colors: ['#a78bfa', '#f472b6', '#38bdf8', '#facc15'],
            zIndex: 9999, // Force on top
        });

        // 3. Reset button text after 2 seconds
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <button
            onClick={handleClick}
            className={styles.chip}
            style={{
                fontSize: 16,
                padding: "12px 32px",
                // Change color to green when copied
                background: isCopied ? "#10b981" : "linear-gradient(135deg, var(--accent), var(--accent-2))",
                color: "white",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 25px rgba(139, 92, 246, 0.4)",
                transition: "all 0.3s ease",
                minWidth: "220px", // Prevent layout shift
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
            }}
        >
            {isCopied ? (
                <>✅ Email Copied!</>
            ) : (
                <>🎉 Send us an Email</>
            )}
        </button>
    );
}
