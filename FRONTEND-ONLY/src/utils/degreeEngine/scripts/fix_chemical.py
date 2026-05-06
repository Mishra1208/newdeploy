import json

path = '/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/src/utils/degreeEngine/data/programs/chemical.json'
with open(path, 'r') as f:
    data = json.load(f)

titles_path = '/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/src/utils/degreeEngine/data/courseTitles.json'
with open(titles_path, 'r') as f:
    courseTitles = json.load(f)

# Correct prerequisites map
prereqs = {
    "CHME 200": ([], []),
    "CHME 201": (["CHME 200"], []),
    "CHME 214": (["MATH 204"], []),
    "CHME 215": ([], []),
    "CHME 216": (["CHME 215"], []),
    "CHME 220": (["MIAE 221"], []),
    "CHME 240": ([], ["CHME 200"]),
    "CHME 300": (["CHME 200"], []),
    "CHME 301": (["CHME 200"], []),
    "CHME 316": (["CHME 216"], []),
    "CHME 320": (["CHME 220"], []),
    "CHME 321": (["CHME 320"], []),
    "CHME 330": (["CHME 301"], []),
    "CHME 340": (["CHME 240"], []),
    "CHME 351": (["ENGR 251"], []),
    "CHME 352": (["CHME 351"], []),
    "CHME 360": (["CHME 351"], []),
    "CHME 361": (["CHME 360"], []),
    "CHME 362": (["CHME 361"], []),
    "CHME 390": (["CHME 201"], []),
    "CHME 415": (["CHME 215"], []),
    "CHME 440": (["CHME 330"], []),
    "CHME 470": (["CHME 301"], []),
    "CHME 490": (["CHME 390"], []),
    "CHEM 221": (["CHEM 205", "CHEM 206"], []),
    "ENGR 245": (["PHYS 204"], ["ENGR 213"]),
    "ENGR 251": (["MATH 203"], []),
    "ENGR 311": (["ENGR 213", "ENGR 233"], []),
    "ENGR 361": (["ENGR 213", "ENGR 233", "ENGR 251"], []),
    "MIAE 221": (["CHEM 205"], []),
    "MATH 203": ([], []),
    "MATH 204": ([], []),
    "MATH 205": (["MATH 203"], []),
    "PHYS 204": (["MATH 203"], []),
    "PHYS 205": (["MATH 205", "PHYS 204"], []),
    "CHEM 205": ([], []),
    "CHEM 206": (["CHEM 205"], []),
}

for course, (p, c) in prereqs.items():
    if course not in data['courses']:
        data['courses'][course] = {"title": courseTitles.get(course, course), "credits": 3.0}
    
    data['courses'][course]['prerequisites'] = [[x] for x in p]
    data['courses'][course]['corequisites'] = [[x] for x in c]

# Fix CHME 490 credits
if "CHME 490" in data['courses']:
    data['courses']["CHME 490"]["credits"] = 6.0

with open(path, 'w') as f:
    json.dump(data, f, indent=2)

print("Updated chemical.json prerequisites and credits.")
