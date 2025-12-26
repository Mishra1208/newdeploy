import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "node:path";

/* ---------------------------------- DATA ---------------------------------- */
let COURSE_INDEX = null, CODE_MAP = null;

async function ensureIndex() {
    if (COURSE_INDEX) return;
    try {
        const p = path.join(process.cwd(), "public", "course_index.json");
        const raw = await fs.readFile(p, "utf8");
        COURSE_INDEX = JSON.parse(raw)?.list ?? [];
        CODE_MAP = new Map();
        for (const item of COURSE_INDEX) {
            const code = `${(item.subject || "").toUpperCase()} ${(item.catalogue || "")}`;
            CODE_MAP.set(code.trim(), item);
        }
    } catch (e) { console.error("Index load failed", e); }
}

/* ------------------------------- CLASSIFIER ------------------------------- */
const INTENTS = {
    RMP: "RMP_LOOKUP",
    REDDIT: "REDDIT_SEARCH",
    COURSE_INFO: "COURSE_LOOKUP",
    UNKNOWN: "UNKNOWN",
};

/**
 * Heuristic to detect "First Last" names without keywords.
 */
function looksLikeName(text) {
    const t = text.trim();
    if (/^(hi|hello|hey|help|start|menu)/i.test(t)) return false;
    // Must be 2-4 words, starts with letter, no numbers
    if (/\d/.test(t)) return false;
    return /^[A-Za-z][A-Za-z.'-]+(?:\s+[A-Za-z][A-Za-z.'-]+){1,3}$/.test(t);
}

