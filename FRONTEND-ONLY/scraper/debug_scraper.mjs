import puppeteer from 'puppeteer';

// SELECTORS
const SEL = {
    TERM_DROPDOWN: '#CLASS_SRCH_WRK2_STRM\\$35\\$',
    SUBJECT_INPUT: '#SSR_CLSRCH_WRK_SUBJECT\\$1',
    CATALOG_NBR_INPUT: '#SSR_CLSRCH_WRK_CATALOG_NBR\\$2',
    OPEN_ONLY_CHECKBOX: '#SSR_CLSRCH_WRK_SSR_OPEN_ONLY\\$5',
    SEARCH_FOOTER_BTN: '.gh-footer-item',
    HIDDEN_SUBMIT_ID: 'CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH'
};

export async function scrapeConcordiaSeats(termVal, subject, courseNumber) {
    // START HYBRID BROWSER CONFIG
    let browser;

    // Always use local config for debug script
    const puppeteerLocal = (await import('puppeteer')).default;
    browser = await puppeteerLocal.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    // END HYBRID BROWSER CONFIG

    // ⚡️ OPTIMIZATION 1: Block Images, Fonts, CSS for speed
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });

    // Enable logging from inside the browser
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    try {
        // 1. Go to Search Page
        console.log("🔗 Connecting...");
        await page.goto('https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_EXT.CU_CLASS_SEARCH.GBL', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        // 2. Select Term
        console.log("... Choosing Term");
        await page.waitForSelector(SEL.TERM_DROPDOWN);
        await page.select(SEL.TERM_DROPDOWN, termVal);
        await page.waitForNetworkIdle({ idleTime: 100, timeout: 3000 }).catch(() => { });

        // 3. Input Subject
        console.log("... Typing Subject");
        await page.waitForSelector(SEL.SUBJECT_INPUT);
        await page.$eval(SEL.SUBJECT_INPUT, (el, val) => el.value = val, subject);
        await page.type(SEL.SUBJECT_INPUT, ' ');
        await page.keyboard.press('Backspace');

        // 4. Input Number
        console.log("... Typing Number");
        await page.waitForSelector(SEL.CATALOG_NBR_INPUT);
        await page.$eval(SEL.CATALOG_NBR_INPUT, (el, val) => el.value = val, courseNumber);
        await page.type(SEL.CATALOG_NBR_INPUT, ' ');
        await page.keyboard.press('Backspace');

        // 5. Uncheck "Show Open Classes Only"
        try {
            const isChecked = await page.$eval(SEL.OPEN_ONLY_CHECKBOX, el => el.checked);
            if (isChecked) {
                console.log("... Unchecking 'Open Only'");
                await page.click(SEL.OPEN_ONLY_CHECKBOX);
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
            await page.waitForSelector('div[id^="win0divDERIVED_CLSRCH_SSR_STATUS_LONG"]', { timeout: 15000 });
            console.log("⚡ Results detected!");
        } catch (e) {
            console.log("⚠️ Wait timeout or no results found.");
            return [];
        }

        // 8. Click into Detail Page
        console.log("🖱️ Clicking first section for details...");
        const sectionLinkSelector = '#MTG_CLASSNAME\\$0';
        await page.waitForSelector(sectionLinkSelector);

        // Click and wait for navigation or content update
        // Interaction usually triggers a postback or overlay update
        await Promise.all([
            page.waitForNetworkIdle({ idleTime: 500, timeout: 10000 }).catch(() => { }),
            page.click(sectionLinkSelector)
        ]);

        console.log("📝 Extracting Detail Page Data...");
        const debugData = await page.evaluate(() => {
            const results = {};
            const bodyText = document.body.innerText;

            // Search for specific labels common in PeopleSoft Class Detail pages
            // "Class Capacity", "Enrollment Total", "Available Seats", "Wait List Capacity", "Wait List Total"
            const relevantLines = bodyText.split('\n').filter(line =>
                line.match(/(Capacity|Enrollment|Total|Available|Seats|Wait List)/i)
            );

            // Also grab HTML of likely containers if we can guess them
            // PeopleSoft often uses 'SSR_CLS_DTL_WRK_ENRL_TOT' etc.
            // Let's just dump all IDs that look relevant
            const statusElements = Array.from(document.querySelectorAll('[id*="SSR_CLS_DTL_WRK"]'));
            const elementData = statusElements.map(el => ({
                id: el.id,
                text: el.innerText
            }));

            results.relevantLines = relevantLines;
            results.elementData = elementData;
            results.fullBodyTextSubstring = bodyText.substring(0, 2000); // Sanity check

            return results;
        });

        console.log("✅ Detail Data Captured.");
        return debugData;

    } catch (error) {
        console.error("❌ Scraper Error:", error);
        throw error;
    } finally {
        console.log("Closing browser immediately...");
        await browser.close();
    }
}
