// Bridge script injected into conuplanner.com
window.addEventListener("message", (event) => {
    // We only accept messages from ourselves
    if (event.source !== window || !event.data.type) return;

    if (event.data.type === "FROM_CONUPLANNER_WEB_FETCH") {
        console.log("Bridge received fetch request from Web App, relaying to Background...");
        
        // Safety check: if the user refreshed the Chrome Extension in exactly this tab,
        // the chrome.runtime object gets destroyed. 
        if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.sendMessage) {
            window.postMessage({
                type: "FROM_EXTENSION_RESPONSE",
                payload: { success: false, error: "Extension was updated! Please Refresh (F5) this page to reconnect." }
            }, "*");
            alert("Extension was updated! Please Refresh (F5) this page to reconnect.");
            return;
        }

        try {
            chrome.runtime.sendMessage({
                action: "FETCH_VSB_CLASSES",
                payload: event.data.payload
            }, (response) => {
                // Send back to web app
                window.postMessage({
                    type: "FROM_EXTENSION_RESPONSE",
                    payload: response
                }, "*");
            });
        } catch (e) {
            window.postMessage({
                type: "FROM_EXTENSION_RESPONSE",
                payload: { success: false, error: "Extension connection lost. Please reload the page." }
            }, "*");
        }
    }

    if (event.data.type === "FROM_CONUPLANNER_WEB_DEEP_FETCH") {
        console.log("Bridge received Deep Class Analysis request, relaying to Background...");
        if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.sendMessage) {
            window.postMessage({ type: "FROM_EXTENSION_DEEP_RESPONSE", payload: { success: false, error: "Extension detached." } }, "*");
            return;
        }

        try {
            chrome.runtime.sendMessage({
                action: "FETCH_DEEP_CLASS_DETAILS",
                payload: event.data.payload
            }, (response) => {
                window.postMessage({
                    type: "FROM_EXTENSION_DEEP_RESPONSE",
                    payload: response
                }, "*");
            });
        } catch (e) {
            window.postMessage({ type: "FROM_EXTENSION_DEEP_RESPONSE", payload: { success: false, error: "Lost connection." } }, "*");
        }
    }

    if (event.data.type === "FROM_CONUPLANNER_WEB_FETCH_TERMS") {
        console.log("Bridge received Term Fetch request, relaying Phase 1...");
        if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.sendMessage) {
            window.postMessage({ type: "FROM_EXTENSION_TERMS_RESPONSE", payload: { success: false, error: "Extension missing." } }, "*");
            return;
        }
        try {
            chrome.runtime.sendMessage({ action: "FETCH_VSB_TERMS" }, (response) => {
                window.postMessage({ type: "FROM_EXTENSION_TERMS_RESPONSE", payload: response }, "*");
            });
        } catch (e) {
            window.postMessage({ type: "FROM_EXTENSION_TERMS_RESPONSE", payload: { success: false } }, "*");
        }
    }
});
console.log("ConuPlanner Extension Bridge Injected!");
