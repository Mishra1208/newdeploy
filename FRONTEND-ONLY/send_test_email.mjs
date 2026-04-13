import { Resend } from 'resend';
import fs from 'fs';

const resend = new Resend(process.env.RESEND_API_KEY);

async function send() {
  console.log("Reading HTML file...");
  let htmlContent = fs.readFileSync('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/newsletter_preview.html', 'utf8');

  // Replace file:/// paths with CIDs
  htmlContent = htmlContent.replace(/file:\/\/\/Users\/narendramishra\/PROJECTMAIN\/frontend2\/FRONTEND-ONLY\/public\/logo\.png/g, 'cid:logo');
  htmlContent = htmlContent.replace(/file:\/\/\/Users\/narendramishra\/PROJECTMAIN\/frontend2\/FRONTEND-ONLY\/public\/marketing_assets\/SCHEDULE BUILDER\.png/g, 'cid:schedule_builder');
  htmlContent = htmlContent.replace(/file:\/\/\/Users\/narendramishra\/PROJECTMAIN\/frontend2\/FRONTEND-ONLY\/public\/marketing_assets\/SEAT FINDER\.png/g, 'cid:seat_finder');
  htmlContent = htmlContent.replace(/file:\/\/\/Users\/narendramishra\/PROJECTMAIN\/frontend2\/FRONTEND-ONLY\/public\/marketing_assets\/alert\.png/g, 'cid:alert');
  htmlContent = htmlContent.replace(/file:\/\/\/Users\/narendramishra\/PROJECTMAIN\/frontend2\/FRONTEND-ONLY\/public\/marketing_assets\/CHROME EXTENSION\.png/g, 'cid:chrome_extension');
  htmlContent = htmlContent.replace(/file:\/\/\/Users\/narendramishra\/PROJECTMAIN\/frontend2\/FRONTEND-ONLY\/public\/marketing_assets\/join inner circle\.png/g, 'cid:inner_circle');
  htmlContent = htmlContent.replace(/file:\/\/\/Users\/narendramishra\/PROJECTMAIN\/frontend2\/FRONTEND-ONLY\/public\/marketing_assets\/New Update Ribbon\.gif/g, 'cid:ribbon');

  htmlContent = htmlContent.replace('{{unsubscribe_url}}', 'https://www.conuplanner.com');

  console.log("Sending email via Resend...");
  try {
    const data = await resend.emails.send({
      from: 'ConuPlanner Updates <updates@conuplanner.com>',
      to: ['mishranarendra1208@gmail.com'],
      subject: 'A Massive Update for Concordia Planners 🚀',
      html: htmlContent,
      attachments: [
        {
          filename: 'logo.png',
          content: fs.readFileSync('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/public/logo.png'),
          content_id: 'logo',
        },
        {
          filename: 'schedule_builder.png',
          content: fs.readFileSync('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/public/marketing_assets/SCHEDULE BUILDER.png'),
          content_id: 'schedule_builder',
        },
        {
          filename: 'seat_finder.png',
          content: fs.readFileSync('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/public/marketing_assets/SEAT FINDER.png'),
          content_id: 'seat_finder',
        },
        {
          filename: 'alert.png',
          content: fs.readFileSync('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/public/marketing_assets/alert.png'),
          content_id: 'alert',
        },
        {
          filename: 'chrome_extension.png',
          content: fs.readFileSync('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/public/marketing_assets/CHROME EXTENSION.png'),
          content_id: 'chrome_extension',
        },
        {
          filename: 'join_inner_circle.png',
          content: fs.readFileSync('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/public/marketing_assets/join inner circle.png'),
          content_id: 'inner_circle',
        },
        {
          filename: 'ribbon.gif',
          content: fs.readFileSync('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/public/marketing_assets/New Update Ribbon.gif'),
          content_id: 'ribbon',
        }
      ],
    });
    console.log("SUCCESS!", data);
  } catch (error) {
    console.error("ERROR:", error);
  }
}

send();
