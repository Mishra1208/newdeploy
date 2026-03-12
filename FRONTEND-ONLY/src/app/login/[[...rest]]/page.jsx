"use client";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '82vh',
            padding: '40px 20px',
            position: 'relative',
            flexDirection: 'column', // Stack children vertically
            gap: '2rem', // Add space between SignIn and link
            overflow: 'hidden'
        }}>
            {/* Visual Flair: Matching the Hero's dynamic background style */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(139, 30, 63, 0.08) 0%, transparent 70%)',
                zIndex: -1,
                pointerEvents: 'none'
            }} />

            <SignIn />

            {/* Admin Link */}
            <div style={{ textAlign: "center", zIndex: 1 }}>
                <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                    Administrator?{" "}
                    <a
                        href="/dev-docs"
                        style={{ color: "#9333ea", fontWeight: 600, textDecoration: "none", transition: "opacity 0.2s" }}
                    >
                        Access Developer Console &rarr;
                    </a>
                </p>
            </div>
        </div>
    );
}
