import Link from "next/link";
import NavLink from "@/components/NavLink";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import Script from "next/script";
import { cookies } from "next/headers";
import ChatWidget from "@/components/ChatWidget";
import { Inter, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import PremiumNavbar from "@/components/PremiumNavbar";
import ClerkThemeProvider from "@/components/ClerkThemeProvider";
import CookieBanner from "@/components/CookieBanner";
import AnalyticsWrapper from "@/components/AnalyticsWrapper";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

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
  verification: {
    google: "7mjp32Xg9XKtiijFf44nzkbc8aSe7N9W6kRjZqhK5Oo"
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
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const initialTheme = themeCookie === "dark" ? "dark" : "light";

  return (
    <ClerkThemeProvider initialTheme={initialTheme}>
      <html lang="en" data-theme={initialTheme} suppressHydrationWarning className={`${inter.variable} ${outfit.variable} ${jakarta.variable}`}>
        <head>
          <meta name="google-site-verification" content="7mjp32Xg9XKtiijFf44nzkbc8aSe7N9W6kRjZqhK5Oo" />
          <Script id="theme-init" strategy="beforeInteractive">{`
  (function () {
    try {
      var localTheme = localStorage.getItem('theme');
      var theme = localTheme || '${initialTheme}';
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
          <CookieBanner />
          <Footer />
          <ChatWidget />
          <AnalyticsWrapper />
          <GoogleAnalytics gaId="G-6N289RVZSJ" />
        </body>
      </html>
    </ClerkThemeProvider>
  );
}
