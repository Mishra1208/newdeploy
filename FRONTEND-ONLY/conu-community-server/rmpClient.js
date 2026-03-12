const { request, gql } = require('graphql-request');

const RMP_ENDPOINT = 'https://www.ratemyprofessors.com/graphql';
const RMP_AUTH_HEADER = 'Basic dGVzdDp0ZXN0'; // Public basic auth for RMP
const CONCORDIA_ID = 'U2Nob29sLTE4NDQz'; // Concordia University (Montreal) - ID 18443

const SEARCH_TEACHER_QUERY = gql`
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

/**
 * Search for a professor at Concordia and return detailed stats (Rating, Difficulty, etc.)
 * Returns a list of matches.
 */
async function findProfessor(name) {
  try {
    const variables = { text: name, schoolID: CONCORDIA_ID };
    const headers = { Authorization: RMP_AUTH_HEADER };

    const data = await request(RMP_ENDPOINT, SEARCH_TEACHER_QUERY, variables, headers);
    const teachers = data.newSearch.teachers.edges.map(e => {
      const node = e.node;
      // Extract unique courses from ratings
      const courses = [...new Set(node.ratings.edges.map(r => r.node.class))]
        .filter(c => c && c.length > 2)
        .map(c => c.replace(/([a-zA-Z]+)(\d+)/, '$1 $2').toUpperCase()); // Normalize "COMP352" to "COMP 352"

      return {
        ...node,
        courses: courses
      };
    });

    return teachers;

  } catch (error) {
    console.error('RMP GraphQL Error:', error.message);
    throw error;
  }
}

module.exports = { findProfessor };
