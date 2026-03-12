import { NextResponse } from 'next/server';

const CONCORDIA_SCHOOL_IDS = ["U2Nob29sLTE0MjA=", "U2Nob29sLTE0MjI=", "U2Nob29sLTE4NDQz"];

// Basic string matching to find the best professor from the search results
function calculateMatchScore(prof, searchName) {
    const searchNameLower = searchName.toLowerCase().trim();
    const profFirstNameLower = prof.firstName.toLowerCase();
    const profLastNameLower = prof.lastName.toLowerCase();
    const profFullNameLower = `${profFirstNameLower} ${profLastNameLower}`;
    const profFullNameLowerRev = `${profLastNameLower} ${profFirstNameLower}`;

    if (profFullNameLower === searchNameLower || profFullNameLowerRev === searchNameLower) return 100;

    let score = 0;
    const searchParts = searchNameLower.split(' ');
    for (const part of searchParts) {
        if (profFirstNameLower.includes(part)) score += 10;
        if (profLastNameLower.includes(part)) score += 10;
        // Exact last name match is weighted heavily
        if (profLastNameLower === part) score += 30;
    }
    return score;
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    console.log(`[RMP API] Searching for: "${name}"`);

    if (!name) {
        return NextResponse.json({ success: false, error: "Missing 'name' query parameter" }, { status: 400 });
    }

    const query = `
    query TeacherSearchPaginationQuery($count: Int!, $query: TeacherSearchQuery!) {
      search: newSearch {
        teachers(query: $query, first: $count) {
          edges {
            node {
              id
              legacyId
              firstName
              lastName
              department
              avgDifficulty
              avgRating
              numRatings
              wouldTakeAgainPercent
              school {
                name
                id
              }
              ratings(first: 100) {
                edges {
                  node {
                    class
                  }
                }
              }
            }
          }
        }
      }
    }
    `;

    try {
        // Fetch from all known Concordia IDs concurrently
        const fetchPromises = CONCORDIA_SCHOOL_IDS.map(schoolID => {
            const variables = {
                count: 10,
                query: { text: name, schoolID: schoolID }
            };

            return fetch("https://www.ratemyprofessors.com/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // This is the public auth token for RMP's frontend
                    "Authorization": "Basic dGVzdDp0ZXN0"
                },
                body: JSON.stringify({ query, variables })
            }).then(res => res.json()).catch(() => null);
        });

        const results = await Promise.all(fetchPromises);

        let allEdges = [];
        for (const data of results) {
            if (data?.data?.search?.teachers?.edges) {
                allEdges = allEdges.concat(data.data.search.teachers.edges);
            }
        }

        if (allEdges.length === 0) {
            return NextResponse.json({ success: false, error: `No professor results found for "${name}"` }, { status: 404 });
        }

        // Filter and score the results
        const scoredProfs = [];
        for (const edge of allEdges) {
            const node = edge.node;

            // Just double check it's at Concordia
            const schoolName = node.school?.name || "";
            if (!schoolName.toLowerCase().includes("concordia")) continue;

            scoredProfs.push({
                ...node,
                score: calculateMatchScore(node, name),
                link: `https://www.ratemyprofessors.com/professor/${node.legacyId}`
            });
        }

        if (scoredProfs.length === 0) {
            return NextResponse.json({ success: false, error: `No professor found at Concordia for "${name}"` }, { status: 404 });
        }

        // Sort by score descending
        scoredProfs.sort((a, b) => b.score - a.score);

        const bestMatch = scoredProfs[0];

        // If the score is too low, we might be returning a false positive
        if (bestMatch.score === 0) {
            return NextResponse.json({ success: false, error: `No close match found for "${name}"` }, { status: 404 });
        }

        // Extract unique courses from ratings
        const courses = [...new Set(bestMatch.ratings?.edges?.map(r => r.node.class))]
            .filter(c => c && c.length > 2)
            .map(c => c.replace(/([a-zA-Z]+)(\d+)/, '$1 $2').toUpperCase());

        return NextResponse.json({
            success: true,
            data: {
                firstName: bestMatch.firstName,
                lastName: bestMatch.lastName,
                department: bestMatch.department,
                rating: bestMatch.avgRating,
                difficulty: bestMatch.avgDifficulty,
                takesAgain: bestMatch.wouldTakeAgainPercent,
                numRatings: bestMatch.numRatings,
                link: bestMatch.link,
                legacyId: bestMatch.legacyId,
                courses: courses
            }
        });

    } catch (error) {
        console.error("RMP Fetch Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error fetching RMP data" }, { status: 500 });
    }
}
