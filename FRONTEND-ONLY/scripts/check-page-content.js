const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const URL = 'https://www.concordia.ca/students/undergraduate/undergraduate-academic-dates.html';

    console.log(`Navigating to ${URL}...`);
    await page.goto(URL, { waitUntil: 'networkidle2' });

    const lists = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('.c-list-featured-events'));
        return els.map((el, i) => `List ${i} HTML (Length ${el.innerHTML.length}): \n${el.innerHTML.substring(0, 2000)}...\n-------------------`);
    });

    console.log(`Found ${lists.length} lists. Printing List 1 HTML:`);
    console.log(lists[1]);

    await browser.close();
})();
