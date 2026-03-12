const fs = require('fs');
const path = require('path');
const { JSDOM } = require("jsdom");

const htmlPath = path.join(__dirname, 'narendra', 'SA_LEARNER_SERVICES.SAA_SS_DPR_ADB.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

const doc = new JSDOM(html).window.document;

let missingCredits = 0;
let missingCourses = 0;

const blocks = doc.querySelectorAll('.ui-collapsible');
console.log(`Total blocks: ${blocks.length}`);

blocks.forEach((block, index) => {
    let titleEl = block.querySelector('.ui-collapsible-heading-toggle, .PAGROUPDIVIDER, .PSGROUPBOXLABEL');
    if (!titleEl) return;
    let title = titleEl.textContent.trim().replace(/\\s+/g, ' ');

    let credits = { required: 0, taken: 0, needed: 0 };
    const listItems = Array.from(block.querySelectorAll('li')).filter(el => {
        return el.closest('.ui-collapsible') === block;
    });

    listItems.forEach(el => {
        const text = el.textContent.trim();
        if (title.includes("ESL 202")) {
            console.log(`ESL 202 LI TEXT: '${text}'`);
        }
        if (text.startsWith('Units:')) {
            const match = text.match(/Units:\\s*([\\d.]+)\\s*required,\\s*([\\d.]+)\\s*taken,\\s*([\\d.]+)\\s*needed/i);
            if (match) {
                credits = {
                    required: parseFloat(match[1]),
                    taken: parseFloat(match[2]),
                    needed: parseFloat(match[3])
                };
            }
        }
    });

    let courses = [];
    const tables = Array.from(block.querySelectorAll('table.PSLEVEL1GRIDWBO, table.PSLEVEL2GRIDWBO, table.PSLEVEL1GRID, table.PSLEVEL2GRID, table.ps_grid-flex, table')).filter(tbl => {
        return tbl.closest('.ui-collapsible') === block;
    });

    tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const tds = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim().replace(/\\s+/g, ' '));
            if (tds.length >= 4) {
                let code = tds[0];
                if (code && code.match(/^[A-Z]{3,4}\\s+\\d{3,4}/)) {
                    courses.push(code);
                }
            }
        });
    });

    if (title.includes("Computer Science Core")) {
        console.log(`[${index}] Title: ${title}`);
        console.log(`[${index}] Credits Extracted: ${credits.required}`);
        console.log(`[${index}] Courses Extracted: ${courses.length}`);
        if (courses.length === 0 && tables.length > 0) {
            console.log("TABLES FOUND BUT NO COURSES!");
        } else if (tables.length === 0) {
            console.log("NO TABLES PASSED FILTER!");
            const unFilteredTables = block.querySelectorAll('table.PSLEVEL1GRIDWBO, table.PSLEVEL2GRIDWBO, table.PSLEVEL1GRID, table.PSLEVEL2GRID, table.ps_grid-flex, table');
            console.log("Raw tables found in block: " + unFilteredTables.length);
            if (unFilteredTables.length > 0) {
                console.log("tbl.closest('.ui-collapsible') == block? ", unFilteredTables[0].closest('.ui-collapsible') === block);
            }
        }
    }
});
