"use client";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import styles from "./Footer.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500"] });

export default function Footer() {
  return (
    <footer className={`${styles.footer} ${body.className}`}>
      <div className={`${styles.container} ${styles.grid}`}>

        {/* Column 1: Brand & Identity */}
        <div className={styles.brandCol}>
          <div>
            <div className={`${styles.brandName} ${display.className}`}>
              ConU Planner
            </div>
            <p className={styles.brandDesc}>
              The unofficial academic launchpad for Concordia students. Plan courses, check prerequisites, and predict your GPA.
            </p>
          </div>

          <div className={styles.socials}>
            <a href="https://github.com/Mishra1208/newdeploy" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Github">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            </a>
            {/* Disabled Twitter for now, uncomment if needed */}
            {/* <a href="#" aria-label="Twitter" className={styles.socialIcon}>...</a> */}
          </div>
        </div>

        {/* Column 2: Product */}
        <div>
          <div className={`${styles.colTitle} ${display.className}`}>Product</div>
          <ul className={styles.linkList}>
            <li><Link href="/pages/courses" className={styles.link}>Course Catalog</Link></li>
            <li><Link href="/pages/planner" className={styles.link}>Degree Planner</Link></li>
            <li><Link href="/pages/tree" className={styles.link}>Prerequisite Tree</Link></li>
            <li><Link href="/pages/gpa" className={styles.link}>GPA Calculator</Link></li>
            <li>
              <Link href="/pages/seat-finder" className={styles.link}>
                Seat Finder <span className={styles.newBadge}>New</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <div className={`${styles.colTitle} ${display.className}`}>Resources</div>
          <ul className={styles.linkList}>
            <li><Link href="/about" className={styles.link}>About Us</Link></li>
            <li><Link href="/about#team" className={styles.link}>Team</Link></li>
            <li><Link href="/about" className={styles.link}>Manifesto</Link></li>
            <li><Link href="/contact" className={styles.link}>Contact</Link></li>
          </ul>
        </div>

        {/* Column 4: Legal & Status */}
        <div>
          <div className={`${styles.colTitle} ${display.className}`}>Status</div>
          <ul className={styles.linkList}>
            <li><Link href="/pages/privacy" className={styles.link}>Privacy Policy</Link></li>
            <li><Link href="/pages/terms" className={styles.link}>Terms of Service</Link></li>
            <li>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem("conu_cookie_consent");
                    window.location.reload();
                  } catch (e) { console.error(e) }
                }}
                className={styles.link}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
              >
                Cookie Settings
              </button>
            </li>
            <li style={{ marginTop: 8 }}>
              <div className={styles.statusBadge}>
                <span className={styles.statusDot}></span>
                All Systems Operational
              </div>
            </li>
          </ul>
        </div>

      </div>

      <div className={styles.container}>
        <div className={styles.bottom}>
          <div>
            © {new Date().getFullYear()} ConU Planner. Not affiliated with Concordia University.
          </div>
          <div>
            Montreal, QC 🇨🇦
          </div>
        </div>
      </div>
    </footer>
  );
}
