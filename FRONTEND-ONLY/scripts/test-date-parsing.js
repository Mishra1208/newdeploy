const dates = [
    "Tue, Sep. 1, 2026",
    "Mon, Jan. 12, 2026",
    "Sun, May 3, 2026"
];

dates.forEach(d => {
    // Logic from icsGenerator.js
    const cleanDateStr = d.replace(/^[A-Za-z]{3},\s+/, '');
    const dateObj = new Date(cleanDateStr);
    console.log(`Input: "${d}" -> Clean: "${cleanDateStr}" -> Parsed: ${dateObj.toString()}`);

    // Check if dot removal is needed
    const cleanNoDot = cleanDateStr.replace('.', '');
    const dateObjNoDot = new Date(cleanNoDot);
    console.log(`Input: "${d}" -> NoDot: "${cleanNoDot}" -> Parsed: ${dateObjNoDot.toString()}`);
});
