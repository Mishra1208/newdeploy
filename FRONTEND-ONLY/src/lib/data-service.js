import Papa from 'papaparse';

// Direct import of CSV as a string would be ideal if using a loader, but for now we might need to fetch it or import it if configured.
// However, since this is Next.js, we can try importing the raw content if configured, or just fetching it.
// Given it's in src/data, let's try a direct fs read if server-side, or import if client side.
// Simpler approach for Next.js App Router: Import the CSV content directly if using raw-loader, or move to public.
// BUT, since we are in "FRONTEND-ONLY", let's assume standard Next.js.
// Best way without extra config: Copy the CSV content into a JS string or JSON, OR use a server action to read it.
// Let's use a server action or just read the file in a Server Component.

// Actually, simpler: Let's assume we can read it on the server.
/*
 * Utility to fetch and parse the CSV data.
 */

// We will load the data. For simplicity in this demo, we might need to rely on fs on server.
import fs from 'fs';
import path from 'path';

// Cache the data
let cachedData = null;

export async function getGradeData() {
    if (cachedData) return cachedData;

    const filePath = path.join(process.cwd(), 'src/data/comp_grades.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: true,
            dynamicTyping: true, // Automatically parse numbers
            skipEmptyLines: true,
            complete: (results) => {
                cachedData = results.data;
                resolve(cachedData);
            },
            error: (err) => {
                reject(err);
            }
        });
    });
}

export async function getAllCourses() {
    const data = await getGradeData();
    // Unique courses
    const courses = [...new Set(data.map(row => row.Course))].sort();
    return courses;
}

export async function getCourseData(courseCode) {
    const data = await getGradeData();
    return data.filter(row => row.Course === courseCode);
}

// Calculate generic stats for a course (aggregated across all terms found)
export function calculateCourseStats(courseRows) {
    if (!courseRows || courseRows.length === 0) return null;

    let totalStudents = 0;
    let totalPass = 0;
    let totalFail = 0; // F, FNS
    let weightedGPASum = 0;

    // Weights for calculating approx GPA
    const gpaw = {
        'A+': 4.3, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0, 'FNS': 0
    };

    courseRows.forEach(row => {
        let rowStudents = 0;
        let rowWeightedPoints = 0;

        Object.keys(gpaw).forEach(grade => {
            const count = row[grade] || 0;
            rowStudents += count;
            rowWeightedPoints += count * gpaw[grade];

            if (['F', 'FNS'].includes(grade)) {
                totalFail += count;
            } else {
                totalPass += count;
            }
        });

        totalStudents += rowStudents;
        weightedGPASum += rowWeightedPoints;
    });

    if (totalStudents === 0) return { gpa: 0, passRate: 0, failRate: 0, totalStudents: 0 };

    return {
        gpa: (weightedGPASum / totalStudents).toFixed(2),
        passRate: ((totalPass / totalStudents) * 100).toFixed(1),
        failRate: ((totalFail / totalStudents) * 100).toFixed(1),
        totalStudents,
        difficultyScore: (totalFail / totalStudents) * 100 // Crude difficulty metric: Fail Rate
    };
}
