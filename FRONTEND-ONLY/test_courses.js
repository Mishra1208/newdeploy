const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, 'narendra', 'SA_LEARNER_SERVICES.SAA_SS_DPR_ADB.html');
const html = fs.readFileSync(htmlPath, 'utf-8');
const $ = cheerio.load(html);

console.log("=== COURSE PARSING EXPERIMENT ===");
$('.ui-collapsible').each((i, block) => {
    const titleEl = $(block).find('.ui-collapsible-heading-toggle, .PAGROUPDIVIDER, .PSGROUPBOXLABEL').first();
    if (!titleEl.length) return;
    let title = titleEl.text().trim().replace(/\\s+/g, ' ');
    title = title.replace(/^Collapse section\\s*/i, '').replace(/\\s*Collapsible section$/i, '').trim();

    // Only look at direct tables
    const tables = $(block).find('table').filter((idx, el) => {
        return $(el).closest('.ui-collapsible').get(0) === block;
    });

    if (tables.length > 0) {
        console.log(`\\n--- ${title} ---`);
        tables.each((_, table) => {
            const rows = $(table).find('tr');
            rows.each((_, row) => {
                const text = $(row).text().replace(/\\s+/g, ' ').trim();
                if (text && !text.includes('Course Description Term Grade Units')) {
                    const cols = $(row).find('td, th').map((k, col) => $(col).text().trim()).get();
                    if (cols.length >= 4) {
                        const courseCode = cols[0] || '';
                        const desc = cols[1] || '';
                        const term = cols[2] || '';
                        const grade = cols[3] || '';
                        const units = parseFloat(cols[4] || '0');
                        console.log(`[${grade}] ${courseCode} (${units}cr)`);
                    }
                }
            });
        });
    }
});
