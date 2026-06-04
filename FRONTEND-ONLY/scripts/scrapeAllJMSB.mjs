import puppeteer from 'puppeteer';
import fs from 'fs/promises';

const urls = [
  'https://www.concordia.ca/jmsb/programs/undergraduate/bachelor/majors/accountancy/courses.html',
  'https://www.concordia.ca/jmsb/programs/undergraduate/bachelor/majors/business-technology-management/courses.html',
  'https://www.concordia.ca/jmsb/programs/undergraduate/bachelor/majors/marketing/courses.html',
  'https://www.concordia.ca/jmsb/programs/undergraduate/bachelor/majors/management/courses.html',
  'https://www.concordia.ca/jmsb/programs/undergraduate/bachelor/majors/finance/courses.html',
  'https://www.concordia.ca/jmsb/programs/undergraduate/bachelor/majors/international-business/courses.html',
  'https://www.concordia.ca/jmsb/programs/undergraduate/bachelor/majors/economics/courses.html',
  'https://www.concordia.ca/jmsb/programs/undergraduate/bachelor/majors/human-resource-management/courses.html',
  'https://www.concordia.ca/jmsb/programs/undergraduate/bachelor/majors/supply-chain-operations-management/courses.html',
  'https://www.concordia.ca/jmsb/programs/undergraduate/bachelor/program-structure/core-courses.html',
  'https://www.concordia.ca/jmsb/programs/undergraduate/bachelor/program-structure/foundation-courses.html'
];

async function scrapeAll() {
  console.log("Launching browser for deep scrape...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  for (const url of urls) {
    console.log(`Scraping ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      const content = await page.evaluate(() => {
        const main = document.querySelector('main') || document.querySelector('.main-content') || document.body;
        // Clean up text a bit
        return main.innerText.replace(/\n{3,}/g, '\n\n');
      });
      
      // Extract the major name from the URL
      const parts = url.split('/');
      let name = parts[parts.length - 2];
      if (name === 'program-structure') {
        name = parts[parts.length - 1].replace('.html', '');
      }
      
      const filePath = `data/jmsb-requirements/scraped_${name}.txt`;
      await fs.writeFile(filePath, content);
      console.log(`Saved to ${filePath}`);
    } catch (e) {
      console.error(`Failed to scrape ${url}:`, e);
    }
  }
  
  await browser.close();
  console.log("Done scraping all majors and core requirements.");
}

scrapeAll().catch(console.error);
