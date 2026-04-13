import { Resend } from 'resend';
import fs from 'fs';

const resend = new Resend(process.env.RESEND_API_KEY);

async function send() {
  console.log("Reading final HTML file...");
  let htmlContent = fs.readFileSync('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/newsletter_final.html', 'utf8');

  // Replace unsubscribe for the test
  htmlContent = htmlContent.replace('{{unsubscribe_url}}', 'https://www.conuplanner.com');

  console.log("Sending email via Resend (0 attachments)...");
  try {
    const data = await resend.emails.send({
      from: 'ConuPlanner Updates <updates@conuplanner.com>',
      to: ['mishranarendra1208@gmail.com'],
      subject: 'A Massive Update for Concordia Planners (TEST) 🚀',
      html: htmlContent,
      // Notice: NO ATTACHMENTS ARRAY HERE! 
    });
    console.log("SUCCESS!", data);
  } catch (error) {
    console.error("ERROR:", error);
  }
}

send();
