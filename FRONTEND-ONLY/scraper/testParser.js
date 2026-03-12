const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function testParse() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load local file
    const localPath = `file://${path.resolve(__dirname, 'debug_results_v2.html')}`;
    await page.goto(localPath);

    const classes = await page.evaluate(() => {
        const results = [];
        let i = 0;

        while (true) {
            // The container for each section seems to be keyed by $i
            // e.g. SSR_CLSRCH_MTG1$scroll$0, SSR_CLSRCH_MTG1$scroll$1 ...
            // or we can look for the specific elements directly if they follow the pattern.

            // Status Icon/Text
            // id="win0divDERIVED_CLSRCH_SSR_STATUS_LONG$0" -> inside is <span class="... success/danger/warning ...">
            const statusContainer = document.querySelector(`#win0divDERIVED_CLSRCH_SSR_STATUS_LONG\\$${i}`);

            if (!statusContainer) {
                // If we can't find the status for index i, we assume we reached the end.
                // However, sometimes indices might skip? Unlikely in PeopleSoft grids usually.
                break;
            }

            // Extract Status
            let status = 'Unknown';
            const statusIcon = statusContainer.querySelector('span[data-gh-replace="OPEN_ICN"]') ||
                statusContainer.querySelector('span.success'); // Open
            const closedIcon = statusContainer.querySelector('span[data-gh-replace="CLOSED_ICN"]') ||
                statusContainer.querySelector('span.danger'); // Closed
            const waitIcon = statusContainer.querySelector('span[data-gh-replace="WAITLIST_ICN"]') ||
                statusContainer.querySelector('span.warning'); // Waitlist

            if (statusIcon) status = 'Open';
            else if (closedIcon) status = 'Closed';
            else if (waitIcon) status = 'Waitlist';

            // Extract Section
            // id="MTG_CLASSNAME$0" -> text
            const sectionEl = document.querySelector(`#MTG_CLASSNAME\\$${i}`);
            const section = sectionEl ? sectionEl.innerText.replace(/\n/g, ' ').trim() : 'N/A';

            // Extract Days/Times
            // id="MTG_DAYTIME$0"
            const timeEl = document.querySelector(`#MTG_DAYTIME\\$${i}`);
            const time = timeEl ? timeEl.innerText.trim() : 'N/A';

            // Extract Class Number
            // id="MTG_CLASS_NBR$0"
            const classNbrEl = document.querySelector(`#MTG_CLASS_NBR\\$${i}`);
            const classNbr = classNbrEl ? classNbrEl.innerText.trim() : 'N/A';

            results.push({
                courseId: `COMP 248`, // Hardcoded for this test context, typically passed in
                section,
                status,
                time,
                classNbr
            });

            i++;
        }
        return results;
    });

    console.log(JSON.stringify(classes, null, 2));

    await browser.close();
}

testParse();
