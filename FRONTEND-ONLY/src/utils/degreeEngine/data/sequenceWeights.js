// A priority map that simulates the Concordia BCompSc Sequence
// Lower number = higher priority (placed earlier in the topological DAG)

export const BCompSc_Weights = {
    // ECP / Foundation Math (If applicable)
    "MATH 203": 1,
    "MATH 204": 1,
    "MATH 205": 5,

    // Year 1 - Fall (90-credit start)
    "COMP 232": 10,
    "COMP 248": 10,
    
    // Year 1 - Winter
    "COMP 228": 20,
    "COMP 233": 20,
    "COMP 249": 20,
    "ENCS 282": 20,

    // Year 2 - Fall
    "COMP 348": 30,
    "COMP 352": 30,

    // Year 2 - Winter
    "COMP 346": 40,

    // Year 3 - Fall
    "COMP 335": 50,
    "COMP 354": 50,

    // Year 3 - Winter
    "ENCS 393": 60,

    // Elective spreading
    "Math Elective 1": 15,
    "Math Elective 2": 25,
    "CS Elective 1": 45,
    "CS Elective 2": 55,
    "CS Elective 3": 65,
    "CS Elective 4": 70,
    "CS Elective 5": 75,
    "CS Elective 6": 80,
    
    "General Elective 1": 15,
    "General Elective 2": 25,
    "General Elective 3": 35,
    "General Elective 4": 45,
    "General Elective 5": 55,
    "General Elective 6": 65,
    "General Elective 7": 75,
    "General Elective 8": 85,
    "General Elective 9": 95,

    // Default weight for anything not specified
    "DEFAULT": 999 
};
