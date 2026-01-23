import Link from 'next/link';

export const metadata = {
    title: "Privacy Policy | ConU Planner",
    description: "Transparency on how we handle your academic data.",
};

export default function PrivacyPage() {
    return (
        <main style={{ maxWidth: 800, margin: '120px auto', padding: '0 24px' }}>
            <h1 className="h2" style={{ marginBottom: 24 }}>Privacy Policy</h1>
            <p style={{ color: '#666', marginBottom: 60 }}>Last updated: January 2026</p>

            <div className="prose">
                <h3>1. Data Minimization</h3>
                <p>
                    ConU Planner is designed with a "local-first" philosophy. We do not store your schedule, grades, or personal information on our servers unless you explicitly choose to sync them via Clerk authentication. Even then, we only store the minimum data required to provide the synchronization service.
                </p>

                <h3>2. No Academic Misconduct</h3>
                <p>
                    This tool is an UNOFFICIAL planner designed to assist with course selection. It is not a substitute for official academic advising. We do not facilitate cheating, unauthorized distribution of course materials, or any activity that violates Concordia University's Academic Code of Conduct.
                </p>

                <h3>3. Data Selling</h3>
                <p>
                    <strong>We do not sell your data.</strong> Provide full stop. We are built by students, for students. We have no interest in monetizing your academic history.
                </p>

                <h3>4. Authentication</h3>
                <p>
                    We use <a href="https://clerk.com" target="_blank" style={{ textDecoration: 'underline' }}>Clerk.com</a> for secure authentication. They handle your passwords and session tokens with industry-standard security. We never see your raw password.
                </p>

                <h3>5. Contact</h3>
                <p>
                    If you have concerns about your data, please contact us at <a href="mailto:privacy@conuplanner.app" style={{ color: 'var(--primary)', fontWeight: 600 }}>privacy@conuplanner.app</a>.
                </p>
            </div>

            <div style={{ marginTop: 80, borderTop: '1px solid #eee', paddingTop: 24 }}>
                <Link href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>← Back to Home</Link>
            </div>
        </main>
    );
}
