const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://bytlxvgnkxgydmpmcxni.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5dGx4dmdua3hneWRtcG1jeG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3Njk4NTksImV4cCI6MjA4MjM0NTg1OX0.aEjT8kY01Of63xkuMdWzr5ocoHmKFy4FeJJlJkHuSWQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    console.log("Connecting to Supabase...");
    const { data, error } = await supabase
        .from('rmp_cache')
        .select('*');

    if (error) {
        console.error("Error fetching data:", error);
        return;
    }

    console.log(`Found ${data.length} entries:`);
    data.forEach(row => {
        // The key format is "name|all:0" or similar
        const name = row.query_name.split('|')[0];
        const date = new Date(row.created_at).toLocaleString();
        console.log(`- ${name} (Cached: ${date})`);
    });
}

check();
