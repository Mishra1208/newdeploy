const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const htmlPath = path.join(__dirname, 'narendra', 'SA_LEARNER_SERVICES.SAA_SS_DPR_ADB.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

const dom = new JSDOM(html);
global.window = dom.window;
global.document = dom.window.document;
global.DOMParser = dom.window.DOMParser;

const { parseAudit } = require('./src/lib/degree-audit/parseAudit.js');

const result = parseAudit(html);
console.log(JSON.stringify(result.summary, null, 2));
console.log(`Extracted Requirements: ${result.requirements.length}`);
result.requirements.forEach(r => console.log(`- ${r.title} | Req: ${r.credits.required}, Taken: ${r.credits.taken}, IP: ${r.courses ? r.courses.length : 0} courses`));
