import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(req) {
    try {
        const body = await req.json();
        const { subject = 'COMP', number = '248', term = '2254' } = body;

        // Validate inputs to prevent command injection
        if (!/^[A-Z]{3,4}$/.test(subject) || !/^\d{3,4}[A-Z]?$/.test(number) || !/^\d{4}$/.test(term)) {
            return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
        }

        const scraperDir = path.join(process.cwd(), 'scraper');
        const scriptPath = path.join(scraperDir, 'concordiaScraper.js');
        const resultsPath = path.join(scraperDir, 'scraper_results.json');

        // Run the scraper script
        // Note: Puppeteer needs to run in a way that works in this environment.
        // Ensure 'puppeteer' is installed and valid in the running node_modules.
        console.log(`Starting scraper for ${subject} ${number}...`);

        try {
            const { stdout, stderr } = await execPromise(`node "${scriptPath}" --subject=${subject} --number=${number} --term=${term}`, {
                cwd: process.cwd()
            });
            console.log('Scraper Logs:', stdout);
            if (stderr) console.error('Scraper Error Logs:', stderr);
        } catch (execError) {
            console.error('Execution failed:', execError);
            return NextResponse.json({ error: 'Scraper failed to run', details: execError.message }, { status: 500 });
        }

        // Read the results
        if (!fs.existsSync(resultsPath)) {
            return NextResponse.json({ error: 'No results structure found' }, { status: 500 });
        }

        const data = fs.readFileSync(resultsPath, 'utf-8');
        const jsonData = JSON.parse(data);

        return NextResponse.json({
            success: true,
            data: jsonData,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
