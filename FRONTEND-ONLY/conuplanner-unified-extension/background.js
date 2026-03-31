// Receiver for the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "uploadGrades") {
        const API_URL = "https://www.conuplanner.com/api/upload-grades";

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request.data)
        })
            .then(response => response.json())
            .then(data => sendResponse({ success: true, data: data }))
            .catch(error => sendResponse({ success: false, error: error.message }));

        return true;
    }

    if (request.action === "fetchRMP") {
        // Can switch to https://www.conuplanner.com/api/rmp for production
        // Using localhost for robust local testing currently
        const API_URL = `https://www.conuplanner.com/api/rmp?name=${encodeURIComponent(request.name)}`;

        fetch(API_URL)
            .then(response => {
                if (!response.ok) throw new Error("API returned " + response.status);
                return response.json();
            })
            .then(data => sendResponse(data))
            .catch(error => sendResponse({ success: false, error: error.message }));

        return true; // Keep channel open for async fetch
    }

    if (request.action === "FETCH_VSB_TERMS") {
        console.log("Instructed to scrape PeopleSoft explicitly for Available Terms...");
        chrome.storage.local.set({ scrapeTarget: { mode: "FETCH_TERMS" } }, () => {
            chrome.tabs.create({ 
                url: "https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_EXT.CU_CLASS_SEARCH.GBL",
                active: false,
                pinned: true
            }, (tab) => {
                let hasResponded = false;
                
                const botListener = (botRequest, botSender, botSendResponse) => {
                    if (botRequest.action === "PEOPLESOFT_TERMS_SUCCESS") {
                        if (hasResponded) return;
                        hasResponded = true;
                        try { chrome.tabs.remove(tab.id).catch(() => {}); } catch(e) {}
                        sendResponse({ success: true, data: botRequest.data });
                        chrome.runtime.onMessage.removeListener(botListener);
                    }
                };
                chrome.runtime.onMessage.addListener(botListener);
                
                setTimeout(() => {
                    if (!hasResponded) {
                        hasResponded = true;
                        try { chrome.tabs.remove(tab.id).catch(() => {}); } catch(e) {}
                        chrome.runtime.onMessage.removeListener(botListener);
                        sendResponse({ success: false, error: "Term Scrape Timed Out" });
                    }
                }, 30000); // 30 sec fast timeout for Terms
            });
        });
        return true;
    }

    if (request.action === "FETCH_VSB_CLASSES") {
        const { subject, catalogue, term } = request.payload || {};
        console.log(`Instructed to scrape PeopleSoft for: ${subject} ${catalogue} (${term})`);
        
        // --- REAL PEOPLESOFT SCRAPER ARCHITECTURE ---
        // 1. Save target to storage so the injected bot knows what to search
        chrome.storage.local.set({ scrapeTarget: { subject, catalogue, term } }, () => {
            
            // 2. Open an INVISIBLE pinned tab
            chrome.tabs.create({ 
                url: "https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_EXT.CU_CLASS_SEARCH.GBL",
                active: false,
                pinned: true
            }, (tab) => {
                
                // 3. Listen for the bot's success signal specifically for this execution
                let hasResponded = false;
                
                const botListener = (botRequest, botSender, botSendResponse) => {
                    if (botRequest.action === "PEOPLESOFT_SCRAPE_SUCCESS") {
                        if (hasResponded) return;
                        hasResponded = true;
                        console.log("Bot finished scraping! Closing pinned tab and returning data.");
                        // Close the hidden window
                        try {
                            chrome.tabs.remove(tab.id).catch(() => {});
                        } catch(e) {}
                        
                        // Send data back to the conuplanner website
                        sendResponse({
                            success: true,
                            data: botRequest.data
                        });
                        
                        // Cleanup listener
                        chrome.runtime.onMessage.removeListener(botListener);
                    }
                };
                chrome.runtime.onMessage.addListener(botListener);
                
                // 4. Safety Timeout: if the bot fails
                setTimeout(() => {
                    if (!hasResponded) {
                        hasResponded = true;
                        console.log("Bot timed out. Probably stuck on login or form wasn't found.");
                        try {
                            chrome.tabs.remove(tab.id).catch(() => {});
                        } catch(e) {}
                        chrome.runtime.onMessage.removeListener(botListener);
                        sendResponse({ success: false, error: "Bot Timed Out. Are you logged in?" });
                    }
                }, 60000); // 60 seconds is plenty for an automated bot
            });
        });

        return true; // Keep channel open to wait for the hidden tab
    }
});


