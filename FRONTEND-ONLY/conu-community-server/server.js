// conu-community/server.js
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Snoowrap = require("snoowrap");

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const { executablePath } = require("puppeteer");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const app = express();
app.use(cors());
app.use(morgan("tiny"));

/* ------------------------------- Reddit -------------------------------- */
// Lower requestDelay to speed things up; still polite to API.
const reddit = new Snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT || "conu-planner/0.1 (dev)",
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});
reddit.config({ requestDelay: 500, continueAfterRatelimitError: true }); // was 1100

function inferTopicFromQuestion(q) {
  const s = (q || "").toLowerCase();
  if (/(best|who to take|avoid|teacher|prof|instructor)/.test(s)) return "instructor";
  if (/(final|midterm|exam|test|quiz|format|curve|grading)/.test(s)) return "exam";
  if (/(tip|advice|study|assignment|lab|labs|resource|textbook|notes)/.test(s)) return "tips";
  return "difficulty";
}
const topicQuery = {
  difficulty: '(hard OR difficulty OR workload OR easy OR tough OR "drop rate" OR curve)',
  instructor: '(prof OR professor OR teacher OR instructor OR "who to take" OR "best prof" OR avoid)',
  exam: '(final OR midterm OR exam OR test OR quiz OR format OR grading OR proctor)',
  tips: '(tips OR advice OR study OR assignment OR lab OR labs OR resource OR textbook OR notes)',
};
const courseVariants = (course) => {
  const compact = course.replace(/\s+/g, "");
  const dashed = course.replace(/\s+/, "-");
  const lower = course.toLowerCase();
  return `("${course}" OR ${compact} OR "${dashed}" OR "${lower}" OR ${lower.replace(/\s+/g, "")})`;
};
const sinceDaysToTimestamp = (days) =>
  Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000);
const relTime = (iso) => {
  const d = new Date(iso), now = Date.now();
  const diff = Math.max(1, Math.round((now - d.getTime()) / (1000 * 60 * 60 * 24)));
  if (diff < 7) return `${diff}d ago`;
  const w = Math.round(diff / 7); if (w < 8) return `${w}w ago`;
  const m = Math.round(diff / 30); if (m < 18) return `${m}mo ago`;
  const y = Math.round(diff / 365); return `${y}y ago`;
};
const summarizePosts = (posts, course, topic) => {
  const head = {
    difficulty: `Here’s what students recently said about **${course}** (difficulty/workload):`,
    instructor: `Instructor chatter for **${course}** (who to take/avoid):`,
    exam: `Exam-related posts for **${course}**:`,
    tips: `Tips & resources mentioned for **${course}**:`,
  }[topic] || `Community posts for **${course}**:`;
  const bullets = posts.slice(0, 5).map(
    (p) => `• ${p.title} — ${relTime(p.created_iso)} (${p.subreddit}) — ${p.url}`
  );
  return {
    answer: [head, ...bullets, "", "Note: Community feedback from Reddit (opinions/experiences, not official)."].join("\n"),
    sources: posts.slice(0, 5).map((p) => ({
      title: p.title, url: p.url, when: relTime(p.created_iso), subreddit: p.subreddit, score: p.score,
    })),
  };
};
const withTimeout = (promise, ms, label = "reddit") =>
  Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error(`${label}:timeout`)), ms)),
  ]);

// 🚀 Parallelize subreddit searches (previously sequential)
async function searchReddit({ subreddits, searchQ, afterTs, limit, perCallTimeoutMs = 4000 }) {
  const tasks = subreddits.map(async (sub) => {
    try {
      const subreddit = await reddit.getSubreddit(sub);
      const listing = await withTimeout(
        subreddit.search({ query: searchQ, sort: "new", time: "year", limit }),
        perCallTimeoutMs,
        `search:${sub}`
      );
      return listing.map((p) => ({
        id: p.id,
        subreddit: `r/${sub}`,
        title: p.title,
        url: `https://www.reddit.com${p.permalink}`,
        score: p.score,
        num_comments: p.num_comments,
        created_utc: p.created_utc,
        created_iso: new Date(p.created_utc * 1000).toISOString(),
      }));
    } catch {
      return [];
    }
  });

  const nested = await Promise.all(tasks);
  const results = nested.flat();
  return results
    .filter((r) => r.created_utc >= afterTs)
    .sort((a, b) => b.created_utc - a.created_utc)
    .slice(0, limit);
}

/* -------------------- Puppeteer: persistent singleton -------------------- */
let _browserPromise = null;
async function getBrowser() {
  if (!_browserPromise) {
    _browserPromise = puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.CHROME_PATH || executablePath(),
    });
  }
  return _browserPromise;
}

// graceful shutdown
async function closeBrowser() {
  try {
    const br = await _browserPromise;
    await br?.close();
  } catch { }
}
process.on("SIGINT", async () => { await closeBrowser(); process.exit(0); });
process.on("SIGTERM", async () => { await closeBrowser(); process.exit(0); });

