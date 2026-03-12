const fs = require('fs');
const path = require('path');

// To require a module with export syntaxes in raw node
const { parseTranscript } = require('./src/lib/transcript/parseTranscript.js');

const htmlPath = path.join(__dirname, 'Student Record_files', 'SA_LEARNER_SERVICES.SSS_TSRQST_UNOFF.html');
const Buffer = fs.readFileSync(htmlPath);
const html = Buffer.toString('utf-8');

const data = parseTranscript(html);
console.log("Overall Cum GPA:", data.overallCumGPA);
console.log("Terms Cum GPAs:", data.terms.map(t => t.cumGPA));
