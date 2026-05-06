import json

prog_data = {
    "program": "Computer Science – Computation Arts (BCompSc)",
    "totalCredits": 90.0,
    "requirements": [
        {
            "category": "Computer Science Core",
            "credits": 33.0,
            "courses": [
                "COMP 228", "COMP 232", "COMP 233", "COMP 248", "COMP 249", 
                "COMP 335", "COMP 346", "COMP 348", "COMP 352", "COMP 354"
            ]
        },
        {
            "category": "Joint Major Required Courses",
            "credits": 12.0,
            "courses": [
                "COMP 345", "COMP 371", "ENCS 282", "ENGR 411"
            ]
        },
        {
            "category": "Computation Arts Core",
            "credits": 24.0,
            "courses": [
                "FFAR 248", "FFAR 249", "CART 210", "CART 211", "CART 212", "CART 214", "CART 310", "CART 470"
            ]
        },
        {
            "category": "Computation Arts Electives",
            "credits": 21.0,
            "electiveSlots": [
                {
                    "name": "300-level CART Elective",
                    "credits": 6.0,
                    "list": ["CART 315", "CART 345", "CART 346", "CART 347", "CART 351", "CART 353", "CART 360", "CART 370", "CART 398"]
                },
                {
                    "name": "400-level CART Elective",
                    "credits": 9.0,
                    "list": ["CART 411", "CART 412", "CART 414", "CART 415", "CART 416", "CART 433", "CART 444", "CART 453", "CART 455", "CART 460", "CART 498"]
                },
                {
                    "name": "Fine Arts Elective",
                    "credits": 6.0,
                    "list": ["DART 221", "DART 261", "DART 280", "DART 298", "DART 331", "DART 335", "DART 380", "DART 398", "ARTH 200", "ARTH 300"]
                }
            ]
        }
    ],
    "courses": {
        "FFAR 248": {"title": "Keywords: Engaging Across Disciplines in the Fine Arts", "credits": 3.0, "prerequisites": [], "corequisites": []},
        "FFAR 249": {"title": "Keywords: Working Across Disciplines in the Fine Arts", "credits": 3.0, "prerequisites": [], "corequisites": []},
        "CART 210": {"title": "New Media Theory", "credits": 3.0, "prerequisites": [], "corequisites": []},
        "CART 211": {"title": "Creative Computing and Network Culture", "credits": 3.0, "prerequisites": [], "corequisites": []},
        "CART 212": {"title": "Digital Media Studio", "credits": 3.0, "prerequisites": [], "corequisites": []},
        "CART 214": {"title": "Visual Form and Communication", "credits": 3.0, "prerequisites": [], "corequisites": []},
        "CART 310": {"title": "Interaction Design Studio", "credits": 3.0, "prerequisites": [["CART 210", "CART 211", "CART 212"]], "corequisites": []},
        "CART 470": {"title": "Capstone: Prototyping", "credits": 3.0, "prerequisites": [["CART 310"]], "corequisites": []},
        "ENGR 411": {"title": "Special Technical Report", "credits": 1.0, "prerequisites": [["ENCS 282"]], "corequisites": []}
    },
    "sequence": {
        "september": [
            ["COMP 248", "COMP 232", "CART 211", "CART 212", "FFAR 248"], 
            ["COMP 249", "COMP 228", "CART 210", "CART 214", "FFAR 249"], 
            ["COMP 352", "COMP 233", "ENCS 282", "CART 310", "300-level CART Elective 1"], 
            ["COMP 346", "COMP 348", "300-level CART Elective 2", "Fine Arts Elective 1", "Fine Arts Elective 2"], 
            ["COMP 335", "COMP 354", "COMP 345", "COMP 371", "400-level CART Elective 1"], 
            ["CART 470", "ENGR 411", "400-level CART Elective 2", "400-level CART Elective 3"] 
        ]
    }
}

import json as json_lib
try:
    major = json_lib.load(open('src/utils/degreeEngine/computerScienceCurriculum.json'))
    for course, data in major['courses'].items():
        if course not in prog_data['courses']:
            prog_data['courses'][course] = data
except Exception as e:
    print("Error loading major:", e)

with open('src/utils/degreeEngine/data/programs/computer-science-computation-arts.json', 'w') as f:
    json_lib.dump(prog_data, f, indent=2)

print("Generated computer-science-computation-arts.json")
