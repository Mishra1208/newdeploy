import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

// Cache the data
// let cachedData = null; // Removed caching to allow live updates

export async function getGradeData() {
    // URL content verified as valid CSV
    const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiDXz0vOWqBdyej65A3GBXo0tBT9VNx0uVIoeOm-pJWek7LHyE45G3NlSCaSh7zjMkjTJ_bTFGzaH8/pub?gid=505576223&single=true&output=csv";

    try {
        const response = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Failed to fetch sheet: ${response.statusText}`);

        const fileContent = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse(fileContent, {
                header: true,
                dynamicTyping: true, // Automatically parse numbers
                skipEmptyLines: true,
                complete: (results) => {
                    // Filter out empty rows or rows without a course code
                    const cleanData = results.data.filter(row => row && row.Course);
                    resolve(cleanData);
                },
                error: (err) => {
                    reject(err);
                }
            });
        });
    } catch (error) {
        console.error("Error reading Google Sheet CSV:", error);
        return [];
    }
}
