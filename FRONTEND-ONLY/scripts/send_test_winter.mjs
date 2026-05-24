import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';


const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  const htmlPath = path.join(process.cwd(), 'src/templates/winter_sync_email_inlined.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  try {
    const { data, error } = await resend.emails.send({
      from: 'ConuPlanner <updates@conuplanner.com>',
      to: ['adityalingwal30@gmail.com'],
      subject: '🎓 Congrats on your Winter Grades! Help us update the engine',
      html: htmlContent,
    });

    if (error) {
      return console.error({ error });
    }

    console.log({ data });
  } catch (err) {
    console.error(err);
  }
}

sendTestEmail();
