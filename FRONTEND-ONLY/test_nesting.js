const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, 'narendra', 'SA_LEARNER_SERVICES.SAA_SS_DPR_ADB.html');
const html = fs.readFileSync(htmlPath, 'utf-8');
const $ = cheerio.load(html);

console.log("ALL COLLAPSIBLES:");
$('.ui-collapsible').each((i, el) => {
    const parent = $(el).parent().closest('.ui-collapsible');
    const title = $(el).find('.ui-collapsible-heading-toggle, .PAGROUPDIVIDER, .PSGROUPBOXLABEL').first().text().trim().replace(/\\s+/g, ' ');
    console.log(`- ${title}`);
    console.log(`  Has Parent Collapsible: ${parent.length > 0}`);
});
