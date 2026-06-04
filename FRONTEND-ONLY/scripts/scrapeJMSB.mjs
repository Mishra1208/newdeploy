import puppeteer from 'puppeteer';
import fs from 'fs/promises';

async function scrape() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log("Navigating to program structure...");
  await page.goto('https://www.concordia.ca/jmsb/programs/undergraduate/bachelor/program-structure.html', { waitUntil: 'networkidle2' });
  
  const content = await page.evaluate(() => {
    // Attempt to grab main content areas
    const main = document.querySelector('main') || document.querySelector('.main-content') || document.body;
    return main.innerText;
  });
  
  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    return anchors
      .map(a => a.href)
      .filter(href => href.includes('/jmsb/programs/undergraduate/bachelor') || href.includes('/section-61'));
  });
  
  const uniqueLinks = [...new Set(links)];
  
  await fs.writeFile('scraped-structure.txt', content);
  await fs.writeFile('scraped-links.txt', uniqueLinks.join('\n'));
  
  console.log(`Saved main content and ${uniqueLinks.length} related links.`);
  await browser.close();
}

scrape().catch(console.error);
