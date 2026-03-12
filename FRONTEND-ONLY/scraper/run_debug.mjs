import { scrapeConcordiaSeats } from './debug_scraper.mjs';

(async () => {
    try {
        console.log("Starting debug scraper...");
        // courseNumber must be string "248"
        const data = await scrapeConcordiaSeats('2254', 'COMP', '248');
        console.log("DEBUG DATA OUTPUT:");
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
})();
