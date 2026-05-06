import json

prog_data = {
    "program": "Cybersecurity (BSc)",
    "totalCredits": 90.0,
    "requirements": [
        {
            "category": "Cybersecurity Core",
            "credits": 22.5,
            "courses": [
                "INSE 201", "INSE 221", "INSE 331", "INSE 349", "INSE 351", "INSE 386", "INSE 413", "INSE 445"
            ]
        },
        {
            "category": "Cybersecurity Complementary Core",
            "credits": 27.0,
            "courses": [
                "COMP 228", "COMP 232", "COMP 248", "COMP 249", "COMP 346", "COMP 352", "COMP 445", "ENCS 282"
            ]
        },
        {
            "category": "Cybersecurity Electives",
            "credits": 12.0,
            "electiveSlots": [
                {
                    "name": "Cybersecurity Elective",
                    "credits": 12.0,
                    "list": [
                        "INSE 321", "INSE 387", "INSE 401", "INSE 411", "INSE 412", "INSE 441", "INSE 442", "INSE 452",
                        "INSE 481", "INSE 482", "INSE 483", "INSE 484", "INSE 485", "INSE 486", "INSE 487", "INSE 488",
                        "INSE 490", "INSE 498"
                    ]
                }
            ]
        },
        {
            "category": "Mathematics Electives",
            "credits": 9.0,
            "electiveSlots": [
                {
                    "name": "Mathematics Elective",
                    "credits": 9.0,
                    "list": [
                        "ENGR 213", "ENGR 233", "ENGR 371", "ENGR 391", "MAST 218", "MAST 219", "MAST 221", "MAST 324",
                        "MAST 332", "MAST 333", "MAST 334", "MATH 251", "MATH 252", "MATH 339", "MATH 366", "MATH 392"
                    ]
                }
            ]
        },
        {
            "category": "General Electives",
            "credits": 19.5,
            "electiveSlots": [
                {
                    "name": "General Elective",
                    "credits": 19.5,
                    "list": []
                }
            ]
        }
    ],
    "courses": {
        "INSE 201": {"title": "Security Ethics, Laws, Standards and Compliance", "credits": 1.5, "prerequisites": [], "corequisites": []},
        "INSE 221": {"title": "Cryptography I", "credits": 3.0, "prerequisites": [["COMP 232"]], "corequisites": []},
        "INSE 331": {"title": "Database Security", "credits": 3.0, "prerequisites": [["COMP 249"]], "corequisites": []},
        "INSE 349": {"title": "Secure Programming and Software Design", "credits": 3.0, "prerequisites": [["COMP 249"]], "corequisites": []},
        "INSE 351": {"title": "Operating System Security", "credits": 3.0, "prerequisites": [["COMP 346"]], "corequisites": []},
        "INSE 386": {"title": "Introduction to Cybersecurity Management and Governance", "credits": 3.0, "prerequisites": [["INSE 201"]], "corequisites": []},
        "INSE 413": {"title": "Security Auditing and Compliance", "credits": 3.0, "prerequisites": [["INSE 386"]], "corequisites": []},
        "INSE 445": {"title": "Network Security", "credits": 3.0, "prerequisites": [["COMP 445"]], "corequisites": []}
    },
    "sequence": {
        "september": [
            ["COMP 248", "COMP 232", "INSE 201", "Mathematics Elective 1", "General Elective 1"], # Sem 1
            ["COMP 249", "COMP 228", "INSE 221", "Mathematics Elective 2", "ENCS 282"], # Sem 2
            ["COMP 352", "COMP 346", "INSE 349", "INSE 386", "General Elective 2"], # Sem 3
            ["COMP 445", "INSE 331", "INSE 351", "Mathematics Elective 3", "General Elective 3"], # Sem 4
            ["INSE 413", "INSE 445", "Cybersecurity Elective 1", "General Elective 4", "General Elective 5"], # Sem 5
            ["Cybersecurity Elective 2", "Cybersecurity Elective 3", "Cybersecurity Elective 4", "General Elective 6", "General Elective 7"] # Sem 6
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

with open('src/utils/degreeEngine/data/programs/cybersecurity.json', 'w') as f:
    json_lib.dump(prog_data, f, indent=2)

print("Generated cybersecurity.json")
