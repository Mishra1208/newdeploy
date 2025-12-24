export function extractPrereqs(text) {
    if (!text) return [];

    // 1. Normalize
    const raw = String(text).toUpperCase().replace(/\./g, " "); // remove dots to avoid "COMP 248." issues

    // 2. Scan for "SUBJ 123" patterns
    //    Matches:  (3-4 letters) (whitespace) (3-4 digits/chars)
    const regex = /([A-Z]{3,4})\s+([0-9]{3,4}[A-Z]?)/g;

    const found = [];
    let m;
    while ((m = regex.exec(raw)) !== null) {
        // e.g. ["COMP 248", "COMP", "248"]
        const subj = m[1];
        const cat = m[2];

        // minimal filtering to avoid noise usually found in descriptions
        // valid subjects should be in our known list, but for now we just take the pattern
        found.push(`${subj}-${cat}`);
    }

    // 3. De-duplicate
    return [...new Set(found)];
}

export function buildGraphData(coursesDB, rootId) {
    // coursesDB: Array of { subject, catalogue, prereqdescription, ... }
    // rootId: "COMP-352"

    const nodes = [];
    const edges = [];
    const visited = new Set();

    // Helper to find a course object
    const findCourse = (id) => coursesDB.find(c => `${c.subject}-${c.catalogue}` === id);

    const stack = [rootId];
    while (stack.length > 0) {
        const currId = stack.pop();
        if (visited.has(currId)) continue;
        visited.add(currId);

        const course = findCourse(currId);
        if (!course) {
            // Node exists as a dependency but not in our DB (or just a code mentioned)
            // We still add a node so the tree isn't broken
            nodes.push({ id: currId, data: { label: currId, exists: false } });
            continue;
        }

        // Add Node
        const isRoot = currId === rootId;
        nodes.push({
            id: currId,
            data: {
                label: `${course.subject} ${course.catalogue}`,
                title: course.title,
                exists: true,
                category: isRoot ? 'target' : 'prereq'
            }
        });

        // Find Parents (Prerequisites)
        const parents = extractPrereqs(course.prereqdescription).filter(p => p !== currId);
        for (const p of parents) {
            edges.push({ id: `${p}->${currId}`, source: p, target: currId });
            stack.push(p);
        }
    }

    // Find Children (Who requires currId?)
    // NOTE: This usually requires scanning the whole DB. 
    // For performance, we might limit this depth or do it only for the root.
    // For the MVP, let's just do "Parents" (Tree going UP), 
    // and maybe immediate Children (Tree going DOWN) for the root only.

    const rootChildren = coursesDB.filter(c => {
        const reqs = extractPrereqs(c.prereqdescription);
        return reqs.includes(rootId);
    });

    for (const child of rootChildren) {
        const childId = `${child.subject}-${child.catalogue}`;
        // Add Child Node
        if (!visited.has(childId)) {
            visited.add(childId); // prevent duplicates
            nodes.push({
                id: childId,
                data: {
                    label: `${child.subject} ${child.catalogue}`,
                    title: child.title,
                    exists: true,
                    category: 'unlock'
                }
            });
            edges.push({ id: `${rootId}->${childId}`, source: rootId, target: childId });
            // We don't recurse down for now to keep the graph manageable
        }
    }

    return { nodes, edges };
}
