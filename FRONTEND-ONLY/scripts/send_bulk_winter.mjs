import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendBulkEmail() {
  const htmlPath = path.join(process.cwd(), 'src/templates/winter_sync_email_inlined.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  const emailsPath = path.join(process.cwd(), 'src/templates/subs email.txt');
  const rawEmails = fs.readFileSync(emailsPath, 'utf8').split('\n');
  
  // Clean and deduplicate emails
  const emails = [...new Set(rawEmails.map(e => e.trim()).filter(e => e && e.includes('@')))];

  console.log(`Found ${emails.length} unique subscribers. Starting individual send...`);

  let successCount = 0;
  let errorCount = 0;

  for (const email of emails) {
    console.log(`Sending to: ${email}...`);

    try {
      const { data, error } = await resend.emails.send({
        from: 'ConuPlanner <updates@conuplanner.com>',
        to: [email],
        subject: '🎓 Congrats on your Winter Grades! Help us update the engine',
        html: htmlContent,
      });

      if (error) {
        console.error(`Error sending to ${email}:`, error);
        errorCount++;
      } else {
        console.log(`Successfully sent to ${email}. ID: ${data.id}`);
        successCount++;
      }
    } catch (err) {
      console.error(`Exception sending to ${email}:`, err);
      errorCount++;
    }
    
    // 200ms delay between emails to be extremely safe with rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`Bulk send completed! Success: ${successCount}, Errors: ${errorCount}`);
}

sendBulkEmail();
