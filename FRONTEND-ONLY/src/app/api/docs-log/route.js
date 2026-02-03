import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { password, userAgent, locationInfo } = await req.json();

        // Get IP from headers (works on Vercel)
        const forwarded = req.headers.get("x-forwarded-for");
        let ip = forwarded ? forwarded.split(/, /)[0] : "127.0.0.1";

        // Normalize IPv6 localhost to human-readable format
        if (ip === "::1") ip = "127.0.0.1 (Localhost)";

        const now = new Date();
        // Format: YYYY-MM-DD HH:mm:ss
        const timestamp = now.toLocaleString('en-US', {
            timeZone: 'America/New_York', // Montreal Time
            dateStyle: 'medium',
            timeStyle: 'medium'
        });

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Multi-User Configuration
        const USERS = {
            [process.env.DEV_PASS_NARENDRA || "mishra1208.ld"]: "Narendra",
            [process.env.DEV_PASS_NEELENDRA || "neelendra-mishra.ui"]: "Neelendra",
            // [process.env.DEV_PASS_ARYAN || "aryann2212.be"]: "Aryan",
            [process.env.DEV_PASS_ADITYA || "aditya108.be"]: "Aditya",
            // Keep the old master password as a fallback/admin
            [process.env.DEV_DOCS_PASSWORD || "CUplanner.26"]: "Admin"
        };

        const matchedUser = USERS[password];
        const isValid = !!matchedUser;
        const status = isValid ? 'SUCCESS' : 'FAILED_ATTEMPT';

        // Append to Sheet3
        // Columns: Timestamp | IP Address | User Agent | Access Status | User/Password
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet3!A:E',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    [
                        timestamp,
                        ip,
                        userAgent || 'Unknown',
                        status,
                        isValid ? matchedUser : password // Log which user accessed, or the failed password
                    ]
                ],
            },
        });

        if (!isValid) {
            return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
        }

        return NextResponse.json({ success: true, user: matchedUser });
    } catch (error) {
        console.error('❌ Google Sheet Log Error:', error);
        // Fail silently but return success to avoid blocking login if logging fails
        return NextResponse.json({ success: true, user: "Developer" });
    }
}
