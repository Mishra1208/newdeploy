const { findProfessor } = require('./conu-community-server/rmpClient');

async function debug() {
    try {
        console.log("Searching for 'Jonathan Liscouet'...");
        const results = await findProfessor("Jonathan Liscouet");
        console.log("Raw Results:", JSON.stringify(results, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

debug();
