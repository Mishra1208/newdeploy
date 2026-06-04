'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { generateOptimalPath, checkPrerequisites } from '../../../../utils/degreeEngine/prereqGraph';
import { BCompSc_Weights } from '../../../../utils/degreeEngine/data/sequenceWeights';
import computerScienceGeneralCurriculum from '../../../../utils/degreeEngine/data/programs/computer-science-general.json';
import aeroOptionA from '../../../../utils/degreeEngine/data/programs/aerospace-option-a.json';
import aeroOptionB from '../../../../utils/degreeEngine/data/programs/aerospace-option-b.json';
import aeroOptionC from '../../../../utils/degreeEngine/data/programs/aerospace-option-c.json';
import buildingCurriculum from '../../../../utils/degreeEngine/data/programs/building.json';
import chemicalCurriculum from '../../../../utils/degreeEngine/data/programs/chemical.json';
import civilCurriculum from '../../../../utils/degreeEngine/data/programs/civil.json';
import computerEngCurriculum from '../../../../utils/degreeEngine/data/programs/computer-eng.json';
import computerScienceComputationArtsCurriculum from '../../../../utils/degreeEngine/data/programs/computer-science-computation-arts.json';
import computerScienceDataScienceCurriculum from '../../../../utils/degreeEngine/data/programs/computer-science-data-science.json';
import computerScienceHealthCurriculum from '../../../../utils/degreeEngine/data/programs/computer-science-health.json';
import computerScienceMinorCurriculum from '../../../../utils/degreeEngine/data/programs/computer-science-minor.json';
import cybersecurityCurriculum from '../../../../utils/degreeEngine/data/programs/cybersecurity.json';
import cybersecurityEngCurriculum from '../../../../utils/degreeEngine/data/programs/cybersecurity-eng.json';
import elecEngCurriculum from '../../../../utils/degreeEngine/data/programs/elec-eng.json';
import induEngCurriculum from '../../../../utils/degreeEngine/data/programs/indu-eng.json';
import mechEngCurriculum from '../../../../utils/degreeEngine/data/programs/mech-eng.json';
import certSciTechCurriculum from '../../../../utils/degreeEngine/data/programs/cert-sci-tech.json';
import soenCurriculum from '../../../../utils/degreeEngine/data/programs/soen.json';
import courseTitles from '../../../../utils/degreeEngine/data/courseTitles.json';
import coursePrereqs from '../../../../utils/degreeEngine/data/coursePrereqs.json';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzS7dsgA_3Fv72I0CcCMwPKjeGAvHTbRZwL9AtLtiB7wIhq-K2JjrRBQhsqCybsv_Rs/exec";

const PROGRAMS = {
  'cs-general': {
    id: 'cs-general',
    name: 'Computer Science (BCompSc)',
    category: 'Computer Science & Software',
    data: computerScienceGeneralCurriculum,
    weights: BCompSc_Weights
  },
  'aerospace': {
    id: 'aerospace',
    name: 'Aerospace Engineering (BEng)',
    category: 'Aerospace, Mechanical & Industrial',
    options: [
      { id: 'aero-a', name: 'Option A: Aerodynamics and Propulsion', data: aeroOptionA },
      { id: 'aero-b', name: 'Option B: Aerospace Structures and Materials', data: aeroOptionB },
      { id: 'aero-c', name: 'Option C: Avionics and Aerospace Systems', data: aeroOptionC }
    ],
    weights: {}
  },
  'building': {
    id: 'building',
    name: 'Building Engineering (BEng)',
    category: 'Civil & Environmental Engineering',
    data: buildingCurriculum,
    weights: {}
  },
  'chemical': {
    id: 'chemical',
    name: 'Chemical Engineering (BEng)',
    category: 'Chemical & Materials Engineering',
    data: chemicalCurriculum,
    weights: {}
  },
  'civil': {
    id: 'civil',
    name: 'Civil Engineering (BEng)',
    category: 'Civil & Environmental Engineering',
    data: civilCurriculum,
    weights: {}
  },
  'computer-eng': {
    id: 'computer-eng',
    name: 'Computer Engineering (BEng)',
    category: 'Computer Science & Software',
    data: computerEngCurriculum,
    weights: {}
  },
  'computer-science-minor': {
    id: 'computer-science-minor',
    name: 'Computer Science (Minor)',
    category: 'Computer Science & Software',
    data: computerScienceMinorCurriculum,
    weights: {}
  },
  'cs-computation-arts': {
    id: 'cs-computation-arts',
    name: 'Computer Science – Computation Arts (BCompSc)',
    category: 'Computer Science & Software',
    data: computerScienceComputationArtsCurriculum,
    weights: {}
  },
  'cybersecurity': {
    id: 'cybersecurity',
    name: 'Cybersecurity (BSc)',
    category: 'Computer Science & Software',
    data: cybersecurityCurriculum,
    weights: {}
  },
  'cs-data-science': {
    id: 'cs-data-science',
    name: 'Computer Science – Data Science (BCompSc)',
    category: 'Computer Science & Software',
    data: computerScienceDataScienceCurriculum,
    weights: {}
  },
  'cs-health': {
    id: 'cs-health',
    name: 'Computer Science – Health and Life Sciences (BCompSc)',
    category: 'Computer Science & Software',
    data: computerScienceHealthCurriculum,
    weights: {}
  },
  'cybersecurity-eng': {
    id: 'cybersecurity-eng',
    name: 'Cybersecurity Engineering (BEng)',
    category: 'Computer Science & Software',
    data: cybersecurityEngCurriculum,
    weights: {}
  },
  'elec-eng': {
    id: 'elec-eng',
    name: 'Electrical Engineering (BEng)',
    category: 'Computer Science & Software',
    data: elecEngCurriculum,
    weights: {}
  },
  'indu-eng': {
    id: 'indu-eng',
    name: 'Industrial Engineering (BEng)',
    category: 'Engineering & Construction',
    data: induEngCurriculum,
    weights: {}
  },
  'mech-eng': {
    id: 'mech-eng',
    name: 'Mechanical Engineering (BEng)',
    category: 'Engineering & Construction',
    data: mechEngCurriculum,
    weights: {}
  },
  'cert-sci-tech': {
    id: 'cert-sci-tech',
    name: 'Science and Technology (Cert)',
    category: 'Computer Science & Software',
    data: certSciTechCurriculum,
    weights: {}
  },
  'soen': {
    id: 'soen',
    name: 'Software Engineering (BEng)',
    category: 'Computer Science & Software',
    data: soenCurriculum,
    weights: {}
  }
};

const GENERAL_EDUCATION_EXCLUSIONS = [
  'ANTH 315', 'PHIL 214', 'PHIL 316', 'PHIL 317', 'SOCI 212', 'SOCI 213', 'SOCI 310',
  'BCEE 231', 'BIOL 200', 'BIOL 322', 'BTM 200', 'BTM 380', 'BTM 382', 'CART 315', 
  'COMM 215', 'COMP 218', 'EXCI 322', 'GEOG 264', 'INTE 296', 'MATH 208', 'MATH 209', 
  'MIAE 215', 'PHYS 235', 'PHYS 236', 'MAST 221', 'MAST 333'
];

// Build the massive General Elective list from the allowed prefixes
const COMPLEMENTARY_PREFIXES = ['ANTH', 'FPST', 'HIST', 'PHIL', 'RELI', 'SOCI', 'THEO', 'WSDB', 'ARTE', 'ARTH', 'JHIS', 'MHIS', 'COMS', 'EDUC', 'ENGL', 'GEOG'];
const GENERAL_LIST = Object.keys(courseTitles).filter(code => 
  COMPLEMENTARY_PREFIXES.some(prefix => code.startsWith(prefix))
);

const MUTUAL_EXCLUSIONS = [
  ['COMP 248', 'COEN 243', 'MIAE 215', 'MECH 215', 'CHME 215'],
  ['COMP 249', 'COEN 244', 'CHME 216'],
  ['COMP 352', 'COEN 352'],
  ['COMP 232', 'COEN 231'],
  ['COMP 228', 'SOEN 228', 'COEN 311'],
  ['ENGR 371', 'COMP 233', 'INDU 323'],
  ['ENGR 391', 'COMP 361', 'MIAE 315', 'CHME 315'],
  ['BLDG 212', 'CIVI 212', 'MIAE 211']
];

const checkExclusion = (course, takenCourses = []) => {
  const code = course.toUpperCase().trim();
  
  // 1. Mutual Exclusions (Highest Priority)
  for (const group of MUTUAL_EXCLUSIONS) {
    if (group.includes(code)) {
      const alreadyTaken = group.find(c => c !== code && takenCourses.includes(c));
      if (alreadyTaken) return { type: 'block', message: `You cannot take ${code} because you have already completed (or planned) the equivalent course ${alreadyTaken}.` };
    }
  }

  // 2. Hard Exclusions (General Education list)
  if (GENERAL_EDUCATION_EXCLUSIONS.includes(code)) return { type: 'block', message: "This course is explicitly on the General Electives Exclusion List." };
  
  // 3. Prefix/Departmental Rules
  if (code.startsWith('ESL ')) return { type: 'warn', message: "ESL courses may be taken if you have language deficiencies, but they DO NOT count for credit towards your degree requirements. They will appear as extra credits." };
  if (code.startsWith('COEN ') || code.startsWith('INTE ')) return { type: 'block', message: "COEN and INTE courses cannot be taken as General Electives without special permission." };
  if (['FRAN 211', 'FRAN 212', 'FRAN 215'].includes(code)) return { type: 'warn', message: "Note: At most 6 credits of elementary/transitional French may be taken." };
  
  return null;
};

