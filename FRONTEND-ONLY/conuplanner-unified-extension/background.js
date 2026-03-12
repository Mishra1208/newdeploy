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
});
