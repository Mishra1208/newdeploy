const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('🚀 Launching Local Browser to inspect Concordia Portal...');
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();

    console.log('🔗 Navigating to https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_EXT.CU_CLASS_SEARCH.GBL ...');
    await page.goto('https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_EXT.CU_CLASS_SEARCH.GBL', { waitUntil: 'networkidle2' });

    console.log('⏳ Page loaded. Waiting 5s for frames/dynamic content to settle...');
    await new Promise(r => setTimeout(r, 5000));

    console.log('📸 Taking debug screenshot...');
    const screenshotPath = path.resolve(__dirname, 'debug_concordia.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log('📝 Dumping HTML content...');
    let fullHtml = `<!-- MAIN PAGE -->\n${await page.content()}`;

    // Handle Iframes (PeopleSoft usually uses 'TargetContent')
    const frames = page.frames();
    console.log(`🔎 Found ${frames.length} frames. Inspecting...`);

    for (const frame of frames) {
        try {
            const name = frame.name() || frame.url();
            const content = await frame.content();
            fullHtml += `\n\n\n\n<!-- ==================== FRAME: ${name} ==================== -->\n${content}`;
        } catch (e) {
            console.log(`⚠️ Could not read frame ${frame.name()}: ${e.message}`);
        }
    }

    const htmlPath = path.resolve(__dirname, 'debug_concordia.html');
    fs.writeFileSync(htmlPath, fullHtml);

    console.log(`✅ COMPLETE.\nSaved Screenshot: ${screenshotPath}\nSaved HTML: ${htmlPath}`);
    console.log('Closing browser in 3 seconds...');

    await new Promise(r => setTimeout(r, 3000));
    await browser.close();
})();