const categoryColors = {
  'Computer Science & Software': 'text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 border-purple-500/30',
  'Aerospace, Mechanical & Industrial': 'text-orange-600 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40 border-orange-500/30',
  'Civil & Environmental Engineering': 'text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500/30',
  'Chemical & Materials Engineering': 'text-rose-600 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/40 border-rose-500/30'
};

const getCategoryColor = (category) => categoryColors[category] || 'text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 border-blue-500/30';

const categoryBorderColors = {
  'Computer Science & Software': 'bg-purple-500',
  'Aerospace, Mechanical & Industrial': 'bg-orange-500',
  'Civil & Environmental Engineering': 'bg-emerald-500',
  'Chemical & Materials Engineering': 'bg-rose-500',
  'Engineering & Construction': 'bg-amber-500'
};
const getCategoryBorderColor = (category) => categoryBorderColors[category] || 'bg-slate-300';

const categoryIcons = {
  'Computer Science & Software': <svg className="w-32 h-32 text-purple-500/10 dark:text-purple-500/20 dark:drop-shadow-[0_0_15px_rgba(192,132,252,0.3)] group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  'Aerospace, Mechanical & Industrial': <svg className="w-32 h-32 text-orange-500/10 dark:text-orange-500/20 dark:drop-shadow-[0_0_15px_rgba(251,146,60,0.3)] group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  'Civil & Environmental Engineering': <svg className="w-32 h-32 text-emerald-500/10 dark:text-emerald-500/20 dark:drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  'Chemical & Materials Engineering': <svg className="w-32 h-32 text-rose-500/10 dark:text-rose-500/20 dark:drop-shadow-[0_0_15px_rgba(244,63,94,0.3)] group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  'Engineering & Construction': <svg className="w-32 h-32 text-amber-500/10 dark:text-amber-500/20 dark:drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
};
const getCategoryIcon = (category) => categoryIcons[category] || null;

const getProgramCategoryColor = (category) => categoryColors[category] || 'text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 border-blue-500/30';

const debugRender = (val, label = "") => {
  if (typeof val === "object" && val !== null) {
    console.error("OBJECT RENDER DETECTED:", label, val);
    return JSON.stringify(val);
  }
  return val;
};

const NATURAL_SCIENCE_ELECTIVES = [
  'BIOL 201', 'BIOL 202', 'BIOL 206', 'BIOL 261', 'BIOL 266', 
  'CHEM 206', 'CHEM 217', 'CHEM 221', 
  'GEOL 206', 'GEOL 208', 
  'PHYS 206', 'PHYS 252', 'PHYS 260', 'PHYS 273', 'PHYS 284', 
  'PHYS 367', 'PHYS 385', 'PHYS 443', 'PHYS 445'
];

const HUMANITIES_LIST = [
  'ANTH', 'FPST', 'HIST', 'PHIL', 'RELI', 'SOCI', 'THEO', 'WSDB', 
  'ARTE', 'ARTH', 'JHIS', 'MHIS', 'COMS 360', 'EDUC 230', 'ENCS 483',
  'ENGL 224', 'ENGL 233', 'GEOG 220', 'INST 250', 'LING 222', 'LING 300', 'URBS 230'
];

