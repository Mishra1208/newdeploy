async function testRMP() {
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
            }
          }
        }
      }
    }
    `;

    const variables = {
        count: 5,
        query: {
            text: "Kerly Titus",
            schoolID: "U2Nob29sLTE0MjA="
        }
    };

    try {
        const response = await fetch("https://www.ratemyprofessors.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic dGVzdDp0ZXN0" 
            },
            body: JSON.stringify({ query, variables })
        });
        const data = await response.json();
        console.log("Results for Kerly Titus:", JSON.stringify(data.data.search.teachers.edges, null, 2));
    } catch (e) {
        console.error(e);
    }
}
testRMP();
