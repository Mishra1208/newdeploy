import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const body = await req.json();

        // Expecting an array of grade objects
        if (!Array.isArray(body) || body.length === 0) {
            return NextResponse.json({ error: 'Invalid data format. Expected an array of courses.' }, { status: 400 });
        }

        console.log(`Checking in ${body.length} grade entries...`);

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Transform data for Sheets
        // Structure: [Term, Course, A+, A, ... Timestamp]
        const values = body.map(entry => [
            entry.term,
            entry.course,
            // description removed
            entry.distribution["A+"],
            entry.distribution["A"],
            entry.distribution["A-"],
            entry.distribution["B+"],
            entry.distribution["B"],
            entry.distribution["B-"],
            entry.distribution["C+"],
            entry.distribution["C"],
            entry.distribution["C-"],
            entry.distribution["D+"],
            entry.distribution["D"],
            entry.distribution["D-"],
            entry.distribution["F"],
            entry.distribution["FNS"],
            entry.distribution["R"],
            entry.distribution["NR"],
            entry.timestamp
        ]);

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            // Targeting 'Sheet5' for grades (Assuming Sheet4 is reviews)
            // TODO: User might need to create this sheet or rename it
            range: 'Sheet5!A:T',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: values,
            },
        });

        console.log("✅ Successfully appended grades to Sheet5");

        return NextResponse.json({ success: true, count: body.length }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });

    } catch (error) {
        console.error('❌ Error uploading grades:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow extension to call this
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
