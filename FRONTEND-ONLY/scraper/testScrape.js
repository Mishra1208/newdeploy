const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  const url = 'https://www.concordia.ca/academics/undergraduate/calendar/current/section-71-gina-cody-school-of-engineering-and-computer-science/section-71-60-engineering-course-descriptions.html';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  
  const courses = {};
  $('.course-description').each((i, el) => {
    const titleText = $(el).find('h4').text().trim(); // e.g. "ENCS 282 Technical Writing and Communication (3 credits)"
    const pTag = $(el).find('p').first().text().trim();
    console.log(titleText);
    if(titleText.includes('ENCS 282')) {
        console.log("DESC:", pTag);
    }
  });
}
test();
