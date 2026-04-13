import fs from 'fs';

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

async function fetchEmails() {
    try {
        const response = await fetch('https://api.clerk.com/v1/users?limit=100', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Clerk API error! status: ${response.status} ${response.statusText}`);
        }

        const users = await response.json();
        
        const emails = users.map(user => {
            if (user.email_addresses && user.email_addresses.length > 0) {
                return user.email_addresses[0].email_address;
            }
            return null;
        }).filter(email => email !== null);

        console.log(`\nFound ${emails.length} emails!`);
        console.log("--------------------------------------------------");
        console.log(JSON.stringify(emails, null, 2));
        console.log("--------------------------------------------------");
        
        // Write it to a file so it's easy for the user to grab
        fs.writeFileSync('all_emails.json', JSON.stringify(emails, null, 2));
        console.log("Emails also saved to 'all_emails.json'");

    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

fetchEmails();
