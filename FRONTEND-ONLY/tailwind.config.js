/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
                display: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
                premium: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
    darkMode: ['class', '[data-theme="dark"]'], // Hook into your existing data-theme attribute
};
