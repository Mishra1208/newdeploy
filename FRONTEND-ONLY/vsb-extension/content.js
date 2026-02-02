// --- Constants ---
const BUTTON_ID = "conuplanner-export-btn";

// --- Main Injection Logic ---
function init() {
    console.log("ConuPlanner VSB Extension Loaded (Debug Mode)");

    // Inject immediately to test visibility
    injectFloatingButton();
}

function injectFloatingButton() {
    const existingBtn = document.getElementById(BUTTON_ID);
    if (existingBtn) return;

    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.innerHTML = "📅 Export Schedule";
    btn.className = "conu-export-btn-floating";
    btn.onclick = parseAndExport;

    document.body.appendChild(btn);
    console.log("Floating Export button injected into Body");
}

// --- Parsing & ICS Generation ---
function parseAndExport() {
    try {
        const scheduleData = scrapeSchedule();

        if (!scheduleData || scheduleData.length === 0) {
            alert("Could not find any visible courses.\n\nPlease ensure you have selected a schedule and the 'Schedule Results' pane is visible.");
            return;
        }

        const icsContent = generateICS(scheduleData);
        downloadICS(icsContent);
    } catch (e) {
        console.error("ConuPlanner Export Error:", e);
        alert("Error parsing schedule: " + e.message + "\n\nCheck console for details.");
    }
}

function scrapeSchedule() {
    const courses = [];

    // Strategy: The "Golden Rule" from the friend's repo logic.
    // The list of time strings (e.g., "Mon 10:00", "Wed 14:00") matches 1-to-1 
    // with the list of Component Rows (LEC, LAB) in the .vsbselectionnew table.

    // FIX 1: Restrict to .course_box only to avoid selecting nested .course_row and doubling up
    const courseBoxes = document.querySelectorAll(".course_box");
    console.log(`VSB Export (Final Polish): Found ${courseBoxes.length} course boxes.`);

    courseBoxes.forEach(box => {
        // 1. Get Course Title (e.g., "COMP 346")
        const titleEl = box.querySelector(".course_title, h4, .header_cell");
        if (!titleEl) return;

        let titleRaw = titleEl.innerText.split("\n")[0].trim();
        const titleMatch = titleRaw.match(/([A-Z]{4}\s+\d{3,4})/);
        const title = titleMatch ? titleMatch[0] : titleRaw;

        // 2. Extract Ordered Time Strings
        const hoursDiv = box.querySelector("#hoursInLegend, .hours-legend");
        const timeText = hoursDiv ? hoursDiv.innerText : box.innerText;

        // REGEX: Allows "Tue, Thu" or "Mon" explicitly
        const fullTimeRegex = /([A-Za-z, \s]+)\s*:\s*(\d{1,2}:\d{2})\s*(AM|PM)?\s*to\s*(\d{1,2}:\d{2})\s*(AM|PM)?/gi;
        const timeSegments = [];
        let match;
        while ((match = fullTimeRegex.exec(timeText)) !== null) {
            timeSegments.push({
                dayStr: match[1].trim(), // "Tue, Thu"
                startStr: match[2],
                ampm1: match[3],
                endStr: match[4],
                ampm2: match[5]
            });
        }

        // 3. Extract Ordered Components (LEC, TUT, LAB)
        const componentRows = [];
        const selectionTable = box.querySelector(".vsbselectionnew .selection_table");
        if (selectionTable) {
            const rows = selectionTable.querySelectorAll("tr");
            rows.forEach(row => {
                const typeEl = row.querySelector(".type_block");
                if (typeEl) {
                    const type = typeEl.innerText.trim(); // "LEC", "TUT"
                    const locationEl = row.querySelector(".location_block");
                    const location = locationEl ? locationEl.innerText.trim() : "Concordia University";
                    componentRows.push({ type, location });
                }
            });
        }

        // 4. Pair Them Up (Time[i] <-> Component[i])
        timeSegments.forEach((seg, index) => {
            let comp = componentRows[index];
            if (!comp && componentRows.length > 0) {
                comp = componentRows[Math.min(index, componentRows.length - 1)];
            }
            if (!comp) comp = { type: "LEC", location: "Concordia" };

            // Time Parse
            const start24 = convertTo24Hour(seg.startStr, seg.ampm1 || seg.ampm2);
            const end24 = convertTo24Hour(seg.endStr, seg.ampm2 || seg.ampm1);
            const dayMap = { "Mon": "MO", "Tue": "TU", "Wed": "WE", "Thu": "TH", "Fri": "FR", "Sat": "SA", "Sun": "SU" };
            const days = seg.dayStr.split(",").map(d => d.trim());
            const byDay = days.map(d => dayMap[d.substring(0, 3)]).filter(Boolean).join(",");
            const firstDayStr = days[0].substring(0, 3); // "Tue"

            // Deduplicate
            // FIX 2: Compare against the raw properties (title, type, start) 
            // because we haven't constructed the appended title yet.
            const isDuplicate = courses.some(c =>
                c.title === title &&
                c.type === comp.type &&
                c.start === parseDateTime(start24, firstDayStr) &&
                c.rrule.includes(byDay)
            );

            if (!isDuplicate) {
                courses.push({
                    title: title, // FIX 3: Store CLEAN title "COMP 346" (don't append type yet)
                    type: comp.type,
                    start: parseDateTime(start24, firstDayStr),
                    end: parseDateTime(end24, firstDayStr),
                    rrule: `FREQ=WEEKLY;UNTIL=20260413T235959Z;BYDAY=${byDay}`,
                    location: comp.location,
                    description: `Course: ${title}\nType: ${comp.type}\nRoom: ${comp.location}`
                });
                console.log(`Exporting: ${title} (${comp.type}) on ${byDay} @ ${start24}-${end24}`);
            }
        });
    });

    // Handle Online Courses (unchanged)
    const onlineMsg = document.querySelector(".timetableMsg");
    if (onlineMsg) {
        const onlineLabels = onlineMsg.querySelectorAll(".minilabel");
        onlineLabels.forEach(label => {
            const courseCode = label.innerText.trim();
            if (courseCode) {
                courses.push({
                    title: courseCode,
                    type: "ONL",
                    start: "2026-01-12",
                    end: "2026-01-13",
                    allDay: true,
                    rrule: "FREQ=WEEKLY;UNTIL=20260413T235959Z;BYDAY=MO",
                    location: "ONLINE - Econcordia",
                    description: `Online Class: ${courseCode}\nNo scheduled time.`
                });
            }
        });
    }

    return [...courses, ...getWinter2026Events()];
}

