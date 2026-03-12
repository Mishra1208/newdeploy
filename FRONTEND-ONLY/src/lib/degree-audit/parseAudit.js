export function parseAudit(html) {
    try {
        if (typeof window === 'undefined') {
            throw new Error("parseAudit is only supported in the browser.");
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        let studentName = 'Unknown Student';
        let studentId = 'Unknown ID';
        let programName = 'Unknown Program';

        // PeopleSoft recently changed ID structure in some reports
        const nameEl = doc.querySelector('#DERIVED_SAA_DPR_DESCR200') || doc.querySelector('#DERIVED_SSTSNAV_PERSON_NAME');
        if (nameEl) studentName = nameEl.textContent.trim();

        const idEl = doc.querySelector('#DERIVED_SAA_DPR_EMPLID') || doc.querySelector('#DERIVED_SSTSNAV_EMPLID');
        if (idEl) studentId = idEl.textContent.trim();

        const progEl = doc.querySelector('div[id^="win0divDERIVED_SAA_DPR_GROUPBOX1"] .gs-collapsible-header');
        if (progEl) programName = progEl.textContent.replace(/Collapse section/i, '').trim();

        let requirements = [];
        let globalInProgress = 0;

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

        const blocks = doc.querySelectorAll('.ui-collapsible');

        // Tag all blocks with a unique ID to avoid object reference equality bugs (`===`) inside Next.js DOMParser
        blocks.forEach((block, idx) => {
            block.setAttribute('data-scope-id', `block-${idx}`);
        });

        blocks.forEach((block) => {
            const scopeId = block.getAttribute('data-scope-id');
            const titleEl = block.querySelector('.ui-collapsible-heading-toggle, .PAGROUPDIVIDER, .PSGROUPBOXLABEL');
            if (!titleEl) return;

            let title = titleEl.textContent.trim().replace(/\s+/g, ' ');
            if (!title || title === 'Collapse section' || title.includes('Collapsible section')) return;

            title = title.replace(/^Collapse section\s*/i, '').replace(/\s*Collapsible section$/i, '').trim();

            if (EXCLUDED_BLOCKS.some(ex => title.toUpperCase().includes(ex))) {
                return;
            }

            let isSpecialInfoBlock = SPECIAL_INFO_BLOCKS.some(sp => title.toUpperCase().includes(sp));
            let status = "Not Satisfied";

            const spans = Array.from(block.querySelectorAll('span.PSLONGEDITBOX')).filter(el => {
                const closest = el.closest('.ui-collapsible');
                return closest && closest.getAttribute('data-scope-id') === scopeId;
            });

            spans.forEach(el => {
                const text = el.textContent;
                if (text.startsWith('Satisfied:')) status = "Satisfied";
                if (text.startsWith('Not Satisfied:')) status = "Not Satisfied";
            });

            let credits = { required: 0, taken: 0, needed: 0 };
            const listItems = Array.from(block.querySelectorAll('li')).filter(el => {
                const closest = el.closest('.ui-collapsible');
                return closest && closest.getAttribute('data-scope-id') === scopeId;
            });

            listItems.forEach(el => {
                // remove non-breaking spaces and convert to normal spaces just in case
                const text = el.textContent.replace(/\u00a0/g, ' ').trim();
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

            // Parse individual courses inside this block
            let courses = [];
            const tables = Array.from(block.querySelectorAll('table.PSLEVEL1GRIDWBO, table.PSLEVEL2GRIDWBO, table.PSLEVEL1GRID, table.PSLEVEL2GRID, table.ps_grid-flex, table')).filter(tbl => {
                const closest = tbl.closest('.ui-collapsible');
                return closest && closest.getAttribute('data-scope-id') === scopeId;
            });

            tables.forEach(table => {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const tds = Array.from(row.querySelectorAll('td')).map(td => {
                        const clone = td.cloneNode(true);

                        // PeopleSoft mobile grid injects hidden <b> labels into every cell, e.g. <b class="ui-table-cell-label">Units</b> 3.00
                        const label = clone.querySelector('b.ui-table-cell-label');
                        if (label) label.remove();

                        // Also remove screen reader spans
                        const srOnly = clone.querySelectorAll('.sr-only');
                        srOnly.forEach(sr => sr.remove());

                        return clone.textContent.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
                    });

                    if (tds.length >= 4) {
                        let code = tds[0];
                        if (code && code.match(/^[A-Z]{3,4}\s+\d{3,4}/)) {
                            let units = parseFloat(tds[2] || '0') || 0;
                            let term = tds[3] || '';
                            let grade = tds[4] || '';
                            let sysStatus = tds[5] || '';

                            courses.push({ code, title: tds[1] || '', units, term, grade });
                        }
                    }
                });
            });

            if (title && (status !== "Unknown" || credits.required > 0 || isSpecialInfoBlock || courses.length > 0)) {
                if (status === "Not Satisfied" && credits.required > 0 && credits.needed === 0) {
                    status = "In Progress";
                }

                if (isSpecialInfoBlock) {
                    credits = { required: 0, taken: 0, needed: 0 };
                }

                let parentWrapper = block.parentElement ? block.parentElement.closest('.ui-collapsible') : null;

                requirements.push({
                    title,
                    status,
                    credits,
                    courses,
                    isInfoOnly: isSpecialInfoBlock,
                    isRoot: parentWrapper === null,
                    id: Math.random().toString(36).substr(2, 9)
                });
            }
        });

        // Exact Total Calculation Logic
        let totalCreditsRequired = 0;
        let totalCreditsTaken = 0;
        let totalCreditsNeeded = 0;

        const getRootCredits = (rootIdx) => {
            const root = requirements[rootIdx];
            if (root.credits.required > 0) return root.credits;
            let req = 0, tak = 0, need = 0;
            for (let i = rootIdx + 1; i < requirements.length; i++) {
                if (requirements[i].isRoot) break;
                req += requirements[i].credits.required;
                tak += requirements[i].credits.taken;
                need += requirements[i].credits.needed;
            }
            return { required: req, taken: tak, needed: need };
        };

        const mainDegreeBlock = requirements.find(r => r.title.toUpperCase().includes('BACHELOR OF') && !r.title.toUpperCase().includes('EXTENDED') && r.isRoot);
        const ecpBlock = requirements.find(r => r.title.toUpperCase().includes('EXTENDED CREDIT PROGRAM') && r.title.toUpperCase().includes('BACHELOR') && r.isRoot);
        const secondMajorBlock = requirements.find(r => r.title.toUpperCase().includes('MAJOR IN') && r.isRoot);

        let degreeStatsAccumulated = false;

        if (mainDegreeBlock) {
            const sums = getRootCredits(requirements.indexOf(mainDegreeBlock));
            totalCreditsRequired += sums.required;
            totalCreditsTaken += sums.taken;
            totalCreditsNeeded += sums.needed;
            degreeStatsAccumulated = true;
        } else if (secondMajorBlock) {
            const sums = getRootCredits(requirements.indexOf(secondMajorBlock));
            totalCreditsRequired += sums.required;
            totalCreditsTaken += sums.taken;
            totalCreditsNeeded += sums.needed;
            degreeStatsAccumulated = true;
        }

        if (ecpBlock) {
            const sums = getRootCredits(requirements.indexOf(ecpBlock));
            totalCreditsRequired += sums.required;
            totalCreditsTaken += sums.taken;
            totalCreditsNeeded += sums.needed;
        }

        if (!mainDegreeBlock && !secondMajorBlock) {
            let rootRequired = 0, rootTaken = 0;
            requirements.filter(r => r.isRoot).forEach(root => {
                const sums = getRootCredits(requirements.indexOf(root));
                if (!root.isInfoOnly) { rootRequired += sums.required; rootTaken += sums.taken; }
            });
            const minor = requirements.find(r => r.title.toUpperCase().includes('MINOR') && r.isRoot);
            const electives = requirements.find(r => r.title.toUpperCase().includes('ELECTIVES') && !r.title.toUpperCase().includes('MINOR') && r.isRoot);
            if (minor && electives && minor.credits.required > 0 && electives.credits.required >= minor.credits.required) {
                rootRequired -= minor.credits.required;
            }
            if (!degreeStatsAccumulated) {
                totalCreditsRequired = rootRequired;
                totalCreditsTaken = rootTaken;
            }
        }

        totalCreditsNeeded = Math.max(0, totalCreditsRequired - totalCreditsTaken);

        // Precise IP sum calculation using unique enrolled courses globally 
        const ipCoursesSet = new Map();
        requirements.forEach(req => {
            if (!req.isInfoOnly) {
                req.courses.forEach(c => {
                    if (c.grade === '' || c.grade === 'IP' || c.grade.includes('EN')) {
                        ipCoursesSet.set(c.code, c.units);
                    }
                });
            }
        });

        let exactIpCredits = 0;
        ipCoursesSet.forEach(units => { exactIpCredits += units; });

        // Calculate truly Completed vs IP
        let completedCredits = Math.max(0, totalCreditsTaken - exactIpCredits);

        const progressPercent = totalCreditsRequired > 0
            ? Math.round((completedCredits / totalCreditsRequired) * 100)
            : 0;

        // Parent / Child Flattening
        let finalRequirements = [];
        let currentParentTitle = null;

        for (let i = 0; i < requirements.length; i++) {
            const req = requirements[i];

            if (req.isRoot) {
                if (req.credits.required === 0 && req.credits.taken === 0 && !req.isInfoOnly && req.courses.length === 0) {
                    currentParentTitle = req.title.replace(/\s*\(RG \d+\)/gi, '');
                    continue;
                } else {
                    currentParentTitle = null; // Reset
                    finalRequirements.push(req);
                }
            } else {
                if (currentParentTitle) {
                    req.title = `${currentParentTitle}: ${req.title}`;
                }
                finalRequirements.push(req);
            }
        }

        return {
            studentName,
            studentId,
            programName,
            date: new Date().toLocaleDateString(),
            summary: {
                totalCredits: totalCreditsRequired,
                takenCredits: completedCredits,
                neededCredits: totalCreditsNeeded,
                inProgressCredits: exactIpCredits > 0 ? exactIpCredits : 0,
                progress: Math.min(100, progressPercent),
                gpa: 0
            },
            requirements: finalRequirements
        };
    } catch (e) {
        console.error(e);
        return {
            error: e.message,
            stack: e.stack,
            summary: { totalCredits: 0, takenCredits: 0, neededCredits: 0, inProgressCredits: 0, progress: 0, gpa: 0 },
            requirements: []
        };
    }
}
