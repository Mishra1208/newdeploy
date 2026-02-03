const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URL = 'https://www.concordia.ca/students/undergraduate/undergraduate-academic-dates.html';
const OUTPUT_FILE = path.join(__dirname, '../src/data/academic-dates.json');

(async () => {
    console.log('📅 Starting Academic Dates Scraper...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // console.log('PAGE LOG: Requests unblocked.');
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    try {
        await page.goto(URL, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const results = {};

            // 1. Find ALL H2s on the page first
            const allH2s = Array.from(document.querySelectorAll('h2'));
            // console.log(`DEBUG: Found ${allH2s.length} H2 tags: ` + allH2s.map(h => h.innerText).join(' | '));

            allH2s.forEach(header => {
                const termName = header.textContent.trim();

                // 2. Loose check for "Year" and "term" matches (e.g. "Fall term 2026")
                if (!termName.toLowerCase().includes('term') || !/\d{4}/.test(termName)) {
                    return;
                }

                console.log(`PAGE LOG: Processing "${termName}"...`);

                // Find the wrapper component (usually .c-wysiwyg)
                // If header is inside .c-wysiwyg, use that. Otherwise use parent.
                const wrapper = header.closest('.c-wysiwyg') || header.parentElement;

                let containers = [];
                let candidate = wrapper.nextElementSibling;
                let attempts = 0;

                // Log first 20 siblings to debug
                let debugCand = wrapper.nextElementSibling;
                for (let i = 0; i < 20; i++) {
                    if (debugCand) {
                        const cls = debugCand.className || 'no-class';
                        console.log(`PAGE LOG:     Sibling ${i}: <${debugCand.tagName} class="${cls}"> Text: ${debugCand.textContent.substring(0, 100).replace(/\n/g, ' ')}...`);
                        debugCand = debugCand.nextElementSibling;
                    }
                }

                // Look for ALL consecutive event lists until we hit another header or run out
                while (candidate && attempts < 20) {
                    const hasH2 = candidate.querySelector('h2');
                    const isList = candidate.classList.contains('c-list-featured-events');

                    console.log(`PAGE LOG:     Loop ${attempts}: Class="${candidate.className}" HasH2=${!!hasH2} IsList=${isList}`);

                    if (isList) {
                        containers.push(candidate);
                    } else if (hasH2) {
                        const h2Text = hasH2.textContent.trim();
                        console.log(`PAGE LOG:     -> Found H2: "${h2Text}"`);

                        // Only break if it looks like a Term Header (e.g. "Summer term 2026")
                        // If it's just "Note" or something else, ignore.
                        if (h2Text.toLowerCase().includes('term') && /\d{4}/.test(h2Text)) {
                            console.log(`PAGE LOG:     -> Term Header detected. Breaking.`);
                            break;
                        } else {
                            console.log(`PAGE LOG:     -> Not a term header. Continuing.`);
                        }
                    }
                    candidate = candidate.nextElementSibling;
                    attempts++;
                }

                if (containers.length === 0) {
                    console.log(`PAGE LOG: ❌ No data containers found for "${termName}"`);
                    return;
                }

                console.log(`PAGE LOG:   Term "${termName}" - Found ${containers.length} containers.`);

                const termEvents = [];
                let currentMonth = "Unknown Month";

                containers.forEach(container => {
                    // Bypass UL structure and find all LIs directly
                    const allListItems = Array.from(container.querySelectorAll('li'));
                    console.log(`PAGE LOG:   Container has ${allListItems.length} list items.`);

                    allListItems.forEach(child => {
                        const wrapper = child.querySelector('div') || child;

                        // Case 1: Month Header
                        // It might be an H3, or just a DIV with text "Month Year"
                        const headerTag = wrapper.querySelector('h3, h4, h5');
                        const text = wrapper.textContent.trim();

                        // Debug log for headers
                        if (headerTag) {
                            console.log(`PAGE LOG:     -> Found Header: ${headerTag.textContent.trim()}`);
                        }

                        if (headerTag) {
                            currentMonth = headerTag.textContent.trim();
                            return;
                        } else if (/^[A-Z][a-z]+ \d{4}$/.test(text)) {
                            currentMonth = text;
                            return;
                        }

                        // Case 2: Event Rows
                        const dateEls = Array.from(wrapper.querySelectorAll('.date'));
                        const textEls = Array.from(wrapper.querySelectorAll('.text'));

                        if (dateEls.length > 0 && textEls.length > 0) {
                            dateEls.forEach((dateEl, index) => {
                                const textEl = textEls[index];
                                if (!textEl) return;

                                const dateText = dateEl.textContent.trim();
                                const description = textEl.textContent.trim();

                                // Always infer/update month from date text to be accurate
                                const match = dateText.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/);
                                if (match) {
                                    let shortMonth = match[1];
                                    const monthMap = {
                                        'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
                                        'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
                                        'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
                                    };
                                    let fullMonth = monthMap[shortMonth] || shortMonth;

                                    // Extract year from Term Name (e.g. Winter term 2026 -> 2026)
                                    // Note: If Fall 2026 has dates in Jan 2027 (unlikely), this might need tweaking.
                                    // But typically Academic Terms are self-contained in year blocks or named by start/end.
                                    // Winter 2026 = Jan-Apr 2026. Fall 2026 = Sep-Dec 2026. Summer 2026 = May-Aug 2026.
                                    // Exception: "Fall/Winter 2025-26". But here we are processing strict "Winter term 2026".
                                    const yearMatch = termName.match(/(\d{4})/);
                                    let year = yearMatch ? yearMatch[1] : '';

                                    // Handle "Fall 2025" logic just in case (Fall is typically same year)
                                    // Winter is same year.
                                    // Summer is same year.
                                    // If we ever see "Jan" in a "Fall 2025" list? That would be next year.
                                    if (termName.includes('Fall') && fullMonth === 'January') {
                                        year = parseInt(year) + 1;
                                    }

                                    currentMonth = `${fullMonth} ${year}`.trim();
                                }

                                if (dateText && description) {
                                    termEvents.push({
                                        month: currentMonth,
                                        date: dateText,
                                        description: description,
                                        fullDate: `${dateText}, ${currentMonth.split(' ')[1] || ''}`
                                    });
                                }
                            });
                        }
                    });
                });
                if (termEvents.length > 0) {
                    results[termName] = termEvents;
                }
            });

            return results;
        });

        console.log(`✅ Scraped ${Object.keys(data).length} terms.`);

        // Ensure directory exists
        const dir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
        console.log(`💾 Saved to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('❌ Error scraping:', error);
    } finally {
        await browser.close();
    }
})();
