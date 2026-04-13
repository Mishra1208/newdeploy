// A priority map that simulates the Concordia BCompSc Sequence
// Lower number = higher priority (placed earlier in the topological DAG)

export const BCompSc_Weights = {
    // ECP / Year 1
    "MATH 203": 10,
    "MATH 204": 10,
    "PHYS 204": 10,
    "CHEM 205": 10, // Some intake combinations differ
    
    "COMP 248": 15,
    
    "MATH 205": 20,
    "PHYS 205": 20,
    "COMP 232": 25,
    "COMP 249": 25,

    // Year 2 Core
    "COMP 228": 30,
    "ENCS 282": 30,
    "COMP 352": 35,
    
    "COMP 335": 40,
    "COMP 346": 40,
    "ENCS 393": 45,

    // Year 3 Core
    "COMP 348": 50,
    "COMP 354": 50,

    // Placeholders fallback sequence weights (we want electives to spread out, generally higher numbers)
    "CS_COMPLEMENTARY_PLACEHOLDER_0": 60,
    "CS_COMPLEMENTARY_PLACEHOLDER_1": 65,

    "MATH_ELECTIVES_PLACEHOLDER_0": 45,
    "MATH_ELECTIVES_PLACEHOLDER_1": 55,

    "AI_ELECTIVES_PLACEHOLDER_0": 70,

    // Push General Electives as filler into later years generally, but DAG will pull them if under 15 credits
    "GENERAL_ELECTIVES_PLACEHOLDER_0": 40,
    "GENERAL_ELECTIVES_PLACEHOLDER_1": 50,
    "GENERAL_ELECTIVES_PLACEHOLDER_2": 60,
    "GENERAL_ELECTIVES_PLACEHOLDER_3": 70,
    "GENERAL_ELECTIVES_PLACEHOLDER_4": 80,
    "GENERAL_ELECTIVES_PLACEHOLDER_5": 85,
    "GENERAL_ELECTIVES_PLACEHOLDER_6": 90,
    "GENERAL_ELECTIVES_PLACEHOLDER_7": 95,
    "GENERAL_ELECTIVES_PLACEHOLDER_8": 100,

    // Default weight for anything not specified
    "DEFAULT": 999 
};
