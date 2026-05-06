import json

prog_data = {
    "program": "Industrial Engineering (BEng)",
    "totalCredits": 120.0,
    "requirements": [
        {
            "category": "Engineering Core",
            "credits": 27.0,
            "courses": [
                "ENCS 282", "ENGR 201", "ENGR 202", "ENGR 213", 
                "ENGR 233", "ENGR 301", "ENGR 371", "ENGR 391", "ENGR 392"
            ]
        },
        {
            "category": "General Education Humanities and Social Sciences Elective",
            "credits": 3.0,
            "courses": [
                "ACCO 220"
            ]
        },
        {
            "category": "Industrial Engineering Core",
            "credits": 81.0,
            "courses": [
                "ENGR 245", "ENGR 251", "ENGR 311", "INDU 211", "INDU 311", "INDU 320", 
                "INDU 321", "INDU 323", "INDU 324", "INDU 330", "INDU 342", "INDU 371", 
                "INDU 372", "INDU 412", "INDU 421", "INDU 423", "INDU 490", "MIAE 211", 
                "MIAE 215", "MIAE 221", "MIAE 311", "MIAE 312", "MIAE 313", "MIAE 380", 
                "MIAE 383"
            ]
        },
        {
            "category": "Industrial Engineering Elective",
            "credits": 12.0,
            "electiveSlots": [
                {
                    "name": "Industrial Engineering Elective",
                    "credits": 12.0,
                    "list": [
                        "INDU 410", "INDU 411", "INDU 424", "INDU 431", "INDU 441", 
                        "INDU 466", "INDU 475", "INDU 480", "INDU 498", "BANA 478", 
                        "BTM 480", "ENGR 411", "ENGR 412", "MANA 300"
                    ]
                }
            ]
        }
    ],
    "courses": {
        "INDU 211": {"credits": 3.0, "prerequisites": [], "corequisites": []},
        "INDU 311": {"credits": 3.5, "prerequisites": [["ENGR 371"]], "corequisites": []},
        "INDU 320": {"credits": 3.0, "prerequisites": [["INDU 323"]], "corequisites": []},
        "INDU 321": {"credits": 3.0, "prerequisites": [["INDU 320"]], "corequisites": []},
        "INDU 323": {"credits": 3.5, "prerequisites": [["ENGR 213", "ENGR 233"], ["INDU 211"], ["MIAE 215"]], "corequisites": []},
        "INDU 324": {"credits": 3.5, "prerequisites": [["INDU 323"]], "corequisites": []},
        "INDU 330": {"credits": 3.0, "prerequisites": [["ENCS 282", "ENGR 301"]], "corequisites": []},
        "INDU 342": {"credits": 3.0, "prerequisites": [["INDU 324"]], "corequisites": []},
        "INDU 371": {"credits": 3.0, "prerequisites": [["ENGR 371"]], "corequisites": []},
        "INDU 372": {"credits": 3.0, "prerequisites": [["ENGR 371"]], "corequisites": []},
        "INDU 412": {"credits": 3.5, "prerequisites": [["ENGR 371"]], "corequisites": []},
        "INDU 421": {"credits": 3.5, "prerequisites": [["INDU 320", "INDU 311"]], "corequisites": []},
        "INDU 423": {"credits": 3.5, "prerequisites": [["INDU 320"]], "corequisites": []},
        "INDU 490": {"credits": 6.0, "prerequisites": [["ENGR 301"], ["MIAE 380"], ["INDU 421"]], "corequisites": []},
        "MIAE 211": {"credits": 3.5, "prerequisites": [], "corequisites": []},
        "MIAE 215": {"credits": 3.5, "prerequisites": [["MATH 204"]], "corequisites": []},
        "MIAE 221": {"credits": 3.0, "prerequisites": [["CHEM 205"]], "corequisites": []},
        "MIAE 311": {"credits": 3.0, "prerequisites": [["MIAE 313"]], "corequisites": []},
        "MIAE 312": {"credits": 1.0, "prerequisites": [["MIAE 311"]], "corequisites": []},
        "MIAE 313": {"credits": 3.5, "prerequisites": [["MIAE 211"]], "corequisites": []},
        "MIAE 380": {"credits": 3.0, "prerequisites": [["ENCS 282"], ["MIAE 211"]], "corequisites": []},
        "MIAE 383": {"credits": 3.5, "prerequisites": [["ENGR 371"], ["MIAE 215"]], "corequisites": []},
        "ACCO 220": {"credits": 3.0, "prerequisites": [], "corequisites": []}
    },
    "sequence": {
        "september": [
            ["ENGR 213", "MIAE 215", "MIAE 211", "ENGR 201", "ENGR 202"],
            ["ENGR 233", "ENGR 245", "ENGR 251", "INDU 211", "ENCS 282"],
            ["ENGR 311", "ENGR 371", "MIAE 221", "MIAE 313", "ACCO 220"],
            ["INDU 323", "MIAE 311", "INDU 371", "ENGR 391", "INDU 372"],
            ["INDU 311", "INDU 320", "INDU 324", "MIAE 380", "MIAE 312"],
            ["INDU 321", "INDU 342", "INDU 412", "MIAE 383", "ENGR 301"],
            ["INDU 421", "INDU 423", "INDU 330", "ENGR 392", "Industrial Engineering Elective 1"],
            ["INDU 490", "Industrial Engineering Elective 2", "Industrial Engineering Elective 3", "Industrial Engineering Elective 4"]
        ]
    }
}

import json as json_lib
with open('src/utils/degreeEngine/data/programs/indu-eng.json', 'w') as f:
    json_lib.dump(prog_data, f, indent=2)

print("Generated indu-eng.json")
