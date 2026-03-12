
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('./harjinder bhai_files/SA_LEARNER_SERVICES.SAA_SS_DPR_ADB.html');
const jsPath = path.resolve('./src/lib/degree-audit/parseAudit.js');

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();

        const html = fs.readFileSync(htmlPath, 'utf8');
        await page.setContent(html);

        let jsContent = fs.readFileSync(jsPath, 'utf8');
        // We need to mock JSDOM import for browser context or just let it fail if we don't need it in browser
        // Actually, the new code uses 'jsdom' on server side.
        // But for this debug script, we are injecting the code into the browser page.
        // The browser doesn't have 'jsdom'. 
        // We need to strip the import line for the browser context.
        jsContent = jsContent.replace("import { JSDOM } from 'jsdom';", "");

        jsContent = jsContent.replace('export function parseAudit', 'window.parseAudit = function parseAudit');

        await page.addScriptTag({ content: jsContent });

        const result = await page.evaluate(() => {
            return window.parseAudit(document.documentElement.outerHTML);
        });



        const logStream = fs.createWriteStream('debug_output.txt');
        const log = (msg) => {
            console.log(msg);
            logStream.write(msg + '\n');
        };

        if (result.logs) {
            result.logs.forEach(l => log(l));
        }

        if (result.error) {
            log("ERROR FROM PARSER: " + result.error);
            log("STACK: " + result.stack);
        }

        if (result.summary) {
            log("TOTAL: " + result.summary.totalCredits);
            log("IP: " + result.summary.inProgressCredits);
        }
        log("REQUIREMENTS:");
        result.requirements.forEach(r => {
            log(`- ${r.title}: ${r.credits.required} req, ${r.credits.taken} taken, ${r.children.length} children`);
            log(`  Courses: ${r.courses.length}`);
            if (r.children) {
                r.children.forEach(c => {
                    log(`    > ${c.title} (Lvl ?): ${c.credits.required}`);
                    if (c.children) {
                        c.children.forEach(gc => {
                            log(`      >> ${gc.title} (Lvl ?): ${gc.credits.required}`);
                        });
                    }
                });
            }
        });

        logStream.end();


        await browser.close();

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
})();
