const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, 'Student Record_files', 'SA_LEARNER_SERVICES.SSS_TSRQST_UNOFF.html');
const html = fs.readFileSync(htmlPath, 'utf-8');
const $ = cheerio.load(html);

const terms = [];
let currentTerm = null;

$('tr').each((i, el) => {
    // Remove invisible metadata injection for cleaner parsing strings
    const clone = $(el).clone();
    clone.find('.ui-table-cell-label').remove();
    clone.find('.sr-only').remove();
    const text = clone.text().replace(/\s+/g, ' ').trim();

    // Check if it's a new term header
    if (text.startsWith('Fall 20') || text.startsWith('Winter 20') || text.startsWith('Summer 20')) {
        // If it's a short string, it's likely the term header
        if (text.length < 20 && !text.includes('Description') && !text.includes('Attempted')) {
            currentTerm = {
                term: text,
                courses: [],
                termGPA: 0,
                cumGPA: 0
            };
            terms.push(currentTerm);
        }
    }

    // Check for "Term GPA" or "Cumulative GPA" (inside a term)
    if (text.includes('Cumulative') || text.includes('Cum ') || text.includes('GPA')) {
        console.log("DEBUG GPA ROW:", text);
    }

    if (currentTerm && text.includes('Term GPA')) {
        const match = text.match(/Term GPA\s+([\d.]+)/);
        if (match) currentTerm.termGPA = parseFloat(match[1]);
    }
    if (currentTerm && text.includes('Cumulative GPA')) {
        const match = text.match(/Cumulative GPA\s+([\d.]+)/);
        if (match) currentTerm.cumGPA = parseFloat(match[1]);
    }

    // Parse course rows
    // They usually have around 11-12 columns
    if (currentTerm && clone.find('td').length >= 8) {
        const tds = clone.find('td').map((i, td) => $(td).text().replace(/\s+/g, ' ').trim()).get();
        // A typical course row has "Course" as the first column text prefix if it has labels, 
        // or just "ECON" if labels are stripped.
        if (tds[0] && tds[1] && tds[3]) {
            let code = tds[0].replace('Course', '').trim();
            let number = tds[1];
            let name = tds[3].replace('Description', '').trim();
            // In case labels aren't strictly stripped

            // Only process if code looks like 3-4 letters
            if (code.match(/^[A-Z]{3,4}$/) || code.match(/^[A-Z]{3,4}\s*\d{3}/)) {
                let attemptedText = tds[4] || '';
                let gradeText = tds[5] || '';
                let earnedText = tds[10] || '';

                let credits = parseFloat(attemptedText.replace(/[^\d.]/g, '')) || 0;
                let earned = parseFloat(earnedText.replace(/[^\d.]/g, '')) || 0;
                let grade = gradeText.replace('Grade', '').trim();

                // Some lines might be transfer credits lacking class numbers, but generally we want proper courses
                currentTerm.courses.push({
                    code: `${code} ${number}`.trim(),
                    title: name,
                    credits,
                    earned,
                    grade
                });
            }
        }
    }
});

console.log(JSON.stringify(terms, null, 2));
console.log(`\nTotal Terms Extracted: ${terms.length}`);
