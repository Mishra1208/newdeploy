import fs from 'fs';
import * as cheerio from 'cheerio';

const URLS_TO_SCRAPE = [
  // Engineering and CS courses
  'https://www.concordia.ca/academics/undergraduate/calendar/current/section-71-gina-cody-school-of-engineering-and-computer-science/section-71-60-engineering-course-descriptions.html',
  // Math courses
  'https://www.concordia.ca/academics/undergraduate/calendar/current/section-31-faculty-of-arts-and-science/section-31-200-department-of-mathematics-and-statistics.html'
];

async function scrapeCatalog() {
  console.log("Starting catalog scrape...");
  const courseData = {};

  for (const url of URLS_TO_SCRAPE) {
    try {
      console.log(`Fetching ${url}...`);
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      // The Concordia calendar usually puts courses inside div.course
      // Let's try to find them by looking for elements that match course codes
      $('.course').each((i, el) => {
        const titleText = $(el).find('h4').text().trim() || $(el).find('.course-title').text().trim() || $(el).find('b').first().text().trim();
        
        // Match course code like "COMP 248" or "ENCS 282"
        const match = titleText.match(/^([A-Z]{3,4}\s+\d{3})/);
        if (match) {
          const courseCode = match[1];
          let prereqText = null;
          let description = null;

          // Usually descriptions and prereqs are in <p> tags
          $(el).find('p').each((j, pEl) => {
            const pText = $(pEl).text().trim();
            if (pText.startsWith('Prerequisite:') || pText.startsWith('Prerequisite/Corequisite:')) {
              prereqText = pText;
            } else if (pText.length > 20 && !pText.startsWith('Note:') && !description) {
              // The first substantial paragraph that isn't a note is usually the description
              description = pText;
            }
          });

          // Sometimes it's structured differently
          if (!prereqText && titleText.includes('Prerequisite')) {
              // Try to extract from text directly
              const fullText = $(el).text();
              const pMatch = fullText.match(/(Prerequisite\/Corequisite:|Prerequisite:)(.*?)(?:\n|$)/);
              if (pMatch) prereqText = pMatch[0].trim();
          }

          courseData[courseCode] = {
            title: titleText.replace(courseCode, '').trim(),
            rawPrerequisite: prereqText || "None",
            description: description || "No description available."
          };
        }
      });
      
      console.log(`Extracted courses from URL. Total so far: ${Object.keys(courseData).length}`);
    } catch (err) {
      console.error(`Error scraping ${url}:`, err);
    }
  }

  const outputPath = './detailedCourseData.json';
  fs.writeFileSync(outputPath, JSON.stringify(courseData, null, 2));
  console.log(`Successfully saved ${Object.keys(courseData).length} courses to ${outputPath}`);
}

scrapeCatalog();
