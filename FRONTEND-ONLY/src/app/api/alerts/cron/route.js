import { NextResponse } from 'next/server';
import { getAllSeatAlerts, deleteSeatAlert } from '@/lib/firebase/firestore';
import { scrapeConcordiaSeats } from '../../../../../scraper/concordiaScraper.js';
import { Resend } from 'resend';
import SeatAlertTemplate from '@/components/emails/SeatAlertTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

// Allow Vercel Cron to run for up to 60 seconds (or more if needed depending on plan)
export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        // Optional security check to ensure this is triggered by Vercel Cron
        /*
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        */

        console.log("CRON RUNNING: Checking Seat Alerts...");
        
        // 1. Fetch all pending alerts
        const activeAlerts = await getAllSeatAlerts();
        if (activeAlerts.length === 0) {
            console.log("No pending alerts. Cron finished.");
            return NextResponse.json({ success: true, message: 'No alerts to process' });
        }

        console.log(`Found ${activeAlerts.length} active alerts.`);

        // 2. Group alerts by course (term + subject + courseNumber) to minimize scraping
        const uniqueCourses = {};
        activeAlerts.forEach(alert => {
            const key = `${alert.term}-${alert.subject}-${alert.courseNumber}`;
            if (!uniqueCourses[key]) {
                uniqueCourses[key] = {
                    term: alert.term,
                    subject: alert.subject,
                    courseNumber: alert.courseNumber,
                    alerts: []
                };
            }
            uniqueCourses[key].alerts.push(alert);
        });

        const emailsSent = [];

        // 3. Scrape each unique course
        for (const key of Object.keys(uniqueCourses)) {
            const { term, subject, courseNumber, alerts } = uniqueCourses[key];
            
            console.log(`Scraping for ${subject} ${courseNumber} (Term: ${term})...`);
            try {
                const scrapedSections = await scrapeConcordiaSeats(term, subject, courseNumber);
                
                // 4. Check if any of the scraped sections exist in our alerts list AND are now 'Open'
                for (const section of scrapedSections) {
                    if (section.status.toLowerCase() === 'open') {
                        // Find all users waiting for this specific classNumber
                        const triggeredAlerts = alerts.filter(a => a.classNumber.toString() === section.classNbr.toString());
                        
                        for (const alert of triggeredAlerts) {
                            console.log(`SEAT OPEN: Sending email to ${alert.email} for ${subject} ${courseNumber}`);
                            
                            // 5. Send Email via Resend
                            await resend.emails.send({
                                from: 'ConU Planner Alerts <alerts@conuplanner.com>',
                                to: [alert.email],
                                subject: `⏰ Seat Alert: ${subject} ${courseNumber} is now OPEN!`,
                                react: SeatAlertTemplate({
                                    subject: subject,
                                    courseNumber: courseNumber,
                                    classNumber: section.classNbr,
                                    term: term === '2261' ? 'Summer 2026' : (term === '2262' ? 'Fall 2026' : 'Winter 2027'),
                                    status: section.status.toLowerCase()
                                })
                            });

                            emailsSent.push(alert.email);

                            // 6. Delete the fulfilled alert from Firestore
                            await deleteSeatAlert(alert.id);
                            console.log(`Deleted fulfilled alert ${alert.id}`);
                        }
                    }
                }
            } catch (err) {
                console.error(`Failed to scrape ${subject} ${courseNumber}:`, err);
                // Continue to next course even if one fails
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Cron job completed',
            emailsSent: emailsSent.length
        });

    } catch (error) {
        console.error('Cron Execution Failed:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
