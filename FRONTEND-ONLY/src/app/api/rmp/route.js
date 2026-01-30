import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    // Default to localhost:4000 if env not set
    const COMMUNITY_API = process.env.COMMUNITY_API_URL || "http://localhost:4000";

    if (!name) {
        return NextResponse.json({ error: "Missing professor name" }, { status: 400 });
    }

    try {
        const targetUrl = new URL("/api/rmp", COMMUNITY_API);
        targetUrl.searchParams.set("name", name);

        // Forward request to backend server
        const response = await fetch(targetUrl.toString(), {
            headers: {
                "Content-Type": "application/json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Backend responded with ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("RMP Proxy Error:", error);
        return NextResponse.json(
            { error: "Failed to connect to community server" },
            { status: 502 }
        );
    }
}
