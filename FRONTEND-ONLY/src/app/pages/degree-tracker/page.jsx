'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateOptimalPath } from '../../../utils/degreeEngine/prereqGraph';
import { BCompSc_Weights } from '../../../utils/degreeEngine/data/sequenceWeights';
import csCurriculum from '../../../utils/degreeEngine/computerScienceCurriculum.json';
import aeroOptionA from '../../../utils/degreeEngine/data/programs/aerospace-option-a.json';
import aeroOptionB from '../../../utils/degreeEngine/data/programs/aerospace-option-b.json';
import aeroOptionC from '../../../utils/degreeEngine/data/programs/aerospace-option-c.json';
import buildingCurriculum from '../../../utils/degreeEngine/data/programs/building.json';
import chemicalCurriculum from '../../../utils/degreeEngine/data/programs/chemical.json';
import civilCurriculum from '../../../utils/degreeEngine/data/programs/civil.json';
import computerEngCurriculum from '../../../utils/degreeEngine/data/programs/computer-eng.json';
import courseTitles from '../../../utils/degreeEngine/data/courseTitles.json';

const PROGRAMS = {
  'cs-general': {
    id: 'cs-general',
    name: 'Computer Science (BCompSc)',
    category: 'Computer Science & Software',
    data: csCurriculum,
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
  }
};

// Build the massive General Elective list from the allowed prefixes
const COMPLEMENTARY_PREFIXES = ['ANTH', 'FPST', 'HIST', 'PHIL', 'RELI', 'SOCI', 'THEO', 'WSDB', 'ARTE', 'ARTH', 'JHIS', 'MHIS', 'COMS', 'EDUC', 'ENGL', 'GEOG'];
const GENERAL_LIST = Object.keys(courseTitles).filter(code => 
  COMPLEMENTARY_PREFIXES.some(prefix => code.startsWith(prefix))
);

const EXCLUSION_LIST = [
  'BCEE 231', 'BIOL 322', 'BTM 380', 'BTM 382', 'CART 315', 'COMM 215', 
  'EXCI 322', 'GEOG 264', 'INTE 296', 'MAST 221', 'MAST 333', 'MIAE 215', 
  'PHYS 235', 'PHYS 236', 'SOCI 212'
];

const checkExclusion = (course) => {
  const code = course.toUpperCase().trim();
  if (EXCLUSION_LIST.includes(code)) return "This course is explicitly on the General Electives Exclusion List.";
  if (code.startsWith('COEN ') || code.startsWith('INTE ')) return "COEN and INTE courses cannot be taken as General Electives without special permission.";
  if (code.startsWith('ESL ')) return "ESL courses may not be taken to fulfill the General Electives requirement.";
  return null;
};

const categoryColors = {
  'Computer Science & Software': 'text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 border-purple-500/30',
  'Aerospace, Mechanical & Industrial': 'text-orange-600 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40 border-orange-500/30',
  'Civil & Environmental Engineering': 'text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500/30',
  'Chemical & Materials Engineering': 'text-rose-600 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/40 border-rose-500/30'
};

const getCategoryColor = (category) => categoryColors[category] || 'text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 border-blue-500/30';

