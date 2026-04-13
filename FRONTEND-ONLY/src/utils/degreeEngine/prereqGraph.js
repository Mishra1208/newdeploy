import encsData from './data/encsCurriculum.json';
import { BCompSc_Weights } from './data/sequenceWeights';

/**
 * Normalizes all course dictionaries into a single massive lookup table.
 * @returns {Record<string, { credits: number, prerequisites: string[][] }>}
 */
const buildGlobalDictionary = () => {
  return {
    ...encsData.ENCS_COMMON_CORE,
    ...encsData.BSOEN_CORE,
    ...encsData.ECP_DEFICIENCIES
  };
};

export const GLOBAL_COURSES = buildGlobalDictionary();

/**
 * Checks if a specific course's prerequisites are met.
 * @param {string} courseCode - e.g., "COMP 352"
 * @param {Array<string>} completedCourses - e.g., ["COMP 248"]
 * @param {Set<string>} remainingSet - e.g., Set({"COMP 249", "COMP 352"})
 * @returns {{ isEligible: boolean, missing: string[][] }}
 */
export const checkPrerequisites = (courseCode, completedCourses, remainingSet) => {
  const courseInfo = GLOBAL_COURSES[courseCode];
  
  if (!courseInfo) {
    // If it's an elective not in the map, assume it has no strict mapped prereqs
    return { isEligible: true, missing: [] };
  }

  const prereqGroups = courseInfo.prerequisites || [];
  const completedSet = new Set(completedCourses);

  const missingGroups = [];

  for (const group of prereqGroups) {
    // group is an OR array, e.g., ["MATH 203", "MATH 209"] means take EITHER one.
    const isCompleted = group.some(course => completedSet.has(course));
    
    // If a prerequisite is NOT in the student's completed courses AND it is NOT in 
    // their remaining target graph, it is an exogenous prerequisite (like CEGEP math).
    // Since the Bucket Engine didn't assign it to them, we assume it's implicitly satisfied.
    const isTargeted = remainingSet ? group.some(course => remainingSet.has(course)) : true;
    
    if (!isCompleted && isTargeted) {
      missingGroups.push(group);
    }
  }

  return {
    isEligible: missingGroups.length === 0,
    missing: missingGroups
  };
};

/**
 * Topologically sorts remaining courses into a structured sequence of semesters.
 * @param {Array<string>} targetCourses - All courses the student needs to graduate.
 * @param {Array<string>} completedCourses - Courses already taken or transferred.
 * @param {number} maxCreditsPerTerm - Safest load is generally 15.0 (5 classes).
 * @returns {Array<Array<string>>} - Array of semesters, each an array of course codes.
 */
export const generateOptimalPath = (targetCourses, completedCourses, maxCreditsPerTerm = 15.0) => {
  const semesters = [];
  let currentCompleted = new Set(completedCourses);
  let remaining = new Set(targetCourses);

  // Fallback to prevent infinite loops if graph has cycles or disconnected nodes
  let safetyCounter = 0; 
  
  while (remaining.size > 0 && safetyCounter < 20) {
    safetyCounter++;
    
    let currentSemesterCourses = [];
    let currentSemesterCredits = 0;
    
    // Find everything we can take RIGHT NOW
    const eligibleThisTerm = [];
    for (const course of remaining) {
      if (checkPrerequisites(course, Array.from(currentCompleted), remaining).isEligible) {
        eligibleThisTerm.push(course);
      }
    }

    // Sort eligible courses to prioritize "Sequence Blocking" courses
    // Instead of random alphabet, we use Concordia's Recommended Sequence Weights
    eligibleThisTerm.sort((a, b) => {
        const getBase = (id) => id.replace(/_\d+$/, '');
        const weightA = BCompSc_Weights[a] || BCompSc_Weights[getBase(a)] || BCompSc_Weights["DEFAULT"];
        const weightB = BCompSc_Weights[b] || BCompSc_Weights[getBase(b)] || BCompSc_Weights["DEFAULT"];
        return weightA - weightB;
    }); 

    // termIndex: 0 = Fall, 1 = Winter, 2 = Summer
    const termMax = (semesters.length % 3 === 2) ? 6.0 : maxCreditsPerTerm;

    // Pack the semester
    for (const course of eligibleThisTerm) {
      const credits = GLOBAL_COURSES[course]?.credits || 3.0; // default to 3 if unknown
      
      if (currentSemesterCredits + credits <= termMax) {
        currentSemesterCourses.push(course);
        currentSemesterCredits += credits;
        remaining.delete(course);
      }
    }

    // If we couldn't schedule anything, there's a prerequisite lock (cycle or missing root).
    // HOWEVER, if it's summer (index % 3 === 2) and we just chose to skip, we shouldn't necessarily lock.
    // Actually, if eligibleThisTerm is empty, we must be locked.
    if (currentSemesterCourses.length === 0) {
        if (semesters.length % 3 === 2 && remaining.size > 0) {
            // It's summer, and maybe everything is 4 credits and max is 6 so we couldn't fit two? 
            // Or maybe eligible was just empty. Just push an empty summer to skip it.
            // But if eligible is empty, pushing empty summer might just lead to empty fall and endless loop?
            // If eligible is empty, it means we literally can't take anything. We shouldn't skip summer, it's a hard lock.
            console.error("Prerequisite lock detected on remaining courses:", remaining);
            break; 
        } else {
            console.error("Prerequisite lock detected on remaining courses:", remaining);
            break; 
        }
    }

    // Add scheduled courses to the completed pool for the *next* term's evaluation
    semesters.push(currentSemesterCourses);
    currentSemesterCourses.forEach(c => currentCompleted.add(c));
  }

  // Whatever is leftover couldn't be scheduled due to errors or locks
  return {
    semesters,
    stuckCourses: Array.from(remaining)
  };
};
