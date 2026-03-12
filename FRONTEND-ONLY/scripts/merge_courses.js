const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/sync').parse;
const stringify = require('csv-stringify/sync').stringify;

const DATA_DIR = path.join(__dirname, '../data');
const CATALOG_FILE = path.join(DATA_DIR, 'CU_SR_OPEN_DATA_CATALOG.csv');
const DESC_FILE = path.join(DATA_DIR, 'CU_SR_OPEN_DATA_CATALOG_DESC.csv');
const SCHED_FILE = path.join(DATA_DIR, 'CU_SR_OPEN_DATA_SCHED.csv');
const OUT_FILE = path.join(DATA_DIR, '../public/courses_merged.csv');

function normalizeTerm(termDescr) {
    const s = String(termDescr || "").toLowerCase();
    if (s.includes('fall')) return 'Fall';
    if (s.includes('winter')) return 'Winter';
    if (s.includes('summer')) return 'Summer';
    return '';
}

function run() {
    console.log("Reading CATALOG...");
    const catalogRaw = fs.readFileSync(CATALOG_FILE, 'utf8');
    const catalog = parse(catalogRaw, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });

    console.log("Reading DESCRIPTIONS...");
    const descRaw = fs.readFileSync(DESC_FILE, 'utf8');
    const descriptions = parse(descRaw, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });

    // Map descriptions by Course ID
    const descMap = new Map();
    if (descriptions.length > 0) {
        console.log("Sample Description Key:", Object.keys(descriptions[0]));
        // Check if we need to clean keys (e.g. remove quotes if parser didn't)
    }
    descriptions.forEach(d => {
        // Try to find the key that holds the ID
        const idKey = Object.keys(d).find(k => k.includes('Course ID'));
        const descKey = Object.keys(d).find(k => k.includes('Descr'));

        if (idKey && descKey) {
            descMap.set(d[idKey], d[descKey]);
        }
    });

    console.log("Reading SCHEDULE...");
    const schedRaw = fs.readFileSync(SCHED_FILE, 'utf8');
    const schedule = parse(schedRaw, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });

    // Map Course ID -> Set of Terms (Fall, Winter, Summer)
    const courseTerms = new Map();
    schedule.forEach(row => {
        const cid = row['Course ID'];
        const tDesc = row['Term Descr'];
        const norm = normalizeTerm(tDesc);

        if (norm) {
            if (!courseTerms.has(cid)) courseTerms.set(cid, new Set());
            courseTerms.get(cid).add(norm);
        }
    });

    console.log(`Merging ${catalog.length} courses with schedule data...`);

    const output = [];

    catalog.forEach(c => {
        const course_id = c['Course ID'];

        // Base properties
        const base = {
            course_id,
            course_credit: c['Class Units'],
            prereqdescription: c['Pre Requisite Description'] || "",
            career: c['Career'],
            equivalent_course_description: c['Equivalent Courses'] || "",
            session: "", // We don't have granular session data easily mapped, leave empty.
            subject: c['Subject'],
            catalogue: c['Catalog'],
            title: c['Long Title'],
            location_description: "",
            course_name: `${c['Subject']} ${c['Catalog']}`,
            description: descMap.get(course_id) || ""
        };

        const terms = courseTerms.get(course_id);

        if (terms && terms.size > 0) {
            // Generate valid rows for each term
            const sortedTerms = Array.from(terms).sort((a, b) => {
                // Sort Fall, Summer, Winter alphabetical is fine: Fall, Summer, Winter
                return a.localeCompare(b);
            });

            sortedTerms.forEach(t => {
                output.push({
                    ...base,
                    term: t
                });
            });
        } else {
            // No schedule found -> Single "Termless" row
            output.push({
                ...base,
                term: ""
            });
        }
    });

    console.log("Writing output...");
    const csvOut = stringify(output, {
        header: true,
        columns: [
            'course_id',
            'course_credit',
            'prereqdescription',
            'career',
            'equivalent_course_description',
            'term',
            'session',
            'subject',
            'catalogue',
            'title',
            'location_description',
            'course_name',
            'description'
        ]
    });

    fs.writeFileSync(OUT_FILE, csvOut);
    console.log(`Done! Wrote ${output.length} rows to ${OUT_FILE}`);
}

run();
