import { NextResponse } from "next/server";
import { scrapeDeepDetails } from "../../../../../scraper/concordiaScraper";

export async function POST(req) {
    try {
        const { term, subject, number, classId } = await req.json();

        if (!term || !subject || !number || !classId) {
            return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
        }

        console.log(`📡 [API] Deep Fetch Request: ${subject} ${number} (${classId}) for Term ${term}`);
        
        const data = await scrapeDeepDetails(term, subject, number, classId);

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error) {
        console.error("❌ [API] Deep Fetch Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to fetch deep details"
        }, { status: 500 });
    }
}
