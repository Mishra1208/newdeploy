import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "node:path";
import { findProfessorByName } from "@/lib/rmp";
import puppeteer from "puppeteer"; // Direct scraper

// Environment
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY); // Prevent crash if missing on build

/* ---------------------------------- DATA ---------------------------------- */
let COURSE_INDEX = null, CODE_MAP = null;

// Simple Cache
const REDDIT_CACHE = new Map();

// --- Retry Helper ---
async function retryWithBackoff(fn, retries = 3, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            const isRateLimit = error.status === 429 || error.message?.includes('429') || error.message?.includes('Quota');
            if (isRateLimit && i < retries - 1) {
                console.log(`⚠️ Gemini Rate Limit. Retrying in ${delay}ms... (${i + 1}/${retries})`);
                await new Promise(r => setTimeout(r, delay));
                delay *= 2; // Exponential backoff (2s -> 4s -> 8s)
            } else {
                throw error;
            }
        }
    }
}

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

// --- Tools ---
const tools = [
    {
        name: "lookupProfessor",
        description: "Get ratings and details for a specific professor at Concordia University.",
        parameters: {
            type: "OBJECT",
            properties: {
                name: { type: "STRING", description: "Name of the professor (e.g. 'Aiman Hanna')" }
            },
            required: ["name"]
        }
    },
    {
        name: "lookupCourse",
        description: "Get official course description, credits, and prerequisites for a Concordia course code.",
        parameters: {
            type: "OBJECT",
            properties: {
                code: { type: "STRING", description: "Course code (e.g. 'COMP 248', 'SOEN 287')" }
            },
            required: ["code"]
        }
    },
    {
        name: "searchReddit",
        description: "Search local Reddit database for student opinions, difficulty, and advice on a topic or course.",
        parameters: {
            type: "OBJECT",
            properties: {
                query: { type: "STRING", description: "The specific question or topic (e.g. 'is it hard?', 'best teacher?')" },
                course: { type: "STRING", description: "Optional course code context (e.g. 'COMP 248')" }
            },
            required: ["query"]
        }
    }
];

// --- API Handler ---
export async function POST(req) {
    try {
        if (!API_KEY) {
            return NextResponse.json({
                reply: "⚠️ Gemini API Key is missing. Please add GEMINI_API_KEY to .env.local"
            });
        }

        await ensureIndex();
        const { message, history } = await req.json();

        // Model Config
        // Switched to gemini-pro-latest as 1.5-flash was 404ing for this key
        console.log("Gemini API: Initializing model 'gemini-pro-latest'");
        const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

        // Chat Session
        const chat = model.startChat({
            history: history || [], // { role: "user" | "model", parts: [{ text: "..." }] }
            generationConfig: {
                maxOutputTokens: 500,
            },
            tools: [{ functionDeclarations: tools }],
        });

        // Send Message
        // Send Message with Retry
        let result = await retryWithBackoff(() => chat.sendMessage(message));
        let response = await result.response;
        const call = response.functionCalls()?.[0];

        // Tool Execution Logic
        if (call) {
            const { name, args } = call;
            let functionResult = null;
            let toolName = null;

            if (name === "lookupProfessor") {
                const results = await findProfessorByName(args.name);
                functionResult = results?.[0]; // Get top match
                toolName = "RMP";

                if (!functionResult) {
                    return NextResponse.json({ reply: `I couldn't find a professor named "${args.name}".` });
                }
            }

            if (name === "lookupCourse") {
                const code = args.code.toUpperCase().replace("-", " ");
                if (CODE_MAP.has(code)) {
                    functionResult = CODE_MAP.get(code);
                    toolName = "COURSE";
                } else {
                    return NextResponse.json({ reply: `I couldn't find course details for "${code}".` });
                }
            }

            if (name === "searchReddit") {
                try {
                    console.log(`Reddit Scraper: Searching for "${args.query}" in context of "${args.course}"`);
                    const posts = await scrapeReddit(args.course, args.query);

                    if (posts && posts.length > 0) {
                        functionResult = {
                            answer: "Based on recent Reddit discussions:",
                            sources: posts
                        };
                        toolName = "REDDIT";
                    } else {
                        return NextResponse.json({ reply: `I checked Reddit for "${args.course}" but didn't find any relevant discussions.` });
                    }
                } catch (e) {
                    console.error("Reddit Scraping Failed:", e);
                    return NextResponse.json({ reply: "I tried searching Reddit but hit a snag." });
                }
            }

            // --- Multi-turn: Send Tool Result Back to AI ---
            // Construct the function response part
            const functionResponsePart = {
                functionResponse: {
                    name: name,
                    response: { result: functionResult } // Wrap in object
                }
            };

            // Get the AI's summary based on the tool output
            const result2 = await retryWithBackoff(() => chat.sendMessage([functionResponsePart]));
            const response2 = await result2.response;

            return NextResponse.json({
                reply: response2.text(), // The natural language summary
                tool: toolName,           // The tool used (for UI card)
                data: functionResult      // The raw data (for UI card)
            });
        }

        // Default Text Response (No Tool)
        return NextResponse.json({ reply: response.text() });

    } catch (error) {
        console.error("Gemini Error:", error);
        return NextResponse.json({ reply: "My AI brain hit a snag. Try again!" }, { status: 500 });
    }
}
