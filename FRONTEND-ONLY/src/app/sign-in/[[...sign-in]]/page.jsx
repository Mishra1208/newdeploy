import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            background: "#fff",
            fontFamily: "var(--font-inter)",
        }}>
            {/* Left Decoration Panel */}
            <div style={{
                flex: "1",
                background: "linear-gradient(135deg, #f5f5f7 0%, #eef0f5 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
                position: "relative",
                overflow: "hidden",
            }} className="hiddenOnMobile">

                {/* Subtle Grid Background */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    opacity: 0.6
                }} />

                <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "400px" }}>
                    <h1 style={{
                        fontSize: "2.5rem",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        marginBottom: "1rem",
                        color: "#1d1d1f"
                    }}>
                        Welcome Back.
                    </h1>
                    <p style={{
                        color: "#86868b",
                        fontSize: "1.1rem",
                        lineHeight: 1.5
                    }}>
                        Continue crafting your academic journey with ConU Planner.
                    </p>
                </div>
            </div>

            {/* Right Login Panel */}
            <div style={{
                flex: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                background: "#fff"
            }}>
                <SignIn />
            </div>

            <style jsx global>{`
        @media (max-width: 900px) {
          .hiddenOnMobile { display: none !important; }
        }
      `}</style>
        </div>
    );
}
