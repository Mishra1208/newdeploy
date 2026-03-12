const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function debugRowHTML() {
    console.log("🚀 Starting Debug Scraper...");
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Block resources
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['image', 'stylesheet', 'font'].includes(req.resourceType())) req.abort();
        else req.continue();
    });

    try {
        await page.goto('https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_EXT.CU_CLASS_SEARCH.GBL', {
            waitUntil: 'networkidle2', // Safer wait
            timeout: 60000
        });

        // Search for COMP 248
        await page.waitForSelector('#CLASS_SRCH_WRK2_STRM\\$35\\$');
        await page.select('#CLASS_SRCH_WRK2_STRM\\$35\\$', '2254');
        await new Promise(r => setTimeout(r, 1000));

        await page.type('#SSR_CLSRCH_WRK_SUBJECT\\$1', 'COMP', { delay: 100 });
        await page.keyboard.press('Tab');
        await page.type('#SSR_CLSRCH_WRK_CATALOG_NBR\\$2', '248', { delay: 100 });
        await page.keyboard.press('Tab');
        await new Promise(r => setTimeout(r, 500));

        // Uncheck Open Only
        try {
            await page.click('label[for="SSR_CLSRCH_WRK_SSR_OPEN_ONLY$5"]');
            await new Promise(r => setTimeout(r, 500));
        } catch (e) { }

        // Submit
        await page.evaluate(() => {
            submitAction_win0(document.win0, 'CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH', new Event('click'));
        });

        // Wait for results
        console.log("Waiting for results...");
        await page.waitForSelector('div[id^="win0divDERIVED_CLSRCH_SSR_STATUS_LONG"]', { timeout: 30000 });
        console.log("⚡ Results detected!");

        // DUMP THE HTML
        const rowStructure = await page.evaluate(() => {
            // Find the first row container. 
            // PeopleSoft usually puts results in trs with id trSSR_CLSRCH_MTG1$0, trSSR_CLSRCH_MTG1$1 etc.
            // Try to find ANY element with id starting with MTG_INSTR
            const instr = document.querySelector('[id^="MTG_INSTR"]');
            const room = document.querySelector('[id^="MTG_ROOM"]');

            return {
                instrID: instr ? instr.id : 'NOT FOUND',
                instrHTML: instr ? instr.outerHTML : 'NOT FOUND',
                roomID: room ? room.id : 'NOT FOUND',
                roomHTML: room ? room.outerHTML : 'NOT FOUND',
                // Also dump the first Status row to see context
                firstRowHTML: document.querySelector('#trSSR_CLSRCH_MTG1\\$0')?.innerHTML || 'ROW 0 NOT FOUND'
            };
        });

        console.log("--- ROW DATA DEBUG ---");
        console.log(JSON.stringify(rowStructure, null, 2));

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await browser.close();
    }
}

debugRowHTML();
