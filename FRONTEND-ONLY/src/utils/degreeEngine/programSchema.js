export const BCompSc_Schema = {
  program: "Bachelor of Computer Science",
  totalCredits: 90,
  buckets: [
    {
      id: "CS_CORE",
      title: "Computer Science Core",
      requiredCredits: 33,
      type: "STRICT",
      courses: [
        "COMP 228", "COMP 232", "COMP 233", "COMP 248", 
        "COMP 249", "COMP 335", "COMP 346", "COMP 348", 
        "COMP 352", "COMP 354"
      ],
      description: "Mandatory system architecture and software engineering backbone."
    },
    {
      id: "CS_COMPLEMENTARY",
      title: "Complementary Core",
      requiredCredits: 6,
      type: "STRICT",
      courses: ["ENCS 282", "ENCS 393"],
      description: "Mandatory ethics and writing courses."
    },
    {
      id: "AI_ELECTIVES",
      title: "Artificial Intelligence Electives",
      requiredCredits: 4,
      type: "CHOOSE_LIST",
      courses: ["COMP 432", "COMP 472", "COMP 473", "COMP 474", "COMP 479"],
      description: "Choose AI specialized topics."
    },
    {
      id: "MATH_ELECTIVES",
      title: "Mathematics Electives",
      requiredCredits: 6,
      type: "CHOOSE_LIST",
      courses: [
        "COMP 339", "COMP 361", "COMP 367", "ENGR 213", 
        "ENGR 233", "MAST 218", "MAST 219", "MAST 324", 
        "MAST 332", "MAST 334", "MATH 251", "MATH 252", 
        "MATH 339", "MATH 392"
      ],
      description: "Choose 6 credits of Mathematics."
    },
    {
      id: "CS_ELECTIVES",
      title: "Computer Science Electives",
      requiredCredits: 14,
      type: "REGEX_MATCH",
      regex: /^COMP\s(3[2-9][5-9]|3[3-9]\d|4\d\d)$/i, // Roughly COMP courses >= 325
      whitelist: [
        "ENGR 490", "SOEN 287", "SOEN 321", "SOEN 331", 
        "SOEN 357", "SOEN 387", "SOEN 422", "SOEN 423", 
        "SOEN 471", "SOEN 487"
      ],
      description: "Any COMP course 325 or higher, or selected SOEN courses."
    },
    {
      id: "GENERAL_ELECTIVES",
      title: "General Electives",
      requiredCredits: 27,
      type: "OPEN",
      description: "Any university course outside the strictly prohibited lists."
    }
  ]
};

// If a student is ECP, they get a custom prepended bucket
export const ECP_Bucket = {
    id: "EXTENDED_CREDIT_PROGRAM",
    title: "Extended Credit Program (ECP)",
    requiredCredits: 30,
    type: "STRICT_ECP",
    courses: [
        "MATH 203", "MATH 204", "MATH 205", 
        "PHYS 204", "PHYS 205", "CHEM 205"
    ],
    description: "The 30 extra credits required for out-of-province/international students."
};
