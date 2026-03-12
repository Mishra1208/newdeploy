const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const EXTENSION_DIR = 'vsb-extension';
const OUTPUT_FILE = 'conuplanner-vsb-exporter.zip';

console.log('📦 Packaging Extension for Chrome Web Store...');

// Ensure previous zip is removed
if (fs.existsSync(OUTPUT_FILE)) {
    fs.unlinkSync(OUTPUT_FILE);
}

// Command to zip the folder contents (not the folder itself, but contents)
// cd vsb-extension && zip -r ../conuplanner-vsb-exporter.zip .
const command = `cd ${EXTENSION_DIR} && zip -r ../${OUTPUT_FILE} . -x "*.DS_Store"`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Error packaging extension: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`⚠️ Zip Warning: ${stderr}`);
    }

    console.log(stdout);
    console.log(`\n✅ Success! Extension packaged at: ${path.resolve(OUTPUT_FILE)}`);
    console.log(`\n👉 NEXT STEPS FOR STORE SUBMISSION:`);
    console.log(`1. Go to Chrome Web Store Developer Dashboard (https://chrome.google.com/webstore/dev/dashboard)`);
    console.log(`2. Click "New Item"`);
    console.log(`3. Upload "${OUTPUT_FILE}"`);
    console.log(`4. In the "Store Listing" section, you will upload your "icon.png" as the "Store Icon".`);
});
