import Link from "next/link";
import { Space_Grotesk } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">

        {/* Column 1: Brand & Identity */}
        <div style={{ paddingRight: 20 }}>
          <div className={`footer-brand ${display.className}`} style={{ fontSize: 20, marginBottom: 12 }}>
            ConU Planner
          </div>
          <p className="footer-muted" style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 260 }}>
            The unofficial academic launchpad for Concordia students. Plan courses, check prerequisites, and predict your GPA.
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, opacity: 0.7 }}>
            <a href="https://github.com/Mishra1208/newdeploy" target="_blank" rel="noopener noreferrer" aria-label="Github">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
            </a>
          </div>
        </div>

        {/* Column 2: Product */}
        <div>
          <div className={`footer-head ${display.className}`}>Product</div>
          <ul className="footer-list">
            <li><Link href="/pages/courses" className="footer-link">Course Catalog</Link></li>
            <li><Link href="/pages/planner" className="footer-link">Degree Planner</Link></li>
            <li><Link href="/pages/tree" className="footer-link">Prerequisite Tree</Link></li>
            <li><Link href="/pages/gpa" className="footer-link">GPA Calculator</Link></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <div className={`footer-head ${display.className}`}>Resources</div>
          <ul className="footer-list">
            <li><Link href="/about" className="footer-link">About Us</Link></li>
            <li><Link href="/about" className="footer-link">Team</Link></li>
            <li><Link href="/about" className="footer-link">Manifesto</Link></li>
            <li><a href="mailto:hello@conuplanner.app" className="footer-link">Contact</a></li>
          </ul>
        </div>

        {/* Column 4: Legal & Status */}
        <div>
          <div className={`footer-head ${display.className}`}>Status</div>
          <ul className="footer-list">
            <li><Link href="#" className="footer-link">Privacy Policy</Link></li>
            <li><Link href="#" className="footer-link">Terms of Service</Link></li>
            <li style={{ marginTop: 12 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 8px',
                background: 'rgba(74, 222, 128, 0.1)',
                borderRadius: 6,
                border: '1px solid rgba(74, 222, 128, 0.2)',
                fontSize: 12,
                color: '#22c55e',
                fontWeight: 600
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'block' }}></span>
                All Systems Operational
              </div>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <div style={{ opacity: 0.6 }}>
          © {new Date().getFullYear()} ConU Planner. Not affiliated with Concordia University.
        </div>
      </div>
    </footer>
  );
}