/* -------------------------- RMP response cache --------------------------- */
// Cache by name + all flag. Evict after 24h.
const RMP_CACHE = new Map();
const RMP_TTL_MS = 24 * 60 * 60 * 1000;
const rmpKey = (name, all) => `${name.toLowerCase()}|all:${all ? 1 : 0}`;
function rmpGet(name, all) {
  const k = rmpKey(name, all);
  const hit = RMP_CACHE.get(k);
  if (hit && Date.now() - hit.ts < RMP_TTL_MS) return hit.data;
  if (hit) RMP_CACHE.delete(k);
  return null;
}
function rmpSet(name, all, data) {
  RMP_CACHE.set(rmpKey(name, all), { ts: Date.now(), data });
}

/* -------------------------------- Routes ------------------------------- */
app.get("/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.get("/api/reddit/search", async (req, res) => {
  const course = (req.query.course || "").trim();
  const topic = (req.query.topic || "difficulty").trim();
  const windowDays = Number(req.query.windowDays || 540);
  const limit = Math.min(50, Number(req.query.limit || 20));
  if (!course) return res.status(400).json({ error: "Missing course" });

  const subs = (process.env.SUBREDDITS || "r/Concordia")
    .split(",").map((s) => s.trim().replace(/^r\//, ""));
  const afterTs = sinceDaysToTimestamp(windowDays);
  const searchQ = `${courseVariants(course)} AND ${topicQuery[topic] || ""}`;

  try {
    const posts = await withTimeout(
      searchReddit({ subreddits: subs, searchQ, afterTs, limit }),
      6000,
      "overall"
    );
    res.json({
      query: { course, topic, windowDays, limit, subreddits: subs.map((s) => `r/${s}`) },
      count: posts.length,
      posts,
      note: "Community results from Reddit. These reflect opinions/experiences, not official university guidance.",
    });
  } catch (e) {
    console.error("search error:", e.message || e);
    res.status(504).json({ error: "Timeout talking to Reddit", detail: String(e) });
  }
});

app.get("/api/reddit/answer", async (req, res) => {
  const course = (req.query.course || "").trim();
  const question = (req.query.question || "").trim();
  const windowDays = Number(req.query.windowDays || 540);
  const limit = Math.min(20, Number(req.query.limit || 8));
  if (!course) return res.status(400).json({ error: "Missing course" });

  const topic = inferTopicFromQuestion(question);
  const subs = (process.env.SUBREDDITS || "r/Concordia")
    .split(",").map((s) => s.trim().replace(/^r\//, ""));
  const afterTs = sinceDaysToTimestamp(windowDays);
  const searchQ = `${courseVariants(course)} AND ${topicQuery[topic] || ""}`;

  try {
    const posts = await withTimeout(
      searchReddit({ subreddits: subs, searchQ, afterTs, limit }),
      6000,
      "overall"
    );
    const { answer, sources } = summarizePosts(posts, course, topic);
    res.json({
      course, topic, question,
      count: posts.length,
      answer, sources,
      note: "Community results from Reddit. These reflect opinions/experiences, not official university guidance.",
    });
  } catch (e) {
    console.error("answer error:", e.message || e);
    res.status(504).json({ error: "Timeout talking to Reddit", detail: String(e) });
  }
});

const { findProfessor } = require('./rmpClient');

/* ------------------------ RateMyProfessors API ----------------------- */
/**
 * GET /api/rmp?name=First%20Last
 * Optimized GraphQL version (No Puppeteer).
 */
app.get("/api/rmp", async (req, res) => {
  const name = (req.query.name || "").trim();
  if (!name) return res.status(400).json({ error: "Missing professor name" });

  try {
    const results = await findProfessor(name);

    if (!results || results.length === 0) {
      return res.json({ count: 0, top: null, others: [], school: "Concordia University" });
    }

    // Scoring logic to find best match
    const nameLc = name.toLowerCase();
    const scored = results.map(r => {
      let score = 0;
      const n = `${r.firstName} ${r.lastName}`.toLowerCase();
      if (n === nameLc) score += 3;
      if (n.startsWith(nameLc)) score += 2;
      if (n.includes(nameLc)) score += 1;
      if (r.numRatings > 0) score += 1;

      // Normalize fields for frontend compatibility
      const enriched = {
        ...r,
        school: r.school.name,
        difficulty: r.avgDifficulty, // Map avgDifficulty to difficulty
        quality: r.avgRating,        // Map avgRating to quality
        dept: r.department
      };
      return { score, enriched };
    }).sort((a, b) => b.score - a.score);

    const top = scored[0].enriched;
    const others = scored.slice(1).map(s => s.enriched);

    res.json({ count: scored.length, top, others, school: "Concordia University" });

  } catch (e) {
    console.error("RMP API Error:", e.message);
    res.status(500).json({ error: "Failed to fetch ratings", detail: e.message });
  }
});

/* --------------------------------- Start -------------------------------- */
const port = process.env.PORT || 4000;
const host = process.env.HOST || "127.0.0.1";
app.listen(port, host, () => {
  console.log(`Community service listening on http://${host}:${port}`);
});
