
const fs = require('fs');
const path = require('path');

// Manually read .env.local because dotenv might not be installed or behaving weirdly
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.*)/);
    if (match && match[1]) {
        process.env.GOOGLE_GENERATIVE_AI_API_KEY = match[1].trim();
    }
} catch (e) {
    console.log("Could not read .env.local directly, relying on process.env");
}

const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!key) {
    console.error("❌ Error: GOOGLE_GENERATIVE_AI_API_KEY not found.");
    process.exit(1);
}

console.log(`🔑 key found: ${key.substring(0, 8)}...`);

async function checkModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    console.log(`🌐 Contacting Google API...`);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status !== 200) {
            console.error(`❌ API Error (${response.status}):`, JSON.stringify(data, null, 2));
            return;
        }

        if (!data.models) {
            console.log("⚠️ No models returned. Data:", data);
            return;
        }

        console.log("\n✅ Available Models:");
        data.models.forEach(m => {
            console.log(`- ${m.name}`);
            console.log(`  Supported methods: ${m.supportedGenerationMethods.join(', ')}`);
        });

        console.log("\n--- Recommendation ---");
        const hasGeminiPro = data.models.some(m => m.name.includes("gemini-pro"));
        const hasFlash = data.models.some(m => m.name.includes("gemini-1.5-flash"));

        if (hasFlash) console.log("👉 Use 'gemini-1.5-flash'");
        else if (hasGeminiPro) console.log("👉 Use 'gemini-pro'");
        else console.log("⚠️ neither gemini-pro nor flash found. Pick one from the list above.");

    } catch (error) {
        console.error("❌ Network/Fetch Error:", error);
    }
}

checkModels();