function classify(text) {
    const t = text.trim();
    const lower = t.toLowerCase();

    // 1. Explicit RMP: "Rate Professor X", "Who is Professor X"
    const profMatch = t.match(/\b(prof|professor|teacher|instructor)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (profMatch) return { intent: INTENTS.RMP, entity: profMatch[2] };

    // 2. Course Code Extraction
    // Matches "COMP 248", "comp-248", "soen287"
    const courseMatch = t.match(/\b([A-Z]{3,4})\s*-?\s*(\d{3,4})\b/i);
    const courseEntity = courseMatch ? `${(courseMatch[1] || "COMP").toUpperCase()} ${courseMatch[2]}` : null;

    // 3. Reddit Keywords
    const isReddit = /\b(hard|easy|difficulty|workload|heavy|light|opinion|thoughts|review|advice|tip|worth|taking|skip|vs|compare|better|exam|midterm|final|lab|resources)\b/i.test(lower);

    if (courseEntity && isReddit) {
        return { intent: INTENTS.REDDIT, entity: courseEntity, topic: lower };
    }

    if (courseEntity) {
        // "How many credits is COMP 248?" or just "COMP 248"
        return { intent: INTENTS.COURSE_INFO, entity: courseEntity };
    }

    // 4. Loose Name Detection (Fallback)
    // "Aiman Hanna", "Yuhong Yan"
    if (looksLikeName(t)) {
        return { intent: INTENTS.RMP, entity: t };
    }

    return { intent: INTENTS.UNKNOWN };
}

/* --------------------------- External Callers --------------------------- */
const COMMUNITY_API = process.env.COMMUNITY_API_URL || "http://localhost:4000";

async function fetchRMP(name) {
    try {
        const url = new URL("/api/rmp", COMMUNITY_API);
        url.searchParams.set("name", name);
        const r = await fetch(url.toString());
        if (!r.ok) return null;
        return await r.json();
    } catch (e) { return null; }
}

async function fetchReddit(course, query) {
    try {
        const url = new URL("/api/reddit/answer", COMMUNITY_API);
        url.searchParams.set("course", course);
        url.searchParams.set("question", query);
        url.searchParams.set("windowDays", "150"); // 5 months
        const r = await fetch(url.toString());
        if (!r.ok) return null;
        return await r.json();
    } catch (e) { return null; }
}

/* --------------------------- CARD BUILDERS --------------------------- */
function buildCourseCard(c) {
    return `
    <div style="background:rgba(255,255,255,0.05); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); margin-top:4px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h3 style="margin:0; font-size:1.15em; font-weight:700; color:#fff;">${c.subject} ${c.catalogue}</h3>
            <span style="background:rgba(99, 102, 241, 0.2); color:#a5b4fc; padding:2px 8px; border-radius:99px; font-size:0.8em; font-weight:600;">
                ${c.credits} Credits
            </span>
        </div>
        <div style="color:rgba(255,255,255,0.9); font-weight:500; margin-bottom:12px;">${c.title}</div>
        
        ${c.prereq ? `
        <div style="margin-bottom:8px; font-size:0.9em; line-height:1.4;">
            <strong style="color:rgba(255,255,255,0.6);">Prerequisites:</strong><br/>
            ${c.prereq}
        </div>` : ""}

        ${c.description ? `
        <div style="font-size:0.9em; line-height:1.5; color:rgba(255,255,255,0.7);">
            ${c.description}
        </div>` : ""}
    </div>
    `;
}

function buildRMPCard(t) {
    return `
    <div class="rmp-card" style="background:rgba(255,255,255,0.05); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
        <h3 style="margin:0 0 12px 0; font-size:1.1em; color:#fff;">👨‍🏫 ${t.name} <span style="opacity:0.6; font-size:0.8em; font-weight:400;">(RateMyProfessors)</span></h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.95em;">
            <div style="background:rgba(0,0,0,0.2); padding:8px; border-radius:8px;">
                <div style="opacity:0.7; font-size:0.8em;">Quality</div>
                <div style="font-weight:700; font-size:1.1em;">${t.quality}/5</div>
            </div>
            <div style="background:rgba(0,0,0,0.2); padding:8px; border-radius:8px;">
                <div style="opacity:0.7; font-size:0.8em;">Difficulty</div>
                <div style="font-weight:700; font-size:1.1em;">${t.difficulty}/5</div>
            </div>
        </div>
        <div style="margin-top:12px; font-size:0.9em; display:flex; gap:12px;">
            <span>🏫 ${t.dept || 'N/A'}</span>
            <span>🔄 Takes again: <strong>${t.wouldTakeAgain || '?'}%</strong></span>
        </div>
        ${t.url ? `<div style="margin-top:12px; font-size:0.85em;"><a href="${t.url}" target="_blank" style="color:#a78bfa; text-decoration:none;">View Full Profile →</a></div>` : ""}
    </div>`;
}

/* --------------------------- API HANDLER --------------------------- */
export async function POST(req) {
    try {
        await ensureIndex(); // Load data

        const { message } = await req.json();
        const { intent, entity, topic } = classify(message);

        /* -------------------------- 1. RMP HANDLER -------------------------- */
        if (intent === INTENTS.RMP) {
            const data = await fetchRMP(entity);
            if (data && data.top) {
                return NextResponse.json({ html: buildRMPCard(data.top) });
            }
            return NextResponse.json({ reply: `I searched for professor "${entity}" but couldn't find a match on RateMyProfessors.` });
        }

        /* ------------------------ 2. REDDIT HANDLER ------------------------- */
        if (intent === INTENTS.REDDIT) {
            const data = await fetchReddit(entity, topic || "difficulty");
            if (data && data.answer) {
                const sources = (data.sources || []).map(s => `<li style="font-size:0.85em; margin-bottom:4px;"><a href="${s.url}" style="color:#a78bfa;" target="_blank">${s.title}</a></li>`).join("");
                const html = `
                <div class="community">
                   <p style="margin-top:0;"><strong>📢 Community Consensus on ${entity}:</strong></p>
                   <p style="font-size:0.95em; opacity:0.9; line-height:1.5;">${data.answer.replace(/\n/g, "<br/>")}</p>
                   ${sources ? `<div style="margin-top:12px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.1);"><small style="opacity:0.7;">Sources:</small><ul style="margin-top:4px; padding-left:16px; opacity:0.9;">${sources}</ul></div>` : ""}
                </div>
             `;
                return NextResponse.json({ html });
            }
            return NextResponse.json({ reply: `I looked on Reddit for ${entity} discussions but found nothing recent.` });
        }

        /* ------------------------- 3. COURSE HANDLER ------------------------ */
        if (intent === INTENTS.COURSE_INFO) {
            if (CODE_MAP && CODE_MAP.has(entity)) {
                const course = CODE_MAP.get(entity);
                return NextResponse.json({ html: buildCourseCard(course) });
            }
            return NextResponse.json({ reply: `I couldn't find detailed record for **${entity}** in the course index.` });
        }

        /* -------------------------- 4. FALLBACK --------------------------- */
        return NextResponse.json({
            reply: "I didn't catch that. Try:\n- **Course Code** (e.g. `COMP 248`) for details.\n- **Professor Name** (e.g. `Aiman Hanna`) for ratings.\n- **Question** (e.g. `Is COMP 248 hard?`) for Reddit advice."
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ reply: "My logic circuits jammed. Try again!" }, { status: 500 });
    }
}
