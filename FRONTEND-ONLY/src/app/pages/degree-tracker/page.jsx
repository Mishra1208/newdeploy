'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { parseOfferLetter } from '../../../utils/degreeEngine/pdfParser';
import { generateOptimalPath, GLOBAL_COURSES } from '../../../utils/degreeEngine/prereqGraph';
import { validateDegree } from '../../../utils/degreeEngine/degreeValidator';
import courseTitles from '../../../utils/degreeEngine/data/courseTitles.json';
import TimelineBoard from './TimelineBoard';
import Papa from 'papaparse';

function TrackerContent() {
  const searchParams = useSearchParams();

  // --- STANDARD CONCORDIA PROGRAM CATALOG (FALLBACKS) ---
  const CONCORDIA_PROGRAM_DEFAULTS = {
      'COMP 228': 'CS_CORE', 'COMP 232': 'CS_CORE', 'COMP 233': 'CS_CORE', 
      'COMP 248': 'CS_CORE', 'COMP 249': 'CS_CORE', 'COMP 335': 'CS_CORE', 
      'COMP 346': 'CS_CORE', 'COMP 348': 'CS_CORE', 'COMP 352': 'CS_CORE', 
      'COMP 354': 'CS_CORE', 'ENCS 282': 'CS_CORE', 'ENCS 393': 'CS_CORE',
      'SOEN 287': 'CS_ELECTIVES', 'COMP 333': 'CS_ELECTIVES', 
      'COMP 353': 'CS_ELECTIVES', 'COMP 432': 'CS_ELECTIVES',
      'ENGR 213': 'MATH_ELECTIVES', 'MATH 251': 'MATH_ELECTIVES', 
      'MATH 203': 'DEFICIENCIES', 'MATH 204': 'DEFICIENCIES', 'MATH 205': 'DEFICIENCIES',
      'COMP 472': 'CS_ELECTIVES', 'COMP 474': 'CS_ELECTIVES',
      'ESL 202': 'DEFICIENCIES', 'ESL 204': 'DEFICIENCIES',
      'MATH 201': 'DEFICIENCIES', 'MATH 206': 'DEFICIENCIES', 'MATH 208': 'DEFICIENCIES', 'MATH 209': 'DEFICIENCIES',
      'PHYS 204': 'DEFICIENCIES', 'PHYS 205': 'DEFICIENCIES', 'CHEM 205': 'DEFICIENCIES'
  };

  // --- KEYWORD-BASED BUCKET RESOLVER (NEW v1.8.0 ENGINE) ---
  const resolveBucketByKeyword = (portalTitle) => {
      if (!portalTitle) return 'GENERAL_ELECTIVES';
      const up = portalTitle.toUpperCase();
      
      if (up.includes('MATH')) return 'MATH_ELECTIVES';
      if (up.includes('SCIENCE_CORE') || up.includes('CS_CORE') || up.includes('DEGREE_CORE')) return 'CS_CORE';
      if (up.includes('CS') && up.includes('ELECTIVE')) return 'CS_ELECTIVES';
      if (up.includes('COMPUTER_SCIENCE_ELECTIVE')) return 'CS_ELECTIVES';
      if (up.includes('COMPLEMENTARY')) return 'CS_COMPLEMENTARY';
      if (up.includes('WRITING') || up.includes('ENCS_282') || up.includes('ENCS_393')) return 'CS_CORE';
      if (up.includes('DEFICIENCY') || up.includes('ECP') || up.includes('PREREQUISITE')) return 'DEFICIENCIES';
      if (up.includes('GENERAL') || up.includes('ENTREPRENEURSHIP')) return 'GENERAL_ELECTIVES';
      
      return null; // Fallback to catalog defaults
  };

  const [setupComplete, setSetupComplete] = useState(false);
  const [loadingType, setLoadingType] = useState(null); // 'extension' | 'upload' | 'manual'
  const [columns, setColumns] = useState(null); // The interactive Sandbox state
  const [ipCourses, setIpCourses] = useState([]); // Courses marked as In Progress
  const [completedCourses, setCompletedCourses] = useState([]); // Courses explicitly marked as Completed
  const [validationStats, setValidationStats] = useState(null); // The historical baseline
  const [requirementBucketMap, setRequirementBucketMap] = useState({}); // Maps ID -> Bucket
  const [courseMetadata, setCourseMetadata] = useState({});
  const [userOverrides, setUserOverrides] = useState({}); // Stores user manual bucket assignments
  const [requirementMapping, setRequirementMapping] = useState({}); // Official mappings from Advisement Report
  const [remainingReqs, setRemainingReqs] = useState([]);
  const [useFullAcademicLoad, setUseFullAcademicLoad] = useState(true); // Toggle between GCS (132) and JMSB (120) style
  
  // Dummy student state to structure the application
  const [studentProfile, setStudentProfile] = useState({
      program: '',
      isECP: false,
      isCoop: false,
      completedCredits: 0,
      studentName: 'Unknown Student',
      exemptions: [],
      deficiencies: [],
      courseHistory: []
  });
  const [showAddModal, setShowAddModal] = useState(null); // Which bucket we are adding to
  const [manualAddCourseCode, setManualAddCourseCode] = useState('');
  const [manualAddTerm, setManualAddTerm] = useState('');

  const handleExtensionSync = () => {
    setLoadingType('extension');
    // TODO: Connect to Chrome Extension via window.postMessage
    // Simulating delay for now
    setTimeout(() => {
      setStudentProfile({
        program: 'Computer Science (BCompSc)',
        isECP: true,
        isCoop: false,
        completedCredits: 15,
        exemptions: ['MATH 201', 'MATH 203'],
        deficiencies: [],
        courseHistory: ['COMP 248', 'MATH 204'],
      });
      setSetupComplete(true);
      setLoadingType(null);
    }, 2000);
  };

  const handleFileUpload = async (e) => {
    setLoadingType('upload');
    const file = e.target.files[0];
    if (!file) {
      setLoadingType(null);
      return;
    }
    
    try {
      const parsedProfile = await parseOfferLetter(file);
      setStudentProfile(parsedProfile);
      setSetupComplete(true);
    } catch (err) {
      alert("Failed to parse PDF. Please try again or make sure it's an official Concordia Offer Letter.");
      console.error(err);
    } finally {
      setLoadingType(null);
    }
  };

  const handleManualAdd = (e) => {
      e.preventDefault();
      if (!showAddModal || !manualAddCourseCode || !manualAddTerm) return;
      
      const cleanCode = manualAddCourseCode.toUpperCase().replace(/\s+/g, ' ').trim();
      
      // Inject to specific column
      setColumns(prev => {
          const newCols = { ...prev };
          if (newCols[manualAddTerm]) {
              newCols[manualAddTerm] = [...newCols[manualAddTerm], cleanCode];
          } else {
              newCols[manualAddTerm] = [cleanCode];
          }
          return newCols;
      });
      
      // Inject to Bucket Map so validation engine catches it!
      setRequirementBucketMap(prev => ({
          ...prev,
          [cleanCode]: showAddModal
      }));
      
      setShowAddModal(null);
      setManualAddCourseCode('');
      setManualAddTerm('');
  };

  const handleFirstYear = () => {
    setStudentProfile({
        program: 'Computer Science (BCompSc)',
        isECP: false,
        isCoop: false,
        completedCredits: 0,
        exemptions: [],
        deficiencies: [],
        courseHistory: [],
    });
    setSetupComplete(true);
  };

  // Automatically compute the Degree Validation logic immediately upon setup
  // This allows the Dashboard to natively display progress bars WITHOUT the user having to click Auto-Pilot!
  React.useEffect(() => {
    if (setupComplete && studentProfile.program) {
        const validationResult = validateDegree(studentProfile);
        setValidationStats(validationResult.status);

        // Store internally for the Auto-Pilot button
        const requiredCourses = validationResult.remainingRequirements.map(req => req.id);
        setRemainingReqs(requiredCourses);
        
        // Map course IDs to their bucket to enable Dynamic Progress Bars during Drag & Drop
        const reqMap = {};
        const metaMap = {};
        validationResult.remainingRequirements.forEach(req => {
            const properName = courseTitles[req.id] || GLOBAL_COURSES[req.id]?.title || req.name || req.id;
            metaMap[req.id] = properName; 
            reqMap[req.id] = req.bucketId;
        });
        setRequirementBucketMap(reqMap);
        setCourseMetadata(prev => ({ ...prev, ...metaMap }));
    }
  }, [setupComplete, studentProfile]);



  // --- PERSISTENCE: Save/Load from Browser Memory ---
  useEffect(() => {
      // LOAD: On first mount, try to restore from localStorage
      const savedColumns = localStorage.getItem('conu_columns');
      const savedMapping = localStorage.getItem('conu_mapping');
      const savedProfile = localStorage.getItem('conu_profile');
      const savedCompleted = localStorage.getItem('conu_completed');
      const savedBucketMap = localStorage.getItem('conu_bucket_map');

      if (savedColumns) setColumns(JSON.parse(savedColumns));
      if (savedMapping) setRequirementMapping(JSON.parse(savedMapping));
      if (savedProfile) setStudentProfile(JSON.parse(savedProfile));
      if (savedCompleted) setCompletedCourses(JSON.parse(savedCompleted));
      if (savedBucketMap) setRequirementBucketMap(JSON.parse(savedBucketMap));
  }, []);

  useEffect(() => {
      // SAVE: Every time state changes, persist it
      if (columns) localStorage.setItem('conu_columns', JSON.stringify(columns));
      if (requirementMapping && Object.keys(requirementMapping).length > 0) localStorage.setItem('conu_mapping', JSON.stringify(requirementMapping));
      if (studentProfile.program) localStorage.setItem('conu_profile', JSON.stringify(studentProfile));
      if (completedCourses.length > 0) localStorage.setItem('conu_completed', JSON.stringify(completedCourses));
      if (requirementBucketMap && Object.keys(requirementBucketMap).length > 0) localStorage.setItem('conu_bucket_map', JSON.stringify(requirementBucketMap));
  }, [columns, requirementMapping, studentProfile, completedCourses, requirementBucketMap]);

  // Load full CSV index passively
  useEffect(() => {
     fetch('/courses_merged.csv')
       .then(res => res.text())
       .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: (results) => {
                    const mapped = {};
                    if (results && results.data) {
                        results.data.forEach(c => {
                            if (c.course_name) {
                                mapped[c.course_name] = {
                                    title: c.title,
                                    credits: parseFloat(c.course_credit) || 3.0
                                };
                            }
                        });
                        setCourseMetadata(prev => ({ ...prev, ...mapped }));
                    }
                }
            });
       })
       .catch(e => console.error("Could not load course csv:", e));
  }, []);

  // 3. Listen for Chrome Extension Redirect Payload!
  // 0. GLOBAL TRASH FILTER: Valid Concordia courses MUST be [DEPT] [NUM] (e.g. COMP 248)
  // This explicitly blocks internal PeopleSoft codes like RG 215 and RQ 333
  const isRealCourse = (id) => {
      if (!id) return false;
      const cleanId = id.trim().toUpperCase();
      // Must have a space and match [3-4 Letters] [Space] [3 Digits]
      const parts = cleanId.split(' ');
      if (parts.length !== 2) return false;
      
      const dept = parts[0];
      const num = parts[1];
      
      // EXCLUSIONS: Hard block RG (Requirement Group) and RQ (Requirement)
      if (dept === 'RG' || dept === 'RQ' || dept === 'UNITS') return false;
      
      // VALIDATION: Dept must be 3-4 letters, Num must be 3 digits + optional letter suffix
      return /^[A-Z]{3,4}$/.test(dept) && /^\d{3}[A-Z]?$/.test(num);
  };

  useEffect(() => {
     // 1. AUTO-RECOVERY: Instantly scrub any saved trash from previous syncs
     const scrub = (prev) => {
         if (!prev) return prev;
         const clean = {};
         let scrubbedAny = false;
         Object.entries(prev).forEach(([colId, list]) => {
             if (Array.isArray(list)) {
                 const originalCount = list.length;
                 clean[colId] = list.filter(id => isRealCourse(id));
                 if (clean[colId].length !== originalCount) scrubbedAny = true;
             } else {
                 clean[colId] = list;
             }
         });
         if (scrubbedAny) console.warn("Scrubbed administrative junk from columns.");
         return clean;
     };

     setColumns(prev => scrub(prev));
     setCompletedCourses(prev => {
         const clean = prev.filter(id => isRealCourse(id));
         if (clean.length !== prev.length) console.warn("Scrubbed administrative junk from completed list.");
         return clean;
     });

     const extData = searchParams.get('data');
     if (extData) {
             let payload;
             try {
                 payload = JSON.parse(decodeURIComponent(extData));
             } catch(e) {
                 console.error("Failed to parse extension payload", e);
                 return;
             }
             
             if (payload.type === 'ADVISEMENT_SYNC') {
                  // This is a high-precision requirement sync!
                  const rawMapping = payload.mapping || {};
                  const cleanMapping = {};
                  
                   Object.entries(rawMapping).forEach(([courseId, bucket]) => {
                       if (!isRealCourse(courseId)) return;
                       const cleanId = courseId.trim().toUpperCase();
                       
                       // RESOLUTION HIERARCHY
                       // 1. Keyword-based match (Mathematics Electives -> MATH_ELECTIVES)
                       // 2. Standard Catalog Fallback (COMP 248 -> CS_CORE)
                       // 3. Raw portal bucket ID as fallback
                       const bucketIdFromKeyword = resolveBucketByKeyword(bucket);
                       const bucketIdFromCatalog = CONCORDIA_PROGRAM_DEFAULTS[cleanId];
                       
                       const aliasedBucket = bucketIdFromKeyword || bucketIdFromCatalog || bucket;
                       
                       cleanMapping[cleanId] = aliasedBucket;
                   });

                   setRequirementMapping(prev => ({ ...prev, ...cleanMapping }));
                   
                   // IMPORT THE COURSES: Only add if they are NEW. 
                   // WE DO NOT OVERWRITE THE TRANSCRIPT DATA.
                   const discoveredCourses = Object.keys(cleanMapping);
                   setCompletedCourses(prev => {
                       // If we already have transcript data (more than 10 courses), 
                       // we trust the transcript's EARNED status for credits.
                       if (prev.length > 10) return prev; 
                       return Array.from(new Set([...prev, ...discoveredCourses]));
                   });
                   
                   setColumns(prev => {
                       if (!prev) return { unplaced: discoveredCourses };
                       
                       // SMART MERGE: Check if course is already on the board in any column
                       const existingOnBoard = new Set();
                       Object.entries(prev || {}).forEach(([colId, list]) => {
                          if (Array.isArray(list)) list.forEach(id => existingOnBoard.add(id));
                       });

                       const currentUnplaced = prev.unplaced || [];
                       // Only add to unplaced if it's NOT already ON THE BOARD (Timeline)
                       const trulyNew = discoveredCourses.filter(id => !existingOnBoard.has(id));
                       
                       const newUnplaced = Array.from(new Set([...currentUnplaced, ...trulyNew]));
                       return { ...prev, unplaced: newUnplaced };
                   });

                  setSetupComplete(true);
                  return;
              }

              // Standard Transcript Sync Logic
              const extCols = { unplaced: [] }; 
             const completedList = [];
             const ipList = [];
             
             payload.terms.forEach(t => {
                 const currentTerm = t.term; // e.g. "Fall 2024"
                 extCols[currentTerm] = [];
                 
                 t.courses.forEach(c => {
                     const pureCode = c.code.replace(/\s+/g, ''); 
                     const properCode = pureCode.replace(/([a-zA-Z]+)(\d+)/, '$1 $2').toUpperCase();
                     extCols[currentTerm].push(properCode);
                     
                     if (c.grade === "IP") {
                         ipList.push(properCode);
                     } else if (c.grade && c.grade !== "F" && c.grade !== "DISC") {
                         completedList.push(properCode);
                     }
                     
                     // Register dynamically unseen courses so they render names!
                     if (!GLOBAL_COURSES[properCode] && !courseTitles[properCode]) {
                         courseTitles[properCode] = c.title || c.description || "Historical Course";
                     }
                 });
             });
             
             // AUTOMATIC DEFICIENCY DETECTION (Since the transcript sync doesn't include the admission letter)
             const detectedDeficiencies = [];
             const allSyncCourses = payload.terms.flatMap(t => t.courses.map(c => c.code.replace(/\s+/g, '').toUpperCase()));
             
             // Standard Concordia Deficiencies
             if (allSyncCourses.some(c => c.startsWith('ESL202'))) detectedDeficiencies.push('ESL 202');
             if (allSyncCourses.some(c => c.startsWith('ESL204'))) detectedDeficiencies.push('ESL 204');
             if (allSyncCourses.some(c => c.startsWith('MATH201'))) detectedDeficiencies.push('MATH 201');

             // Update states!
             setStudentProfile(prev => ({
                 ...prev,
                 studentName: payload.studentName || prev.studentName,
                 program: (payload.programName || prev.program || "").replace(/\\n|\n|\\r/g, ', ').replace(/\s+,/g, ',').trim(),
                 minCreditsRequired: payload.minCreditsRequired || prev.minCreditsRequired,
                 completedCredits: payload.totalCreditsEarned || prev.completedCredits,
                 courseHistory: completedList,
                 deficiencies: Array.from(new Set([...(prev.deficiencies || []), ...detectedDeficiencies]))
             }));
             setCompletedCourses(completedList);
             setIpCourses(ipList);
             
             // Merge the historical timeline into the board
             setColumns(prev => {
                 const baseCols = prev || {};
                 return { ...baseCols, ...extCols };
             });
             
             // Close the setup modal since data is injected
             setSetupComplete(true);
             
     }
  }, [searchParams]);

  const triggerAutoPilot = () => {
    // 1. Calculate the latest term in history to avoid overlapping
    let lastYear = 2024;
    let lastTermIdx = 0; // 0=Fall, 1=Winter, 2=Summer

    if (columns) {
        Object.keys(columns).forEach(termKey => {
            if (termKey === 'unplaced' || termKey === 'unassigned') return;
            const match = termKey.match(/^(Fall|Winter|Summer)\s+(\20\d{2})$/);
            if (match) {
                const term = match[1];
                const year = parseInt(match[2]);
                const idx = term === "Fall" ? 0 : term === "Winter" ? 1 : 2;
                if (year > lastYear || (year === lastYear && idx > lastTermIdx)) {
                    lastYear = year;
                    lastTermIdx = idx;
                }
            }
        });
    }

    // Move to the next term
    let startTermIdx = (lastTermIdx + 1) % 3;
    let startYear = startTermIdx === 0 ? lastYear + 1 : (startTermIdx === 1 ? lastYear : lastYear);
    // Actually, following the loop logic in triggerAutoPilot, 0=Fall, 1=Winter, 2=Summer
    // If last was Fall (0), next is Winter (1) same year.
    // If last was Winter (1), next is Summer (2) same year.
    // If last was Summer (2), next is Fall (0) NEXT year.

    const result = generateOptimalPath(remainingReqs, studentProfile.exemptions, 15.0);
    
    setColumns(prev => {
        const merged = { ...prev };
        
        // Ensure unplaced exists and merge newly stuck courses
        if (!merged['unplaced']) merged['unplaced'] = [];
        const unplacedSet = new Set(merged['unplaced']);
        (result.stuckCourses || []).forEach(c => unplacedSet.add(c));
        merged['unplaced'] = Array.from(unplacedSet);
        
        result.semesters.forEach((sem, idx) => {
            // Sequence terms based on the calculated start date
            const cycle = (startTermIdx + idx) % 3;
            const yearsSinceStart = Math.floor((startTermIdx + idx) / 3);
            const actualYear = startYear + yearsSinceStart;
            
            let termName = "Fall";
            if (cycle === 1) termName = "Winter";
            if (cycle === 2) termName = "Summer";
            
            const termKey = `${termName} ${actualYear}`;
            
            if (merged[termKey]) {
                const existingSet = new Set(merged[termKey]);
                sem.forEach(c => existingSet.add(c));
                merged[termKey] = Array.from(existingSet);
            } else {
                merged[termKey] = sem;
            }
        });
        
        return merged;
    });
  };

  // DEFAULT TARGETS FOR PROGRESS BARS
  const CONCORDIA_REQUIREMENT_TARGETS = {
      "CS_CORE": 33.0,
      "CS_COMPLEMENTARY": 6.0,
      "AI_ELECTIVES": 4.0,
      "MATH_ELECTIVES": 6.0,
      "CS_ELECTIVES": 14.0,
      "GENERAL_ELECTIVES": 27.0,
      "DEFICIENCIES": 12.0
  };

  // The Magic: Dynamically calculate progress based on the Drag & Drop Board
  const activeStats = React.useMemo(() => {
      const blended = {};
      
      // PRE-INITIALIZE ALL REQUIRED BUCKETS (Ensures 0/14 cr cards show up!)
      Object.entries(CONCORDIA_REQUIREMENT_TARGETS).forEach(([bucketKey, targetCr]) => {
          blended[bucketKey] = {
             title: bucketKey.replace(/_/g, ' '),
             target: targetCr,
             fulfilledCredits: 0,
             plannedCredits: 0
          };
      });

      if (columns) {
          const globalHandledCourses = new Set();
          Object.values(columns).forEach(list => {
              if (!Array.isArray(list)) return;
              list.forEach(courseId => {
                  // NUCLEAR TRASH FILTER: Reject non-courses in categories
                  if (!isRealCourse(courseId)) return;

                  // Deduplication: Only count each course code ONCE across all semesters
                  if (globalHandledCourses.has(courseId)) return;
                  globalHandledCourses.add(courseId);

                  const userBucket = userOverrides[courseId];
                  const officialBucket = requirementMapping[courseId];
                  const defaultBucket = CONCORDIA_PROGRAM_DEFAULTS[courseId] || officialBucket || requirementBucketMap[courseId];
                  const targetBucket = userBucket || defaultBucket || 'GENERAL_ELECTIVES';
                  
                  if (!blended[targetBucket]) {
                      const historicalTarget = validationStats?.[targetBucket]?.target || 0;
                      blended[targetBucket] = { 
                          title: targetBucket.replace(/_/g, ' '), 
                          target: historicalTarget, 
                          fulfilledCredits: 0, 
                          plannedCredits: 0 
                      };
                  }
                  
                  if (blended[targetBucket]) {
                      const credits = (courseMetadata[courseId]?.credits || GLOBAL_COURSES[courseId]?.credits || (courseId.startsWith('ESL') ? 6.0 : 3.0));
                      
                      // ONLY count credits if explicitly marked as COMPLETED in transcript
                      if (completedCourses.includes(courseId)) {
                          blended[targetBucket].fulfilledCredits += credits;
                      } else if (ipCourses.includes(courseId)) {
                          blended[targetBucket].plannedCredits = (blended[targetBucket].plannedCredits || 0) + credits;
                      }
                  }
              });
          });
      }
      return blended;
  }, [validationStats, columns, requirementBucketMap, userOverrides, ipCourses, completedCourses, courseMetadata]);

   const globalStats = React.useMemo(() => {
      const prog = studentProfile.program || "";
      const isECP = prog.toLowerCase().includes("extended credit") || prog.includes("ECP");
      
      // 1. Raw Metadata from Transcript
      let rawTarget = parseFloat(studentProfile.minCreditsRequired) || (isECP ? 120.0 : 90.0);
      let rawFulfilled = 0;
      let inprogressToken = 0;
      let plannedToken = 0;
      let defCredits = 0;

      // 2. Strict Deduplication from ALL Columns (Timeline + Dump)
      if (columns) {
          const allCoursesOnBoard = [];
          Object.values(columns).forEach(list => {
              if (Array.isArray(list)) allCoursesOnBoard.push(...list);
          });

          const uniqueCourses = Array.from(new Set(allCoursesOnBoard));
          
          uniqueCourses.forEach(courseId => {
               if (!isRealCourse(courseId)) return;
               const credits = (courseMetadata[courseId]?.credits || GLOBAL_COURSES[courseId]?.credits || (courseId.startsWith('ESL') ? 6.0 : 3.0));
               
               const userBucket = userOverrides[courseId];
               const officialBucket = requirementMapping[courseId];
               const defaultBucket = officialBucket || CONCORDIA_PROGRAM_DEFAULTS[courseId] || requirementBucketMap[courseId];
               const isDeficiency = (userBucket === 'DEFICIENCIES' || defaultBucket === 'DEFICIENCIES' || courseId.startsWith('ESL'));
               
               if (isDeficiency) defCredits += credits;

               if (completedCourses.includes(courseId)) {
                   rawFulfilled += credits;
               } else if (ipCourses.includes(courseId)) {
                   inprogressToken += credits;
               } else {
                   plannedToken += credits;
               }
          });
      }

      // 3. Adjust based on Departmental Policy Toggle
      let target = rawTarget;
      let fulfilled = rawFulfilled;
      let inprogress = inprogressToken;
      let planned = plannedToken;

      if (!useFullAcademicLoad) {
          // JMSB/Arts Style: Track against standard 120/90 core
          target = isECP ? 120.0 : 90.0;
          fulfilled = Math.max(0, rawFulfilled - defCredits);
      } else {
          // GCS (Engineering) Style: Track full absolute load (132)
          target = rawTarget;
          fulfilled = rawFulfilled;
      }

      return { target, fulfilled, inprogress, planned };
   }, [studentProfile, columns, ipCourses, completedCourses, userOverrides, requirementBucketMap, useFullAcademicLoad, requirementMapping, courseMetadata]);

  // RESOLVE CATEGORY LABELS FOR VISUAL TAGS
  const resolvedBucketMap = React.useMemo(() => {
    if (!columns) return {};
    const map = {};
    const labelMap = {
        "CS_CORE": "CS CORE",
        "CS_COMPLEMENTARY": "CS COMP",
        "MATH_ELECTIVES": "MATH ELEC",
        "AI_ELECTIVES": "AI ELEC",
        "CS_ELECTIVES": "CS ELECT",
        "GENERAL_ELECTIVES": "GEN ELEC",
        "DEFICIENCIES": "DEFIC."
    };

    Object.values(columns).forEach(list => {
        list.forEach(courseId => {
            const bucketId = userOverrides[courseId] || requirementBucketMap[courseId] || CONCORDIA_PROGRAM_DEFAULTS[courseId] || "GENERAL_ELECTIVES";
            map[courseId] = labelMap[bucketId] || bucketId.replace(/_/g, ' ').toUpperCase();
        });
    });
    return map;
  }, [columns, userOverrides, requirementBucketMap]);

  const handleToggleIP = (courseId) => {
     setIpCourses(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
     setCompletedCourses(prev => prev.filter(id => id !== courseId)); // Mutually exclusive
  };

  const handleToggleCompleted = (courseId) => {
     setCompletedCourses(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
     setIpCourses(prev => prev.filter(id => id !== courseId)); // Mutually exclusive
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-[#912338] selection:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#912338] flex items-center justify-center font-bold text-white shadow-sm">
              C
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Smart Advisor <span className="text-[#912338] font-bold text-xs ml-2 px-2.5 py-1 rounded-full bg-[#912338]/10 tracking-widest uppercase">BETA</span>
            </h1>
          </div>
          {setupComplete && (
            <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div> System Active</span>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-mono uppercase tracking-widest border border-yellow-200">v1.8.0 - Universal Precision</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!setupComplete ? (
            /* ONBOARDING / SETUP HERO */
            <motion.div 
              key="onboarding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto mt-10"
            >
              <div className="text-center mb-12">
                <h2 className="text-5xl font-black mb-6 tracking-tight text-gray-900">
                  Never guess your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#912338] to-red-600">prerequisites</span> again.
                </h2>
                <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
                  The ultimate degree planner for ENCS students. Load your profile instantly and let the autopilot generate your perfect path to graduation.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                
                {/* OPTION A: FIRST YEAR */}
                <div 
                  onClick={handleFirstYear}
                  className="relative p-6 rounded-2xl border border-gray-200 bg-white hover:border-[#912338] hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-5 text-emerald-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">First Year Student</h3>
                  <p className="text-gray-500 mb-6 text-sm">
                    No transfer credits or exemptions. Start with a blank slate and load the perfect curated 4-year sequence.
                  </p>
                  <div className="flex items-center text-emerald-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Start Blank Plan →
                  </div>
                </div>

                {/* OPTION B: MAGIC SYNC */}
                <div 
                  onClick={handleExtensionSync}
                  className={`relative p-6 rounded-2xl border border-[#912338]/30 bg-[#912338]/5 hover:border-[#912338] hover:shadow-lg hover:shadow-[#912338]/5 transition-all cursor-pointer group overflow-hidden ${loadingType === 'extension' ? 'opacity-70 pointer-events-none' : ''}`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#912338]/10 flex items-center justify-center mb-5 text-[#912338]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Chrome Extension</h3>
                  <p className="text-gray-500 mb-6 text-sm">
                    Uses the ConuPlanner Extension to fetch your transcript directly from the Student Hub instantly.
                  </p>
                  <div className="flex items-center text-[#912338] font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    {loadingType === 'extension' ? 'Syncing...' : 'Magic Sync →'}
                  </div>
                </div>

                {/* OPTION C: MANUAL FILE UPLOAD */}
                <div className="relative p-6 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-5 text-gray-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Upload PDF</h3>
                    <p className="text-gray-500 mb-6 text-sm">
                      Upload your PDF Offer Letter. The engine will extract your ECP & Transfer exemptions natively.
                    </p>
                  </div>
                  
                  <div className="relative w-full mt-2">
                    <input 
                      type="file" 
                      accept=".pdf,.json" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={loadingType !== null}
                    />
                    <button className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors border ${loadingType === 'upload' ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>
                      {loadingType === 'upload' ? 'Parsing...' : 'Select File'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE DEGREE DASHBOARD */
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Profile Bar */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <div className="flex flex-col gap-1 mb-2">
                      <h2 className="text-2xl font-extrabold text-gray-900">{studentProfile.program}</h2>
                      {studentProfile.studentName && studentProfile.studentName !== 'Unknown Student' && (
                          <span className="text-sm font-semibold text-gray-500">Student: {studentProfile.studentName}</span>
                      )}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    {studentProfile.isECP && <span className="text-[#DCAE1D] bg-[#DCAE1D]/10 px-2.5 py-1 rounded-md">120-Credit ECP</span>}
                    {studentProfile.isCoop && <span className="text-[#912338] bg-red-50 px-2.5 py-1 rounded-md">Co-op Student</span>}
                    <span className="text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">{(globalStats?.fulfilled || 0)} Credits Completed</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button onClick={() => { setSetupComplete(false); setColumns(null); setValidationStats(null); }} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium text-sm">
                    Reset Progress
                  </button>
                  <button onClick={triggerAutoPilot} className="px-5 py-2.5 rounded-xl bg-[#912338] text-white hover:bg-[#a62b42] shadow-[0_4px_15px_rgba(145,35,56,0.2)] transition-all font-medium text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    Auto-Pilot Planner
                  </button>
                </div>
              </div>

              {/* DRAG AND DROP KANBAN TIMELINE ENGINE */}
              <div className="mt-8 space-y-6">
                
                {/* AUTO-MOUNTED BUCKET SUMMARY WIDGET */}
                <AnimatePresence>
                {activeStats && globalStats && (
                  <>
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* GLOBAL PROGRESS BAR */}
                      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                          <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-2"><svg className="w-4 h-4 text-[#912338]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Total Degree Progress</h4>
                          <div className="flex flex-col gap-4">
                              <div className="flex justify-between items-end">
                                  <div className="flex items-end gap-2">
                                      <span className="text-4xl font-black text-gray-900 tracking-tighter">{globalStats.fulfilled}</span>
                                      <span className="text-sm text-gray-500 font-bold pb-2">/ {globalStats.target} cr Completed</span>
                                      {globalStats.planned > 0 && <span className="text-xs font-bold text-gray-400 mb-2 ml-1 tracking-tight">{`(+${globalStats.planned} planned)`}</span>}
                                  </div>

                                  {/* Policy Toggle */}
                                  <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-100 shadow-sm relative group">
                                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">GCS</span>
                                     <button 
                                        onClick={() => setUseFullAcademicLoad(!useFullAcademicLoad)}
                                        className={`w-10 h-5 rounded-full p-1 transition-colors duration-200 ${!useFullAcademicLoad ? 'bg-[#912338]' : 'bg-[#912338]'}`}
                                     >
                                        <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ${useFullAcademicLoad ? 'translate-x-0' : 'translate-x-5'}`}></div>
                                     </button>
                                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">JMSB</span>
                                     
                                     {/* Tooltip */}
                                     <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                         <div className="bg-gray-900 text-white text-[10px] p-2 rounded shadow-xl whitespace-nowrap">
                                             {useFullAcademicLoad 
                                               ? "GCS Engineering: Tracking Full Load (120 + Deficiencies = 132)" 
                                               : "JMSB/Arts: Tracking against Core Degree (120/90)"}
                                         </div>
                                     </div>
                                  </div>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner flex">
                                <div className="h-full bg-gradient-to-r from-[#912338] to-[#b32b45] transition-all duration-500 ease-out" style={{ width: `${Math.min(100, (globalStats.fulfilled / globalStats.target) * 100)}%` }}></div>
                                <div className="h-full bg-gray-300 transition-all duration-500 ease-out" style={{ width: `${Math.min(100, (globalStats.planned / globalStats.target) * 100)}%` }}></div>
                              </div>
                          </div>
                      </div>

                      {/* IN PROGRESS BAR */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between">
                          <h4 className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-widest flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg> Currently In Progress</h4>
                          <div>
                              <div className="flex items-end gap-2 mb-2">
                                  <span className="text-3xl font-black text-amber-600 tracking-tight">{globalStats.inprogress}</span>
                                  <span className="text-sm text-amber-700/60 font-bold pb-1">cr</span>
                              </div>
                              <div className="w-full bg-amber-200/50 rounded-full h-2.5 overflow-hidden shadow-inner">
                                <div className="h-full rounded-full bg-amber-400 transition-all duration-500 ease-out" style={{ width: '100%' }}></div>
                              </div>
                          </div>
                      </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {Object.entries(activeStats).map(([key, stat]) => {
                         const progress = Math.min(100, (stat.fulfilledCredits / stat.target) * 100);
                         const exemptedProgress = stat.exemptedCredits ? Math.min(100 - progress, (stat.exemptedCredits / stat.target) * 100) : 0;
                         const plannedProgress = stat.plannedCredits ? Math.min(100 - progress - exemptedProgress, (stat.plannedCredits / stat.target) * 100) : 0;
                         const isComplete = progress + exemptedProgress >= 100;
                         return (
                           <div key={key} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between group relative overflow-hidden">
                               <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">{key.replace(/_/g, ' ')}</h4>
                                  <button 
                                      onClick={() => setShowAddModal(key)}
                                      className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#912338] hover:text-white transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                                      title={`Manually override course into ${key.replace(/_/g, ' ')}`}
                                  >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                  </button>
                               </div>
                               <div>
                                  <div className="flex items-end gap-2 mb-2">
                                      <span className={`text-2xl font-black transition-colors duration-300 ${isComplete ? 'text-green-500' : 'text-gray-900'}`}>{stat.fulfilledCredits}</span>
                                      <span className="text-sm text-gray-500 font-medium pb-0.5">/ {stat.target} cr</span>
                                      {stat.exemptedCredits > 0 && <span className="text-xs font-bold text-blue-500 pb-1 ml-1">{`+${stat.exemptedCredits} exempt`}</span>}
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden flex">
                                    <div className={`h-full transition-all duration-500 ease-out ${isComplete ? 'bg-green-500' : 'bg-[#912338]'}`} style={{ width: `${progress}%` }}></div>
                                    <div className="h-full bg-blue-400 transition-all duration-500 ease-out" style={{ width: `${exemptedProgress}%` }}></div>
                                    <div className="h-full bg-gray-300 transition-all duration-500 ease-out" style={{ width: `${plannedProgress}%` }}></div>
                                  </div>
                              </div>
                           </div>
                         );
                      })}
                  </motion.div>
                  </>
                )}
                </AnimatePresence>

                  {/* Manual Insertion Modal Overhead */}
                  <AnimatePresence>
                    {showAddModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-6 relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Add Course Manually</h3>
                            <button onClick={() => setShowAddModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1 bg-gray-50 rounded-lg">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                          </div>
                          
                          <p className="text-sm text-gray-500 mb-6">
                            You are manually injecting a course directly into the <span className="font-bold text-gray-800">{showAddModal.replace(/_/g, ' ')}</span> requirement pool.
                          </p>

                          <form onSubmit={handleManualAdd} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Course Code</label>
                                <input 
                                  list="course-list"
                                  type="text" 
                                  required 
                                  placeholder="e.g. COMP 432" 
                                  value={manualAddCourseCode}
                                  onChange={(e) => setManualAddCourseCode(e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#912338]/20 focus:border-[#912338] transition-all font-medium placeholder-gray-400"
                                />
                                <datalist id="course-list">
                                    {Object.keys(courseMetadata).map(code => (
                                        <option key={code} value={code}>{courseMetadata[code].title}</option>
                                    ))}
                                </datalist>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Target Semester</label>
                                <input 
                                  list="semesters-list"
                                  type="text"
                                  required
                                  placeholder="e.g. Summer 2027"
                                  value={manualAddTerm}
                                  onChange={(e) => setManualAddTerm(e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#912338]/20 focus:border-[#912338] transition-all font-medium"
                                />
                                <datalist id="semesters-list">
                                    {columns && Object.keys(columns).filter(c => c !== 'unassigned').map(term => (
                                        <option key={term} value={term}>{term}</option>
                                    ))}
                                    <option value="unassigned">Requirements Dump</option>
                                </datalist>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="w-full mt-2 bg-[#912338] text-white rounded-lg py-3 font-bold shadow-lg shadow-[#912338]/20 hover:bg-[#7a1c2e] hover:shadow-xl transition-all active:scale-[0.98]"
                            >
                                Inject Course
                            </button>
                          </form>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                {columns ? (
                  <TimelineBoard 
                     columns={columns}
                     onColumnsChange={setColumns}
                     courseMetadata={courseMetadata}
                     setCourseMetadata={setCourseMetadata}
                     ipCourses={ipCourses}
                     onToggleIP={handleToggleIP}
                     completedCourses={completedCourses}
                     onToggleCompleted={handleToggleCompleted}
                     userOverrides={userOverrides}
                     setUserOverrides={setUserOverrides}
                     availableBuckets={activeStats ? Object.keys(activeStats) : []}
                  />
                ) : (
                   <div className="grid lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 min-h-[600px] border-2 border-gray-200 rounded-2xl border-dashed bg-gray-50/50 flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Timeline Canvas</h3>
                      <p className="text-gray-500 max-w-sm">The Dashboard engine is actively running. Click "Auto-Pilot Planner" to topologically sequence your classes.</p>
                    </div>
                    
                    {/* COURSE POOL (Placeholder) */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 min-h-[600px]">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-3">Requirements Dump</h3>
                      <p className="text-sm text-gray-500">Unstructured sequence items will appear here initially.</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {remainingReqs.slice(0, 10).map((req, i) => (
                           <div key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">{courseMetadata[req] || req}</div>
                        ))}
                        {remainingReqs.length > 10 && <div className="px-3 py-1.5 text-gray-400 text-xs font-semibold">+{remainingReqs.length - 10} more</div>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* SYSTEM DIAGNOSIS & LOGS (USER REQUESTED) */}
      <div className="max-w-[1600px] mx-auto px-6 mb-20">
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                          System Diagnosis Cache
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 italic">Audit trail for all active courses and credit calculations. Use this to identify ghost data.</p>
                  </div>
                  <button 
                      onClick={() => {
                          const forceScrub = (prev) => {
                              if (!prev) return prev;
                              const clean = {};
                              Object.entries(prev).forEach(([colId, list]) => {
                                  if (Array.isArray(list)) {
                                      clean[colId] = list.filter(id => isRealCourse(id));
                                  } else {
                                      clean[colId] = list;
                                  }
                              });
                              return clean;
                          };
                          setColumns(prev => forceScrub(prev));
                          setCompletedCourses(prev => prev.filter(id => isRealCourse(id)));
                          alert("All administrative junk has been purged from memory!");
                      }}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-xl hover:shadow-red-600/20 flex items-center gap-2 active:scale-95"
                  >
                      🔥 Force Clean Administrative Junk (Purge RG/RQ)
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {columns && Object.entries(columns).map(([colId, list]) => (
                      <div key={colId} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                          <h4 className="font-bold text-slate-400 border-b border-slate-50 pb-2 mb-3 uppercase tracking-widest text-[10px]">{colId} ({list.length})</h4>
                          <div className="space-y-1.5">
                              {list.map(id => {
                                  const isValid = isRealCourse(id);
                                  return (
                                      <div key={id} className={`text-[11px] flex justify-between px-2 py-1.5 rounded-lg border ${isValid ? 'text-slate-600 bg-slate-50/50 border-transparent' : 'bg-red-50 text-red-700 font-bold border-red-100 animate-pulse'}`}>
                                          <span className="font-mono">{id}</span>
                                          <span className="opacity-50 font-bold uppercase tracking-tighter text-[9px]">{isValid ? 'CLEAN' : 'TRASH'}</span>
                                      </div>
                                  );
                              })}
                              {list.length === 0 && <div className="text-[10px] text-slate-300 italic">Empty.</div>}
                          </div>
                      </div>
                  ))}
              </div>

              {(!columns || Object.keys(columns).length === 0) && (
                  <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-300 font-medium">
                      No active course logs found in memory.
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}

export default function DegreeTrackerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-medium">✨ Importing Transcript...</div>}>
       <TrackerContent />
    </Suspense>
  );
}
