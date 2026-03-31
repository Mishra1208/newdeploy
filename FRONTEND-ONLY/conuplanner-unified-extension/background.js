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
    
    if (request.action === "FORCE_MAIN_WORLD_EXECUTE") {
        if (sender && sender.tab && sender.tab.id) {
            chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                world: "MAIN",
                func: (linkId) => {
                    try {
                        const scriptString = "submitAction_win0(document.win0, '" + linkId + "');";
                        window.location.assign("javascript:" + scriptString);
                    } catch(e) {}
                },
                args: [request.data]
            }).catch(e => console.error("Main World Execution failed!", e));
        }
        sendResponse({ success: true });
        return true;
    }

    if (request.action === "fetchRMP") {
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
        
        // --- REAL PEOPLESOFT SCRAPER ARCHITECTURE ---
        // 1. Save target to storage so the injected bot knows what to search
        chrome.storage.local.set({ scrapeTarget: { subject, catalogue, term } }, () => {
            
            // 2. Open an INVISIBLE minimized popup window for entirely cloaked background processing
            chrome.windows.create({ 
                url: "https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_EXT.CU_CLASS_SEARCH.GBL",
                type: "popup",
                state: "minimized"
            }, (win) => {
                
                // 3. Listen for the bot's success signal specifically for this execution
                let hasResponded = false;
                
                const botListener = (botRequest, botSender, botSendResponse) => {
                    if (botRequest.action === "PEOPLESOFT_SCRAPE_SUCCESS") {
                        if (hasResponded) return;
                        hasResponded = true;
                        
                        // Close the hidden window completely, obliterating all tabs within it
                        try {
                            chrome.windows.remove(win.id).catch(() => {});
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
                        try {
                            chrome.windows.remove(win.id).catch(() => {});
                        } catch(e) {}
                        chrome.runtime.onMessage.removeListener(botListener);
                        sendResponse({ success: false, error: "Bot Timed Out. Are you logged in?" });
                    }
                }, 60000); // 60 seconds is plenty for an automated bot
            });
        });

        return true; // Keep channel open to wait for the hidden tab
    }

    if (request.action === "FETCH_DEEP_CLASS_DETAILS") {
        const { classId, subject, catalogue, term } = request.payload || {};
        
        chrome.storage.local.set({ scrapeTarget: { mode: "DEEP_FETCH", classId, subject, catalogue, term } }, () => {
            chrome.windows.create({ 
                url: "https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_EXT.CU_CLASS_SEARCH.GBL",
                type: "popup",
                state: "minimized"
            }, (win) => {
                let hasResponded = false;
                
                const botListener = (botRequest, botSender, botSendResponse) => {
                    if (botRequest.action === "PEOPLESOFT_DEEP_SCRAPE_SUCCESS") {
                        if (hasResponded) return;
                        hasResponded = true;
                        
                        // Wiping the entire hidden window safely kills Tab A and the instantly spawned Tab B simultaneously!
                        try { chrome.windows.remove(win.id).catch(() => {}); } catch(e) {}
                        
                        sendResponse({ success: true, data: botRequest.data });
                        chrome.runtime.onMessage.removeListener(botListener);
                    }
                };
                chrome.runtime.onMessage.addListener(botListener);
                
                setTimeout(() => {
                    if (!hasResponded) {
                        hasResponded = true;
                        try { chrome.windows.remove(win.id).catch(() => {}); } catch(e) {}
                        chrome.runtime.onMessage.removeListener(botListener);
                        sendResponse({ success: false, error: "Deep Scrape Timed Out" });
                    }
                }, 15000); // Wait up to 15s since it does two heavy navigations
            });
        });
        
        return true;
    }
});


