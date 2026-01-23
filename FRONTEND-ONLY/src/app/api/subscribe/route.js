import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email: rawEmail } = await req.json();

        if (!rawEmail) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const email = rawEmail.toLowerCase().trim(); // Normalize email

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Fix for Vercel env vars
            },
            scopes: [
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 1. Check if email already exists
        const getRows = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:A', // Read only column A (Emails)
        });

        // Normalize existing emails to lowercase for comparison
        const existingEmails = getRows.data.values
            ? getRows.data.values.flat().map(e => e.toLowerCase().trim())
            : [];

        if (existingEmails.includes(email)) {
            return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });
        }

        // 2. Append if unique
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:B',
            valueInputOption: 'USER_ENTERED', // Raw input option
            requestBody: {
                values: [
                    [email, new Date().toISOString()]
                ],
            },
        });

        console.log("✅ Google Sheet Append Success:", response.data);
        return NextResponse.json({ success: true, data: response.data });
    } catch (error) {
        console.error('❌ Google Sheets API Error:', error);
        if (error.response) {
            console.error('Error Details:', JSON.stringify(error.response.data, null, 2));
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
