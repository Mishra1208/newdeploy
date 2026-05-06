import re

with open('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/.next/dev/static/chunks/src_fa3f37cb._.js.map', 'r') as f:
    text = f.read()

# Find the "sourcesContent":["..."]
match = re.search(r'"sourcesContent":\["(.*?)"\],', text)
if match:
    source = match.group(1).encode('utf-8').decode('unicode_escape')
    with open('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/src/app/pages/degree-tracker/page.jsx', 'w') as f:
        f.write(source)
    print("Recovered!")
else:
    print("Not found.")
