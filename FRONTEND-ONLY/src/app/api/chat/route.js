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

  // 1. Course Code Extraction
  // Matches "COMP 248", "comp-248", "soen287"
  const courseMatch = t.match(/\b([A-Z]{3,4})\s*-?\s*(\d{3,4})\b/i);
  const courseEntity = courseMatch ? `${(courseMatch[1] || "COMP").toUpperCase()} ${courseMatch[2]}` : null;

  // 2. Reddit Keywords (Expanded)
  const isReddit = /\b(hard|easy|difficulty|workload|heavy|light|opinion|thoughts|review|advice|tip|worth|taking|skip|vs|compare|better|exam|midterm|final|lab|resources|best|avoid|recommend|who)\b/i.test(lower);

  // 3. Priority: "Best/Who is taking [Course]" -> REDDIT
  if (courseEntity && (isReddit || lower.includes("professor for") || lower.includes("teacher for"))) {
    let topic = "difficulty";
    if (/(best|who|recommend|avoid|teacher|prof)/.test(lower)) topic = "instructor";
    if (/(final|midterm|exam)/.test(lower)) topic = "exam";
    return { intent: INTENTS.REDDIT, entity: courseEntity, topic };
  }

  // 4. Explicit RMP: "Rate Professor X", "Who is Professor X"
  // Avoid capturing "for", "is", "the" as names
  const profMatch = t.match(/\b(rate|prof|professor|teacher|instructor)\s+(?!for\b|is\b|the\b)([A-Za-z.'-]+(?:\s+[A-Za-z.'-]+)?)/i);
  if (profMatch && profMatch[2].length > 2) {
    // Only if it doesn't look like a course request
    return { intent: INTENTS.RMP, entity: profMatch[2].trim() };
  }

  // 5. Course Info Fallback ("How many credits is COMP 248?")
  if (courseEntity) {
    return { intent: INTENTS.COURSE_INFO, entity: courseEntity };
  }

  // 6. Loose Name Detection (Fallback)
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
    <div class="premium-card">
        <!-- Header Gradient -->
        <div class="card-header" style="background:linear-gradient(135deg, #3b82f6, #6366f1) !important; color:white;">
            <div style="display:flex; justify-content:space-between; align-items:start;">
                <div>
                    <div style="font-size:0.7rem; opacity:0.9; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Concordia Course</div>
                    <h3 style="margin:4px 0 0 0; font-size:1.6em; font-weight:800; letter-spacing:-0.03em;">
                        ${c.subject} ${c.catalogue}
                    </h3>
                </div>
                <span style="background:rgba(255,255,255,0.2); color:white; padding:4px 12px; border-radius:99px; font-size:0.85em; font-weight:700; backdrop-filter:blur(4px); box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                    ${c.credits} Cr
                </span>
            </div>
            <div style="font-size:0.95em; opacity:0.95; margin-top:6px; font-weight:500; line-height:1.4;">${c.title}</div>
        </div>

        <!-- Content -->
        <div style="padding:20px;">
            
            ${c.prereq ? `
            <div style="margin-bottom:16px; padding:12px 16px; background:rgba(59, 130, 246, 0.08); border-radius:12px; border-left:4px solid #3b82f6;">
                <div style="font-size:0.7em; font-weight:800; color:#3b82f6; text-transform:uppercase; margin-bottom:4px; letter-spacing:0.5px;">Prerequisites</div>
                <div style="font-size:0.9em; line-height:1.5; font-weight:500;">${c.prereq}</div>
            </div>` : ""}

            ${c.description ? `
            <div style="font-size:0.95em; line-height:1.6; opacity:0.8;">
                ${c.description}
            </div>` : ""}
        </div>
        
        <!-- Footer -->
         <div style="background:rgba(0,0,0,0.02); padding:12px 20px; border-top:1px solid rgba(0,0,0,0.05); text-align:right;">
             <span style="font-size:0.7em; opacity:0.4; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Official Catalog Data</span>
        </div>
    </div>
    `;
}

function buildRMPCard(t) {
  // 1. Clean the name
  let name = t.name.replace(/QUALITY\s*[\d.]+\s*\d*\s*ratings?/i, "")
    .replace(/\d+%\s*would\s*take\s*again/i, "")
    .replace(/[\d.]+\s*level\s*of\s*difficulty/i, "")
    .replace(/Concordia\s*University/i, "")
    .replace(t.dept || "_______", "")
    .trim();
  if (name.length < 3) name = t.name.split("Computer")[0].replace(/QUALITY.*?ratings?/i, "").trim();

  // 2. Color Logic
  const q = parseFloat(t.quality) || 0;
  const qColor = q >= 3.5 ? "#4ade80" : q >= 2.5 ? "#facc15" : "#f87171";
  const d = parseFloat(t.difficulty) || 0;
  const dColor = d >= 4 ? "#f87171" : d >= 3 ? "#facc15" : "#4ade80";

  return `
    <div class="premium-card">
        <!-- Header Gradient -->
        <div class="card-header" style="background:linear-gradient(135deg, #8b5cf6, #d946ef) !important; color:white;">
            <div style="font-size:0.7rem; opacity:0.9; font-weight:700; text-transform:uppercase; letter-spacing:1px;">RateMyProfessors</div>
            <h3 style="margin:4px 0 0 0; font-size:1.6em; font-weight:800; letter-spacing:-0.03em;">${name}</h3>
            <div style="font-size:0.95em; opacity:0.9; margin-top:4px;">${t.dept || 'Concordia'}</div>
        </div>

        <!-- Stats Row -->
        <div style="display:grid; grid-template-columns:1fr 1fr; padding:20px; gap:16px;">
            <!-- Quality -->
            <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                <div style="font-size:0.75em; opacity:0.6; font-weight:700; letter-spacing:0.5px;">QUALITY</div>
                <div style="background:${qColor}15; color:${qColor}; border:2px solid ${qColor}40; border-radius:16px; padding:6px 20px; font-weight:800; font-size:1.6em; box-shadow:0 4px 12px ${qColor}20;">
                    ${t.quality}
                </div>
                <div style="font-size:0.7em; opacity:0.4; font-weight:500;">out of 5.0</div>
            </div>
            
            <!-- Difficulty -->
             <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                <div style="font-size:0.75em; opacity:0.6; font-weight:700; letter-spacing:0.5px;">DIFFICULTY</div>
                <div style="background:${dColor}15; color:${dColor}; border:2px solid ${dColor}40; border-radius:16px; padding:6px 20px; font-weight:800; font-size:1.6em; box-shadow:0 4px 12px ${dColor}20;">
                    ${t.difficulty}
                </div>
                <div style="font-size:0.7em; opacity:0.4; font-weight:500;">out of 5.0</div>
            </div>
        </div>

        <!-- Footer Info: Progress Bar -->
         <div style="background:rgba(0,0,0,0.02); padding:20px; border-top:1px solid rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:0.75em; font-weight:700; opacity:0.6; text-transform:uppercase; letter-spacing:0.5px;">Would Take Again</span>
                <span style="font-size:1.1em; font-weight:800; color:${t.wouldTakeAgain ? (parseInt(t.wouldTakeAgain) >= 50 ? '#4ade80' : '#f87171') : '#999'}">${t.wouldTakeAgain || 'N/A'}%</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width:${parseInt(t.wouldTakeAgain) || 0}%; background:${t.wouldTakeAgain ? (parseInt(t.wouldTakeAgain) >= 50 ? '#4ade80' : '#f87171') : 'transparent'};"></div>
            </div>
            
            ${t.url ? `<div style="margin-top:16px; text-align:center;">
                <a href="${t.url}" target="_blank" style="font-size:0.85em; font-weight:700; color:#8b5cf6; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:transform 0.2s;">
                    View Profile on RMP <span>→</span>
                </a>
            </div>` : ""}
        </div>
    </div>`;
}

function buildRedditCard(data, entity) {
  const answerClean = data.answer.split('\n').filter(line => line.startsWith('•')).map(line => {
    // Clean up
    const parts = line.replace(/^•\s*/, '').split('—');
    const title = parts[0].trim();
    const meta = parts.slice(1).join('—').trim();
    return `<div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid rgba(0,0,0,0.05);">
            <div style="font-weight:600; font-size:0.95em; margin-bottom:4px; line-height:1.4;">${title}</div>
            <div style="font-size:0.75em; opacity:0.5;">${meta.split('http')[0]}</div>
        </div>`;
  }).join("");

  return `
    <div class="premium-card">
         <!-- Header Gradient -->
        <div class="card-header" style="background:linear-gradient(135deg, #f97316, #ea580c) !important; color:white;">
            <div style="font-size:0.7rem; opacity:0.9; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Reddit Consensus</div>
            <h3 style="margin:4px 0 0 0; font-size:1.5em; font-weight:800; letter-spacing:-0.03em;">
                ${entity}
            </h3>
        </div>
        
        <!-- Content -->
        <div style="padding:24px;">
             <div style="font-size:0.9em; line-height:1.6; opacity:0.9;">
                ${answerClean || "No specific posts found, but here is the general consensus..."}
             </div>
        </div>

        <!-- Footer -->
        <div style="background:rgba(0,0,0,0.02); padding:12px 20px; border-top:1px solid rgba(0,0,0,0.05); display:flex; justify-content:space-between; align-items:center;">
             <span style="font-size:0.7em; opacity:0.5; font-weight:600;">Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
             <a href="https://www.reddit.com/r/Concordia/search/?q=${encodeURIComponent(entity)}" target="_blank" style="font-size:0.85em; font-weight:700; color:#f97316; text-decoration:none;">
                View on Reddit →
             </a>
        </div>
    </div>
    `;
}

/* --------------------------- API HANDLER --------------------------- */
export async function POST(req) {
  try {
    await ensureIndex(); // Load data

    const { message, text } = await req.json(); // Support both 'text' (legacy) and 'message' (new)
    const input = message || text;

    const { intent, entity, topic } = classify(input);

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
        return NextResponse.json({ html: buildRedditCard(data, entity) });
      }
      return NextResponse.json({ reply: `I looked on Reddit for ${entity} discussions but found nothing recent.` });
    }

    /* ------------------------- 3. COURSE HANDLER ------------------------ */
    if (intent === INTENTS.COURSE_INFO) {
      if (CODE_MAP && CODE_MAP.has(entity)) {
        const course = CODE_MAP.get(entity);
        return NextResponse.json({
          html: buildCourseCard(course),
          actions: [
            { label: "View Tree Graph", link: `/pages/tree?code=${course.subject}-${course.catalogue}` },
            { label: "Search Courses", link: `/pages/courses?search=${course.subject}%20${course.catalogue}` },
            { label: "Full Description", link: `/pages/courses/descriptions#${course.subject}-${course.catalogue}` }
          ]
        });
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
