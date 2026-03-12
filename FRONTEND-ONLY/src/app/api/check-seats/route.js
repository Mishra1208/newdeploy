import { NextResponse } from 'next/server';
import { scrapeConcordiaSeats } from '../../../../scraper/concordiaScraper.js';

export async function POST(req) {
    try {
        const body = await req.json();
        const { subject = 'COMP', number = '248', term = '2254' } = body;

        // Validate inputs to prevent command injection (clean inputs)
        if (!/^[A-Z]{3,4}$/.test(subject) || !/^\d{3,4}[A-Z]?$/.test(number) || !/^\d{4}$/.test(term)) {
            return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
        }

        console.log(`Starting scraper for ${subject} ${number}...`);

        try {
            // DIRECT CALL - Forces Vercel to bundle puppeteer
            const data = await scrapeConcordiaSeats(term, subject, number);

            return NextResponse.json({
                success: true,
                data: data,
                timestamp: new Date().toISOString()
            });

        } catch (scraperError) {
            console.error('Scraper Execution Failed:', scraperError);
            return NextResponse.json({ error: 'Scraper failed to run', details: scraperError.message }, { status: 500 });
        }

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
