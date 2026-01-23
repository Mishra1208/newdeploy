"use client";
import React, { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";

export default function AnalyticsWrapper() {
    const [consent, setConsent] = useState(false);

    useEffect(() => {
        // Function to check consent
        const checkConsent = () => {
            const stored = localStorage.getItem("conu_cookie_consent");
            if (stored === "accepted") {
                setConsent(true);
            } else {
                setConsent(false);
            }
        };

        // Check initially
        checkConsent();

        // Listen for updates from CookieBanner
        window.addEventListener("conu_cookie_update", checkConsent);

        // Cleanup
        return () => window.removeEventListener("conu_cookie_update", checkConsent);
    }, []);

    // Only render Analytics if consent is true
    return consent ? <Analytics /> : null;
}