export default function FreshDegreeTracker() {
  const [step, setStep] = useState('select-program'); // 'select-program' | 'config' | 'select-courses' | 'plan'
  const [completedCourses, setCompletedCourses] = useState([]);
  const [delayedCourses, setDelayedCourses] = useState({}); 
  const [ignoredCourses, setIgnoredCourses] = useState([]);
  const [skippedSemesters, setSkippedSemesters] = useState([]);
  const [electiveChoices, setElectiveChoices] = useState({}); 
  const [manualAdds, setManualAdds] = useState({}); 
  const [includeMathProfile, setIncludeMathProfile] = useState(false); // ECP Math Deficiencies
  const [startTerm, setStartTerm] = useState('Fall');
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [plan, setPlan] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null); // Custom error modal state
  const [selectedProgramId, setSelectedProgramId] = useState('cs-general');
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showForgetConfirm, setShowForgetConfirm] = useState(false);
  const [showBugReport, setShowBugReport] = useState(false);
  const [bugForm, setBugForm] = useState({
    ecp: 'No',
    program: '',
    course: '',
    error: '',
    correctMethod: ''
  });
  const [bugStatus, setBugStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, success

  const { user, isLoaded } = useUser();

  // Load saved state on mount (or when user logs in)
  useEffect(() => {
    if (isLoaded && user) {
      const saved = localStorage.getItem(`conu_plan_${user.id}`);
      if (saved) {
        // We don't auto-apply it yet to avoid confusing the user, 
        // we just store it to show the "Resume" button.
      }
    }
  }, [isLoaded, user]);

  const saveToProfile = useCallback(async () => {
    if (!user) return;
    setSaveStatus('saving');
    
    const stateToSave = {
      selectedProgramId,
      completedCourses,
      electiveChoices,
      delayedCourses,
      skippedSemesters,
      manualAdds,
      includeMathProfile,
      startTerm,
      startYear,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(`conu_plan_${user.id}`, JSON.stringify(stateToSave));
    
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 8000); // Simulate network delay
  }, [user, selectedProgramId, completedCourses, electiveChoices, delayedCourses, skippedSemesters, manualAdds, includeMathProfile, startTerm, startYear]);

  const resumeSavedPlan = () => {
    if (!user) return;
    const saved = JSON.parse(localStorage.getItem(`conu_plan_${user.id}`));
    if (saved) {
      setSelectedProgramId(saved.selectedProgramId);
      setCompletedCourses(saved.completedCourses || []);
      setElectiveChoices(saved.electiveChoices || {});
      setDelayedCourses(saved.delayedCourses || {});
      setSkippedSemesters(saved.skippedSemesters || []);
      setManualAdds(saved.manualAdds || {});
      setIncludeMathProfile(saved.includeMathProfile || false);
      setStartTerm(saved.startTerm || 'Fall');
      setStartYear(saved.startYear || 2024);
      setStep('plan');
    }
  };

  const forgetSavedPlan = (e) => {
    e.stopPropagation();
    if (!user) return;
    setShowForgetConfirm(true);
  };

  const handleConfirmForget = () => {
    localStorage.removeItem(`conu_plan_${user.id}`);
    setShowForgetConfirm(false);
    window.location.reload();
  };

  const programsByAlphabet = Object.values(PROGRAMS).sort((a, b) => a.name.localeCompare(b.name));

  // Modal States
  const [activeElectiveSlot, setActiveElectiveSlot] = useState(null); 
  const [activeCourseDetails, setActiveCourseDetails] = useState(null); 
  const [manualAddPrompt, setManualAddPrompt] = useState(null); 
  const [manualInput, setManualInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedProgram = PROGRAMS[selectedProgramId];
  const currentOption = selectedProgram.options 
    ? (selectedProgram.options.find(o => o.id === selectedOptionId) || selectedProgram.options[0])
    : null;
  const curriculum = currentOption ? currentOption.data : selectedProgram.data;


  // Dynamically extract categories from curriculum
  const categories = useMemo(() => {
    if (!curriculum || !curriculum.requirements) return {};
    return curriculum.requirements.reduce((acc, req) => {
      if (req.category && Array.isArray(req.courses)) {
        acc[req.category] = req.courses.filter(c => typeof c === 'string');
      }
      return acc;
    }, {});
  }, [curriculum]);

  // Forward Dependency Graph for Chain Reaction Warnings
  const forwardGraph = useMemo(() => {
    if (!coursePrereqs) return {};
    const graph = {};
    Object.entries(coursePrereqs).forEach(([code, data]) => {
      let prereqs = [];
      if (typeof data === 'object') {
        // Flatten nested array structures [[p1, p2], [p3]]
        prereqs = [...(data.prerequisites || []), ...(data.corequisites || [])].flat();
      } else if (typeof data === 'string') {
        // Simple string parsing for common patterns
        const codes = data.match(/[A-Z]{4}\s\d{3}/g) || [];
        prereqs = codes;
      }
      
      prereqs.forEach(p => {
        if (!graph[p]) graph[p] = [];
        if (!graph[p].includes(code)) graph[p].push(code);
      });
    });
    return graph;
  }, []);

  const getImpactedCourses = useCallback((courseCode) => {
    const impacted = new Set();
    const queue = [courseCode];
    const visited = new Set();
    
    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);
      
      const children = forwardGraph[current] || [];
      children.forEach(child => {
        impacted.add(child);
        queue.push(child);
      });
    }
    impacted.delete(courseCode);
    return Array.from(impacted);
  }, [forwardGraph]);

  const courseCategoryMap = useMemo(() => {
    if (!curriculum) return {};
    const map = {};
    const colors = [
      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
      'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-800/50',
      'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
      'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
      'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/50',
      'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800/50',
      'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800/50',
    ];
    curriculum.requirements.forEach((req, index) => {
      map[req.category] = {
        color: colors[index % colors.length],
        dot: colors[index % colors.length].split(' ')[0]
      };
    });
    
    // Explicitly add ECP Foundation
    map['ECP Foundation'] = {
      color: 'bg-slate-200 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border-slate-300 dark:border-slate-700/50',
      dot: 'bg-slate-200 dark:bg-slate-800'
    };

    return map;
  }, [curriculum]);

  const targetCredits = useMemo(() => {
    let base = curriculum?.totalCredits || 120;
    if (includeMathProfile) {
      // ECP adds 30 credits (1 year) to the degree
      base += 30;
    }
    return base;
  }, [curriculum, includeMathProfile]);

  const getCourseCategory = useCallback((courseId) => {
    if (!curriculum) return null;
    
    if (courseId.includes('Elective') || courseId.includes('Group')) {
      const req = curriculum.requirements.find(r => courseId.startsWith(r.category) || courseId.includes(r.category.replace(/s$/, '')));
      if (req) return req.category;
      return null;
    }

    for (const req of curriculum.requirements) {
      if (req.courses && req.courses.includes(courseId)) {
        return req.category;
      }
    }

    for (const [slotName, chosenCourse] of Object.entries(electiveChoices)) {
      if (chosenCourse === courseId) {
         const req = curriculum.requirements.find(r => slotName.startsWith(r.category) || slotName.includes(r.category.replace(/s$/, '')));
         if (req) return req.category;
         return null;
      }
    }
    
    // Is it an ECP Foundation course?
    const ecpCourses = ['MATH 203', 'MATH 204', 'MATH 205', 'PHYS 204', 'PHYS 205', 'CHEM 205', 'CHEM 206'];
    if (ecpCourses.includes(courseId)) {
      return 'ECP Foundation';
    }
    
    return null;
  }, [curriculum, electiveChoices]);

  useEffect(() => {
    if (step === 'plan') {
      let ecpFoundation = [];
      if (includeMathProfile) {
        if (selectedProgram.category.includes('Engineering') || selectedProgram.category.includes('Aerospace')) {
          ecpFoundation = [
            'MATH 203', 'MATH 204', 'MATH 205', 
            'PHYS 204', 'PHYS 205', 'CHEM 205',
            'Natural Science Elective 1', 'Natural Science Elective 2',
            'General Education Elective 1', 'General Education Elective 2'
          ];
        } else {
          // Computer Science ECP
          ecpFoundation = [
            'MATH 203', 'MATH 204', 'MATH 205',
            'General Elective 1', 'General Elective 2', 'General Elective 3', 'General Elective 4', 'General Elective 5'
          ];
          
          // Special case for CS Systems and Health
          if (selectedProgramId === 'cs-health') {
             ecpFoundation = [
               'MATH 203', 'MATH 204', 'MATH 205',
               'BIOL 201', 'CHEM 205', 'CHEM 206',
               'PHYS 204', 'PHYS 205', 'PHYS 206',
               'PHYS 224', 'PHYS 225', 'PHYS 226'
             ];
          }
        }
      }
      
      // Build targets list dynamically based on curriculum
      let targets = [...ecpFoundation];
      
      curriculum.requirements.forEach(req => {
        // 1. Core courses
        if (req.courses && req.courses.length > 0) {
          targets = [...targets, ...req.courses.filter(c => typeof c === 'string')];
        }
        
        // 2. Elective slots
        if (req.electiveSlots && req.electiveSlots.length > 0) {
          req.electiveSlots.forEach(slot => {
            const creditsPerCourse = 3; 
            const count = Math.ceil(slot.credits / creditsPerCourse);
            for (let i = 0; i < count; i++) {
              const slotName = count > 1 ? `${slot.name} ${i + 1}` : slot.name;
              const choice = electiveChoices[slotName] || slotName;
              if (typeof choice === 'string') {
                targets.push(choice);
              }
            }
          });
        }
      });
      
      // Final safety filter
      targets = targets.filter(t => typeof t === 'string');
      const invertedElectives = {};
      Object.entries(electiveChoices).forEach(([slot, course]) => {
          invertedElectives[course] = slot;
      });
      const modifiedCoursesDict = { ...curriculum.courses };
      if (includeMathProfile) {
         // Force structured progression for Foundation courses
         const foundation = ['MATH 203', 'MATH 204', 'MATH 205', 'PHYS 204', 'PHYS 205', 'CHEM 205', 'CHEM 206'];
         foundation.forEach(code => {
           if (!modifiedCoursesDict[code]) modifiedCoursesDict[code] = { credits: 3.0, prerequisites: [], corequisites: [] };
         });
         modifiedCoursesDict['MATH 205'].prerequisites = [['MATH 203']];
         modifiedCoursesDict['PHYS 204'].prerequisites = [['MATH 203']];
         modifiedCoursesDict['PHYS 205'].prerequisites = [['MATH 203'], ['PHYS 204']];
         modifiedCoursesDict['CHEM 206'].prerequisites = [['CHEM 205']];

         // Natural Science Elective logic
         ['Natural Science Elective 1', 'Natural Science Elective 2'].forEach(t => {
            if (!modifiedCoursesDict[t]) modifiedCoursesDict[t] = { credits: 3.0, prerequisites: [['MATH 203']], corequisites: [] };
         });
      }
      
      // Prevent advanced generic elective slots from dumping into Semester 1
      targets.forEach(t => {
        if (!modifiedCoursesDict[t] && t.toLowerCase().includes('elective')) {
          let syntheticPrereqs = [];
          const lower = t.toLowerCase();
          
          // 1. Advanced Tech/CS Electives depend on Core Engineering or Math
          if (lower.includes('artificial intelligence') || lower.includes('computer science') || 
              lower.includes('technical') || lower.includes('option') || lower.includes('software')) {
            if (modifiedCoursesDict['ENGR 301']) syntheticPrereqs.push(['ENGR 301']);
            else if (modifiedCoursesDict['COMP 249']) syntheticPrereqs.push(['COMP 249']);
          }

          // 2. Math electives depend on Calculus
          if (lower.includes('math')) {
            if (modifiedCoursesDict['MATH 205']) syntheticPrereqs.push(['MATH 205']);
            else if (modifiedCoursesDict['ENGR 213']) syntheticPrereqs.push(['ENGR 213']);
          }

          // 3. General Education/Science Electives depend on Term 1 completion
          if (lower.includes('general education') || lower.includes('natural science')) {
            syntheticPrereqs.push(['MATH 203']);
          }
          
          modifiedCoursesDict[t] = {
            credits: 3.0,
            prerequisites: syntheticPrereqs,
            corequisites: []
          };
        }
      });
      
      // Inject ECP Foundation Prerequisite Rules
      const ecpRules = {
        'MATH 205': ['MATH 203'],
        'PHYS 205': ['PHYS 204'],
        'PHYS 206': ['PHYS 204'],
        'CHEM 206': ['CHEM 205'],
        'MATH 204': ['MATH 203'] // Often recommended to take 203 first or same time
      };

      Object.entries(ecpRules).forEach(([course, prereqs]) => {
        if (!modifiedCoursesDict[course]) {
          // If the course isn't in curriculum, add it with rules
          modifiedCoursesDict[course] = {
            credits: 3.0,
            prerequisites: [prereqs],
            corequisites: []
          };
        } else {
          // If it is in curriculum, append these as hard prereqs
          modifiedCoursesDict[course].prerequisites = [
            ...(modifiedCoursesDict[course].prerequisites || []),
            prereqs
          ];
        }
      });
      
      const remainingTargets = targets.filter(c => !completedCourses.includes(c) && !ignoredCourses.includes(c));
      const result = generateOptimalPath(
        remainingTargets, 
        completedCourses, 
        modifiedCoursesDict, 
        selectedProgram.weights,
        15.0, 
        invertedElectives, 
        startTerm,
        delayedCourses,
        skippedSemesters
      );
      setPlan(result.semesters);
    }
  }, [completedCourses, electiveChoices, includeMathProfile, step, startTerm, startYear, selectedProgramId, delayedCourses, ignoredCourses, skippedSemesters]);

  const handleFirstYear = () => {
    setCompletedCourses([]);
    setStep('plan');
  };

  const toggleCourse = (course) => {
    setCompletedCourses(prev => 
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    );
  };

  const submitBugReport = async (e) => {
    e.preventDefault();
    setBugStatus('submitting');
    try {
      const payload = {
        ...bugForm,
        type: 'bug-report',
        degree: PROGRAMS[selectedProgramId]?.name || 'Unknown',
        timestamp: new Date().toLocaleString()
      };
      
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      setBugStatus('success');
      setTimeout(() => {
        setShowBugReport(false);
        setBugStatus('idle');
        setBugForm({ ecp: 'No', program: '', course: '', error: '', correctMethod: '' });
      }, 2000);
    } catch (err) {
      console.error(err);
      setBugStatus('idle');
      alert("Failed to submit bug report. Please try again.");
    }
  };

  const getTermName = (idx) => {
    const termOrder = ["Winter", "Summer", "Fall"];
    const startIndex = termOrder.indexOf(startTerm);
    const totalTerms = startIndex + idx;
    
    const currentTerm = termOrder[totalTerms % 3];
    const yearsAdded = Math.floor(totalTerms / 3);
    const currentYear = startYear + yearsAdded;

    return `${currentTerm} ${currentYear}`;
  };

  const getElectiveStyles = (course) => {
    if (typeof course !== 'string') return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-900', title: 'text-slate-700' };
    if (!course.includes('Elective') && !course.includes('Group')) return null;
    if (course.includes('Math')) return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800 border-dashed', text: 'text-blue-900 dark:text-blue-300', title: 'text-blue-700 dark:text-blue-400' };
    if (course.includes('CS')) return { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800 border-dashed', text: 'text-violet-900 dark:text-violet-300', title: 'text-violet-700 dark:text-violet-400' };
    if (course.includes('General')) return { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800 border-dashed', text: 'text-amber-900 dark:text-amber-300', title: 'text-amber-700 dark:text-amber-400' };
    if (course.includes('Group')) return { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800 border-dashed', text: 'text-emerald-900 dark:text-emerald-300', title: 'text-emerald-700 dark:text-emerald-400' };
    return { bg: 'bg-slate-50 dark:bg-black', border: 'border-slate-200 dark:border-white/[0.08] border-dashed', text: 'text-slate-900 dark:text-white', title: 'text-slate-700 dark:text-white/80' };
  };

  const getCredits = (course) => {
    if (typeof course !== 'string') return 3.0;
    if (course.includes('Elective') || course.includes('Group')) return 3.0;
    
    // Special cases for 6-credit courses
    if (course === 'ESL 202' || course === 'ESL 204') return 6.0;

    // Check global prerequisites data for credit info
    const globalInfo = coursePrereqs[course];
    if (globalInfo && typeof globalInfo === 'object' && globalInfo.credits) {
      return globalInfo.credits;
    }

    return curriculum.courses[course]?.credits || 3.0;
  };

  const getPrereqString = (course) => {
    if (typeof course !== 'string') return "None";
    if (course === "ENCS 282") return "Students must pass the Engineering Writing Test (EWT), or pass ENCS 272 with a grade of C- or higher.";
    
    // Check if the current curriculum has explicitly defined structured prerequisites
    if (curriculum.courses[course] && curriculum.courses[course].prerequisites && curriculum.courses[course].prerequisites.length > 0) {
      return curriculum.courses[course].prerequisites.map(group => {
        const items = Array.isArray(group) ? group : [group];
        return items.join(" OR ");
      }).join(" AND ");
    }
    
    // Fallback to the global course prereqs dictionary from CSV
    if (coursePrereqs[course]) {
      const globalInfo = coursePrereqs[course];
      if (typeof globalInfo === 'string') return globalInfo;
      
      // If it's an object with prerequisites array
      if (globalInfo.prerequisites && globalInfo.prerequisites.length > 0) {
        return globalInfo.prerequisites.map(group => {
          const items = Array.isArray(group) ? group : [group];
          return items.join(" OR ");
        }).join(" AND ");
      }
    }
    
    return "None";
  };

  const handleElectiveClick = (course) => {
    setSearchQuery('');
    const lowerCourse = course.toLowerCase();
    const isElectiveSlot = lowerCourse.includes('elective') || lowerCourse.includes('group') || lowerCourse.includes('general education');
    
    if (isElectiveSlot) {
      if (lowerCourse.includes('math')) {
        const req = curriculum.requirements.find(r => r.category.toLowerCase().includes('math'));
        const mathList = req?.electiveSlots?.[0]?.list || req?.courses || [];
        setActiveElectiveSlot({ slot: course, type: 'MATH', list: mathList });
      } else if (lowerCourse.includes('cs elective') || lowerCourse.includes('computer science elective')) {
        const req = curriculum.requirements.find(r => r.category.toLowerCase().includes('computer science elective'));
        const csList = req?.electiveSlots?.[0]?.list || req?.courses || [];
        setActiveElectiveSlot({ slot: course, type: 'CS', list: csList });
      } else if (lowerCourse.includes('general elective') || lowerCourse.includes('general education')) {
        setActiveElectiveSlot({ slot: course, type: 'GENERAL', list: GENERAL_LIST });
      } else if (lowerCourse.includes('natural science elective')) {
        setActiveElectiveSlot({ slot: course, type: 'SCIENCE', list: NATURAL_SCIENCE_ELECTIVES });
      } else {
        // Generic elective finder - find requirement that matches the category prefix of the slot
        const req = curriculum.requirements.find(r => {
          const category = r.category.toLowerCase();
          return lowerCourse.startsWith(category) || category.startsWith(lowerCourse.replace(/\s\d+$/, ''));
        });
        const electiveList = req?.electiveSlots?.[0]?.list || req?.courses || [];
        setActiveElectiveSlot({ slot: course, type: 'TECHNICAL', list: electiveList });
      }
    } else {
      setActiveCourseDetails(course);
    }
  };

  const selectElective = (slot, chosenCourse) => {
    const allTaken = [...completedCourses, ...plan.flat(), ...Object.values(electiveChoices)];
    const exclusion = checkExclusion(chosenCourse, allTaken);
    if (exclusion) {
      if (exclusion.type === 'block') {
        setErrorMsg({ title: 'Action Blocked', message: exclusion.message, type: 'error' });
        return;
      } else {
        // Warning - still add but notify
        setErrorMsg({ title: 'Academic Warning', message: exclusion.message, type: 'warning' });
      }
    }
    
    setElectiveChoices(prev => ({ ...prev, [slot]: chosenCourse }));
    setActiveElectiveSlot(null);
  };

  const unselectElective = (course) => {
    const slotKey = Object.keys(electiveChoices).find(k => electiveChoices[k] === course);
    if (slotKey) {
      setElectiveChoices(prev => {
        const copy = { ...prev };
        delete copy[slotKey];
        return copy;
      });
      setActiveCourseDetails(null);
    }
  };

  const submitManualAdd = () => {
    if (!manualInput.trim()) return;
    const semIdx = manualAddPrompt.semesterIdx;
    const courseCode = manualInput.trim().toUpperCase();
    
    const allTaken = [...completedCourses, ...plan.flat(), ...Object.values(electiveChoices)];
    const exclusion = checkExclusion(courseCode, allTaken);
    let hasWarning = false;
    if (exclusion) {
      if (exclusion.type === 'block') {
        setErrorMsg({ title: 'Action Blocked', message: exclusion.message, type: 'error' });
        return;
      } else {
        hasWarning = true;
        setErrorMsg({ title: 'Academic Warning', message: exclusion.message, type: 'warning' });
      }
    }

    // NEW: Prerequisite Validation for Manual Adds
    const completedBefore = [
      ...completedCourses,
      ...plan.slice(0, semIdx).flat()
    ];
    
    const { isEligible, missing } = checkPrerequisites(
      courseCode, 
      completedBefore, 
      null, 
      curriculum.courses,
      []
    );

    if (!isEligible) {
      const missingStr = missing.map(m => Array.isArray(m) ? m.join(" OR ") : m.group.join(" OR ")).join(", ");
      setErrorMsg({ title: 'Prerequisite Error', message: `Cannot add ${courseCode} to Semester ${semIdx + 1}!\n\nMissing Prerequisites: ${missingStr}`, type: 'error' });
      return;
    }
    
    setManualAdds(prev => ({
      ...prev,
      [semIdx]: [...(prev[semIdx] || []), courseCode]
    }));
    
    setManualAddPrompt(null);
    setManualInput('');
  };

  const removeManualAdd = (semIdx, courseCode) => {
    setManualAdds(prev => ({
      ...prev,
      [semIdx]: prev[semIdx].filter(c => c !== courseCode)
    }));
    setActiveCourseDetails(null);
  };

  const isChosenElective = (course) => Object.values(electiveChoices).includes(course);
  const isManualAdd = (course) => Object.values(manualAdds).flat().includes(course);

  const filteredElectiveList = activeElectiveSlot?.list.filter(c => {
    // Check if course is already in the plan or completed
    if (completedCourses.includes(c)) return false;
    if (Object.values(electiveChoices).includes(c)) return false;
    
    // Apply General Education Exclusions if the slot is for General Education
    if (activeElectiveSlot.type === 'General Education') {
       if (GENERAL_EDUCATION_EXCLUSIONS.includes(c)) return false;
       
       // Department check for Humanities
       const prefix = c.split(' ')[0];
       if (!HUMANITIES_LIST.includes(prefix) && !HUMANITIES_LIST.some(h => c.startsWith(h))) {
          // Special cases like COMS 360 are handled by startsWith above
          return false;
       }
    }
    
    // Apply Natural Science filter if applicable
    if (activeElectiveSlot.type === 'Natural Science') {
       if (!NATURAL_SCIENCE_ELECTIVES.includes(c)) return false;
    }

    return (c.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (courseTitles[c] || '').toLowerCase().includes(searchQuery.toLowerCase()));
  }) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black p-4 md:p-8 lg:p-12 print:p-0 print:bg-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          header, footer, nav, .print\\:hidden { display: none !important; }
          .fixed, .sticky { position: static !important; }
          body, html { background: white !important; color: black !important; width: 100% !important; height: auto !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; }
          .min-h-screen { min-height: 0 !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          
          .print-only { display: block !important; }
          
          /* Container Adjustments */
          .max-w-7xl { max-width: none !important; margin: 0 !important; width: 100% !important; padding: 0 40px !important; }
          .space-y-12 { space-y: 15px !important; }

          /* Formal Header Gutters */
          .print-only.text-center { margin-left: 20px !important; margin-right: 20px !important; }

          /* Semester Block as Table-ish Row */
          .semester-block { 
            page-break-inside: avoid; 
            break-inside: avoid; 
            border: 2px solid #000 !important; 
            border-radius: 0 !important;
            margin-bottom: 20px !important;
            padding: 15px !important;
            background: transparent !important;
            box-shadow: none !important;
          }
          
          .semester-block h4 { 
            color: black !important; 
            border-bottom: 2px solid black !important;
            padding-bottom: 5px !important;
            margin-bottom: 15px !important;
          }

          /* Course Cards as Table Rows */
          .grid-cols-1, .md\\:grid-cols-2, .xl\\:grid-cols-3 { 
            display: flex !important; 
            flex-direction: column !important; 
            gap: 0 !important; 
          }

          .course-card { 
            display: grid !important;
            grid-template-columns: 100px 1fr 60px !important;
            align-items: center !important;
            border: 1px solid #ddd !important;
            border-radius: 0 !important;
            margin-bottom: -1px !important;
            padding: 8px 12px !important;
            page-break-inside: avoid;
            break-inside: avoid;
            background: transparent !important;
          }

          .course-card div:first-child { font-weight: bold !important; font-size: 14px !important; }
          .course-card .text-xs { display: none !important; } /* Hide category labels in print */
          .course-card h4 { border-bottom: none !important; margin-bottom: 0 !important; font-size: 14px !important; }
          .course-card .prereq-text { font-size: 10px !important; font-style: italic !important; }

          /* Tabular Exemptions */
          .prior-credits-container { 
            border: 2px solid #10b981 !important; 
            border-radius: 0 !important;
            padding: 15px !important;
            margin-bottom: 20px !important;
          }
          .prior-credits-container h3 { color: #065f46 !important; border-bottom: 2px solid #10b981 !important; margin-bottom: 10px !important; }
          .exemption-row { 
            display: grid !important; 
            grid-template-columns: 100px 1fr 60px !important;
            border-bottom: 1px solid #eee !important;
            padding: 8px 0 !important;
            align-items: center !important;
          }
        }
        
        .print-only { display: none; }
      ` }} />
      <div className="max-w-7xl mx-auto space-y-12 print:max-w-none print:space-y-4">
        
        {/* Print-Only Header */}
        <div className="print-only text-center mb-8 border-b-4 border-black pb-4">
          <h1 className="text-3xl font-bold uppercase tracking-tighter">Official Degree Roadmap</h1>
          <p className="text-lg font-bold">{selectedProgram?.name || 'Academic Plan'}</p>
          <div className="flex justify-between mt-4 font-mono text-sm">
            <span>Prepared on: {new Date().toLocaleDateString()}</span>
            <span>Target Credits: {targetCredits} CR</span>
          </div>
        </div>

        {/* Web-Only Header */}
        <div className="mb-16 text-center print:hidden">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#912338]/10 text-[#912338] font-bold text-xs uppercase tracking-widest mb-6">
            {selectedProgram ? selectedProgram.name : "Degree Pathfinder"}
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Degree Path <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#912338] to-red-600">Generator</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-white/60 dark:text-white/50 max-w-2xl mx-auto font-medium">
            Get a perfect, prerequisite-safe, semester-by-semester plan for your Computer Science degree.
          </p>
        </div>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: CONFIG */}
          {step === 'config' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-8 justify-center max-w-4xl mx-auto"
            >
              <div className="mb-2">
                <h2 className="text-4xl font-black text-slate-800 dark:text-white/90 mb-2 tracking-tight">Step 1: Configure Your Profile</h2>
                <p className="text-slate-500 dark:text-white/60 font-medium text-lg">Customize your starting point and preferences.</p>
              </div>
              
              {/* Profile Configurator */}
              <div className="flex flex-col gap-4">
                {selectedProgram.options && (
                  <div className="bg-white dark:bg-white/[0.03] backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white/90">Program Option</h4>
                      <p className="text-sm text-slate-500 dark:text-white/60 font-medium">Select your specific degree option.</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <select 
                        value={selectedOptionId || selectedProgram.options[0].id}
                        onChange={(e) => setSelectedOptionId(e.target.value)}
                        className="px-4 py-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/[0.08] rounded-xl font-bold text-slate-700 dark:text-white/80 outline-none focus:ring-2 focus:ring-[#912338]/50 w-full"
                      >
                        {selectedProgram.options.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                
                <div className="bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white/90">When are you starting?</h4>
                    <p className="text-sm text-slate-500 dark:text-white/60 dark:text-white/50 font-medium">Select your first active semester.</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <select 
                      value={startTerm}
                      onChange={(e) => setStartTerm(e.target.value)}
                      className="px-4 py-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/[0.08] rounded-xl font-bold text-slate-700 dark:text-white/80 outline-none focus:ring-2 focus:ring-[#912338]/50 w-full md:w-auto"
                    >
                      <option value="Fall">Fall (Sept - Dec)</option>
                      <option value="Winter">Winter (Jan - April)</option>
                      <option value="Summer">Summer (May - Aug)</option>
                    </select>
                    <select 
                      value={startYear}
                      onChange={(e) => setStartYear(parseInt(e.target.value))}
                      className="px-4 py-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/[0.08] rounded-xl font-bold text-slate-700 dark:text-white/80 outline-none focus:ring-2 focus:ring-[#912338]/50 w-full md:w-auto"
                    >
                      {[...Array(8)].map((_, i) => {
                         const yr = new Date().getFullYear() - 3 + i;
                         return <option key={yr} value={yr}>{yr}</option>
                      })}
                    </select>
                  </div>
                </div>

                <div className="bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white/90">Extended Credit Program (ECP) Foundation</h4>
                    <p className="text-sm text-slate-500 dark:text-white/60 dark:text-white/50 font-medium">I am an international or out-of-province student and need to take foundational Science/Math prerequisites.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={includeMathProfile} onChange={() => setIncludeMathProfile(!includeMathProfile)} />
                  <div className="w-14 h-7 bg-slate-200 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.06] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md after:border-slate-300 dark:border-slate-600 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#912338]"></div>
                </label>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mt-12">
                  <div 
                    onClick={handleFirstYear}
                    className="flex-1 bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md p-10 rounded-[2rem] border border-slate-200 dark:border-white/[0.08] hover:border-[#912338]/50 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer text-center group"
                  >
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                    </div>
                    <h3 className="text-3xl font-extrabold mb-4 text-slate-800 dark:text-white/90">New Student</h3>
                    <p className="text-slate-500 dark:text-white/60 dark:text-white/50 font-medium text-lg px-4">
                      I am a first-year student. Generate my full degree path from the beginning.
                    </p>
                  </div>

                  <div 
                    onClick={() => setStep('select-courses')}
                    className="flex-1 bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md p-10 rounded-[2rem] border border-slate-200 dark:border-white/[0.08] hover:border-[#912338]/50 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer text-center group"
                  >
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    </div>
                    <h3 className="text-3xl font-extrabold mb-4 text-slate-800 dark:text-white/90">Continuing Student</h3>
                    <p className="text-slate-500 dark:text-white/60 dark:text-white/50 font-medium text-lg px-4">
                      I have already completed some university courses or transfer credits.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <button 
                    onClick={() => setStep('select-program')}
                    className="px-8 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50 font-bold hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                  >
                    ← Back to Program Selection
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 0: SELECT PROGRAM */}
          {step === 'select-program' && (
            <motion.div 
              key="select-program"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-white/[0.03] backdrop-blur-md p-10 mb-8 border border-slate-200 dark:border-white/20 rounded-[2rem] shadow-xl">
                <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-4">Step 0: Select Your Program</h2>
                <p className="text-slate-500 dark:text-blue-200 text-lg mb-10">We've expanded our tracker! Choose your department and degree to begin.</p>
                
                {/* SMART RESUME DASHBOARD - PREMIUM GLASSMORPHISM */}
                {user && localStorage.getItem(`conu_plan_${user.id}`) && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -8, scale: 1.01 }}
                    onClick={resumeSavedPlan}
                    className="mb-12 p-1 relative group cursor-pointer overflow-hidden rounded-[2.5rem]"
                  >
                    {/* Animated Border/Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#912338] via-rose-500 to-[#912338] opacity-20 group-hover:opacity-40 blur-xl transition-opacity duration-700 animate-gradient-x" />
                    
                    <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl p-10 rounded-[2.4rem] border border-white/20 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(145,35,56,0.15)] flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-[0.03] dark:opacity-[0.07] group-hover:scale-110 transition-transform duration-1000">
                        <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="50" /></svg>
                      </div>

                      <div className="relative z-10 flex-1">
                        <div className="flex items-center gap-3 mb-6">
                          <span className="w-3 h-3 rounded-full bg-[#912338] animate-ping" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#912338] dark:text-rose-400">Secure Cloud Save Detected</span>
                        </div>
                        <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-3 tracking-tighter leading-none">
                          Resume Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#912338] to-rose-600">Concordia Journey</span>
                        </h3>
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Program</span>
                            <span className="text-lg font-bold text-slate-700 dark:text-white/90">{PROGRAMS[JSON.parse(localStorage.getItem(`conu_plan_${user.id}`))?.selectedProgramId]?.name || 'My Degree'}</span>
                          </div>
                          <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Synced</span>
                            <span className="text-lg font-bold text-slate-700 dark:text-white/90">{new Date(JSON.parse(localStorage.getItem(`conu_plan_${user.id}`))?.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 relative z-10">
                        <div className="px-8 py-5 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-[0.15em] flex items-center gap-4 shadow-2xl hover:bg-[#912338] transition-all group/btn">
                          Launch Roadmap
                          <svg className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                        </div>
                        
                        <button 
                          onClick={forgetSavedPlan}
                          className="p-5 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-600 transition-all border border-transparent hover:border-rose-200"
                          title="Forget this plan"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(PROGRAMS).map((prog) => (
                    <button
                      key={prog.id}
                      onClick={() => {
                        setSelectedProgramId(prog.id);
                        setStep('config');
                      }}
                      className={`group relative p-8 pl-10 rounded-3xl text-left transition-all duration-300 ${
                        selectedProgramId === prog.id 
                        ? 'bg-blue-50 dark:bg-blue-600/40 border-blue-400/50 shadow-2xl shadow-blue-900/20' 
                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50'
                      } border overflow-hidden`}
                    >
                      {/* Left "Coat" Border Strip */}
                      <div className={`absolute top-0 left-0 w-2 h-full ${getCategoryBorderColor(prog.category)}`} />

                      {/* Right Background Icon watermark */}
                      <div className="absolute -right-4 -bottom-4 pointer-events-none">
                        {getCategoryIcon(prog.category)}
                      </div>

                      <div className="relative z-10 flex justify-between items-start mb-4">
                        <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${getCategoryColor(prog.category)}`}>
                          {prog.category}
                        </span>
                        {selectedProgramId === prog.id && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <h3 className="relative z-10 text-2xl font-black text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors tracking-tight">
                        {debugRender(prog.name, "prog.name")}
                      </h3>
                      <p className="relative z-10 text-sm font-medium text-slate-500 dark:text-gray-400 opacity-80 uppercase tracking-widest">
                        {prog.options ? prog.options[0].data.totalCredits : prog.data.totalCredits} Credits • Undergraduate
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 1: SELECT COMPLETED COURSES */}
          {step === 'select-courses' && (
            <motion.div 
              key="select-courses"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md p-10 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/[0.08]"
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                  <h2 className="text-4xl font-black text-slate-800 dark:text-white/90 mb-2 tracking-tight">Step 2: Previous Experience</h2>
                  <p className="text-slate-500 dark:text-white/60 dark:text-white/50 font-medium text-lg">Click on the classes you have already passed.</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep('select-program')}
                    className="px-6 py-4 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 rounded-2xl text-slate-700 dark:text-white font-bold transition-all"
                  >
                    Change Program
                  </button>
                  <button 
                    onClick={() => setStep('plan')}
                    className="bg-[#912338] text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl hover:bg-[#7a1d2f] hover:-translate-y-1 transition-all"
                  >
                    Generate Plan →
                  </button>
                </div>
              </div>
              
              <div className="space-y-12">
                {Object.entries(categories).map(([category, courses]) => (
                  <div key={category} className="space-y-6">
                    <h3 className="text-2xl font-black text-[#912338] dark:text-blue-300 border-b border-slate-200 dark:border-white/10 pb-4 uppercase tracking-widest">{debugRender(category, "step2.category")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map(course => (
                        <div 
                          key={typeof course === 'string' ? course : Math.random()}
                          onClick={() => toggleCourse(course)}
                          className={`p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-300 ${
                            completedCourses.includes(course) 
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-xl shadow-emerald-500/10' 
                              : 'border-slate-100 dark:border-white/[0.08] hover:border-[#912338]/40 text-slate-600 dark:text-white/70 bg-white dark:bg-white/[0.02] backdrop-blur-sm'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-black text-lg">{typeof course === 'string' ? course : "Invalid Entry"}</span>
                            {completedCourses.includes(course) && (
                              <div className="bg-emerald-500 text-white rounded-full p-1 shadow-lg shadow-emerald-500/40">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-10 border-t border-slate-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={includeMathProfile}
                      onChange={(e) => setIncludeMathProfile(e.target.checked)}
                    />
                    <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                    <span className="ml-4 text-base font-bold text-gray-300 tracking-tight">ECP / Math Deficiencies?</span>
                  </label>
                </div>

                <div className="flex gap-6">
                  <button 
                    onClick={handleFirstYear}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
                  >
                    I'm a New Student
                  </button>
                  <button 
                    onClick={() => setStep('plan')}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black transition-all hover:shadow-2xl hover:shadow-blue-900/40 hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
                  >
                    Generate Roadmap
                  </button>
                </div>
              </div>
            </motion.div>
          )}


          {/* STEP 3: PLAN */}
          {step === 'plan' && plan && (
            <motion.div 
              key="plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* STEP 3 HEADER - MODERN COMMAND CENTER */}
              <div className="mb-12 print:hidden">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5 bg-[#912338]/10 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-[#912338] animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#912338]">Live Roadmap</span>
                      </div>
                      {user && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          Linked to Profile
                        </motion.div>
                      )}
                    </div>
                    
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter leading-tight mb-2">
                      Your Academic <span className="text-[#912338]">Masterplan</span>
                    </h2>
                    <p className="text-slate-500 dark:text-white/50 font-medium text-lg max-w-xl">
                      Optimized based on {PROGRAMS[selectedProgramId]?.name} requirements and typical Concordia sequences.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {user && (
                      <button 
                        onClick={saveToProfile}
                        className={`flex-1 lg:flex-none px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                          saveStatus === 'success' 
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                            : saveStatus === 'saving'
                              ? 'bg-slate-800 text-white animate-pulse'
                              : 'bg-slate-900 text-white hover:bg-[#912338] shadow-slate-900/20'
                        }`}
                      >
                        {saveStatus === 'saving' ? (
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : saveStatus === 'success' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                        )}
                        {saveStatus === 'success' ? 'Plan Synced' : saveStatus === 'saving' ? 'Syncing...' : 'Sync to Profile'}
                      </button>
                    )}

                    <div className="h-10 w-px bg-slate-200 dark:bg-white/10 hidden lg:block" />

                    <div className="flex items-center gap-2 w-full lg:w-auto">
                      <button 
                        onClick={() => {
                          const data = { plan, completedCourses, startTerm, startYear, electiveChoices, curriculum };
                          localStorage.setItem('roadmapData', JSON.stringify(data));
                          window.open('/pages/degree-tracker/roadmap', '_blank');
                        }}
                        className="flex-1 lg:flex-none p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-50 transition-all group"
                        title="Open Visual Roadmap"
                      >
                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                      </button>
                      <button 
                        onClick={() => setStep('select-program')}
                        className="flex-1 lg:flex-none p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-50 transition-all group"
                        title="Change Program"
                      >
                        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button 
                        onClick={() => window.print()}
                        className="flex-1 lg:flex-none px-8 py-4 rounded-2xl bg-[#912338] text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#7a1d2f] transition-all shadow-xl shadow-[#912338]/20 flex items-center justify-center gap-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4" /></svg>
                        Export Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8 p-4 rounded-2xl bg-white dark:bg-white/[0.03] backdrop-blur-md border border-slate-200 dark:border-white/[0.08] flex flex-wrap gap-x-6 gap-y-3 items-center shadow-sm">
                <span className="text-sm font-black text-slate-500 dark:text-white/50 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Legend:
                </span>
                
                {includeMathProfile && (
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full shadow-inner bg-slate-200 dark:bg-slate-800`} />
                    <span className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wide">ECP Foundation</span>
                  </div>
                )}
                
                {curriculum && curriculum.requirements.map(req => {
                  const catStyle = courseCategoryMap[req.category];
                  if (!catStyle) return null;
                  return (
                    <div key={req.category} className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full shadow-inner ${catStyle.dot.replace('bg-', 'bg-').replace('/40', '')}`} />
                      <span className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wide">{debugRender(req.category, "legend.category")}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="grid gap-8">
                {/* PRIOR CREDITS / EXEMPTIONS */}
                {completedCourses.length > 0 && (
                  <div className="prior-credits-container bg-emerald-50/30 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-800/30 p-8 rounded-[2.5rem] mb-12 relative overflow-hidden group print:border-emerald-500/40 print:break-inside-avoid print:page-break-inside-avoid">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-2xl font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-3 uppercase tracking-widest">
                        Prior Credits & Exemptions
                        <span className="text-xs font-black bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full">{completedCourses.length} Courses</span>
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {completedCourses.map((course, i) => (
                        <div 
                          key={i} 
                          onClick={() => setActiveCourseDetails(course)}
                          className="exemption-row p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-emerald-100 dark:border-emerald-800/20 shadow-sm flex flex-col justify-between group/card relative cursor-pointer"
                        >
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 rounded-l-2xl opacity-0 group-hover/card:opacity-100 transition-opacity" />
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md uppercase tracking-widest print:hidden">Exempt</span>
                            <span className="font-black text-xl text-slate-800 dark:text-white/90 print:text-sm">{course}</span>
                          </div>
                          <p className="text-sm font-bold text-slate-500 dark:text-white/60 line-clamp-1 mb-1 print:text-xs">{courseTitles[course]}</p>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-emerald-50 dark:border-emerald-900/30 print:hidden">
                            <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest">Confirmed Transfer</span>
                            <span className="text-xs font-black text-slate-400">{getCredits(course)} CR</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* GRADUATION PROGRESS BAR */}
                {curriculum && (
                  <div className="bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.08] relative overflow-hidden print:hidden">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <h4 className="text-sm font-black text-slate-400 dark:text-white/50 uppercase tracking-widest mb-1">Graduation Progress</h4>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-slate-800 dark:text-white/90">
                            {plan.flat().reduce((sum, c) => sum + getCredits(c), 0) + completedCourses.reduce((sum, c) => sum + getCredits(c), 0)}
                          </span>
                          <span className="text-lg font-bold text-slate-400 dark:text-white/50">/ {targetCredits} Credits</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <h4 className="text-sm font-black text-slate-400 dark:text-white/50 uppercase tracking-widest mb-1">Expected Graduation</h4>
                        <span className="text-xl font-black text-[#912338]">
                          {plan.length > 0 ? getTermName(plan.length - 1) : 'TBD'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full h-4 bg-slate-100 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.04] rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-emerald-400"
                        style={{ width: `${Math.min(100, (completedCourses.reduce((sum, c) => sum + getCredits(c), 0) / targetCredits) * 100)}%` }}
                        title="Completed Credits"
                      />
                      <div 
                        className="h-full bg-[#912338]"
                        style={{ width: `${Math.min(100, (plan.flat().reduce((sum, c) => sum + getCredits(c), 0) / targetCredits) * 100)}%` }}
                        title="Planned Credits"
                      />
                    </div>
                    
                    {plan.flat().reduce((sum, c) => sum + getCredits(c), 0) + completedCourses.reduce((sum, c) => sum + getCredits(c), 0) < targetCredits && (
                      <p className="mt-3 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        Warning: You are below the required credits for graduation. Did you remove a core course?
                      </p>
                    )}
                  </div>
                )}

                {/* GENERATED SEMESTERS */}
                {plan.map((semesterOriginal, idx) => {
                  const semester = [...semesterOriginal, ...(manualAdds[idx] || [])];
                  if (semester.length === 0) {
                    if (skippedSemesters.includes(idx)) {
                      return (
                        <div key={idx} className="bg-slate-50 dark:bg-black/20 p-6 rounded-[2rem] border border-dashed border-slate-300 dark:border-white/10 flex justify-between items-center opacity-70">
                          <div>
                            <h4 className="text-xl font-black text-slate-500 dark:text-white/40 uppercase tracking-widest flex items-center gap-3">
                              Semester {idx + 1} 
                              <span className="text-sm font-bold bg-slate-200 dark:bg-white/5 text-slate-500 dark:text-white/40 px-3 py-1 rounded-full">{getTermName(idx)}</span>
                            </h4>
                            <p className="text-sm font-bold text-slate-400 mt-1">You are taking this term off. Courses have been pushed to the next available term.</p>
                          </div>
                          <button 
                            onClick={() => setSkippedSemesters(prev => prev.filter(i => i !== idx))}
                            className="bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white/80 font-bold px-5 py-2 rounded-xl transition-colors print:hidden"
                          >
                            Restore Term
                          </button>
                        </div>
                      );
                    }
                    return null;
                  }
                  
                  const semesterCredits = semester.reduce((sum, c) => sum + getCredits(c), 0);
                  
                  return (
                    <div key={idx} className="semester-block bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-white/[0.08] relative overflow-hidden group transition-shadow print:break-inside-avoid print:page-break-inside-avoid print:shadow-none print:border-slate-300">
                      <div className="absolute top-0 left-0 w-2 h-full bg-slate-200 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.06] group-hover:bg-[#912338] transition-colors print:bg-[#912338]" />
                      
                      <div className="flex justify-between items-center mb-6 pl-4 border-b border-slate-100 dark:border-white/[0.08] pb-4">
                        <h4 className="text-2xl font-black text-slate-800 dark:text-white/90 uppercase tracking-widest transition-colors flex items-center gap-3">
                          Semester {idx + 1} 
                          <span className="text-sm font-bold bg-slate-100 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.04] text-slate-500 dark:text-white/60 dark:text-white/50 px-3 py-1 rounded-full print:border print:border-slate-200">{getTermName(idx)}</span>
                        </h4>
                        <div className="flex items-center gap-4">
                          {skippedSemesters.includes(idx) ? (
                            <button 
                              onClick={() => setSkippedSemesters(prev => prev.filter(s => s !== idx))}
                              className="text-emerald-500 hover:text-emerald-600 font-bold px-3 py-1.5 rounded-xl text-sm transition-colors print:hidden"
                            >
                              Resume This Term
                            </button>
                          ) : (
                            <button 
                              onClick={() => setSkippedSemesters(prev => [...prev, idx])}
                              className="text-slate-400 hover:text-red-500 font-bold px-3 py-1.5 rounded-xl text-sm transition-colors print:hidden"
                            >
                              Take Term Off
                            </button>
                          )}
                          <button 
                            onClick={() => setManualAddPrompt({ semesterIdx: idx })}
                            className="bg-slate-100 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.04] hover:bg-slate-200 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.06] text-slate-600 dark:text-white/70 font-bold px-4 py-1.5 rounded-xl text-sm transition-colors flex items-center gap-2 print:hidden"
                          >
                            <span>+ Add Course</span>
                          </button>
                          <div className="bg-[#912338]/10 text-[#912338] font-black px-4 py-1.5 rounded-xl">
                            {semesterCredits} Credits
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pl-4">
                        {semester.length === 0 ? (
                          <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl opacity-50">
                            <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-slate-400 font-bold">This term is skipped or empty.</p>
                          </div>
                        ) : semester.map((course, cIdx) => {
                           const isElectivePlaceholder = course.includes('Elective') || course.includes('Group');
                           const title = courseTitles[course] || (isElectivePlaceholder ? "Click to select a course" : "Course Title Unavailable");
                           const elStyles = isElectivePlaceholder ? getElectiveStyles(course) : null;
                           const category = getCourseCategory(course);
                           const categoryStyle = category ? courseCategoryMap[category] : null;
                           
                           return (
                             <div 
                               key={cIdx} 
                               onClick={() => handleElectiveClick(course)}
                               className={`course-card p-5 rounded-2xl border-2 cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between print:flex-row print:items-center print:gap-4 print:border-slate-200 print:hover:translate-y-0 print:hover:shadow-none print:p-2 print:border-b print:border-x-0 print:border-t-0 print:rounded-none ${
                                 isElectivePlaceholder 
                                   ? `${elStyles.bg} ${elStyles.border} ${elStyles.text}` 
                                   : 'bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md border-slate-100 dark:border-white/[0.08] text-slate-800 dark:text-white/90'
                               }`}
                             >
                               <div className="flex-1 print:flex print:items-center print:gap-6">
                                 <div className="flex justify-between items-start mb-2 print:mb-0 print:w-32 print:shrink-0">
                                   <div className="flex flex-col gap-1.5">
                                     {categoryStyle && (
                                       <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md w-fit border shadow-sm ${categoryStyle.color} print:hidden`}>
                                         {category}
                                       </span>
                                     )}
                                     <span className={`font-black text-xl print:text-sm ${isElectivePlaceholder ? elStyles.title : 'text-[#912338]'}`}>
                                       {debugRender(course, "plancourse")}
                                     </span>
                                   </div>
                                   <span className="text-xs font-bold bg-slate-100 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.04] text-slate-500 dark:text-white/60 dark:text-white/50 px-2 py-1 rounded-md shadow-sm shrink-0 print:text-[10px]">{getCredits(course)} CR</span>
                                 </div>
                                 <p className="text-sm font-semibold opacity-80 leading-tight line-clamp-2 mb-4 print:mb-0 print:text-xs print:flex-1">
                                   {debugRender(title, "plantitle")}
                                 </p>
                               </div>

                               {!isElectivePlaceholder && (
                                 <div className="mt-auto pt-3 border-t border-black/5 print:border-none print:pt-0 print:w-48 print:text-right">
                                   <p className="text-xs font-bold text-slate-400 dark:text-white/50 uppercase tracking-wider mb-1 print:hidden">Prerequisites</p>
                                   <p className="text-xs font-medium text-slate-600 dark:text-white/70 truncate print:text-[9px] print:italic">
                                     {typeof course === 'string' ? getPrereqString(course) : "N/A"}
                                   </p>
                                 </div>
                               )}
                             </div>
                           )
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FORGET PLAN CONFIRMATION MODAL - ULTRA SLEEK */}
      <AnimatePresence>
        {showForgetConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40, rotateX: 10 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, y: 40, rotateX: 10 }}
              className="bg-white dark:bg-slate-900 border border-white/20 dark:border-white/5 rounded-[3rem] p-12 max-w-xl w-full shadow-[0_64px_128px_-24px_rgba(0,0,0,0.5)] overflow-hidden relative"
            >
              {/* Top Accent Gradient */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 via-[#912338] to-rose-500" />
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                <div className="w-24 h-24 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                
                <div className="text-center md:text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 mb-3 block">Danger Zone</span>
                  <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-4 tracking-tighter">Discard Academic Plan?</h3>
                  <p className="text-slate-500 dark:text-white/60 mb-8 font-medium text-lg leading-relaxed">
                    You are about to permanently erase your saved roadmap and course exemptions. This action is <span className="text-slate-900 dark:text-white font-bold underline decoration-rose-500">irreversible</span>.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={handleConfirmForget}
                      className="px-10 py-5 rounded-2xl bg-rose-600 text-white font-black text-xs uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-600/20 transition-all flex-1"
                    >
                      Yes, Wipe Data
                    </button>
                    <button 
                      onClick={() => setShowForgetConfirm(false)}
                      className="px-10 py-5 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex-1"
                    >
                      Keep Everything
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL FOR ELECTIVE SELECTION */}
      <AnimatePresence>
        {activeElectiveSlot && (
          <motion.div 
            key="elective-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setActiveElectiveSlot(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-slate-100 dark:border-white/[0.08] bg-slate-50 dark:bg-black flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white/90">Select {activeElectiveSlot.type} Elective</h3>
                  <p className="text-slate-500 dark:text-white/60 dark:text-white/50 font-medium text-sm mt-1">Replacing: {activeElectiveSlot.slot}</p>
                </div>
                <button onClick={() => setActiveElectiveSlot(null)} className="p-2 bg-slate-200 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.06] text-slate-600 dark:text-white/70 rounded-full hover:bg-slate-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* SEARCH BAR */}
              <div className="p-4 border-b border-slate-100 dark:border-white/[0.08] bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md">
                <div className="relative">
                  <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input 
                    type="text" 
                    placeholder="Search by course code (e.g., HIST 200) or title..." 
                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/[0.08] rounded-xl py-3 pl-12 pr-4 font-medium text-slate-700 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-[#912338]/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="p-4 overflow-y-auto flex-1 bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md">
                {filteredElectiveList.length === 0 ? (
                  <div className="text-center text-slate-500 dark:text-white/60 dark:text-white/50 py-10 font-medium">No courses found matching "{searchQuery}"</div>
                ) : (
                  <div className="grid gap-3">
                    {filteredElectiveList.map(c => (
                      <div 
                        key={c}
                        onClick={() => selectElective(activeElectiveSlot.slot, c)}
                        className="p-4 rounded-xl border border-slate-100 dark:border-white/[0.08] hover:border-[#912338] hover:bg-red-50 cursor-pointer transition-colors group flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-lg text-slate-800 dark:text-white/90 group-hover:text-[#912338]">
                            {typeof c === 'string' ? c : "Invalid Course"}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-white/60 dark:text-white/50">{courseTitles[c] || "Description unavailable"}</div>
                        </div>
                        <div className="text-xs font-bold text-slate-400 dark:text-white/50 bg-slate-100 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.04] px-2 py-1 rounded-lg">
                          {getCredits(c)} CR
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL FOR MANUAL COURSE ADDITION */}
        {manualAddPrompt && (
          <motion.div 
            key="manual-add-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setManualAddPrompt(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md w-full max-w-md rounded-[2rem] shadow-2xl p-8"
            >
              <h3 className="text-2xl font-black text-slate-800 dark:text-white/90 mb-2">Add Course to Semester {manualAddPrompt.semesterIdx + 1}</h3>
              <p className="text-slate-500 dark:text-white/60 dark:text-white/50 font-medium mb-6">Type the exact course code you want to append to this term (e.g., COMP 490).</p>
              
              <input 
                type="text"
                autoFocus
                placeholder="e.g. HIST 200"
                className="w-full bg-slate-50 dark:bg-black border-2 border-slate-200 dark:border-white/[0.08] rounded-xl p-4 font-bold text-lg text-slate-800 dark:text-white/90 mb-6 focus:outline-none focus:border-[#912338]"
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitManualAdd()}
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => setManualAddPrompt(null)}
                  className="flex-1 bg-slate-100 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.04] text-slate-600 dark:text-white/70 font-bold py-3 rounded-xl hover:bg-slate-200 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.06] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitManualAdd}
                  className="flex-1 bg-[#912338] text-white font-bold py-3 rounded-xl hover:bg-[#7a1d2f] transition-colors"
                >
                  Add Course
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL FOR COURSE DETAILS */}
        {activeCourseDetails && (
          <motion.div 
            key="course-details-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setActiveCourseDetails(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md w-full max-w-md rounded-[2rem] shadow-2xl p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-black text-[#912338] mb-1">{typeof activeCourseDetails === 'string' ? activeCourseDetails : "Course Details"}</h3>
                  <p className="font-bold text-slate-500 dark:text-white/60 dark:text-white/50 leading-tight">{courseTitles[activeCourseDetails] || "Title Unavailable"}</p>
                </div>
                <div className="bg-slate-100 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.04] font-bold text-slate-700 dark:text-white/80 px-3 py-1 rounded-lg">
                  {getCredits(activeCourseDetails)} CR
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 dark:bg-black p-4 rounded-xl border border-slate-100 dark:border-white/[0.08]">
                  <p className="text-xs font-bold text-slate-400 dark:text-white/50 uppercase tracking-widest mb-1">Prerequisites</p>
                  <p className="font-medium text-slate-800 dark:text-white/90">{getPrereqString(activeCourseDetails)}</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-black p-4 rounded-xl border border-slate-100 dark:border-white/[0.08]">
                  <p className="text-xs font-bold text-slate-400 dark:text-white/50 uppercase tracking-widest mb-1">Corequisites</p>
                  <p className="font-medium text-slate-800 dark:text-white/90">
                    {curriculum.courses[activeCourseDetails]?.corequisites?.length > 0 
                      ? curriculum.courses[activeCourseDetails].corequisites.join(", ") 
                      : "None"}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Editing/Removing/Exemptions */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    toggleCourse(activeCourseDetails);
                    setActiveCourseDetails(null);
                  }}
                  className={`w-full font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 ${
                    completedCourses.includes(activeCourseDetails)
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  {completedCourses.includes(activeCourseDetails) ? 'Remove Exemption' : 'Mark as Exempt / Completed'}
                </button>

                {isChosenElective(activeCourseDetails) && (
                  <button 
                    onClick={() => unselectElective(activeCourseDetails)}
                    className="w-full bg-amber-100 text-amber-800 font-bold py-3 rounded-xl hover:bg-amber-200 transition-colors flex justify-center items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Remove Selected Elective
                  </button>
                )}

                {!completedCourses.includes(activeCourseDetails) && !isChosenElective(activeCourseDetails) && !isManualAdd(activeCourseDetails) && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                      <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-3 tracking-wider">Reschedule Course</label>
                      <div className="flex gap-2">
                        <select 
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) {
                              setDelayedCourses(prev => ({ ...prev, [activeCourseDetails]: val }));
                              setActiveCourseDetails(null);
                            }
                          }}
                          className="flex-1 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-2 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue=""
                        >
                          <option value="" disabled>Select target semester...</option>
                          {Array.from({ length: 12 }).map((_, i) => {
                            const currentSemIdx = plan?.findIndex(sem => sem.includes(activeCourseDetails));
                            if (i <= (currentSemIdx || 0)) return null;
                            return (
                              <option key={i} value={i}>
                                Move to Semester {i + 1} ({getTermName(i)})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    {/* Chain Reaction Warning */}
                    {(() => {
                      const impact = getImpactedCourses(activeCourseDetails);
                      if (impact.length > 0) {
                        return (
                          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                            <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                              <span className="text-xs font-black uppercase tracking-wider">Chain Reaction Warning</span>
                            </div>
                            <p className="text-xs font-bold text-amber-600 dark:text-amber-300/80 mb-2">
                              Moving this course will also delay the following {impact.length} courses:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {impact.slice(0, 10).map(c => (
                                <span key={c} className="text-[10px] bg-amber-200/50 dark:bg-amber-800/40 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-md font-bold">
                                  {c}
                                </span>
                              ))}
                              {impact.length > 10 && <span className="text-[10px] text-amber-600 font-bold">+{impact.length - 10} more</span>}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {delayedCourses[activeCourseDetails] !== undefined && (
                      <button 
                        onClick={() => {
                          setDelayedCourses(prev => {
                            const newDelays = { ...prev };
                            delete newDelays[activeCourseDetails];
                            return newDelays;
                          });
                          setActiveCourseDetails(null);
                        }}
                        className="w-full font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Reset Timing Constraints
                      </button>
                    )}

                    <button 
                      onClick={() => {
                        setIgnoredCourses(prev => [...prev, activeCourseDetails]);
                        setActiveCourseDetails(null);
                      }}
                      className="w-full font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Remove Course Completely
                    </button>
                  </div>
                )}

                {isManualAdd(activeCourseDetails) && (
                  <button 
                    onClick={() => {
                      const semIdx = Object.keys(manualAdds).find(k => manualAdds[k].includes(activeCourseDetails));
                      removeManualAdd(semIdx, activeCourseDetails);
                    }}
                    className="w-full bg-red-100 text-red-800 font-bold py-3 rounded-xl hover:bg-red-200 transition-colors flex justify-center items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Remove Manually Added Course
                  </button>
                )}

                <button 
                  onClick={() => setActiveCourseDetails(null)}
                  className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL FOR ERROR MESSAGES */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setErrorMsg(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className={`bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md w-full max-w-md rounded-[2rem] shadow-2xl p-8 border-l-8 ${errorMsg.type === 'warning' ? 'border-amber-500' : 'border-red-500'}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${errorMsg.type === 'warning' ? 'bg-amber-100 text-amber-500' : 'bg-red-100 text-red-500'}`}>
                  {errorMsg.type === 'warning' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white/90">{errorMsg.title}</h3>
              </div>
              <p className="text-slate-600 dark:text-white/70 font-medium mb-8 whitespace-pre-wrap">{errorMsg.message}</p>
              
              <button 
                onClick={() => setErrorMsg(null)}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Understood
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bug Report Floating Button */}
      {step === 'select-program' && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
              setBugForm(prev => ({ ...prev, program: PROGRAMS[selectedProgramId]?.name || '' }));
              setShowBugReport(true);
          }}
          className="fixed bottom-8 left-8 z-50 bg-amber-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold group overflow-hidden border-4 border-white dark:border-slate-800"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </motion.div>
          <span className="max-w-0 group-hover:max-w-xs transition-all duration-500 whitespace-nowrap opacity-0 group-hover:opacity-100 pr-2">
            Report a Bug
          </span>
        </motion.button>
      )}

      {/* Bug Report Modal */}
      <AnimatePresence>
        {showBugReport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 border border-white/10 relative overflow-hidden"
            >
              <button 
                onClick={() => setShowBugReport(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">Report a Bug</h2>
              <p className="text-slate-500 dark:text-white/60 mb-6 font-medium">Found an error? Let us know!</p>

              <form onSubmit={submitBugReport} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">ECP Student?</label>
                    <select 
                      value={bugForm.ecp}
                      onChange={e => setBugForm({...bugForm, ecp: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-slate-700 dark:text-white"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Program Name</label>
                    <input 
                      type="text"
                      value={bugForm.program}
                      onChange={e => setBugForm({...bugForm, program: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-slate-700 dark:text-white"
                      placeholder="e.g. BCompSc General"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Course (Autocomplete)</label>
                  <input 
                    list="bug-courses"
                    type="text"
                    value={bugForm.course}
                    onChange={e => setBugForm({...bugForm, course: e.target.value.toUpperCase()})}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-slate-700 dark:text-white"
                    placeholder="e.g. COMP 352"
                    required
                  />
                  <datalist id="bug-courses">
                    {Object.keys(courseTitles)
                      .filter(c => c.toLowerCase().includes(bugForm.course.toLowerCase()) || courseTitles[c].toLowerCase().includes(bugForm.course.toLowerCase()))
                      .slice(0, 100)
                      .map(c => <option key={c} value={c}>{courseTitles[c]}</option>)}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">What is the error?</label>
                  <textarea 
                    value={bugForm.error}
                    onChange={e => setBugForm({...bugForm, error: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-slate-700 dark:text-white h-24"
                    placeholder="e.g. Prerequisite is wrong"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">What is the correct method?</label>
                  <textarea 
                    value={bugForm.correctMethod}
                    onChange={e => setBugForm({...bugForm, correctMethod: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-bold text-slate-700 dark:text-white h-24"
                    placeholder="Describe the fix..."
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={bugStatus !== 'idle'}
                  className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all ${bugStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  {bugStatus === 'idle' && 'Submit Bug Report'}
                  {bugStatus === 'submitting' && 'Sending Report...'}
                  {bugStatus === 'success' && 'Successfully Reported!'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
