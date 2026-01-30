import { NextResponse } from "next/server";
import { findProfessorByName } from "@/lib/rmp";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
        return NextResponse.json({ error: "Missing professor name" }, { status: 400 });
    }

    try {
        const results = await findProfessorByName(name);

        if (!results || results.length === 0) {
            return NextResponse.json({
                count: 0,
                top: null,
                others: [],
                school: "Concordia University"
            });
        }

        // Scoring logic (similar to backend but simplified for GraphQL)
        const nameLc = name.toLowerCase();
        const scored = results.map(r => {
            let score = 0;
            const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
            if (fullName === nameLc) score += 3;
            else if (fullName.startsWith(nameLc)) score += 2;
            else if (fullName.includes(nameLc)) score += 1;

            if (r.numRatings > 0) score += 1;
            return { score, r };
        }).sort((a, b) => b.score - a.score);

        const top = scored[0].r;
        const others = scored.slice(1).map(s => s.r);

        return NextResponse.json({
            count: scored.length,
            top,
            others,
            school: "Concordia University"
        });

    } catch (error) {
        console.error("RMP Direct Fetch Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch from RateMyProfessors" },
            { status: 500 }
        );
    }
}
