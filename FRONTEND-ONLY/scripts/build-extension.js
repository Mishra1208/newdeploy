const fs = require('fs');
const path = require('path');

const DATES_PATH = path.join(__dirname, '../src/data/academic-dates.json');
const EXTENSION_PATH = path.join(__dirname, '../vsb-extension/content.js');

try {
    const datesJson = fs.readFileSync(DATES_PATH, 'utf8');
    let contentJs = fs.readFileSync(EXTENSION_PATH, 'utf8');

    // Regex to replace the ACADEMIC_DATES constant block
    // It captures "const ACADEMIC_DATES = {" ... until "};"
    // Since the object is quite large and might have nested braces, we need to be careful.
    // But in the original file, it matches:
    // const ACADEMIC_DATES = {
    //    ...
    // };

    // We can assume it starts at line 5 and ends at line 28 (roughly).
    // Better strategy: Find start index, find end index of the object.

    const startMarker = 'const ACADEMIC_DATES = {';
    const startIndex = contentJs.indexOf(startMarker);

    if (startIndex === -1) {
        throw new Error('Could not find ACADEMIC_DATES constant in content.js');
    }

    // Find the end of the object block
    // We look for the closing semicolon of the declaration
    // This is a bit brittle if not formatted.
    // Alternatively, we can just replace everything from startMarker until "const init =" or similar?
    // Looking at file: "};" is followed by empty lines and then "function init() {"

    // Let's rely on the structure observed: "};" followed by "\n\n// --- Main Injection Logic ---"

    const endMarker = '// --- Main Injection Logic ---';
    const endIndex = contentJs.indexOf(endMarker);

    if (endIndex === -1) {
        throw new Error('Could not find Main Injection Logic marker in content.js');
    }

    // Extract the substring to verify we are replacing the right thing
    const toReplace = contentJs.substring(startIndex, endIndex);

    // Construct new content
    const newBlock = `const ACADEMIC_DATES = ${datesJson};\n\n`;

    const newContent = contentJs.replace(toReplace, newBlock);

    fs.writeFileSync(EXTENSION_PATH, newContent);
    console.log(`✅ Successfully injected academic dates into ${EXTENSION_PATH}`);
    console.log(`Payload size: ${datesJson.length} bytes`);

} catch (error) {
    console.error('❌ Error building extension:', error);
    process.exit(1);
}
