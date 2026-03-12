import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "node:path";
import { findProfessorByName } from "@/lib/rmp";

import puppeteer from "puppeteer";

/* ---------------------------------- DATA ---------------------------------- */
let COURSE_INDEX = null, CODE_MAP = null;

// Simple Cache
const REDDIT_CACHE = new Map();

async function scrapeReddit(course, query) {
  const cacheKey = `${course}-${query}`.toLowerCase();
  if (REDDIT_CACHE.has(cacheKey)) {
    console.log("Serving from REDDIT_CACHE");
    return REDDIT_CACHE.get(cacheKey);
  }

  let browser;
  try {
    console.log("Launching Puppeteer...");
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Optimizations
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) req.abort();
      else req.continue();
    });

    // Use old.reddit for stable selectors
    const q = `${course} ${query}`.trim();
    const url = `https://old.reddit.com/r/Concordia/search?q=${encodeURIComponent(q)}&restrict_sr=on&sort=relevance&t=all`;

    console.log(`Scraping Reddit: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 });

    // Wait for results container
    try {
      await page.waitForSelector('.search-result', { timeout: 3000 });
    } catch (e) {
      console.log("No .search-result found (timeout)");
      return [];
    }

    const results = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.search-result')).map(el => {
        const titleEl = el.querySelector('a.search-title');
        const scoreEl = el.querySelector('.search-score');
        const metaEl = el.querySelector('.search-time'); // "submitted 1 year ago by..."

        if (!titleEl) return null;

        let score = 0;
        if (scoreEl) {
          const txt = scoreEl.innerText;
          if (txt.includes('k')) score = parseFloat(txt) * 1000;
          else score = parseInt(txt) || 0;
        }

        return {
          title: titleEl.innerText,
          url: titleEl.href,
          score: score,
          subreddit: "r/Concordia",
          meta: metaEl ? metaEl.innerText : ""
        };
      }).filter(x => x).slice(0, 5); // Top 5
    });

    REDDIT_CACHE.set(cacheKey, results);
    console.log(`Found ${results.length} results`);
    return results;

  } catch (e) {
    console.error("Puppeteer Error:", e);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

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
  CREDITS: "COURSE_CREDITS",
  OFFERED: "COURSE_OFFERED",
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

  // 5. Credits Query: "How many credits is COMP 248?"
  // Relaxed regex to catch "credit" anywhere
  if (courseEntity && (lower.includes("credit") || lower.includes("unit"))) {
    return { intent: INTENTS.CREDITS, entity: courseEntity };
  }

  // 6. Offered/Term Query: "When is COMP 248 offered?", "What semester is..."
  if (courseEntity && (lower.includes("when") || lower.includes("offer") || lower.includes("term") || lower.includes("semester") || lower.includes("avail"))) {
    return { intent: INTENTS.OFFERED, entity: courseEntity };
  }

  // 7. Course Info Fallback ("COMP 248")
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
    const results = await findProfessorByName(name);
    if (!results || results.length === 0) return null;
    return { top: results[0] };
  } catch (e) {
    console.error("Chat RMP Fetch Error:", e);
    return null;
  }
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

/* --------------------------- API HANDLER --------------------------- */
export async function POST(req) {
  try {
    await ensureIndex(); // Load data

    const { message, text } = await req.json(); // Support both 'text' (legacy) and 'message' (new)
    const input = message || text;

    const { intent, entity, topic } = classify(input);

    /* -------------------------- 1. RMP HANDLER -------------------------- */
    if (intent === INTENTS.RMP) {
      const results = await findProfessorByName(entity);
      if (!results || results.length === 0) {
        return NextResponse.json({ reply: `I searched for professor "${entity}" but couldn't find a match on RateMyProfessors.` });
      }

      // Scoring logic: Prefer Concordia + Full Name Match + High Rating Count
      const nameLc = entity.toLowerCase().trim();
      const scored = results.map(r => {
        let score = 0;
        const fullName = r.name.toLowerCase().trim();
        const school = (r.schoolName || "").toLowerCase();

        if (fullName === nameLc) score += 20;
        else if (fullName.startsWith(nameLc)) score += 10;
        else if (fullName.includes(nameLc)) score += 5;

        if (school.includes("concordia")) score += 30;

        // Popularity boost (Crucial for picking the profile with actual data)
        if (r.numRatings > 0) score += 5;
        score += Math.min(10, (r.numRatings || 0) / 10);

        return { score, r };
      }).sort((a, b) => b.score - a.score);

      const top = scored[0].r;
      return NextResponse.json({
        reply: null,
        tool: "RMP",
        data: {
          firstName: top.name.split(" ")[0],
          lastName: top.name.split(" ").slice(1).join(" "),
          department: top.dept || "Concordia",
          avgRating: top.quality || "N/A",
          avgDifficulty: top.difficulty || "N/A",
          numRatings: top.numRatings || 0,
          wouldTakeAgain: top.wouldTakeAgain || "N/A"
        }
      });
    }

    /* ------------------------ 2. REDDIT HANDLER ------------------------- */
    if (intent === INTENTS.REDDIT) {
      const posts = await scrapeReddit(entity, topic || "difficulty");
      if (posts && posts.length > 0) {
        return NextResponse.json({
          reply: null,
          tool: "REDDIT",
          data: {
            answer: "See posts below",
            sources: posts
          }
        });
      }
      return NextResponse.json({ reply: `I checked Reddit for "${entity}" but didn't find any relevant discussions.` });
    }

    /* ------------------------- 3. COURSE HANDLER ------------------------ */
    /* ------------------------- 3. COURSE HANDLER ------------------------ */
    if (intent === INTENTS.COURSE_INFO) {
      if (CODE_MAP && CODE_MAP.has(entity)) {
        const course = CODE_MAP.get(entity);
        return NextResponse.json({
          reply: null,
          tool: "COURSE",
          data: {
            title: course.title,
            name: `${course.subject} ${course.catalogue}`,
            credits: course.credits,
            description: course.description,
            prereq: course.prereq
          }
        });
      }
      return NextResponse.json({ reply: `I couldn't find detailed record for **${entity}** in the course index.` });
    }

    /* ------------------------- 4. CREDITS HANDLER ----------------------- */
    if (intent === INTENTS.CREDITS) {
      if (CODE_MAP && CODE_MAP.has(entity)) {
        const course = CODE_MAP.get(entity);
        return NextResponse.json({
          reply: `${course.subject} ${course.catalogue} is ${course.credits} credits.`
          // No tool/data needed, just a direct answer
        });
      }
      return NextResponse.json({ reply: `I couldn't find credit info for ${entity}.` });
    }

    /* ------------------------- 5. OFFERED HANDLER ----------------------- */
    if (intent === INTENTS.OFFERED) {
      if (CODE_MAP && CODE_MAP.has(entity)) {
        const course = CODE_MAP.get(entity);
        const terms = course.terms && course.terms.length > 0 ? course.terms.join(", ") : "Check specific academic year (varies)";
        return NextResponse.json({
          reply: `${course.subject} ${course.catalogue} is typically offered in: ${terms}.`
        });
      }
      return NextResponse.json({ reply: `I couldn't find offering terms for ${entity}.` });
    }

    /* -------------------------- 4. FALLBACK --------------------------- */
    return NextResponse.json({
      reply: "I didn't catch that. Try:\n- Course Code (e.g. `COMP 248`) for details.\n- Professor Name (e.g. `Aiman Hanna`) for ratings.\n- Question (e.g. `Is COMP 248 hard?`) for Reddit advice."
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ reply: "My logic circuits jammed. Try again!" }, { status: 500 });
  }
}
