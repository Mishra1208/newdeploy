const cheerio = require('cheerio');

const GRADE_POINTS = {
    'A+': 4.3, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0, 'FNS': 0.0, 'R': 0.0
};

export function parseTranscript(html) {
    const $ = cheerio.load(html);
    const terms = [];
    let currentTerm = null;
    let programName = "";
    let studentName = "";
    let studentId = "";
    let minCreditsRequired = "";
    let foundProgram = false;

    // 1. Extract Student ID and Name
    $('b').each((i, b) => {
        const bText = $(b).text().trim();
        if (bText.includes('Student ID:')) {
            studentId = bText.replace('Student ID:', '').trim();
            const parentRow = $(b).closest('tr');
            if (parentRow.length > 0) {
                const nameB = parentRow.find('td').first().find('b');
                if (nameB.length > 0) {
                    studentName = nameB.text().trim();
                }
            }
        }
    });

    // 2. Extract Active Program (Latest block before courses)
    let lastActiveRowIndex = -1;
    const allTrs = $('tr');
    allTrs.each((index, tr) => {
        if ($(tr).text().includes('Active in Program')) {
            lastActiveRowIndex = index;
        }
    });

    if (lastActiveRowIndex !== -1) {
        let collectedProgram = [];
        for (let i = lastActiveRowIndex + 1; i < allTrs.length; i++) {
            const tr = allTrs.eq(i);
            const rowText = tr.text().replace(/\s+/g, ' ').trim();
            if (rowText.includes('Min. Credits Required:')) {
                minCreditsRequired = rowText.replace('Min. Credits Required:', '').replace(/[^0-9.]/g, '').trim();
                break;
            }
            if (rowText.includes('Term GPA') || i > lastActiveRowIndex + 10) {
                break;
            }
            if (tr.find('.CUProg, .CUPlan').length > 0) {
                let planText = rowText;
                if (planText && !planText.includes('(Co-op)') && !planText.includes('Withdrew')) {
                    collectedProgram.push(planText);
                }
            }
        }
        if (collectedProgram.length > 0) {
            programName = collectedProgram.join('\n');
            foundProgram = true;
        }
    }

    $('tr').each((i, el) => {
        const clone = $(el).clone();
        clone.find('.ui-table-cell-label').remove();
        clone.find('.sr-only').remove();
        const text = clone.text().replace(/\s+/g, ' ').trim();

        // Grab program name fallback
        if (!foundProgram && (text.includes('Bachelor') || text.includes('Master') || text.includes('Certificate') || text.includes('Engineering'))) {
            if (text.length > 15 && text.length < 150) {
                programName = text;
                foundProgram = true;
            }
        }

        if (text.startsWith('Fall 20') || text.startsWith('Winter 20') || text.startsWith('Summer 20')) {
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

        if (currentTerm) {
            const termMatch = text.match(/Term GPA\s*([\d.]+)/i);
            if (termMatch) currentTerm.termGPA = parseFloat(termMatch[1]);

            // Note: We no longer extract Cum GPA from text because it is often missing.
            // We will dynamically calculate it below.

            if (clone.find('td').length >= 8) {
                const tds = clone.find('td').map((i, td) => $(td).text().replace(/\s+/g, ' ').trim()).get();
                if (tds[0] && tds[1] && tds[3]) {
                    let codeRaw = tds[0].replace('Course', '').trim();
                    let number = tds[1];
                    let name = tds[3].replace('Description', '').trim();

                    if (codeRaw.match(/^[A-Z]{3,4}$/) || codeRaw.match(/^[A-Z]{3,4}\s*\d{3}/)) {
                        let code = codeRaw.replace(/\s+/g, '');
                        let attemptedText = tds[4] || '';
                        let gradeText = tds[5] || '';
                        let earnedText = tds[10] || '';

                        let credits = parseFloat(attemptedText.replace(/[^\d.]/g, '')) || 0;
                        let earned = parseFloat(earnedText.replace(/[^\d.]/g, '')) || 0;
                        let grade = gradeText.replace('Grade', '').trim();
                        if (grade === '' && credits > 0 && earned === 0) grade = 'IP';

                        currentTerm.courses.push({
                            code: `${code} ${number}`.trim(),
                            title: name,
                            credits,
                            earned,
                            grade,
                            subject: code // Helpful for radar charts
                        });
                    }
                }
            }
        }
    });

    let totalCreditsAttempted = 0;
    let totalCreditsEarned = 0;

    // Manual GPA tracking
    const courseHistory = {}; // Maps course code to latest grade information
    let runningCumGPA = 0;

    terms.forEach(t => {
        let termPoints = 0;
        let termGradedCredits = 0;

        t.courses.forEach(c => {
            totalCreditsAttempted += c.credits;
            if (c.grade !== 'IP' && c.grade !== 'F' && c.grade !== 'FNS' && c.grade !== 'DISC') {
                totalCreditsEarned += c.earned;
            }

            // Track graded courses for GPA
            if (GRADE_POINTS[c.grade] !== undefined) {
                const points = GRADE_POINTS[c.grade] * c.credits;
                termPoints += points;
                termGradedCredits += c.credits;

                // Update cumulative history (most recent grade overrides older ones for cumGPA)
                courseHistory[c.code] = { credits: c.credits, points: points };
            }
        });

        // Calculate dynamic Term GPA if it was missing from HTML
        if (t.termGPA === 0 && termGradedCredits > 0) {
            t.termGPA = parseFloat((termPoints / termGradedCredits).toFixed(2));
        }

        // Calculate dynamic Cumulative GPA up to this term
        let totalCumPoints = 0;
        let totalCumCredits = 0;
        Object.values(courseHistory).forEach(entry => {
            totalCumPoints += entry.points;
            totalCumCredits += entry.credits;
        });

        if (totalCumCredits > 0) {
            runningCumGPA = parseFloat((totalCumPoints / totalCumCredits).toFixed(2));
        }
        t.cumGPA = runningCumGPA;
    });

    const validTerms = terms.filter(t => t.courses.length > 0 || t.termGPA > 0);

    return {
        studentName,
        studentId,
        programName,
        minCreditsRequired,
        overallCumGPA: runningCumGPA,
        totalCreditsAttempted,
        totalCreditsEarned,
        terms: validTerms
    };
}
