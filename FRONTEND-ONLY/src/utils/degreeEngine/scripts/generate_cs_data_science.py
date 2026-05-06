import json

prog_data = {
    "program": "Computer Science - Data Science (BCompSc)",
    "totalCredits": 90.0,
    "requirements": [
        {
            "category": "Computer Science Core",
            "credits": 33.0,
            "courses": [
                "COMP 228", "COMP 232", "COMP 248", "COMP 249", "COMP 335",
                "COMP 346", "COMP 348", "COMP 352", "COMP 354", "MAST 221"
            ]
        },
        {
            "category": "Computer Science Complementary Core",
            "credits": 6.0,
            "courses": [
                "ENCS 282", "ENCS 393"
            ]
        },
        {
            "category": "Data Science Courses",
            "credits": 16.0,
            "courses": [
                "COMP 353", "COMP 432", "COMP 433", "SOEN 471"
            ]
        },
        {
            "category": "Mathematics and Statistics Core",
            "credits": 18.0,
            "courses": [
                "MAST 218", "MAST 234", "MAST 333", "MAST 334", "MAST 387", "STAT 280"
            ]
        },
        {
            "category": "Computer Science Electives",
            "credits": 6.0,
            "electiveSlots": [
                {
                    "name": "Computer Science Elective",
                    "credits": 6.0,
                    "list": [
                        "COMP 333", "COMP 345", "COMP 371", "COMP 376", "COMP 425", "COMP 438", "COMP 472", 
                        "COMP 473", "COMP 474", "COMP 475", "COMP 476", "COMP 477", "COMP 479", 
                        "SOEN 287", "SOEN 321", "SOEN 331", "SOEN 357", "SOEN 387", "SOEN 422", "SOEN 423", "SOEN 487"
                    ]
                }
            ]
        },
        {
            "category": "General Electives",
            "credits": 11.0,
            "electiveSlots": [
                {
                    "name": "General Elective",
                    "credits": 11.0,
                    "list": []
                }
            ]
        }
    ],
    "courses": {
        "COMP 228": {"title": "System Hardware", "credits": 3.0, "prerequisites": [["MATH 203", "MATH 204"]], "corequisites": []},
        "COMP 232": {"title": "Mathematics for Computer Science", "credits": 3.0, "prerequisites": [["MATH 203", "MATH 204"]], "corequisites": []},
        "COMP 248": {"title": "Object-Oriented Programming I", "credits": 3.5, "prerequisites": [["MATH 204"]], "corequisites": []},
        "COMP 249": {"title": "Object-Oriented Programming II", "credits": 3.5, "prerequisites": [["COMP 248", "MATH 203"]], "corequisites": [["MATH 205"]]},
        "COMP 335": {"title": "Introduction to Theoretical Computer Science", "credits": 3.0, "prerequisites": [["COMP 232", "COMP 249"]], "corequisites": []},
        "COMP 346": {"title": "Operating Systems", "credits": 4.0, "prerequisites": [["COMP 228", "SOEN 228"], ["COMP 352"]], "corequisites": []},
        "COMP 348": {"title": "Principles of Programming Languages", "credits": 3.0, "prerequisites": [["COMP 249"]], "corequisites": []},
        "COMP 352": {"title": "Data Structures and Algorithms", "credits": 3.0, "prerequisites": [["COMP 232", "COMP 249"]], "corequisites": []},
        "COMP 354": {"title": "Introduction to Software Engineering", "credits": 4.0, "prerequisites": [["COMP 352"], ["ENCS 282"]], "corequisites": []},
        "ENCS 282": {"title": "Technical Writing and Communication", "credits": 3.0, "prerequisites": [], "corequisites": []},
        "ENCS 393": {"title": "Social and Ethical Dimensions of Information and Communication Technologies", "credits": 3.0, "prerequisites": [["ENCS 282"]], "corequisites": []},
        "COMP 353": {"title": "Databases", "credits": 4.0, "prerequisites": [["COMP 232", "COMP 249"]], "corequisites": []},
        "COMP 432": {"title": "Machine Learning", "credits": 4.0, "prerequisites": [["COMP 352"]], "corequisites": []},
        "COMP 433": {"title": "Introduction to Deep Learning", "credits": 4.0, "prerequisites": [["COMP 432"]], "corequisites": []},
        "SOEN 471": {"title": "Big Data Analytics", "credits": 4.0, "prerequisites": [["COMP 352", "COMP 353"]], "corequisites": []},
        "MAST 218": {"title": "Multivariable Calculus I", "credits": 3.0, "prerequisites": [["MATH 204", "MATH 205"]], "corequisites": []},
        "MAST 221": {"title": "Applied Probability", "credits": 3.0, "prerequisites": [["MATH 204", "MATH 205"]], "corequisites": []},
        "MAST 234": {"title": "Linear Algebra and Applications I", "credits": 3.0, "prerequisites": [["MATH 204"]], "corequisites": []},
        "MAST 333": {"title": "Applied Statistics", "credits": 3.0, "prerequisites": [["MAST 221", "ENGR 371", "STAT 249"]], "corequisites": []},
        "MAST 334": {"title": "Numerical Analysis", "credits": 3.0, "prerequisites": [["MATH 252", "MAST 234", "MATH 205", "COMP 248"]], "corequisites": []},
        "MAST 387": {"title": "Data Science Lab", "credits": 3.0, "prerequisites": [["STAT 280", "MAST 333"]], "corequisites": []},
        "STAT 280": {"title": "Introduction to Statistical Programming", "credits": 3.0, "prerequisites": [["MATH 203", "MATH 204"]], "corequisites": []}
    },
    "sequence": {
        "september": [
            ["COMP 248", "COMP 232", "MAST 218", "MAST 234"], # Sem 1
            ["COMP 249", "COMP 228", "MAST 221", "STAT 280"], # Sem 2
            ["COMP 352", "COMP 348", "MAST 333", "ENCS 282", "General Elective 1"], # Sem 3
            ["COMP 346", "COMP 353", "MAST 334", "COMP 335", "General Elective 2"], # Sem 4
            ["COMP 354", "COMP 432", "MAST 387", "ENCS 393", "General Elective 3"], # Sem 5
            ["COMP 433", "SOEN 471", "Computer Science Elective 1", "Computer Science Elective 2", "General Elective 4"] # Sem 6
        ]
    }
}

import json as json_lib
with open('src/utils/degreeEngine/data/programs/computer-science-data-science.json', 'w') as f:
    json_lib.dump(prog_data, f, indent=2)

print("Generated computer-science-data-science.json")
