import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

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

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:B', // Assumes columns A and B are used
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    [email, new Date().toISOString()] // Col A: Email, Col B: Date
                ],
            },
        });

        console.log("✅ Google Sheet Append Success:", response.data);
        return NextResponse.json({ success: true, data: response.data });
    } catch (error) {
        console.error('❌ Google Sheets API Error:', error);
        // Log detailed error from Google if available
        if (error.response) {
            console.error('Error Details:', JSON.stringify(error.response.data, null, 2));
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
