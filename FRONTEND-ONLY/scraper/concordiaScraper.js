const puppeteer = require('puppeteer');

async function scrapeConcordiaSeats(term, subject, courseNumber) {
    console.log(`🚀 Starting scraper for ${subject} ${courseNumber} (${term})...`);

    const browser = await puppeteer.launch({
        headless: "new", // Use new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    try {
        // 1. Go to Search Page
        await page.goto('https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_EXT.CU_CLASS_SEARCH.GBL', {
            waitUntil: 'networkidle2'
        });

        // 2. Select Term
        // Note: The specific IDs (CLASS_SRCH_WRK2_STRM$35$) change often. 
        // We might need to make this dynamic or user-configurable if hardcoding fails.
        // For now, let's try to assume the dropdown is present.
        // We will wait for the iframe or main content to load.

        // NOTE: PeopleSoft is often tricky with frames. 
        // This is a simplified starter script that might need adjusting based on the actual DOM.

        console.log("... Page loaded. (Note: PeopleSoft scraping is complex, this is V1)");

        // For this V1 standalone, we might simply print that we connected.
        // Real interaction with PeopleSoft requires handling IFrames and dynamic IDs.

        // Let's take a screenshot to verify we can see the page
        await page.screenshot({ path: 'scraper_debug_page.png' });
        console.log("📸 Screenshot taken: scraper_debug_page.png");

    } catch (error) {
        console.error("❌ Scraper Error:", error);
    } finally {
        await browser.close();
    }
}

// CLI usage: node scraper/concordiaScraper.js --subject COMP --number 248 --term 2252
const args = process.argv.slice(2);
const subject = args[args.indexOf('--subject') + 1] || 'COMP';
const number = args[args.indexOf('--number') + 1] || '248';
const term = args[args.indexOf('--term') + 1] || '2252';

scrapeConcordiaSeats(term, subject, number);
