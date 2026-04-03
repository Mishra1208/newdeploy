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

    // Detect Vercel/Production Environment
    if (process.env.NODE_ENV === 'production') {
        const chromium = (await import('@sparticuz/chromium')).default;
        const puppeteerCore = (await import('puppeteer-core')).default;

        // Optional: Load local font if needed, but keeping it simple for now
        // await chromium.font('https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf');

        // REMOTE DOWNLOAD STRATEGY
        // This bypasses the "input directory does not exist" error by downloading the binary at runtime to /tmp
        const executablePath = await chromium.executablePath(
            "https://github.com/Sparticuz/chromium/releases/download/v123.0.0/chromium-v123.0.0-pack.tar"
        );

        browser = await puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true
        });
    } else {
        // Local Development
        const puppeteer = (await import('puppeteer')).default;
        browser = await puppeteer.launch({
            headless: "new", // "new" is the modern headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

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
        // 1. Go to Search Page (Fastest Wait)
        console.log("🔗 Connecting...");
        await page.goto('https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_EXT.CU_CLASS_SEARCH.GBL', {
            waitUntil: 'domcontentloaded', // Much faster than networkidle2
            timeout: 30000
        });

        // 2. Select Term
        console.log("... Choosing Term");
        await page.waitForSelector(SEL.TERM_DROPDOWN);
        await page.select(SEL.TERM_DROPDOWN, termVal);

        // Wait for Loading Overlay/Spinner to disappear instead of fixed sleep
        // Concordia pages usually do a postback. We wait for network idle briefly.
        await page.waitForNetworkIdle({ idleTime: 100, timeout: 3000 }).catch(() => { });

        // 3. Input Subject (Instant Entry)
        console.log("... Typing Subject");
        await page.waitForSelector(SEL.SUBJECT_INPUT);
        await page.$eval(SEL.SUBJECT_INPUT, (el, val) => el.value = val, subject);
        await page.type(SEL.SUBJECT_INPUT, ' '); // Small trigger to fire events
        await page.keyboard.press('Backspace');

        // 4. Input Number (Instant Entry)
        console.log("... Typing Number");
        await page.waitForSelector(SEL.CATALOG_NBR_INPUT);
        await page.$eval(SEL.CATALOG_NBR_INPUT, (el, val) => el.value = val, courseNumber);
        await page.type(SEL.CATALOG_NBR_INPUT, ' '); // Trigger events
        await page.keyboard.press('Backspace');

        // 5. Uncheck "Show Open Classes Only"
        try {
            const isChecked = await page.$eval(SEL.OPEN_ONLY_CHECKBOX, el => el.checked);
            if (isChecked) {
                console.log("... Unchecking 'Open Only'");
                await page.click(SEL.OPEN_ONLY_CHECKBOX); // Click matches label often better
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
            console.log("⚠️ Wait timeout or no results found.");
            // We return empty array if no results found instead of crashing
            return [];
        }

        // 8. Parse Results
        console.log("🔍 Extracting Course Data...");
        const sections = await page.evaluate((courseCode) => {
            const parseConcordiaTime = (timeStr) => {
                if (!timeStr || timeStr === 'N/A' || timeStr.includes('TBA')) {
                    return { days: 'TBA', startTime: '', endTime: '' };
                }

                // Handle format: "MoWe 10:15AM - 11:30AM" or "MoWeFr 12:00PM - 1:15PM"
                const parts = timeStr.split(' ');
                if (parts.length < 4) return { days: [], startTime: '', endTime: '' };

                const dayStr = parts[0]; // e.g. "MoWe"
                const startTime = parts[1]; // e.g. "10:15AM"
                const endTime = parts[3]; // e.g. "11:30AM"

                return { days: dayStr, startTime, endTime };
            };

            const results = [];
            let i = 0;

            while (true) {
                // Status Icon Container
                const statusContainer = document.querySelector(`#win0divDERIVED_CLSRCH_SSR_STATUS_LONG\\$${i}`);
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
                const timeStr = timeEl ? timeEl.innerText.trim() : 'N/A';
                const parsedTime = parseConcordiaTime(timeStr);

                const classNbrEl = document.querySelector(`#MTG_CLASS_NBR\\$${i}`);
                const classNbr = classNbrEl ? classNbrEl.innerText.trim() : 'N/A';

                const instrEl = document.querySelector(`#MTG_INSTR\\$${i}`);
                const instructor = instrEl ? instrEl.innerText.trim() : 'Staff';

                const locEl = document.querySelector(`#MTG_ROOM\\$${i}`);
                const location = locEl ? locEl.innerText.trim() : 'TBA';

                results.push({
                    id: classNbr,
                    course: courseCode,
                    section,
                    status,
                    time: timeStr,
                    classNbr,
                    days: parsedTime.days,
                    startTime: parsedTime.startTime,
                    endTime: parsedTime.endTime,
                    instructor,
                    location,
                    description: `${courseCode} - ${section}`
                });

                i++;
            }
            return results;
        }, `${subject} ${courseNumber}`);

        console.log(`✅ Found ${sections.length} sections.`);
        return sections; // RETURN DATA DIRECTLY

    } catch (error) {
        console.error("❌ Scraper Error:", error);
        throw error; // Propagate error to API
    } finally {
        console.log("Closing browser immediately...");
        await browser.close();
    }
}

export async function scrapeDeepDetails(termVal, subject, courseNumber, classId) {
    let browser;
    if (process.env.NODE_ENV === 'production') {
        const chromium = (await import('@sparticuz/chromium')).default;
        const puppeteerCore = (await import('puppeteer-core')).default;
        const executablePath = await chromium.executablePath(
            "https://github.com/Sparticuz/chromium/releases/download/v123.0.0/chromium-v123.0.0-pack.tar"
        );
        browser = await puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true
        });
    } else {
        const puppeteer = (await import('puppeteer')).default;
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    const page = await browser.newPage();
    try {
        console.log(`🔍 Deep Diving: ${subject} ${courseNumber} (Class ${classId})`);
        await page.goto('https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_EXT.CU_CLASS_SEARCH.GBL', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        // 1. Initial Search (Same as main scrape)
        await page.waitForSelector(SEL.TERM_DROPDOWN);
        await page.select(SEL.TERM_DROPDOWN, termVal);
        await page.waitForNetworkIdle({ idleTime: 100, timeout: 3000 }).catch(() => { });

        await page.waitForSelector(SEL.SUBJECT_INPUT);
        await page.$eval(SEL.SUBJECT_INPUT, (el, val) => el.value = val, subject);
        await page.type(SEL.SUBJECT_INPUT, ' ');
        await page.keyboard.press('Backspace');

        await page.waitForSelector(SEL.CATALOG_NBR_INPUT);
        await page.$eval(SEL.CATALOG_NBR_INPUT, (el, val) => el.value = val, courseNumber);
        await page.type(SEL.CATALOG_NBR_INPUT, ' ');
        await page.keyboard.press('Backspace');

        try {
            const isChecked = await page.$eval(SEL.OPEN_ONLY_CHECKBOX, el => el.checked);
            if (isChecked) await page.click(SEL.OPEN_ONLY_CHECKBOX);
        } catch (e) {}

        await page.evaluate((btnId) => {
            if (typeof submitAction_win0 === 'function') {
                submitAction_win0(document.win0, btnId, new Event('click'));
            }
        }, SEL.HIDDEN_SUBMIT_ID);

        // 2. Click class link
        await page.waitForSelector('a[id^="MTG_CLASSNAME"]', { timeout: 15000 });
        
        const found = await page.evaluate((cid) => {
            const rows = Array.from(document.querySelectorAll("tr")).filter(tr => tr.innerText.includes(cid));
            const link = rows.length > 0 ? rows[0].querySelector('a[id^="MTG_CLASSNAME"]') : null;
            if (link) {
                link.click();
                return true;
            }
            return false;
        }, classId);

        if (!found) throw new Error("Could not find class row in search results");

        // 3. Extract Deep Data
        await page.waitForSelector('span[id*="SSR_CLS_DTL_WRK_ENRL_CAP"]', { timeout: 10000 });

        const details = await page.evaluate(() => {
            const getVal = (id) => document.querySelector(`span[id*="${id}"]`)?.innerText.trim() || "0";
            
            // Prerequisites extraction logic
            let prerequisites = "None";
            const pNodes = Array.from(document.querySelectorAll('span, p, div')).filter(el => {
                const txt = el.innerText || "";
                return (txt.includes("Prerequisite") || txt.includes("Prereq")) && txt.length < 500 && !txt.includes("Class Search");
            });
            if (pNodes.length > 0) {
                const explicitNode = pNodes.find(n => n.id && n.id.includes("REQUISITE"));
                prerequisites = explicitNode ? explicitNode.innerText.trim() : pNodes[0].innerText.trim();
                // Slice if too long
                if (prerequisites.includes("\n")) {
                    prerequisites = prerequisites.split("\n").find(line => line.includes("Prerequisite") || line.includes("Prereq")) || prerequisites;
                }
            }

            return {
                capacity: getVal("SSR_CLS_DTL_WRK_ENRL_CAP"),
                waitlistCapacity: getVal("SSR_CLS_DTL_WRK_WAIT_CAP"),
                enrolled: getVal("SSR_CLS_DTL_WRK_ENRL_TOT"),
                waitlisted: getVal("SSR_CLS_DTL_WRK_WAIT_TOT"),
                available: getVal("SSR_CLS_DTL_WRK_AVAILABLE_SEATS"),
                prerequisites
            };
        });

        return details;

    } catch (error) {
        console.error("❌ Deep Scraper Error:", error);
        throw error;
    } finally {
        await browser.close();
    }
}
