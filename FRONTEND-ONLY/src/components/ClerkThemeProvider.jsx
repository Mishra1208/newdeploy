"use client";

import React, { useEffect, useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function ClerkThemeProvider({ children, initialTheme }) {
    const [theme, setTheme] = useState(initialTheme);

    useEffect(() => {
        const root = document.documentElement;

        // Initial sync
        const currentTheme = root.getAttribute("data-theme") || initialTheme;
        setTheme(currentTheme);

        // Watch for changes to data-theme attribute
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "data-theme") {
                    const newTheme = root.getAttribute("data-theme");
                    setTheme(newTheme);
                }
            });
        });

        observer.observe(root, { attributes: true });

        return () => observer.disconnect();
    }, [initialTheme]);

    return (
        <ClerkProvider
            appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                variables: {
                    colorPrimary: "#8b1e3f", // ConU Burgundy
                    colorTextOnPrimaryBackground: "white",
                },
                elements: {
                    card: {
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        border: "1px solid rgba(255,255,255,0.05)",
                    },
                },
            }}
        >
            {children}
        </ClerkProvider>
    );
}
