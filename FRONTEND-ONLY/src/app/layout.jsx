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
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = {
  title: "ConU Planner - Your Academic Weapon | Concordia Course Planning",
  description: "The ultimate course planning tool for Concordia students. Search 7,900+ courses, build your schedule, calculate GPA, and find library seats. Used by 5,000+ students.",
  keywords: "concordia university, course planner, concordia courses, gpa calculator, degree planning, concordia schedule, course catalog, seat finder, academic planning",
  authors: [{ name: "ConU Planner Team" }],
  openGraph: {
    title: "ConU Planner - Your Academic Weapon",
    description: "Plan, track, and crush your Concordia degree. Search courses, build schedules, and calculate GPA in one premium tool.",
    url: "https://conuplanner.com",
    siteName: "ConU Planner",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "ConU Planner - Academic Planning for Concordia Students"
    }],
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "ConU Planner - Your Academic Weapon",
    description: "The ultimate course planning tool for Concordia students. Used by 5,000+ students.",
    images: ["/og-image.png"]
  },
  alternates: {
    canonical: "https://conuplanner.com"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // TODO: Add after Google Search Console setup
  }
};

export default async function RootLayout({ children }) {
  // FORCED LIGHT MODE (User Request)
  // const cookieStore = await cookies();
  // const themeCookie = cookieStore.get("theme")?.value;
  // const initialTheme = themeCookie === "dark" ? "dark" : "light";
  const initialTheme = "light";

  return (
    <ClerkThemeProvider initialTheme={initialTheme}>
      <html lang="en" data-theme={initialTheme} suppressHydrationWarning>
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;700;800&display=swap"
            rel="stylesheet"
          />
          {/* Prevents first-paint flash; FORCED LIGHT MODE for now.
             The hydrator will enforce localStorage on the client after mount. */}
          <Script id="theme-init" strategy="beforeInteractive">{`
  (function () {
    try {
      // FORCE LIGHT MODE
      var theme = 'light';
      var root = document.documentElement;
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
    } catch (e) { }
  })();
`}</Script>
        </head>
        <body>
          <PremiumNavbar />
          <main className="site-main" style={{ paddingTop: 100 }}>{children}</main>
          <Footer />
          <ChatWidget />
          <AnalyticsWrapper />
          <GoogleAnalytics gaId="G-6N289RVZSJ" />
        </body>
      </html>
    </ClerkThemeProvider>
  );
}
