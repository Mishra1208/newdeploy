/*
 * Shared utility functions for calculating stats from grade data.
 * Safe for Client Components (no 'fs' imports).
 */

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