export default function FreshDegreeTracker() {
  const [step, setStep] = useState('select-program'); // 'select-program' | 'config' | 'select-courses' | 'plan'
  const [completedCourses, setCompletedCourses] = useState([]);
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
  const categories = curriculum.requirements.reduce((acc, req) => {
    if (req.courses && req.courses.length > 0) {
      acc[req.category] = req.courses;
    }
    return acc;
  }, {});

  useEffect(() => {
    if (step === 'plan') {
      let ecpFoundation = [];
      if (includeMathProfile) {
        if (selectedProgram.category.includes('Engineering') || selectedProgram.category.includes('Aerospace')) {
          ecpFoundation = ['MATH 203', 'MATH 204', 'MATH 205', 'PHYS 204', 'PHYS 205', 'CHEM 205', 'CHEM 206'];
        } else {
          ecpFoundation = ['MATH 203', 'MATH 204', 'MATH 205'];
        }
      }
      
      // Build targets list dynamically based on curriculum
      let targets = [...ecpFoundation];
      
      curriculum.requirements.forEach(req => {
        if (req.category.includes('Elective')) {
          // Handle elective slots based on required credits
          const creditsPerCourse = 3; // Default assumption for slot count
          const count = Math.ceil(req.credits / creditsPerCourse);
          const slots = Array(count).fill().map((_, i) => {
            const slotName = count > 1 ? `${req.category} ${i + 1}` : req.category;
            return electiveChoices[slotName] || slotName;
          });
          targets = [...targets, ...slots];
        } else if (req.courses && req.courses.length > 0) {
          // Core courses
          targets = [...targets, ...req.courses];
        }
      });

      const invertedElectives = {};
      Object.entries(electiveChoices).forEach(([slot, course]) => {
          invertedElectives[course] = slot;
      });
      
      const remainingTargets = targets.filter(c => !completedCourses.includes(c));
      const result = generateOptimalPath(
        remainingTargets, 
        completedCourses, 
        curriculum.courses, 
        selectedProgram.weights,
        15.0, 
        invertedElectives, 
        startTerm
      );
      setPlan(result.semesters);
    }
  }, [completedCourses, electiveChoices, includeMathProfile, step, startTerm, startYear, selectedProgramId]);

  const handleFirstYear = () => {
    setCompletedCourses([]);
    setStep('plan');
  };

  const toggleCourse = (course) => {
    setCompletedCourses(prev => 
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    );
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
    if (!course.includes('Elective')) return null;
    if (course.includes('Math')) return { bg: 'bg-blue-50', border: 'border-blue-200 border-dashed', text: 'text-blue-900', title: 'text-blue-700' };
    if (course.includes('CS')) return { bg: 'bg-violet-50', border: 'border-violet-200 border-dashed', text: 'text-violet-900', title: 'text-violet-700' };
    if (course.includes('General')) return { bg: 'bg-amber-50', border: 'border-amber-200 border-dashed', text: 'text-amber-900', title: 'text-amber-700' };
    return { bg: 'bg-slate-50 dark:bg-black', border: 'border-slate-200 dark:border-white/[0.08] border-dashed', text: 'text-slate-900 dark:text-white', title: 'text-slate-700 dark:text-white/80' };
  };

  const getCredits = (course) => {
    if (course.includes('Elective')) return 3.0;
    return curriculum.courses[course]?.credits || 3.0;
  };

  const getPrereqString = (course) => {
    if (course === "ENCS 282") return "Students must pass the Engineering Writing Test (EWT), or pass ENCS 272 with a grade of C- or higher.";
    if (!curriculum.courses[course] || !curriculum.courses[course].prerequisites.length) return "None";
    return curriculum.courses[course].prerequisites.map(group => group.join(" OR ")).join(" AND ");
  };

  const handleElectiveClick = (course) => {
    setSearchQuery('');
    if (course.includes('Math Elective')) {
      const mathList = curriculum.requirements.find(r => r.category.includes('Math'))?.courses || [];
      setActiveElectiveSlot({ slot: course, type: 'MATH', list: mathList });
    } else if (course.includes('CS Elective')) {
      const csList = curriculum.requirements.find(r => r.category.includes('Computer Science Elective'))?.courses || [];
      setActiveElectiveSlot({ slot: course, type: 'CS', list: csList });
    } else if (course.includes('General Elective')) {
      setActiveElectiveSlot({ slot: course, type: 'GENERAL', list: GENERAL_LIST });
    } else if (course.includes('Elective')) {
        // Generic elective finder
        const req = curriculum.requirements.find(r => course.startsWith(r.category));
        const electiveList = req?.electiveSlots?.[0]?.list || req?.courses || [];
        setActiveElectiveSlot({ slot: course, type: 'TECHNICAL', list: electiveList });
    } else {
      setActiveCourseDetails(course);
    }
  };

  const selectElective = (slot, chosenCourse) => {
    const exclusionReason = checkExclusion(chosenCourse);
    if (exclusionReason && slot.includes('General Elective')) {
      setErrorMsg(`Cannot select ${chosenCourse}!\n\n${exclusionReason}`);
      return;
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
    
    const exclusionReason = checkExclusion(courseCode);
    if (exclusionReason) {
      setErrorMsg(`Cannot add ${courseCode}!\n\n${exclusionReason}`);
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

  const filteredElectiveList = activeElectiveSlot?.list.filter(c => 
    c.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (courseTitles[c] || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans p-8 selection:bg-[#912338] selection:text-white transition-all">
      <div className="max-w-6xl mx-auto mt-12">
        
        {/* Header */}
        <div className="mb-16 text-center">
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
            </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div 
                  onClick={handleFirstYear}
                  className="flex-1 bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md p-10 rounded-[2rem] border border-slate-200 dark:border-white/[0.08] hover:border-[#912338]/50 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer text-center group"
                >
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                  </div>
                  <h3 className="text-3xl font-extrabold mb-4 text-slate-800 dark:text-white/90">Start Planning</h3>
                  <p className="text-slate-500 dark:text-white/60 dark:text-white/50 font-medium text-lg px-4">
                    Generate my full degree path from the beginning.
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(PROGRAMS).map((prog) => (
                    <button
                      key={prog.id}
                      onClick={() => {
                        setSelectedProgramId(prog.id);
                        setStep('config');
                      }}
                      className={`group relative p-8 rounded-3xl text-left transition-all duration-300 ${
                        selectedProgramId === prog.id 
                        ? 'bg-blue-50 dark:bg-blue-600/40 border-blue-400/50 shadow-2xl shadow-blue-900/20' 
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
                      } border`}
                    >
                      <div className="flex justify-between items-start mb-4">
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
                      <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors tracking-tight">
                        {prog.name}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-gray-400 opacity-80 uppercase tracking-widest">
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
                    <h3 className="text-2xl font-black text-[#912338] dark:text-blue-300 border-b border-slate-200 dark:border-white/10 pb-4 uppercase tracking-widest">{category}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {courses.map(course => (
                        <div 
                          key={course}
                          onClick={() => toggleCourse(course)}
                          className={`p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-300 ${
                            completedCourses.includes(course) 
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-xl shadow-emerald-500/10' 
                              : 'border-slate-100 dark:border-white/[0.08] hover:border-[#912338]/40 text-slate-600 dark:text-white/70 bg-white dark:bg-white/[0.02] backdrop-blur-sm'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-black text-lg">{course}</span>
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                  <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white/90 tracking-tight">Step 3: Your Degree Plan</h2>
                  <p className="text-lg text-slate-500 dark:text-white/60 dark:text-white/50 font-medium mt-2">
                    Generated based on prerequisites and typical Concordia sequences.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      const data = { plan, completedCourses, startTerm, startYear, electiveChoices, curriculum };
                      localStorage.setItem('roadmapData', JSON.stringify(data));
                      window.open('/pages/degree-tracker/roadmap', '_blank');
                    }}
                    className="bg-[#912338] hover:bg-[#912338]/90 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                    Visual Roadmap
                  </button>
                  <button 
                    onClick={() => { setStep('select-program'); setPlan(null); setElectiveChoices({}); setManualAdds({}); setIncludeMathProfile(false); setShowRoadmap(false); }}
                    className="bg-slate-200 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.06] hover:bg-slate-300 text-slate-800 dark:text-white/90 font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm"
                  >
                    Start Over
                  </button>
                </div>
              </div>
              
              <div className="grid gap-8">
                {/* EXEMPTIONS / PRIOR CREDITS BLOCK */}
                {completedCourses.length > 0 && (
                  <div className="bg-emerald-50/60 p-8 rounded-[2rem] border border-emerald-200 relative overflow-hidden group transition-shadow">
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-400" />
                    
                    <div className="flex justify-between items-center mb-6 pl-4 border-b border-emerald-200/50 pb-4">
                      <h4 className="text-2xl font-black text-emerald-800 uppercase tracking-widest flex items-center gap-3">
                        Prior Credits & Exemptions
                      </h4>
                      <div className="bg-emerald-200/50 text-emerald-800 font-black px-4 py-1.5 rounded-xl">
                        {completedCourses.length} Courses
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pl-4 opacity-75">
                      {completedCourses.map((course, cIdx) => {
                         const title = courseTitles[course] || "Course Title Unavailable";
                         
                         return (
                           <div 
                             key={cIdx} 
                             onClick={() => setActiveCourseDetails(course)}
                             className="p-5 rounded-2xl border-2 border-emerald-200 bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md/50 cursor-pointer transition-transform hover:-translate-y-1 flex flex-col justify-between"
                           >
                             <div>
                               <div className="flex justify-between items-start mb-2">
                                 <span className="font-black text-xl text-emerald-700">{course}</span>
                                 <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md shadow-sm">EXEMPT/COMPLETED</span>
                               </div>
                               <p className="text-sm font-semibold opacity-80 leading-tight line-clamp-2">{title}</p>
                             </div>
                           </div>
                         )
                      })}
                    </div>
                  </div>
                )}

                {/* GENERATED SEMESTERS */}
                {plan.map((semesterOriginal, idx) => {
                  const semester = [...semesterOriginal, ...(manualAdds[idx] || [])];
                  if (semester.length === 0) return null;
                  
                  const semesterCredits = semester.reduce((sum, c) => sum + getCredits(c), 0);
                  
                  return (
                    <div key={idx} className="bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-white/[0.08] relative overflow-hidden group transition-shadow">
                      <div className="absolute top-0 left-0 w-2 h-full bg-slate-200 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.06] group-hover:bg-[#912338] transition-colors" />
                      
                      <div className="flex justify-between items-center mb-6 pl-4 border-b border-slate-100 dark:border-white/[0.08] pb-4">
                        <h4 className="text-2xl font-black text-slate-800 dark:text-white/90 uppercase tracking-widest transition-colors flex items-center gap-3">
                          Semester {idx + 1} 
                          <span className="text-sm font-bold bg-slate-100 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.04] text-slate-500 dark:text-white/60 dark:text-white/50 px-3 py-1 rounded-full">{getTermName(idx)}</span>
                        </h4>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setManualAddPrompt({ semesterIdx: idx })}
                            className="bg-slate-100 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.04] hover:bg-slate-200 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.06] text-slate-600 dark:text-white/70 font-bold px-4 py-1.5 rounded-xl text-sm transition-colors flex items-center gap-2"
                          >
                            <span>+ Add Course</span>
                          </button>
                          <div className="bg-[#912338]/10 text-[#912338] font-black px-4 py-1.5 rounded-xl">
                            {semesterCredits} Credits
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pl-4">
                        {semester.map((course, cIdx) => {
                           const isElectivePlaceholder = course.includes('Elective');
                           const title = courseTitles[course] || (isElectivePlaceholder ? "Click to select a course" : "Course Title Unavailable");
                           const elStyles = isElectivePlaceholder ? getElectiveStyles(course) : null;
                           
                           return (
                             <div 
                               key={cIdx} 
                               onClick={() => handleElectiveClick(course)}
                               className={`p-5 rounded-2xl border-2 cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${
                                 isElectivePlaceholder 
                                   ? `${elStyles.bg} ${elStyles.border} ${elStyles.text}` 
                                   : 'bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md border-slate-100 dark:border-white/[0.08] text-slate-800 dark:text-white/90'
                               }`}
                             >
                               <div>
                                 <div className="flex justify-between items-start mb-2">
                                   <span className={`font-black text-xl ${isElectivePlaceholder ? elStyles.title : 'text-[#912338]'}`}>{course}</span>
                                   <span className="text-xs font-bold bg-slate-100 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.04] text-slate-500 dark:text-white/60 dark:text-white/50 px-2 py-1 rounded-md shadow-sm">{getCredits(course)} CR</span>
                                 </div>
                                 <p className="text-sm font-semibold opacity-80 leading-tight line-clamp-2 mb-4">{title}</p>
                               </div>

                               {!isElectivePlaceholder && (
                                 <div className="mt-auto pt-3 border-t border-black/5">
                                   <p className="text-xs font-bold text-slate-400 dark:text-white/50 uppercase tracking-wider mb-1">Prerequisites</p>
                                   <p className="text-xs font-medium text-slate-600 dark:text-white/70 truncate">{getPrereqString(course)}</p>
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

      {/* MODAL FOR ELECTIVE SELECTION */}
      <AnimatePresence>
        {activeElectiveSlot && (
          <motion.div 
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
                          <div className="font-bold text-lg text-slate-800 dark:text-white/90 group-hover:text-[#912338]">{c}</div>
                          <div className="text-sm text-slate-500 dark:text-white/60 dark:text-white/50">{courseTitles[c] || "Description unavailable"}</div>
                        </div>
                        <div className="text-xs font-bold text-slate-400 dark:text-white/50 bg-slate-100 dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.04] px-2 py-1 rounded-lg">
                          {curriculum.courses[c]?.credits || 3.0} CR
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
                  <h3 className="text-3xl font-black text-[#912338] mb-1">{activeCourseDetails}</h3>
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
              className="bg-white dark:bg-white dark:bg-white/[0.03] dark:backdrop-blur-md/[0.03] backdrop-blur-md w-full max-w-md rounded-[2rem] shadow-2xl p-8 border-l-8 border-red-500"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white/90">Action Blocked</h3>
              </div>
              <p className="text-slate-600 dark:text-white/70 font-medium mb-8 whitespace-pre-wrap">{errorMsg}</p>
              
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
    </div>
  );
}
