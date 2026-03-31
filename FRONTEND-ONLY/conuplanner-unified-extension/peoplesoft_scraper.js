// ConuPlanner PeopleSoft Bot Script


chrome.storage.local.get(["scrapeTarget"], (result) => {
    const target = result.scrapeTarget;
    if (!target) return; // Not commanded to scrape right now

    // --- FEATURE: BACKGROUND TERM SYNCHRONIZATION ---
    if (target.mode === "FETCH_TERMS") {
        const termInterval = setInterval(() => {
            const termSelect = document.querySelector('select[id*="STRM"]') || document.querySelector('select[name*="STRM"]');
            if (termSelect && termSelect.options.length > 0) {
                clearInterval(termInterval);
                const rawOptions = Array.from(termSelect.options).map(opt => opt.innerText.trim());
                
                // Filter out non-applicable or generic headers (Keep only standard academic terms)
                const validTerms = rawOptions.filter(t => {
                    const tUpper = t.toUpperCase();
                    return !tUpper.includes("SELECT") && 
                           !tUpper.includes("ALL TERMS") && 
                           !tUpper.includes("CCE ONLY");
                });

                console.log("[Term Sync] Extracted clean terms:", validTerms);
                
                setTimeout(() => {
                    try {
                        chrome.runtime.sendMessage({ action: "PEOPLESOFT_TERMS_SUCCESS", data: validTerms });
                        chrome.storage.local.remove("scrapeTarget");
                    } catch(e) {}
                }, 500);
            }
        }, 500);
        return; // Kill the rest of the script. We are only here to harvest terms.
    }

    let state = "WAITING_FOR_FORM";
    
    // Create a visual overlay in case they accidentally open the tab
    if (!document.getElementById("conu-bot-overlay")) {
        const overlay = document.createElement("div");
        overlay.id = "conu-bot-overlay";
        overlay.innerHTML = `
            <div style="position: fixed; bottom: 0; left: 0; width: 100%; background: #912338; color: white; padding: 15px; text-align: center; z-index: 999999; font-weight: bold; font-family: sans-serif; box-shadow: 0 -4px 6px rgba(0,0,0,0.2);">
                🤖 SCHEDULE ENGINE BOT INJECTED (AUTOMATED MODE)<br/><br/>
                Please do not touch anything. I am automatically configuring Term: ${target.term}, Career: Undergraduate, and clicking Search!
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    let hasClickedSearch = false; // Prevent multiple clicks
    
    // Polling because PeopleSoft heavily uses AJAX and frames
    const interval = setInterval(() => {
        
        // 1. ALWAYS LOOK FOR RESULTS FIRST!
        // Because we now do a God-Mode Native HTTP POST, the page might fully reload
        // directly into the Results screen! We must extract immediately if data is present.

        // --- ADDED: DETECT "NO RESULTS" ERROR STATE ---
        const pageText = document.body.innerText || "";
        const noResultsMatch = pageText.includes("The search returns no results that match the criteria") || 
                               pageText.includes("No classes found") || pageText.includes("no results that match the criteria specified");
        
        if (noResultsMatch) {
            console.log("Bot detected PeopleSoft 'No Results' warning! Aborting search early.");
            clearInterval(interval);
            
            const overlay = document.getElementById("conu-bot-overlay");
            if (overlay) overlay.innerHTML = "<div style='position: fixed; bottom: 0; left: 0; width: 100%; background: #c5a059; color: black; padding: 15px; text-align: center; z-index: 999999; font-weight: bold;'>⚠️ NO CLASSES FOUND! Ending Bot Session...</div>";
            
            setTimeout(() => {
                try {
                    chrome.runtime.sendMessage({
                        action: "PEOPLESOFT_SCRAPE_SUCCESS",
                        data: [] // Empty array signifies "Successfully searched, but zero results."
                    });
                    chrome.storage.local.remove("scrapeTarget");
                } catch(e) {}
            }, 100);
            return;
        }

        const rows = Array.from(document.querySelectorAll("tr")).filter(tr => {
            const tds = Array.from(tr.children).filter(c => c.tagName === "TD");
            if (tds.length < 6) return false;
            
            // PeopleSoft injects hidden accessibility labels like "Class 2833"
            const classIdText = tds[5].innerText.replace(/[^\d]/g, "").trim();
            return classIdText.length >= 4 && classIdText.length <= 5;
        });
        
        if (rows.length > 0) {
            
            // --- FEATURE: ON-DEMAND LAZY DEMOGRAPHICS RESOLUTION ---
            if (target.mode === "DEEP_FETCH") {
                 console.log("Deep bot found results! Locating specific Sequence ID: " + target.classId);
                 
                 const targetRow = rows.find(tr => {
                     const tds = Array.from(tr.children).filter(c => c.tagName === "TD");
                     const classIdText = tds[5].innerText.replace(/[^\d]/g, "").trim();
                     return classIdText === target.classId;
                 });
                 
                 if (targetRow) {
                     // Query the Section HTML node uniquely resolving to MTG_CLASSNAME
                     const classLink = targetRow.querySelector('a[id*="MTG_CLASSNAME"]');
                     if (classLink && !window.hasClickedDeepLink) {
                         window.hasClickedDeepLink = true;
                         const overlay = document.getElementById("conu-bot-overlay");
                         if (overlay) overlay.innerHTML = "<div style='position: fixed; bottom: 0; left: 0; width: 100%; background: #eab308; color: black; padding: 15px; text-align: center; z-index: 999999; font-weight: bold;'>⚠️ DIVING INTO CLASS " + target.classId + " DEEP DETAILS...</div>";
                         
                         // Delegate the exact navigation event directly into the Main World runtime wrapper.
                         try {
                             chrome.runtime.sendMessage({ action: "FORCE_MAIN_WORLD_EXECUTE", data: classLink.id });
                         } catch (e) { console.error("Message passing failed", e); }
                         
                         state = "WAITING_FOR_DEEP_DETAILS";
                         return; // Continue polling while the server generates the next page!
                     } else if (classLink) {
                         // Awaiting DOM transition, do not spam click.
                         return;
                     }
                 }
                 
                 // Fallback if class mysteriously vanished
                 clearInterval(interval);
                 chrome.runtime.sendMessage({ action: "PEOPLESOFT_DEEP_SCRAPE_SUCCESS", data: null });
                 try { chrome.storage.local.remove("scrapeTarget"); } catch(e){}
                 return;
            }

            // --- REAL DATA EXTRACTION ALGORITHM ---
            let extractedPrereq = "None";
            try {
                // Aggressively scan the entire document for generic Prerequisite text blocks often hidden in headers above the results table
                const pNodes = Array.from(document.querySelectorAll('span, p, div')).filter(el => {
                    const txt = el.innerText || "";
                    return (txt.includes("Prerequisite") || txt.includes("Prereq")) && txt.length < 500 && !txt.includes("Class Search");
                });
                if (pNodes.length > 0) {
                    // Try to catch the rigorously formatted PeopleSoft requisite ID
                    const explicitNode = pNodes.find(n => n.id && n.id.includes("REQUISITE"));
                    extractedPrereq = explicitNode ? explicitNode.innerText.trim() : pNodes[0].innerText.trim();
                    
                    // If we somehow grabbed a massive wrapper div, safely slice it down
                    if (extractedPrereq.includes("\n")) {
                        extractedPrereq = extractedPrereq.split("\n").find(line => line.includes("Prerequisite") || line.includes("Prereq")) || extractedPrereq;
                    }
                }
            } catch (e) {
                console.log("Failed to parse prerequisites", e);
            }

            const parsedClasses = [];
            
            rows.forEach(tr => {
                const tds = Array.from(tr.children).filter(c => c.tagName === "TD");
                try {
                    const sectionRaw = tds[1].innerText.replace("Section", "").trim(); 
                    const daysTimesRaw = tds[2].innerText.replace("Days & Times", "").replace("Days & Time", "").trim(); 
                    const classIdRaw = tds[5].innerText.replace(/[^\d]/g, "").trim(); 
                    
                    let type = "LEC";
                    let section = "Unknown";
                    if (sectionRaw.includes("-")) {
                        const parts = sectionRaw.split("\n")[0].split("-"); 
                        // Concordia notoriously uses variable dashes (e.g., "AA-LEC" vs "AI-X-LAB").
                        // The true architectural TYPE (LEC, TUT, LAB) is always strictly the LAST element.
                        type = parts[parts.length - 1].trim(); 
                        section = parts.slice(0, parts.length - 1).join("-").trim();
                    }
                    
                    let days = "TBA";
                    let startTimeStr = "00:00";
                    let endTimeStr = "00:00";
                    
                    if (daysTimesRaw && daysTimesRaw !== "TBA" && !daysTimesRaw.includes("00:00-00:00")) {
                        const timeSplit = daysTimesRaw.split(" ");
                        if (timeSplit.length > 0) {
                            days = timeSplit[0]; 
                            let timeString = daysTimesRaw.replace(days, "").trim(); 
                            let splitTimes = timeString.split("-").map(s => s.trim());
                            if (splitTimes.length === 2) {
                                const convertTime = (t) => {
                                    if (!t) return "00:00";
                                    let isPM = t.toUpperCase().includes("PM");
                                    let cleanH = t.replace(/[^\d:]/g, "");
                                    let [h, m] = cleanH.split(":");
                                    let hNum = parseInt(h);
                                    if (isPM && hNum < 12) hNum += 12;
                                    if (!isPM && hNum === 12) hNum = 0;
                                    return `${hNum.toString().padStart(2, "0")}:${m}`;
                                };
                                startTimeStr = convertTime(splitTimes[0]);
                                endTimeStr = convertTime(splitTimes[1]);
                            }
                        }
                    }

                    parsedClasses.push({
                        id: classIdRaw,
                        type: type,
                        section: section,
                        days: days,
                        startTime: startTimeStr,
                        endTime: endTimeStr,
                        room: "TBA",
                        prof: "TBA",
                        prerequisites: extractedPrereq
                    });
                } catch (e) {
                    console.log("Failed to parse row", tr, e);
                }
            });
            
            console.log("Extracted Classes:", parsedClasses);

            setTimeout(() => {
                try {
                    chrome.runtime.sendMessage({
                        action: "PEOPLESOFT_SCRAPE_SUCCESS",
                        data: parsedClasses.length > 0 ? parsedClasses : [
                            { id: "ERROR", type: "ERR", section: "Failed", days: "MoWe", startTime: "12:00", endTime: "14:00", room: "TBA", prof: "Parser failed" }
                        ]
                    });
                    chrome.storage.local.remove("scrapeTarget");
                } catch (e) {
                    const overlay = document.getElementById("conu-bot-overlay");
                    if (overlay) overlay.innerHTML = "<div style='position: fixed; bottom: 0; left: 0; width: 100%; background: red; color: white; padding: 15px; text-align: center; z-index: 999999; font-weight: bold;'>❌ Extension was reloaded! Please close this tab and Extract again.</div>";
                }
            }, 100);
            return;
        }
        
        if (state === "WAITING_FOR_FORM" && !hasClickedSearch) {
            const subjectInput = document.querySelector('input[id*="SUBJECT"]') || document.querySelector('input[name*="SUBJECT"]');
            const catalogInput = document.querySelector('input[id*="CATALOG_NBR"]') || document.querySelector('input[name*="CATALOG_NBR"]');
            const careerSelect = document.querySelector('select[id*="ACAD_CAREER"]');
            const termSelect = document.querySelector('select[id*="STRM"]') || document.querySelector('select[name*="STRM"]');
            const openOnlyCheckbox = document.querySelector('input[type="checkbox"][id*="OPEN_ONLY"]');
            
            // Helper to find the dynamic Search Button
            const getSearchBtn = () => {
                return document.querySelector('[id*="PB_CLASS_SRCH"]') || 
                       document.querySelector('[name*="PB_CLASS_SRCH"]') ||
                       document.querySelector('[id*="SSR_PB_SRCH"]') ||
                       Array.from(document.querySelectorAll('a, input, button')).find(el => {
                           const text = el.innerText ? el.innerText.trim().toUpperCase() : "";
                           const val = el.value ? el.value.trim().toUpperCase() : "";
                           return text.includes("SEARCH") || val.includes("SEARCH");
                       });
            };

            const searchBtn = getSearchBtn();

            // Find the main form elements
            if (subjectInput && catalogInput && careerSelect && termSelect && searchBtn) {
                console.log(`Bot filling form for ${target.subject} ${target.catalogue}`);
                
                // 1. Fill Subject and Catalog and explicitly trigger 'change' so PeopleSoft counts them as Search Criteria!
                if (subjectInput.value !== target.subject) {
                    subjectInput.value = target.subject;
                    subjectInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                if (catalogInput.value !== target.catalogue) {
                    catalogInput.value = target.catalogue;
                    catalogInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                
                // Keep track if we need to wait for PeopleSoft AJAX (dropdowns trigger server lock)
                let triggeredAjax = false;

                // 2. Set Career to Undergraduate ("UGRD") ONLY if it's not already
                if (careerSelect.value !== "UGRD") {
                    careerSelect.value = "UGRD";
                    careerSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    triggeredAjax = true;
                }
                
                // 3. Find the correct internal value for the requested Term (Strict Matching!)
                let foundTerm = false;
                
                // Pass 1: Strict Exact Match
                Array.from(termSelect.options).forEach(opt => {
                    if (opt.innerText.trim() === target.term) {
                        if (termSelect.value !== opt.value) {
                            termSelect.value = opt.value;
                            termSelect.dispatchEvent(new Event('change', { bubbles: true }));
                            triggeredAjax = true;
                        }
                        foundTerm = true;
                    }
                });
                
                // Pass 2: Loose Match but explicit CCE filter to avoid accidentally grabbing CCE terms for standard students
                if (!foundTerm) {
                    Array.from(termSelect.options).forEach(opt => {
                        const txt = opt.innerText.trim();
                        // Ensure both the Term and Year match. Reject '(CCE only)' unless explicitly requested
                        if (txt.includes(target.term) && (!txt.includes("CCE") || target.term.includes("CCE")) && !foundTerm) {
                            if (termSelect.value !== opt.value) {
                                termSelect.value = opt.value;
                                termSelect.dispatchEvent(new Event('change', { bubbles: true }));
                                triggeredAjax = true;
                            }
                            foundTerm = true;
                        }
                    });
                }

                // 4. Uncheck "Show Open Classes Only" 
                if (openOnlyCheckbox && openOnlyCheckbox.checked) {
                    openOnlyCheckbox.checked = false;
                    openOnlyCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
                
                // Lock it instantly
                hasClickedSearch = true; 
                
                console.log("Bot Form Prepared! Waiting for PeopleSoft internal JS to settle...");
                
                // God-Mode Submit V2: Sanitized Pure HTML POST Submission
                // 1. Grab PeopleSoft form
                // 2. Strip any javascript: action or onsubmit attribute to bypass Concordia CSP
                // 3. Set ICAction and blast it via pure HTTP POST
                const triggerSearch = () => {
                    var btn = document.querySelector('a[id*="PB_CLASS_SRCH"], a[name*="PB_CLASS_SRCH"], input[id*="PB_CLASS_SRCH"], button[id*="PB_CLASS_SRCH"]');
                    var form = document.querySelector('form[name="win0"]') || document.forms[0];
                    var icAction = document.querySelector('input[name="ICAction"]') || document.querySelector('input[id="ICAction"]');
                    var icXPos = document.querySelector('input[name="ICXPos"]');
                    var icYPos = document.querySelector('input[name="ICYPos"]');
                    
                    if (btn && form && icAction) {
                        try {
                            console.log("[Content Script] Sanitizing Form and Forging POST data...");
                            
                            // Strip any CSP-violating scripts attached directly to the form
                            form.removeAttribute('onsubmit');
                            
                            let currentAction = form.getAttribute('action') || "";
                            if (currentAction.toLowerCase().startsWith('javascript:') || currentAction.trim() === "") {
                                form.setAttribute('action', window.location.href);
                            }

                            // Forge the PeopleSoft hidden input tracking
                            icAction.value = btn.id || btn.name || "CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH";
                            if (icXPos) icXPos.value = "100";
                            if (icYPos) icYPos.value = "100";
                            
                            form.submit();
                        } catch(e) {
                            console.error("[Content Script] God-Mode Submit completely failed!", e);
                        }
                    } else if (btn) {
                        try { btn.click(); } catch(e) {}
                    }
                };

                // If we triggered an AJAX change on Term/Career, give it 2 full seconds to unlock.
                setTimeout(() => {
                    console.log("Bot Programmatically clicking Search!");
                    triggerSearch();
                    state = "WAITING_FOR_RESULTS_MANUAL"; 
                }, triggeredAjax ? 2500 : 800);
            } else {
                console.log("Bot scanning for form elements. Status:", { 
                    subject: !!subjectInput, catalog: !!catalogInput, career: !!careerSelect, term: !!termSelect, searchBtn: !!searchBtn 
                });
            }
        }
        
        if (state === "WAITING_FOR_RESULTS_MANUAL") {
                // If results haven't loaded organically, PeopleSoft's "Processing" spinner 
                // might have crashed. We aggressively re-click / re-submit every 3 seconds.
                if (!window.conuSearchTick) window.conuSearchTick = 0;
                window.conuSearchTick++;
                
                // 30 ticks * 100ms = 3000ms (3 seconds) breather before re-triggering POST!
                if (window.conuSearchTick % 30 === 0) {
                    console.log("Results not found yet. Re-firing God-Mode Search click to break PeopleSoft frozen state...");
                    var btn = document.querySelector('a[id*="PB_CLASS_SRCH"], a[name*="PB_CLASS_SRCH"], input[id*="PB_CLASS_SRCH"], button[id*="PB_CLASS_SRCH"]');
                    var form = document.querySelector('form[name="win0"]') || document.forms[0];
                    var icAction = document.querySelector('input[name="ICAction"]') || document.querySelector('input[id="ICAction"]');
                    var icXPos = document.querySelector('input[name="ICXPos"]');
                    var icYPos = document.querySelector('input[name="ICYPos"]');
                    
                    if (btn && form && icAction) {
                        try {
                            form.removeAttribute('onsubmit');
                            let currentAction = form.getAttribute('action') || "";
                            if (currentAction.toLowerCase().startsWith('javascript:') || currentAction.trim() === "") {
                                form.setAttribute('action', window.location.href);
                            }
                            icAction.value = btn.id || btn.name || "CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH";
                            if (icXPos) icXPos.value = "100";
                            if (icYPos) icYPos.value = "100";
                            form.submit(); 
                        } catch(e) {}
                    }
                }
        }
        
        const classCap = document.querySelector('span[id*="SSR_CLS_DTL_WRK_ENRL_CAP"]');
        const pageTitle = document.querySelector('span[id*="DERIVED_CLSRCH_DESCR200"]');
        
        // Either we are systematically tracking the click via state, OR we boot up fresh into the details page!
        if (state === "WAITING_FOR_DEEP_DETAILS" || (target.mode === "DEEP_FETCH" && (classCap || pageTitle))) {
            
            if (classCap || pageTitle) { // The detail page successfully breached
                clearInterval(interval);
                
                const overlay = document.getElementById("conu-bot-overlay");
                if (overlay) overlay.innerHTML = "<div style='position: fixed; bottom: 0; left: 0; width: 100%; background: #0284c7; color: white; padding: 15px; text-align: center; z-index: 999999; font-weight: bold;'>✅ DEEP ANALYSIS COMPLETE! Harvesting Demographics...</div>";
                
                let extractedPrereq = "None";
                try {
                    const pNodes = Array.from(document.querySelectorAll('span, p, div')).filter(el => {
                        const txt = el.innerText || "";
                        return (txt.includes("Prerequisite") || txt.includes("Prereq")) && txt.length < 500 && !txt.includes("Class Search");
                    });
                    if (pNodes.length > 0) {
                        const explicitNode = pNodes.find(n => n.id && n.id.includes("REQUISITE"));
                        extractedPrereq = explicitNode ? explicitNode.innerText.trim() : pNodes[0].innerText.trim();
                        if (extractedPrereq.includes("\n")) {
                            extractedPrereq = extractedPrereq.split("\n").find(line => line.includes("Prerequisite") || line.includes("Prereq")) || extractedPrereq;
                        }
                    }
                } catch (e) {}
                
                const returnData = {
                    capacity: classCap ? classCap.innerText.trim() : "Unknown",
                    waitlistCapacity: document.querySelector('span[id*="SSR_CLS_DTL_WRK_WAIT_CAP"]') ? document.querySelector('span[id*="SSR_CLS_DTL_WRK_WAIT_CAP"]').innerText.trim() : "0",
                    enrolled: document.querySelector('span[id*="SSR_CLS_DTL_WRK_ENRL_TOT"]') ? document.querySelector('span[id*="SSR_CLS_DTL_WRK_ENRL_TOT"]').innerText.trim() : "0",
                    waitlisted: document.querySelector('span[id*="SSR_CLS_DTL_WRK_WAIT_TOT"]') ? document.querySelector('span[id*="SSR_CLS_DTL_WRK_WAIT_TOT"]').innerText.trim() : "0",
                    available: document.querySelector('span[id*="SSR_CLS_DTL_WRK_AVAILABLE_SEATS"]') ? document.querySelector('span[id*="SSR_CLS_DTL_WRK_AVAILABLE_SEATS"]').innerText.trim() : "0",
                    prerequisites: extractedPrereq
                };
                
                console.log("Deep Analysis Harvest complete:", returnData);
                
                chrome.runtime.sendMessage({
                    action: "PEOPLESOFT_DEEP_SCRAPE_SUCCESS",
                    data: returnData
                });
                try { chrome.storage.local.remove("scrapeTarget"); } catch(e){}
                return;
            }
        }
        
    }, 100); // Check every 100ms (Hyper-optimized)
    
    // Safety timeout: Reverted to 60 seconds because it is fully automated!
    setTimeout(() => {
        clearInterval(interval);
        try {
            chrome.storage.local.remove("scrapeTarget");
        } catch(e) {}
    }, 60000);
});
