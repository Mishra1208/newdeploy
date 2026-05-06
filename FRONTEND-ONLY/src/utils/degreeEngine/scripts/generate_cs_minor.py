import json

minor_data = {
    "program": "Minor in Computer Science",
    "totalCredits": 25.0,
    "requirements": [
        {
            "category": "Computer Science Minor Core",
            "credits": 16.0,
            "courses": [
                "COMP 228", "COMP 232", "COMP 248", "COMP 249", "COMP 352"
            ]
        },
        {
            "category": "Computer Science Electives",
            "credits": 9.0,
            "electiveSlots": [
                {
                    "name": "Computer Science Elective",
                    "credits": 9.0,
                    "list": [
                        "COMP 318", "COMP 325", "COMP 333", "COMP 335", "COMP 345", "COMP 346", "COMP 348", "COMP 353", "COMP 361", "COMP 371", "COMP 376",
                        "COMP 425", "COMP 426", "COMP 428", "COMP 432", "COMP 433", "COMP 438", "COMP 442", "COMP 444", "COMP 445", "COMP 451", 
                        "COMP 465", "COMP 472", "COMP 473", "COMP 474", "COMP 475", "COMP 476", "COMP 477", "COMP 478", "COMP 479",
                        "SOEN 287", "SOEN 321", "SOEN 331", "SOEN 357", "SOEN 387", "SOEN 422", "SOEN 423", "SOEN 471", "SOEN 487",
                        "MAST 324", "ENGR 490"
                    ]
                }
            ]
        }
    ],
    "courses": {
        "COMP 228": {"title": "System Hardware", "credits": 3.0, "prerequisites": [["MATH 203", "MATH 204"]], "corequisites": []},
        "COMP 232": {"title": "Mathematics for Computer Science", "credits": 3.0, "prerequisites": [["MATH 203", "MATH 204"]], "corequisites": []},
        "COMP 248": {"title": "Object-Oriented Programming I", "credits": 3.5, "prerequisites": [["MATH 204"]], "corequisites": []},
        "COMP 249": {"title": "Object-Oriented Programming II", "credits": 3.5, "prerequisites": [["COMP 248"]], "corequisites": [["MATH 205"]]},
        "COMP 352": {"title": "Data Structures and Algorithms", "credits": 3.0, "prerequisites": [["COMP 232", "COMP 249"]], "corequisites": []},
        
        "MATH 203": {"title": "Differential and Integral Calculus I", "credits": 3.0, "prerequisites": [], "corequisites": []},
        "MATH 204": {"title": "Vectors and Matrices", "credits": 3.0, "prerequisites": [], "corequisites": []},
        "MATH 205": {"title": "Differential and Integral Calculus II", "credits": 3.0, "prerequisites": [["MATH 203"]], "corequisites": []}
    },
    "sequence": {
        "september": [
            ["COMP 248", "COMP 232"], # Sem 1
            ["COMP 249", "COMP 228"], # Sem 2
            ["COMP 352", "Computer Science Elective 1"], # Sem 3
            ["Computer Science Elective 2", "Computer Science Elective 3"] # Sem 4
        ]
    }
}

with open('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/src/utils/degreeEngine/data/programs/computer-science-minor.json', 'w') as f:
    json.dump(minor_data, f, indent=2)

print("Generated computer-science-minor.json")
