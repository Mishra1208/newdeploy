"use client";

import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import styles from "../../app/about/about.module.css";

export default function ConfettiButton() {
    const router = useRouter();

    const handleClick = () => {
        router.push("/contact");
    };

    return (
        <button
            onClick={handleClick}
            className={styles.chip}
            style={{
                fontSize: 16,
                padding: "14px 32px",
                background: "linear-gradient(135deg, #1a1a1a 0%, #912338 100%)", /* Premium Royal Gradient */
                color: "white",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 25px rgba(145, 35, 56, 0.3)",
                transition: "all 0.3s ease",
                minWidth: "220px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                borderRadius: "99px",
                fontWeight: 600
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
            <Sparkles size={18} />
            Join the Team
            <ArrowRight size={18} style={{ opacity: 0.8 }} />
        </button>
    );
}
