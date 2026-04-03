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
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    const page = await browser.newPage();
    
    // ⚡️ OPTIMIZATION: Block Images, Fonts, CSS for speed
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    try {
        console.log("🔗 Connecting...");
        await page.goto('https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_EXT.CU_CLASS_SEARCH.GBL', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        console.log("... Choosing Term");
        await page.waitForSelector(SEL.TERM_DROPDOWN);
        await page.select(SEL.TERM_DROPDOWN, termVal);
        await page.waitForNetworkIdle({ idleTime: 100, timeout: 3000 }).catch(() => { });

        console.log("... Typing Subject");
        await page.waitForSelector(SEL.SUBJECT_INPUT);
        await page.$eval(SEL.SUBJECT_INPUT, (el, val) => el.value = val, subject);
        await page.type(SEL.SUBJECT_INPUT, ' ');
        await page.keyboard.press('Backspace');

        console.log("... Typing Number");
        await page.waitForSelector(SEL.CATALOG_NBR_INPUT);
        await page.$eval(SEL.CATALOG_NBR_INPUT, (el, val) => el.value = val, courseNumber);
        await page.type(SEL.CATALOG_NBR_INPUT, ' ');
        await page.keyboard.press('Backspace');

        try {
            const isChecked = await page.$eval(SEL.OPEN_ONLY_CHECKBOX, el => el.checked);
            if (isChecked) {
                console.log("... Unchecking 'Open Only'");
                await page.click(SEL.OPEN_ONLY_CHECKBOX);
            }
        } catch (e) {
            console.warn("⚠️ Checkbox issue:", e.message);
        }

        console.log("... Triggering Submission");
        await page.evaluate((btnId) => {
            if (typeof submitAction_win0 === 'function') {
                submitAction_win0(document.win0, btnId, new Event('click'));
            } else {
                console.log("submitAction_win0 not found!");
            }
        }, SEL.HIDDEN_SUBMIT_ID);

        console.log("⏳ Waiting for results to load...");
        try {
            await page.waitForSelector('div[id^="win0divDERIVED_CLSRCH_SSR_STATUS_LONG"]', { timeout: 15000 });
            console.log("⚡ Results detected!");
        } catch (e) {
            console.log("⚠️ Wait timeout or no results found.");
            return [];
        }

        console.log("🔍 Extracting Course Data (Global Scan v3)...");
        const sections = await page.evaluate((courseCode) => {
            const parseConcordiaTime = (timeStr) => {
                if (!timeStr || timeStr === 'N/A' || timeStr.includes('TBA')) {
                    return { days: 'TBA', startTime: '', endTime: '' };
                }
                const match = timeStr.trim().match(/^([A-Za-z]+)\s*([\d:APM\s]+)-([\d:APM\s]+)$/i);
                if (match) {
                    return { days: match[1], startTime: match[2].trim(), endTime: match[3].trim() };
                }
                return { days: 'TBA', startTime: '', endTime: '' };
            };

            const results = [];
            // Use global scan on all class number IDs
            const allClassNbrs = Array.from(document.querySelectorAll('span[id^="MTG_CLASS_NBR$"]'));
            
            allClassNbrs.forEach(nbrEl => {
                const idMatch = nbrEl.id.match(/\$(\d+)$/);
                if (!idMatch) return;
                const idx = idMatch[1];

                const classNbr = nbrEl.innerText.trim();
                const statusContainer = document.querySelector(`div[id*="STATUS_LONG\\$${idx}"]`) || 
                                        document.querySelector(`#win0divDERIVED_CLSRCH_SSR_STATUS_LONG\\$${idx}`);
                
                let status = 'Unknown';
                if (statusContainer) {
                    const html = statusContainer.innerHTML.toUpperCase();
                    if (html.includes('OPEN') || html.includes('SUCCESS') || html.includes('CHECK')) status = 'Open';
                    else if (html.includes('CLOSED') || html.includes('DANGER') || html.includes('ERROR')) status = 'Closed';
                    else if (html.includes('WAIT') || html.includes('WARNING') || html.includes('CLOCK')) status = 'Waitlist';
                }

                const sectionEl = document.querySelector(`#MTG_CLASSNAME\\$${idx}`);
                const section = sectionEl ? sectionEl.innerText.replace(/\n/g, ' ').trim() : 'N/A';

                const timeEl = document.querySelector(`#MTG_DAYTIME\\$${idx}`);
                const timeStr = timeEl ? timeEl.innerText.trim() : 'N/A';
                const parsedTime = parseConcordiaTime(timeStr);

                const instrEl = document.querySelector(`#MTG_INSTR\\$${idx}`);
                const instructor = instrEl ? instrEl.innerText.trim() : 'Staff';

                const locationEl = document.querySelector(`#MTG_ROOM\\$${idx}`);
                const location = locationEl ? locationEl.innerText.trim() : 'TBA';

                results.push({
                    id: classNbr,
                    section,
                    status,
                    days: parsedTime.days,
                    startTime: parsedTime.startTime,
                    endTime: parsedTime.endTime,
                    instructor,
                    location,
                    type: (section.includes('TUT') || section.includes('Tutorial')) ? 'TUT' : 
                          (section.includes('LAB') || section.includes('Laboratory')) ? 'LAB' : 'LEC',
                    term: "Unknown"
                });
            });

            return results;
        }, `${subject} ${courseNumber}`);

        console.log(`✅ Found ${sections.length} sections.`);
        return sections;

    } catch (error) {
        console.error("❌ Scraper Error:", error);
        throw error;
    } finally {
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

        await page.waitForSelector('a[id^="MTG_CLASSNAME"]', { timeout: 15000 });
        
        const found = await page.evaluate((cid) => {
            const rows = Array.from(document.querySelectorAll("tr")).filter(tr => tr.innerText.includes(cid));
            const link = rows.length > 0 ? rows[0].querySelector('a[id^="MTG_CLASSNAME"]') : null;
            if (link) { link.click(); return true; }
            return false;
        }, classId);

        if (!found) throw new Error("Could not find class row");

        await page.waitForSelector('span[id*="SSR_CLS_DTL_WRK_ENRL_CAP"]', { timeout: 10000 });

        const details = await page.evaluate(() => {
            const getVal = (id) => document.querySelector(`span[id*="${id}"]`)?.innerText.trim() || "0";
            return {
                capacity: getVal("SSR_CLS_DTL_WRK_ENRL_CAP"),
                waitlistCapacity: getVal("SSR_CLS_DTL_WRK_WAIT_CAP"),
                enrolled: getVal("SSR_CLS_DTL_WRK_ENRL_TOT"),
                waitlisted: getVal("SSR_CLS_DTL_WRK_WAIT_TOT"),
                available: getVal("SSR_CLS_DTL_WRK_AVAILABLE_SEATS"),
                prerequisites: "See course description"
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
