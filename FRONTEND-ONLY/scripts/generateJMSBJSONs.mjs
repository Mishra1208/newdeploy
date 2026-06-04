import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '../src/utils/degreeEngine/data/programs/jmsb');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// JMSB Core
const coreRequirements = [
  {
    category: "JMSB Core 200-Level",
    credits: 34.5,
    courses: ["COMM 205", "COMM 211", "COMM 213", "COMM 214", "COMM 216", "COMM 217", "COMM 219", "COMM 221", "COMM 223", "COMM 225", "COMM 226", "COMM 227", "COMM 229"]
  },
  {
    category: "JMSB Core 300 & 400-Level",
    credits: 13.5,
    courses: ["COMM 305", "COMM 309", "COMM 316", "COMM 320", "COMM 401"]
  }
];

const bcommSequence = {
  september: [
    ["COMM 205", "COMM 211", "COMM 217", "COMM 213", "COMM 216", "Non-Business Elective 1"],
    ["COMM 214", "COMM 221", "COMM 223", "COMM 225", "COMM 219"],
    ["COMM 226", "COMM 227", "COMM 305", "COMM 229", "Non-Business Elective 2"],
    ["COMM 309", "COMM 316", "Major Core 1", "Major Core 2", "General Elective 1"],
    ["COMM 320", "Major Core 3", "Major Core 4", "Major Elective 1", "General Elective 2"],
    ["COMM 401", "Major Core 5", "Major Elective 2", "Major Elective 3", "General Elective 3", "General Elective 4"]
  ]
};

const programsData = {
  btm: {
    name: 'Business Technology Management',
    majorCore: ["BTM 380", "BTM 382", "BTM 385", "BTM 481", "BTM 496"],
    majorElectiveCredits: 9.0,
    majorElectiveList: ["BANA 450", "BANA 478", "BTM 387", "BTM 430", "BTM 440", "BTM 450", "BTM 460", "BTM 480", "BTM 490", "BTM 495"],
    minor: ["BTM 382", "BTM 481", "BTM 496"],
    minorElectives: 3.0, // 3 credits from 300/400 level BTM
    minorElectiveList: ["BTM 380", "BTM 385", "BTM 387", "BTM 430", "BTM 440", "BTM 450", "BTM 460", "BTM 480", "BTM 490", "BTM 495"]
  },
  economics: {
    name: 'Economics',
    majorCore: ["ECON 301", "ECON 302", "ECON 303", "ECON 304"],
    majorElectiveCredits: 12.0,
    majorElectiveList: [], // 400 level ECON
    minor: ["ECON 318", "ECON 319"],
    minorElectives: 6.0, // 300 level ECON
    minorElectiveList: []
  },
  finance: {
    name: 'Finance',
    majorCore: ["FINA 385", "FINA 395"],
    majorElectiveCredits: 18.0,
    majorElectiveList: ["FINA 402", "FINA 405", "FINA 408", "FINA 409", "FINA 410", "FINA 411", "FINA 412", "FINA 413", "FINA 415", "FINA 416", "FINA 420", "FINA 421", "FINA 455", "FINA 465", "FINA 470", "FINA 471", "FINA 481", "FINA 482", "FINA 495"], // 400 level FINA
    minor: ["FINA 385", "FINA 395"],
    minorElectives: 6.0,
    minorElectiveList: ["FINA 402", "FINA 405", "FINA 408", "FINA 409", "FINA 410", "FINA 411", "FINA 412", "FINA 413", "FINA 415", "FINA 416", "FINA 420", "FINA 421", "FINA 455", "FINA 465", "FINA 470", "FINA 471", "FINA 481", "FINA 482", "FINA 495"]
  },
  hrm: {
    name: 'Human Resource Management',
    majorCore: ["MANA 362", "MANA 366", "MANA 420", "MANA 443", "MANA 444", "MANA 445", "MANA 446", "MANA 463"],
    majorElectiveCredits: 0.0,
    majorElectiveList: [],
    minor: ["MANA 362"],
    minorElectives: 9.0,
    minorElectiveList: ["MANA 366", "MANA 443", "MANA 444", "MANA 445", "MANA 446", "MANA 463"]
  },
  'international-business': {
    name: 'International Business',
    majorCore: ["IBUS 462", "IBUS 466", "IBUS 492"],
    majorElectiveCredits: 15.0,
    majorElectiveList: ["IBUS 370", "IBUS 465", "IBUS 471", "IBUS 493", "ECON 319"],
    minor: ["IBUS 462", "IBUS 466", "IBUS 492"],
    minorElectives: 3.0,
    minorElectiveList: ["IBUS 370", "IBUS 465", "IBUS 471", "IBUS 493"]
  },
  management: {
    name: 'Management',
    majorCore: ["MANA 341", "MANA 420", "IBUS 492"],
    majorElectiveCredits: 15.0,
    majorElectiveList: ["MANA 300", "MANA 343", "MANA 362", "MANA 366", "MANA 369", "MANA 374", "MANA 390", "MANA 443", "MANA 444", "MANA 445", "MANA 446", "MANA 447", "MANA 451", "MANA 461", "MANA 463", "MANA 466", "MANA 477", "MANA 478", "MANA 479", "MANA 480", "MANA 481", "MANA 482", "MANA 490", "MANA 493", "MANA 498", "MANA 499"],
    minor: ["MANA 341", "MANA 420"],
    minorElectives: 6.0,
    minorElectiveList: ["MANA 300", "MANA 343", "MANA 362", "MANA 366", "MANA 369", "MANA 374", "MANA 390", "MANA 443", "MANA 444", "MANA 445", "MANA 446", "MANA 447", "MANA 451", "MANA 461", "MANA 463", "MANA 466", "MANA 477", "MANA 478", "MANA 479", "MANA 480", "MANA 481", "MANA 482", "MANA 490", "MANA 493", "MANA 498", "MANA 499"]
  },
  marketing: {
    name: 'Marketing',
    majorCore: ["MARK 301", "MARK 302", "MARK 305", "MARK 495"],
    majorElectiveCredits: 12.0,
    majorElectiveList: ["MARK 444", "MARK 451", "MARK 452", "MARK 453", "MARK 454", "MARK 456", "MARK 457", "MARK 458", "MARK 460", "MARK 463", "MARK 465", "MARK 485", "MARK 486", "MARK 491", "MARK 492", "MARK 493"],
    minor: ["MARK 302", "MARK 305"],
    minorElectives: 6.0,
    minorElectiveList: ["MARK 444", "MARK 451", "MARK 452", "MARK 453", "MARK 454", "MARK 456", "MARK 457", "MARK 458", "MARK 460", "MARK 463", "MARK 465", "MARK 485", "MARK 486", "MARK 491", "MARK 492", "MARK 493"]
  },
  'supply-chain': {
    name: 'Supply Chain Operations Management',
    majorCore: ["SCOM 361", "SCOM 363", "SCOM 372", "SCOM 374", "SCOM 492", "SCOM 498"],
    majorElectiveCredits: 6.0,
    majorElectiveList: ["BANA 450", "SCOM 362", "SCOM 491"],
    minor: ["SCOM 361", "SCOM 363", "SCOM 372", "SCOM 374"],
    minorElectives: 0.0,
    minorElectiveList: []
  }
};

