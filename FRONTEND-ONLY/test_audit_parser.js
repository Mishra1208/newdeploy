const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const PROFILES = {
    narendra: path.join(__dirname, 'narendra', 'SA_LEARNER_SERVICES.SAA_SS_DPR_ADB.html'),
    harjinder: path.join(__dirname, 'harjinder', 'SA_LEARNER_SERVICES.SAA_SS_DPR_ADB.html'),
    mehjabin: path.join(__dirname, 'mehjabin', 'SA_LEARNER_SERVICES.SAA_SS_DPR_ADB.html')
};

function parseAudit(htmlPath, profileName) {
    if (!fs.existsSync(htmlPath)) {
        console.error(`File not found for ${profileName}: ${htmlPath}`);
        return;
    }

    const html = fs.readFileSync(htmlPath, 'utf-8');
    const $ = cheerio.load(html);
    const requirements = [];

    const EXCLUDED_BLOCKS = [
        'ADMISSIONS DEFICIENCY',
        'IMPORTANT ADVISEMENT',
        'GRADUATION ELIGIBILITY',
        'LEGAL DISCLAIMER',
        'COURSES ENROLLED IN LATE',
        'CUMULATIVE GRADE POINT AVERAGE'
    ];

    const SPECIAL_INFO_BLOCKS = [
        'UNUSED',
        'NOT APPLIED',
        'EXEMPTIONS',
        'NOT TRANSFERRED'
    ];

    $('.ui-collapsible').each((i, block) => {
        const titleEl = $(block).find('.ui-collapsible-heading-toggle, .PAGROUPDIVIDER, .PSGROUPBOXLABEL').first();
        if (!titleEl.length) return;

        let title = titleEl.text().trim().replace(/\s+/g, ' ');
        if (!title || title === 'Collapse section' || title.includes('Collapsible section')) return;

        title = title.replace(/^Collapse section\s*/i, '').replace(/\s*Collapsible section$/i, '').trim();

        // Check Exclusions
        if (EXCLUDED_BLOCKS.some(ex => title.toUpperCase().includes(ex))) {
            return;
        }

        let isSpecialInfoBlock = SPECIAL_INFO_BLOCKS.some(sp => title.toUpperCase().includes(sp));

        let status = "Not Satisfied";
        // We only want spans that belong to THIS block directly, not nested blocks.
        // Nested blocks are inside another .ui-collapsible
        const spans = $(block).find('span.PSLONGEDITBOX').filter((idx, el) => {
            return $(el).closest('.ui-collapsible').get(0) === block;
        });

        spans.each((_, el) => {
            const text = $(el).text();
            if (text.startsWith('Satisfied:')) status = "Satisfied";
            if (text.startsWith('Not Satisfied:')) status = "Not Satisfied";
        });

        let credits = { required: 0, taken: 0, needed: 0 };
        const listItems = $(block).find('li').filter((idx, el) => {
            return $(el).closest('.ui-collapsible').get(0) === block;
        });

        listItems.each((_, el) => {
            const text = $(el).text().trim();
            if (text.startsWith('Units:')) {
                const match = text.match(/Units:\s*([\d.]+)\s*required,\s*([\d.]+)\s*taken,\s*([\d.]+)\s*needed/i);
                if (match) {
                    credits = {
                        required: parseFloat(match[1]),
                        taken: parseFloat(match[2]),
                        needed: parseFloat(match[3])
                    };
                }
            }
        });

        if (title && (status !== "Unknown" || credits.required > 0 || isSpecialInfoBlock)) {
            if (status === "Not Satisfied" && credits.required > 0 && credits.needed === 0) {
                status = "In Progress";
            }
            if (isSpecialInfoBlock) {
                credits = { required: 0, taken: 0, needed: 0 }; // force 0 constraints
            }

            requirements.push({
                title,
                status,
                credits,
                isInfoOnly: isSpecialInfoBlock,
                id: Math.random().toString(36).substr(2, 9)
            });
        }
    });

    const titleCounts = {};
    requirements.forEach(req => {
        if (titleCounts[req.title]) {
            titleCounts[req.title]++;
            req.title = `${req.title} (Part ${titleCounts[req.title]})`;
        } else {
            titleCounts[req.title] = 1;
        }
    });

    // Total Calculation Fix
    // Instead of looking for BACHELOR OF, let's look for the highest `required` credit block among "BACHELOR" OR "MAJOR".
    // Or, look closely at how PeopleSoft organizes the top-level block.

    // For Narendra, the ACTUAL total degree progress is often 90 credits. But does it say 90?
    // Let's find out what the blocks output. Let's dump the blocks.

    console.log(`\n============================`);
    console.log(`Profile: ${profileName.toUpperCase()}`);
    console.log(`============================`);

    requirements.forEach(r => console.log(`[${r.status}] ${r.title} | Req: ${r.credits.required}, Taken: ${r.credits.taken}`));

}

async function main() {
    for (const [profileName, htmlPath] of Object.entries(PROFILES)) {
        parseAudit(htmlPath, profileName);
    }
}

main();
