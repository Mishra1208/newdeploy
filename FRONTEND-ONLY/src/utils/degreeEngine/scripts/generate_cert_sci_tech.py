import json

prog_data = {
    "program": "Science and Technology (Cert)",
    "totalCredits": 30.0,
    "requirements": [
        {
            "category": "Core Courses",
            "credits": 9.0,
            "courses": [
                "MATH 203", "MATH 204", "MATH 205"
            ]
        },
        {
            "category": "Science and Technology Electives",
            "credits": 21.0,
            "electiveSlots": [
                {
                    "name": "Science and Technology Elective",
                    "credits": 21.0,
                    "list": [
                        "CHEM 205", "PHYS 204", "PHYS 205",
                        "BCEE 231", "BCEE 371", "BLDG 212", "CIVI 212", "CIVI 231",
                        "COEN 212", "COEN 231", "COEN 243", "COEN 244", "COEN 311",
                        "COMP 228", "COMP 232", "COMP 233", "COMP 248", "COMP 249",
                        "ELEC 242", "ELEC 251", "ELEC 273", "ELEC 275",
                        "ENCS 282", "ENGR 201", "ENGR 202", "ENGR 213", "ENGR 233",
                        "ENGR 242", "ENGR 243", "ENGR 244", "ENGR 245", "ENGR 251", "ENGR 301",
                        "INDU 211", "INDU 330",
                        "MIAE 211", "MIAE 215", "MIAE 313",
                        "SOEN 228", "SOEN 287"
                    ]
                }
            ]
        }
    ],
    "courses": {
        "MATH 203": {"credits": 3.0, "prerequisites": [], "corequisites": []},
        "MATH 204": {"credits": 3.0, "prerequisites": [], "corequisites": []},
        "MATH 205": {"credits": 3.0, "prerequisites": [["MATH 203"]], "corequisites": []}
    },
    "sequence": {
        "september": [
            ["MATH 203", "MATH 204", "Science and Technology Elective 1", "Science and Technology Elective 2", "Science and Technology Elective 3"],
            ["MATH 205", "Science and Technology Elective 4", "Science and Technology Elective 5", "Science and Technology Elective 6", "Science and Technology Elective 7"]
        ]
    }
}

import json as json_lib
with open('src/utils/degreeEngine/data/programs/cert-sci-tech.json', 'w') as f:
    json_lib.dump(prog_data, f, indent=2)

print("Generated cert-sci-tech.json")