const minorData = {
  'assurance': {
    name: 'Assurance, Fraud Prevention and Investigative Services',
    core: ["ACCO 310", "ACCO 320", "ACCO 360", "ACCO 455"],
    electives: 0
  },
  'business-studies': {
    name: 'Business Studies',
    core: ["COMM 205", "COMM 211", "COMM 214", "COMM 217", "COMM 221", "COMM 223", "COMM 225"],
    electives: 9.0 // 9 credits of business courses
  },
  'entrepreneurship': {
    name: 'Entrepreneurship',
    core: ["MANA 447", "MANA 451", "MANA 478", "MANA 480"],
    electives: 0
  },
  'is-audit': {
    name: 'Information Systems Audit and Risk Management',
    core: ["ACCO 360", "ACCO 455", "BTM 382", "BTM 440"],
    electives: 0
  },
  'real-estate': {
    name: 'Real Estate',
    core: ["FINA 450", "FINA 465"],
    electives: 6.0,
    electiveList: ["FINA 411", "FINA 416", "URBS 230", "URBS 240", "URBS 393"]
  }
};

for (const [key, data] of Object.entries(programsData)) {
  const bcommJson = {
    program: `${data.name} (BComm)`,
    totalCredits: 90.0,
    requirements: [
      ...coreRequirements,
      {
        category: `${data.name} Major Core`,
        credits: data.majorCore.length * 3.0,
        courses: data.majorCore
      },
      {
        category: `${data.name} Electives`,
        credits: data.majorElectiveCredits,
        electiveSlots: [
          {
            name: `${data.name} Elective`,
            credits: data.majorElectiveCredits,
            list: data.majorElectiveList || []
          }
        ]
      },
      {
        category: "Non-Business Electives",
        credits: 6.0,
        electiveSlots: [{ name: "Non-Business Elective", credits: 6.0, list: [] }]
      },
      {
        category: "General Electives",
        credits: 12.0,
        electiveSlots: [{ name: "General Elective", credits: 12.0, list: [] }]
      }
    ],
    courses: {},
    sequence: bcommSequence
  };
  fs.writeFileSync(path.join(outDir, `${key}-bcomm.json`), JSON.stringify(bcommJson, null, 2));

  const minorJson = {
    program: `Minor in ${data.name}`,
    totalCredits: 12.0,
    requirements: [
      {
        category: `Minor Core`,
        credits: data.minor.length * 3.0,
        courses: data.minor
      },
      {
        category: `Minor Electives`,
        credits: data.minorElectives,
        electiveSlots: [
          {
            name: `Minor Elective`,
            credits: data.minorElectives,
            list: data.minorElectiveList || []
          }
        ]
      }
    ],
    courses: {},
    sequence: {
      september: [data.minor]
    }
  };
  fs.writeFileSync(path.join(outDir, `${key}-minor.json`), JSON.stringify(minorJson, null, 2));
}

