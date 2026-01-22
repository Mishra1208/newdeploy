const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// SELECTORS
const SEL = {
    TERM_DROPDOWN: '#CLASS_SRCH_WRK2_STRM\\$35\\$',
    SUBJECT_INPUT: '#SSR_CLSRCH_WRK_SUBJECT\\$1',
    CATALOG_NBR_INPUT: '#SSR_CLSRCH_WRK_CATALOG_NBR\\$2',
    OPEN_ONLY_CHECKBOX: '#SSR_CLSRCH_WRK_SSR_OPEN_ONLY\\$5',
    SEARCH_FOOTER_BTN: '.gh-footer-item',
    HIDDEN_SUBMIT_ID: 'CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH'
};

async function scrapeConcordiaSeats(termVal, subject, courseNumber) {
    console.log(`🚀 Starting Scraper for ${subject} ${courseNumber}...`);

    const browser = await puppeteer.launch({
        headless: true, // Strictly hidden
        defaultViewport: { width: 1920, height: 1080 }, // Force Desktop to see all columns
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Safer for server env
    });

    const page = await browser.newPage();

    // Enable logging from inside the browser
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    try {
        // 1. Go to Search Page
        console.log("🔗 Connecting...");
        await page.goto('https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_EXT.CU_CLASS_SEARCH.GBL', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // 2. Select Term
        console.log("... Choosing Term");
        await page.waitForSelector(SEL.TERM_DROPDOWN);
        await page.select(SEL.TERM_DROPDOWN, termVal);
        await new Promise(r => setTimeout(r, 1000));
        await page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 }).catch(() => console.log("No network idle after term select"));

        // 3. Input Subject
        console.log("... Typing Subject");
        await page.click(SEL.SUBJECT_INPUT);
        await new Promise(r => setTimeout(r, 500));
        await page.type(SEL.SUBJECT_INPUT, subject, { delay: 100 });
        await page.keyboard.press('Tab');
        await new Promise(r => setTimeout(r, 500));

        // 4. Input Number
        console.log("... Typing Number");
        await page.type(SEL.CATALOG_NBR_INPUT, courseNumber, { delay: 100 });
        await page.keyboard.press('Tab');
        await new Promise(r => setTimeout(r, 500));

        // 5. Uncheck "Show Open Classes Only"
        try {
            const labelSel = `label[for="SSR_CLSRCH_WRK_SSR_OPEN_ONLY$5"]`;
            const isChecked = await page.$eval(SEL.OPEN_ONLY_CHECKBOX, el => el.checked);
            if (isChecked) {
                console.log("... Unchecking 'Open Only'");
                await page.click(labelSel);
                await new Promise(r => setTimeout(r, 100));
            }
        } catch (e) {
            console.warn("⚠️ Checkbox issue:", e.message);
        }

        // 6. Submit via JS
        console.log("... Triggering Submission");
        await page.evaluate((btnId) => {
            if (typeof submitAction_win0 === 'function') {
                submitAction_win0(document.win0, btnId, new Event('click'));
            } else {
                console.log("submitAction_win0 not found!");
            }
        }, SEL.HIDDEN_SUBMIT_ID);

        // 7. Wait for Results
        console.log("⏳ Waiting for results to load...");
        try {
            // Wait for the first status icon container to appear
            await page.waitForSelector('div[id^="win0divDERIVED_CLSRCH_SSR_STATUS_LONG"]', { timeout: 15000 });
            console.log("⚡ Results detected!");
        } catch (e) {
            console.log("⚠️ Wait timeout or no results found. Converting page...");
        }

        // 8. Parse Results
        console.log("🔍 Extracting Course Data...");
        const sections = await page.evaluate((courseCode) => {
            const results = [];
            let i = 0;

            while (true) {
                // Status Icon Container
                const statusContainer = document.querySelector(`#win0divDERIVED_CLSRCH_SSR_STATUS_LONG\\$${i}`);
                // Break if we can't find the next row
                if (!statusContainer) break;

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

                // Extract Section info
                const sectionEl = document.querySelector(`#MTG_CLASSNAME\\$${i}`);
                const section = sectionEl ? sectionEl.innerText.replace(/\n/g, ' ').trim() : 'N/A';

                const timeEl = document.querySelector(`#MTG_DAYTIME\\$${i}`);
                const time = timeEl ? timeEl.innerText.trim() : 'N/A';

                const classNbrEl = document.querySelector(`#MTG_CLASS_NBR\\$${i}`);
                const classNbr = classNbrEl ? classNbrEl.innerText.trim() : 'N/A';

                results.push({
                    course: courseCode,
                    section,
                    status,
                    time,
                    classNbr
                });

                i++;
            }
            return results;
        }, `${subject} ${courseNumber}`);

        console.log(`✅ Found ${sections.length} sections.`);
        console.log(sections);

        // Save to JSON
        const outputPath = path.resolve(__dirname, 'scraper_results.json');
        fs.writeFileSync(outputPath, JSON.stringify(sections, null, 2));
        console.log(`💾 Saved data to ${outputPath}`);

    } catch (error) {
        console.error("❌ Scraper Error:", error);
    } finally {
        console.log("Closing browser immediately...");
        await browser.close();
    }
}

// CLI Argument Parsing
const args = process.argv.slice(2);
const termArg = args.find(a => a.startsWith('--term='))?.split('=')[1] || '2254'; // Default Winter 2026
const subjectArg = args.find(a => a.startsWith('--subject='))?.split('=')[1] || 'COMP';
const numberArg = args.find(a => a.startsWith('--number='))?.split('=')[1] || '248';

if (require.main === module) {
    scrapeConcordiaSeats(termArg, subjectArg, numberArg);
}

module.exports = scrapeConcordiaSeats;
