import pkg from '@mtucourses/rate-my-professors';

async function findSchool() {
    try {
        const searchSchool = pkg.default.searchSchool;
        const schools = await searchSchool('Concordia University');
        console.log("Found schools:", JSON.stringify(schools, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

findSchool();
