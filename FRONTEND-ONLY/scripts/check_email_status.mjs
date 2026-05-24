import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);

async function checkStatus() {
  const ids = ['49229989-4cc9-4d0d-a09e-8a548d5fc168', 'e14bf9c5-6f9d-4bd1-83f0-605ba4ad320e'];
  
  for (const id of ids) {
    try {
      const { data, error } = await resend.emails.get(id);
      if (error) {
        console.error(`Error fetching ID ${id}:`, error);
      } else {
        console.log(`Status for ${id}:`, data);
      }
    } catch (err) {
      console.error(`Exception for ID ${id}:`, err);
    }
  }
}

checkStatus();