// ... unchanged helpers ...

function extractTextDeep(node) {
    let text = [];
    if (node.nodeType === 3) return [node.textContent.trim()];
    node.childNodes.forEach(child => text.push(...extractTextDeep(child)));
    return text.filter(t => t.length > 0);
}

function generateICS(events) {
    let icsLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//ConuPlanner//VSB Exporter//EN",
        "CALSCALE:GREGORIAN"
    ];

    events.forEach(event => {
        icsLines.push("BEGIN:VEVENT");
        // FIX 4: Correct Summary Formatting "COMP 346 (LEC UU)"
        icsLines.push(`SUMMARY:${event.title} (${event.type})`);

        if (event.allDay) {
            // All-Day Event Format: DTSTART;VALUE=DATE:YYYYMMDD
            const startStr = event.start.replace(/-/g, "");
            const endStr = event.end.replace(/-/g, "");
            icsLines.push(`DTSTART;VALUE=DATE:${startStr}`);
            icsLines.push(`DTEND;VALUE=DATE:${endStr}`);
        } else {
            // Standard Event Format: DTSTART:YYYYMMDDTHHMMSSZ
            icsLines.push(`DTSTART:${sanitizeDate(event.start)}`);
            icsLines.push(`DTEND:${sanitizeDate(event.end)}`);
        }

        if (event.rrule) icsLines.push(`RRULE:${event.rrule}`);
        if (event.location) icsLines.push(`LOCATION:${event.location}`);
        if (event.description) icsLines.push(`DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`);

        icsLines.push("END:VEVENT");
    });

    icsLines.push("END:VCALENDAR");
    return icsLines.join("\r\n");
}

function sanitizeDate(isoString) {
    // Input: 2026-01-12T11:45:00 -> Output: 20260112T114500 (Floating Time)
    // REMOVED 'Z' so it uses Local Time (EST) instead of UTC
    return isoString.replace(/[-:]/g, "").split(".")[0];
}

function downloadICS(content) {
    const blob = new Blob([content], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conuplanner-schedule.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function getWinter2026Events() {
    // Hardcoded from Concordia Standard Dates
    return [
        {
            title: "🎓 First Day of Class (Winter)",
            start: "20260112", // Jan 12
            end: "20260113",
            allDay: true
        },
        {
            title: "🚫 DNE Deadline (Drop No Fees)",
            start: "20260126", // Jan 26
            end: "20260127",
            allDay: true,
            description: "Last day to drop courses with full refund."
        },
        {
            title: "⚠️ DISC Deadline (Academic Drop)",
            start: "20260323", // Mar 23
            end: "20260324",
            allDay: true,
            description: "Last day to discontinue courses (grade shows as DISC)."
        },
        {
            title: "🏁 Last Day of Class",
            start: "20260413", // Apr 13
            end: "20260414",
            allDay: true
        },
        {
            title: "📝 Final Exams Period Start",
            start: "20260416", // Apr 16
            end: "20260417",
            allDay: true
        },
        {
            title: "📝 Final Exams Period End",
            start: "20260503", // May 3
            end: "20260504",
            allDay: true
        }
    ];
}

function convertTo24Hour(timePart, modifier) {
    let [hours, minutes] = timePart.split(':');
    hours = parseInt(hours, 10);

    if (!modifier) {
        if (hours < 8 || hours === 12) modifier = "PM";
        else modifier = "AM";
    }

    modifier = modifier.toUpperCase();

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

function parseDateTime(time24, dayStr) {
    const baseDates = {
        "Mon": "12", "Tue": "13", "Wed": "14", "Thu": "15", "Fri": "16", "Sat": "17", "Sun": "18"
    };
    // Normalize Day to 3 chars
    const normalizedDay = dayStr.charAt(0).toUpperCase() + dayStr.slice(1, 3).toLowerCase();
    const day = baseDates[normalizedDay] || "12";

    return `2026-01-${day}T${time24}:00`;
}

function detectTypeByDuration(start24, end24) {
    // Helper to guess LEC vs TUT
    try {
        const [h1, m1] = start24.split(":").map(Number);
        const [h2, m2] = end24.split(":").map(Number);
        const diffMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);

        if (diffMinutes <= 65) return "TUT";
        if (diffMinutes > 160) return "LAB"; // > 2h40m
        return "LEC";
    } catch (e) {
        return "LEC"; // Default
    }
}

// Run immediately
init();

// Also run on dynamic updates just in case the body gets wiped (unlikely but safe)
const observer = new MutationObserver(() => {
    if (!document.getElementById(BUTTON_ID)) {
        injectFloatingButton();
    }
});
observer.observe(document.body, { childList: true, subtree: true });
