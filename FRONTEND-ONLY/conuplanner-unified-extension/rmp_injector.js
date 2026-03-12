// RateMyProfessors Injector for Concordia VSB

const RMP_CACHE = {}; // Cache queries to avoid spamming the API

function initRMPInjector() {
    console.log("ConuPlanner: Init RMP Injector...");

    // Create an observer to watch for DOM changes, as VSB loads classes dynamically
    const observer = new MutationObserver(mutations => {
        let shouldProcess = false;
        for (const mut of mutations) {
            if (mut.addedNodes.length > 0 || mut.type === 'childList') {
                shouldProcess = true;
                break;
            }
        }
        if (shouldProcess) {
            // Debounce processing to prevent excessive calls during rapid DOM updates
            clearTimeout(window.rmpDebounce);
            window.rmpDebounce = setTimeout(processInstructors, 500);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    // Initial run
    processInstructors();
}

async function processInstructors() {
    // VSB's structure uses multiple tables. The most robust way to find the instructor
    // is to look for the "Location/Time" cell, which contains keywords like "Campus", "Room", or "On Line".
    // The instructor name is almost always the very last line of text in this cell.

    const cells = document.querySelectorAll('.course_box td, .selection_table td');

    cells.forEach(cell => {
        if (cell.hasAttribute("data-rmp-injected")) return;

        // If the cell contains another table, skip it (we want the innermost cells)
        if (cell.querySelector('table')) return;

        const text = cell.innerText.trim();
        if (!text) return;

        const lowerText = text.toLowerCase();

        // The cell must contain location keywords to be the right cell
        const isLocationCell = lowerText.includes("campus") ||
            lowerText.includes("building") ||
            lowerText.includes("room") ||
            lowerText.includes("on-line") ||
            lowerText.includes("on line") ||
            lowerText.includes("in person");

        if (isLocationCell) {
            // Split by newlines to get individual lines of text
            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

            // The instructor name is always the last line in these cells
            let potentialName = lines[lines.length - 1];

            // In cases where it says "Staff", or "TBA", we gracefully skip
            if (isValidName(potentialName)) {

                // Prevent duplicate badges for the same professor in a single course (e.g. LEC + TUT)
                const parentBox = cell.closest('.course_box, .selection_table');
                if (parentBox) {
                    if (!parentBox.injectedProfs) parentBox.injectedProfs = new Set();
                    if (parentBox.injectedProfs.has(potentialName)) {
                        // Mark as skipped so we don't process it again on the next mutation
                        cell.setAttribute("data-rmp-injected", "duplicate-skipped");
                        return;
                    }
                    parentBox.injectedProfs.add(potentialName);
                }

                cell.setAttribute("data-rmp-injected", "pending");

                injectBadge(cell, potentialName);
            } else {
                cell.setAttribute("data-rmp-injected", "skipped");
            }
        }
    });

}

function isValidName(str) {
    if (str.length < 4) return false;
    if (/\d/.test(str)) return false; // Names shouldn't have numbers

    // Check for all uppercase acronyms like "LEC" or "TUT"
    if (str.toUpperCase() === str) return false;

    const lower = str.toLowerCase();
    const invalidKeywords = ['staff', 'tba', 'campus', 'room', 'in person', 'online', 'on-line', 'on line', 'concordia', 'seats', 'enrolled', 'wait', 'listed', 'closed', 'lec', 'tut', 'lab'];
    if (invalidKeywords.some(kw => lower.includes(kw))) return false;

    const words = str.split(' ');
    // Most names are 2 to 4 words. 
    return words.length >= 2 && words.length <= 4;
}

function fetchRating(name) {
    if (RMP_CACHE[name]) return Promise.resolve(RMP_CACHE[name]);

    return new Promise((resolve) => {
        // Send message to background.js to perform the fetch
        chrome.runtime.sendMessage({ action: "fetchRMP", name: name }, response => {
            if (response && response.success) {
                RMP_CACHE[name] = response.data;
                resolve(response.data);
            } else {
                RMP_CACHE[name] = { error: true, msg: response?.error || "Unknown" };
                resolve(RMP_CACHE[name]);
            }
        });
    });
}

async function injectBadge(container, rawName) {
    let searchName = rawName;

    // Reverse "LastName, FirstName" to "FirstName LastName" for better searching
    if (searchName.includes(",")) {
        const parts = searchName.split(",");
        if (parts.length === 2) {
            searchName = `${parts[1].trim()} ${parts[0].trim()}`;
        }
    }

    // Append a wrapper so we don't break existing VSB event listeners
    const badgeContainer = document.createElement("div");
    badgeContainer.className = "rmp-badge-container";
    badgeContainer.style.marginTop = "4px";

    const loadingSpan = document.createElement("span");
    loadingSpan.className = "rmp-badge-loading";
    loadingSpan.style = "font-size: 11px; color:#999; animation: pulse 1.5s infinite;";
    loadingSpan.innerText = "⏳ Searching...";

    badgeContainer.appendChild(loadingSpan);
    container.appendChild(badgeContainer);

    const data = await fetchRating(searchName);

    // Clean up loading indicator
    loadingSpan.remove();

    if (data.error) {
        container.setAttribute("data-rmp-injected", "error");

        // If the API explicitly says the professor doesn't exist, we just don't show a badge
        // to keep the UI clean (e.g., Kerly Titus)
        if (data.msg && (data.msg.includes("No professor") || data.msg.includes("No close match"))) {
            return;
        }

        // Show an explicit "Error" badge so the user knows parsing worked but API failed
        const errBadgeDiv = document.createElement("span");
        errBadgeDiv.className = "conuplanner-rmp-badge-error";
        errBadgeDiv.style = `
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: #e2e8f0;
            color: #64748b;
            border: 1px solid #cbd5e1;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            text-decoration: none;
            cursor: help;
            line-height: 1;
        `;
        errBadgeDiv.innerHTML = `<span>⭐ N/A</span>`;
        // Put the exact error message in the title popup!
        errBadgeDiv.title = `RMP Fetch Error: ${data.error}\\nMake sure the local server (npm run dev) is running!`;

        badgeContainer.appendChild(errBadgeDiv);
        return;
    }

    // Determine badge color based on rating
    let badgeColor = "#ef4444"; // Default Red
    if (data.rating >= 3.5) badgeColor = "#10b981"; // Green
    else if (data.rating >= 2.5) badgeColor = "#f59e0b"; // Yellow

    const badgeDiv = document.createElement("div");
    badgeDiv.className = "conuplanner-rmp-badge";
    badgeDiv.style = `
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: white;
        color: ${badgeColor};
        border: 1px solid ${badgeColor}50;
        padding: 4px 10px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 700;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        cursor: pointer;
        transition: all 0.2s ease;
        line-height: 1;
    `;

    // Show rating. E.g., ⭐ 4.2
    badgeDiv.innerHTML = `<span style="font-size: 13px;">⭐</span> <span>${Number(data.rating).toFixed(1)}</span>`;

    // Parse the takesAgain percentage safely
    const takesAgainNum = parseFloat(data.takesAgain);
    const takesAgainStr = !isNaN(takesAgainNum) && takesAgainNum >= 0 ? `${Math.round(takesAgainNum)}%` : "N/A";
    const difficultyStr = data.difficulty > 0 ? `${Number(data.difficulty).toFixed(1)} / 5` : "N/A";

    // Build the premium popover
    const popover = document.createElement("div");
    popover.className = "rmp-popover";
    popover.innerHTML = `
        <div class="rmp-popover-header">
            <span style="font-size:18px; font-weight:800; color:#0f172a;">${searchName.split(' ')[0]}'s Insights</span>
            <span style="background:${badgeColor}20; color:${badgeColor}; padding:4px 8px; border-radius:12px; font-weight:700; font-size:14px;">⭐ ${Number(data.rating).toFixed(1)}</span>
        </div>
        
        <div style="display: flex; gap: 24px;">
            <div class="rmp-popover-stat">
                <span class="rmp-popover-label">Difficulty</span>
                <span class="rmp-popover-value">${difficultyStr}</span>
            </div>
            <div class="rmp-popover-stat">
                <span class="rmp-popover-label">Takes Again</span>
                <span class="rmp-popover-value">${takesAgainStr}</span>
            </div>
        </div>
        
        <div style="margin-top: 12px; font-size: 13px; color: #64748b; font-weight: 500;">
            Based on <span style="color:#0f172a; font-weight:700;">${data.numRatings}</span> reviews
        </div>
        
        <a href="${data.link}" target="_blank" class="rmp-popover-button">View on RateMyProfessors</a>
    `;

    document.body.appendChild(popover);

    // Interactive Hover Effects & Smart Body Positioning
    let hideTimeout;

    badgeDiv.onmouseenter = () => {
        clearTimeout(hideTimeout);
        badgeDiv.style.transform = "translateY(-1px)";
        badgeDiv.style.boxShadow = "0 6px 8px -1px rgba(0, 0, 0, 0.08), 0 4px 6px -1px rgba(0, 0, 0, 0.04)";

        popover.style.display = "block"; // Temporarily force display if needed for layout calcs
        popover.classList.add("rmp-popover-visible");

        // Use fixed viewport positioning to escape all native VSB container scroll-box clipping
        const badgeRect = badgeDiv.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();

        // Default: Pop DOWNWARDS and LEFTWARDS (user requested)
        let targetTop = badgeRect.bottom + 12;
        let targetLeft = badgeRect.right - popoverRect.width + 10;

        popover.classList.remove('rmp-popover-top');

        // Flip UPWARDS if it hits the absolute bottom of the screen
        if (targetTop + popoverRect.height + 15 > window.innerHeight) {
            targetTop = badgeRect.top - popoverRect.height - 12;
            popover.classList.add('rmp-popover-top');
        }

        // Push RIGHT if window is too small vertically and it hits left edge
        if (targetLeft < 10) {
            targetLeft = 10;
        }

        popover.style.top = `${targetTop}px`;
        popover.style.left = `${targetLeft}px`;
    };

    badgeDiv.onmouseleave = (e) => {
        if (e.relatedTarget && (popover.contains(e.relatedTarget) || e.relatedTarget === popover)) return;
        scheduleHide();
    };

    popover.onmouseenter = () => {
        clearTimeout(hideTimeout);
    };

    popover.onmouseleave = (e) => {
        if (e.relatedTarget && (badgeDiv.contains(e.relatedTarget) || e.relatedTarget === badgeDiv)) return;
        scheduleHide();
    };

    function scheduleHide() {
        badgeDiv.style.transform = "translateY(0)";
        badgeDiv.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)";
        popover.classList.remove("rmp-popover-visible");

        hideTimeout = setTimeout(() => {
            if (!popover.classList.contains("rmp-popover-visible")) {
                popover.style.display = "none";
            }
        }, 300);
    }

    badgeContainer.appendChild(badgeDiv);
    container.setAttribute("data-rmp-injected", "done");
}

if (window.location.hostname.includes("vsb.concordia.ca") && window === window.top) {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }
        
        .rmp-badge-container {
            position: relative;
            display: inline-flex;
            cursor: pointer;
        }

        /* 
         * PREMIUM POPOVER CSS
         */
        .rmp-popover {
            position: fixed; /* Escape all VSB parent containers */
            top: 0;
            left: 0;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            padding: 16px;
            width: max-content;
            min-width: 220px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px);
            transition: opacity 0.25s ease, visibility 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            z-index: 2147483647; /* Absolute maximum */
            color: #0f172a;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            pointer-events: none; /* Prevent rogue hover catching */
        }

        /* Hover logic (now controlled by JS class for smarter positioning) */
        .rmp-popover-visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            pointer-events: auto; /* Allow clicking button when open */
        }

        /* The arrow pointing UP to the badge (default pop DOWN) */
        .rmp-popover::after {
            content: '';
            position: absolute;
            bottom: 100%;
            top: auto;
            right: 20px; /* Aligned right to match shifted box */
            left: auto;
            border-width: 8px;
            border-style: solid;
            border-color: transparent transparent white transparent;
        }
        
        /* The border for the arrow */
        .rmp-popover::before {
            content: '';
            position: absolute;
            bottom: 100%;
            top: auto;
            right: 19px;
            left: auto;
            transform: translateY(-1px);
            border-width: 9px;
            border-style: solid;
            border-color: transparent transparent #e2e8f0 transparent;
        }

        /* Top Flipped Arrow Logic (If popped UPwards) */
        .rmp-popover-top::after {
            top: 100%;
            bottom: auto;
            border-color: white transparent transparent transparent;
        }
        .rmp-popover-top::before {
            top: 100%;
            bottom: auto;
            transform: translateY(1px);
            border-color: #e2e8f0 transparent transparent transparent;
        }

        .rmp-popover-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #f1f5f9;
        }
        
        /* ... remaining css ... */
        
        .rmp-popover-stat {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .rmp-popover-label {
            font-size: 11px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .rmp-popover-value {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
        }

        .rmp-popover-button {
            display: block;
            width: 100%;
            margin-top: 16px;
            padding: 10px 0;
            background: #2563eb;
            color: white !important;
            text-align: center;
            border-radius: 8px;
            font-weight: 700;
            text-decoration: none !important;
            font-size: 13px;
            transition: all 0.2s ease;
            box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }

        .rmp-popover-button:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
            box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.3);
        }
    `;
    document.head.appendChild(style);

    // If the user scrolls inside VSB's panels, instantly hide leftover tooltips
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.rmp-popover-visible').forEach(p => {
            p.classList.remove('rmp-popover-visible');
            p.style.display = 'none';
        });
    }, true);

    // Slight delay to ensure VSB table is rendered before we start extracting
    setTimeout(initRMPInjector, 1500);
}
