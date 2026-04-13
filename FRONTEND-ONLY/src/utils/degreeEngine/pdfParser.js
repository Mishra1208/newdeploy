// Cache-bust: 3
export const parseOfferLetter = async (file) => {
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    // Using unpkg guarantees the exact file exists since it mirrors the npm package exactly.
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // Join with newlines to preserve some vertical structure formatting
        const pageText = textContent.items.map(item => item.str).join('\n');
        fullText += pageText + '\n';
    }

    // Heuristic Parsing
    const profile = {
        program: 'Unknown Program',
        isECP: false,
        isCoop: false,
        completedCredits: 0,
        studentName: 'Unknown Student',
        exemptions: [],
        deficiencies: [],
        courseHistory: []
    };

    // 1. Program Name & Student Name
    const programMatch = fullText.match(/Bachelor of [^\n\r]+/i);
    if (programMatch) {
        profile.program = programMatch[0].trim();
    }

    const nameMatch = fullText.match(/Dear\s+([^\n\r,:]+)[:,]/i) || fullText.match(/Name:\s*([^\n\r]+)/i);
    if (nameMatch) {
        // Strip out double-spacing artifacts from PDF extraction
        profile.studentName = nameMatch[1].replace(/\s+/g, ' ').trim();
    }

    // 2. ECP Status
    if (fullText.includes("Extended Credit Program") || fullText.includes("120 credits")) {
        profile.isECP = true;
    }

    // 3. Co-op Status
    if (fullText.includes("Co-operative Education") || fullText.includes("Co-op program")) {
        profile.isCoop = true;
    }

    // 4. Extract Exemptions
    // Format usually has "Exemptions Granted:" followed by course codes spanning multiple lines
    // Wait, PDF.js might extract it as "CHEM" \n "205" or "CHEM 205".
    // We'll run a global regex looking for any 4-letter + 3-number combo in the whole document
    // and filter them into exemptions vs deficiencies based on where they appear.
    
    // Attempt to isolate the exemptions section
    const exemptionsIndex = fullText.indexOf("Exemptions:");
    const deficienciesIndex = fullText.indexOf("Deficiencies:");
    const transferIndex = fullText.indexOf("Transfer Credits:");

    if (exemptionsIndex !== -1 && deficienciesIndex !== -1) {
        const exemptionsSection = fullText.substring(exemptionsIndex, deficienciesIndex);
        
        // Match standard formatting e.g. "COMP" \n "248" or "COMP 248"
        // Also handle potential spaces
        const courseRegex = /([A-Z]{3,4})\s*\n*\s*(\d{3})/g;
        let match;
        while ((match = courseRegex.exec(exemptionsSection)) !== null) {
            const courseCode = `${match[1].trim()} ${match[2].trim()}`;
            if (!profile.exemptions.includes(courseCode)) {
                profile.exemptions.push(courseCode);
            }
        }
    }

    // 5. Extract Deficiencies
    if (deficienciesIndex !== -1) {
        const endIndex = transferIndex !== -1 ? transferIndex : fullText.length;
        const deficienciesSection = fullText.substring(deficienciesIndex, endIndex);
        
        const courseRegex = /([A-Z]{3,4})\s*\n*\s*(\d{3})/g;
        let match;
        while ((match = courseRegex.exec(deficienciesSection)) !== null) {
            const courseCode = `${match[1].trim()} ${match[2].trim()}`;
            if (!profile.deficiencies.includes(courseCode)) {
                profile.deficiencies.push(courseCode);
            }
        }
    }

    console.log("Parsed Profile:", profile);
    return profile;

  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF Offer Letter.");
  }
};
