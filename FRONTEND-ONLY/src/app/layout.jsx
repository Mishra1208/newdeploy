import Link from "next/link";
import NavLink from "@/components/NavLink";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import Script from "next/script";
import { cookies } from "next/headers";
import ChatWidget from "@/components/ChatWidget";
import "@/styles/globals.css";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import PremiumNavbar from "@/components/PremiumNavbar";
import ClerkThemeProvider from "@/components/ClerkThemeProvider";
import CookieBanner from "@/components/CookieBanner";
import AnalyticsWrapper from "@/components/AnalyticsWrapper";

export const metadata = {
  title: "ConU Planner",
  description: "Plan your Concordia courses with clarity.",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const initialTheme = themeCookie === "dark" ? "dark" : "light";

  return (
    <ClerkThemeProvider initialTheme={initialTheme}>
      <html lang="en" data-theme={initialTheme} suppressHydrationWarning>
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;700;800&display=swap"
            rel="stylesheet"
          />
          {/* Prevents first-paint flash; prefers cookie -> system.
             The hydrator will enforce localStorage on the client after mount. */}
          <Script id="theme-init" strategy="beforeInteractive">{`
            (function () {
              try {
                var m = document.cookie.match(/(?:^|; )theme=(dark|light)/);
                var cookieTheme = m && m[1];
                var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                var theme = cookieTheme || (systemDark ? 'dark' : 'light');
                var root = document.documentElement;
                root.dataset.theme = theme;
                root.style.colorScheme = theme;
              } catch(e){}
            })();
          `}</Script>
        </head>
        <body>
          <PremiumNavbar />
          <main className="site-main" style={{ paddingTop: 100 }}>{children}</main>
          <Footer />
          <ChatWidget />
          <CookieBanner />
          <AnalyticsWrapper />
        </body>
      </html>
    </ClerkThemeProvider>
  );
}
