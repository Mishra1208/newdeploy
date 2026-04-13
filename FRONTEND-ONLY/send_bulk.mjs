import { Resend } from 'resend';
import fs from 'fs';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendAll() {
  try {
    console.log("Loading emails...");
    const emails = JSON.parse(fs.readFileSync('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/all_emails.json', 'utf8'));
    
    console.log("Loading newsletter HTML...");
    let htmlContent = fs.readFileSync('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/newsletter_final.html', 'utf8');
    htmlContent = htmlContent.replace('{{unsubscribe_url}}', 'https://www.conuplanner.com');

    console.log(`Preparing batch payload for ${emails.length} users...`);
    const payload = emails.map(email => ({
        from: 'ConuPlanner Updates <updates@conuplanner.com>',
        to: [email],
        subject: 'A Massive Update for Concordia Planners 🚀',
        html: htmlContent
    }));

    console.log("Triggering bulk send via Resend...");
    const { data, error } = await resend.batch.send(payload);
    
    if (error) {
        console.error("Batch Error:", error);
    } else {
        console.log(`✅ SUCCESS! Successfully broadcasted to ${emails.length} users.`);
        console.log(data);
    }
  } catch (e) {
    console.error("Script Failed:", e);
  }
}

sendAll();