// Generate standalone minors
for (const [key, data] of Object.entries(minorData)) {
  const minorJson = {
    program: `Minor in ${data.name}`,
    totalCredits: data.core.length * 3.0 + data.electives,
    requirements: [
      {
        category: `Minor Core`,
        credits: data.core.length * 3.0,
        courses: data.core
      },
      {
        category: `Minor Electives`,
        credits: data.electives,
        electiveSlots: [
          {
            name: `Minor Elective`,
            credits: data.electives,
            list: data.electiveList || []
          }
        ]
      }
    ],
    courses: {},
    sequence: {
      september: [data.core]
    }
  };
  fs.writeFileSync(path.join(outDir, `minor-${key}.json`), JSON.stringify(minorJson, null, 2));
}

// Generate an index.js to export PROGRAMS
let indexJs = `
import accountancyBComm from './accountancy-bcomm.json';
import accountancyHonours from './accountancy-honours.json';
import accountancyCert from './accountancy-cert.json';\n`;

for (const key of Object.keys(programsData)) {
  indexJs += `import ${key.replace(/-/g, '')}BComm from './${key}-bcomm.json';\n`;
  indexJs += `import ${key.replace(/-/g, '')}Minor from './${key}-minor.json';\n`;
}

for (const key of Object.keys(minorData)) {
  indexJs += `import minor${key.replace(/-/g, '')} from './minor-${key}.json';\n`;
}

indexJs += `\nexport const JMSB_PROGRAMS = {
  'accountancy': {
    id: 'accountancy',
    name: 'Accountancy',
    category: 'Accounting',
    options: [
      { id: 'bcomm', name: 'Major in Accountancy (BComm)', data: accountancyBComm },
      { id: 'honours', name: 'Honours in Accountancy', data: accountancyHonours },
      { id: 'cert', name: 'Certificate in Accountancy', data: accountancyCert }
    ],
    weights: {}
  },\n`;

const getCategoryForProgram = (key) => {
  if (key === 'accountancy') return 'Accounting';
  if (['finance', 'economics'].includes(key)) return 'Economics & Finance';
  if (['marketing', 'international-business'].includes(key)) return 'Marketing & IB';
  if (['btm', 'supply-chain'].includes(key)) return 'Tech & Supply Chain';
  if (['management', 'hrm'].includes(key)) return 'Management & HR';
  return 'JMSB Majors';
};

for (const [key, data] of Object.entries(programsData)) {
  const varName = key.replace(/-/g, '');
  const cat = getCategoryForProgram(key);
  indexJs += `  '${key}': {
    id: '${key}',
    name: '${data.name}',
    category: '${cat}',
    options: [
      { id: 'bcomm', name: 'Major in ${data.name} (BComm)', data: ${varName}BComm },
      { id: 'minor', name: 'Minor in ${data.name}', data: ${varName}Minor }
    ],
    weights: {}
  },\n`;
}

indexJs += `  'standalone-minors': {
    id: 'standalone-minors',
    name: 'Standalone Minors & Certificates',
    category: 'Minors & Certificates',
    options: [\n`;
for (const [key, data] of Object.entries(minorData)) {
  const varName = key.replace(/-/g, '');
  indexJs += `      { id: 'minor-${key}', name: 'Minor in ${data.name}', data: minor${varName} },\n`;
}
indexJs += `    ],
    weights: {}
  }
};
`;

fs.writeFileSync(path.join(outDir, 'index.js'), indexJs);
console.log("JMSB Programs successfully built.");
