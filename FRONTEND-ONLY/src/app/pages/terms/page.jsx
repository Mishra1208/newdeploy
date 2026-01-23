import Link from 'next/link';

export const metadata = {
    title: "Terms of Service | ConU Planner",
    description: "Rules for using the ConU Planner academic tools.",
};

export default function TermsPage() {
    return (
        <main style={{ maxWidth: 800, margin: '120px auto', padding: '0 24px' }}>
            <h1 className="h2" style={{ marginBottom: 24 }}>Terms of Service</h1>
            <p style={{ color: '#666', marginBottom: 60 }}>Effective Date: January 2026</p>

            <div className="prose">
                <h3>1. Acceptance of Terms</h3>
                <p>
                    By accessing and using ConU Planner, you agree to be bound by these Terms. If you do not agree, please discontinue use immediately.
                </p>

                <h3>2. Unofficial Status</h3>
                <p>
                    <strong>Disclaimer:</strong> ConU Planner is an independent, student-run project and is NOT affiliated with, endorsed by, or operated by Concordia University. For official academic records, always refer to the Student Hub.
                </p>

                <h3>3. Acceptable Use</h3>
                <p>
                    You agree to use this tool only for personal academic planning. You may not:
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: 20, marginBottom: 16 }}>
                    <li>Use automated scripts to scrape our data or burden our servers.</li>
                    <li>Reverse engineer or attempt to copy the source code of this application.</li>
                    <li>Use the platform to distribute unauthorized course materials.</li>
                </ul>

                <h3>4. Intellectual Property</h3>
                <p>
                    The design, code, and "ConU Planner" branding are the intellectual property of the development team. Unauthorized reproduction is prohibited. Course data remains the property of Concordia University and is used here for informational purposes only.
                </p>

                <h3>5. Limitation of Liability</h3>
                <p>
                    This service is provided "as is" without warranties of any kind. We are not responsible for errors in course data, scheduling mishaps, or missed prerequisites. Always verify your schedule with an official academic advisor.
                </p>
            </div>

            <div style={{ marginTop: 80, borderTop: '1px solid #eee', paddingTop: 24 }}>
                <Link href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>← Back to Home</Link>
            </div>
        </main>
    );
}
