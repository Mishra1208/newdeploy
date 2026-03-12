const fs = require('fs');
const path = require('path');
const { JSDOM } = require("jsdom");

const htmlPath = path.join(__dirname, 'narendra', 'SA_LEARNER_SERVICES.SAA_SS_DPR_ADB.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

const doc = new JSDOM(html).window.document;
global.window = new JSDOM(html).window;

// Bring in the exact parser
const { parseAudit } = require('./src/lib/degree-audit/parseAudit.js');

const result = parseAudit(html);
console.log(`Parsed In Progress Credits: ${result.summary.inProgressCredits}`);
console.log(`Parsed Completed Credits: ${result.summary.takenCredits}`);
console.log(`Parsed Needed Credits: ${result.summary.neededCredits}`);
