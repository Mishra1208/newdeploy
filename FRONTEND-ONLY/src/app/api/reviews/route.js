import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Read columns A-K from Sheet4 (widened to catch any rogue shifts)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet4!A:K',
        });

        const rows = response.data.values || [];

        // Check if rows[0] is a header or actual data
        let startIndex = 0;
        if (rows.length > 0) {
            const firstRowLower = rows[0].map(cell => String(cell).toLowerCase());
            if (firstRowLower.includes('name') || firstRowLower.includes('role') || firstRowLower.includes('review')) {
                startIndex = 1; // It's a header row
            }
        }

        const reviews = rows.slice(startIndex)
            .filter((row) => row[2] && String(row[2]).trim() !== "") // Only keep rows with review text in column C
            .map((row) => ({
                name: row[0] || "Anonymous User",
                role: row[1] || "Student",
                text: row[2] || "",
                rating: parseInt(row[3]) || 5,
                date: row[4] || row[9] || new Date().toISOString(),
                isAnonymous: row[5] === 'TRUE' || row[10] === 'TRUE'
            })).reverse(); // Show newest first

        return NextResponse.json({ success: true, reviews });

    } catch (error) {
        console.error('❌ Error fetching reviews:', error);
        return NextResponse.json({ success: false, reviews: [] }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, role, text, rating, isAnonymous } = body;

        if (!text || !rating) {
            return NextResponse.json({ error: 'Review text and rating are required' }, { status: 400 });
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Display Name Logic
        const displayName = isAnonymous ? "Anonymous User" : (name || "Anonymous User");

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet4!A:F',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [[
                    displayName,
                    role || "Student",
                    text,
                    rating,
                    new Date().toISOString(),
                    isAnonymous ? 'TRUE' : 'FALSE'
                ]],
            },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('❌ Error submitting review:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
