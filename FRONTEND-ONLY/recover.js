const fs = require('fs');
const content = fs.readFileSync('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/.next/dev/static/chunks/src_fa3f37cb._.js.map', 'utf8');

const lines = content.split('\n');
for (const line of lines) {
    if (line.includes('sourcesContent')) {
        try {
            const startIdx = line.indexOf('{');
            let jsonStr = line.substring(startIdx);
            if (!jsonStr.endsWith('}')) {
                jsonStr = jsonStr.substring(0, jsonStr.lastIndexOf('}') + 1);
            }
            const data = JSON.parse(jsonStr);
            if (data.map && data.map.sources && data.map.sources[0].includes('src/app/pages/degree-tracker/page.jsx')) {
                fs.writeFileSync('/Users/narendramishra/PROJECTMAIN/frontend2/FRONTEND-ONLY/src/app/pages/degree-tracker/page.jsx', data.map.sourcesContent[0]);
                console.log("Recovered the correct file!");
                break;
            }
        } catch(e) {}
    }
}
