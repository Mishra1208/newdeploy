/**
 * RMP GraphQL Utility
 * 
 * Directly queries the RateMyProfessors GraphQL API.
 * This is significantly faster than Puppeteer-based scraping.
 */

const RMP_ENDPOINT = 'https://www.ratemyprofessors.com/graphql';
const RMP_AUTH_HEADER = 'Basic dGVzdDp0ZXN0'; // Standard RMP public auth
const CONCORDIA_ID = 'U2Nob29sLTE4NDQz'; // Concordia University (Montreal)

const SEARCH_QUERY = `
  query NewSearchTeachersQuery($text: String!, $schoolID: ID!) {
    newSearch {
      teachers(query: { text: $text, schoolID: $schoolID }) {
        edges {
          node {
            id
            firstName
            lastName
            department
            avgRating
            numRatings
            avgDifficulty
            wouldTakeAgainPercent
            legacyId
            school {
              id
              name
            }
          }
        }
      }
    }
  }
`;

/**
 * findProfessorByName
 * @param {string} name 
 * @returns {Promise<Array>} List of matching professors
 */
export async function findProfessorByName(name) {
    if (!name) return [];

    try {
        const response = await fetch(RMP_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': RMP_AUTH_HEADER,
            },
            body: JSON.stringify({
                query: SEARCH_QUERY,
                variables: {
                    text: name,
                    schoolID: CONCORDIA_ID
                }
            })
        });

        if (!response.ok) {
            throw new Error(`RMP API responded with ${response.status}`);
        }

        const data = await response.json();
        const teachers = data?.data?.newSearch?.teachers?.edges?.map(e => e.node) || [];

        // Enrich data with standardized fields for frontend compatibility
        return teachers.map(t => ({
            ...t,
            name: `${t.firstName} ${t.lastName}`,
            quality: t.avgRating,
            difficulty: t.avgDifficulty,
            wouldTakeAgain: t.wouldTakeAgainPercent,
            dept: t.department,
            schoolName: t.school?.name,
            url: `https://www.ratemyprofessors.com/professor/${t.legacyId || getLegacyId(t.id)}`
        }));

    } catch (error) {
        console.error("RMP GraphQL Error:", error);
        return [];
    }
}

/**
 * decode RMP ID if legacyId is missing
 */
function getLegacyId(id) {
    if (!id) return null;
    try {
        const decoded = atob(id);
        if (decoded.includes('-')) return decoded.split('-')[1];
    } catch (e) {
        return null;
    }
    return null;
}
