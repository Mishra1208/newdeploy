import csCurriculum from './computerScienceCurriculum.json';
import { BCompSc_Weights } from './data/sequenceWeights';

export const GLOBAL_COURSES = csCurriculum.courses;

export const checkPrerequisites = (courseCode, completedCourses, remainingSet) => {
  const courseInfo = GLOBAL_COURSES[courseCode];
  
  if (!courseInfo) {
    return { isEligible: true, missing: [] };
  }

  const prereqGroups = courseInfo.prerequisites || [];
  const completedSet = new Set(completedCourses);

  const missingGroups = [];

  for (const group of prereqGroups) {
    const isCompleted = group.some(course => completedSet.has(course));
    
    // If it's not completed, and it's not in the remaining set, we assume it's implicitly satisfied
    // (e.g. if the user has transfer credits that bypassed the course).
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

export const generateOptimalPath = (targetCourses, completedCourses, maxCreditsPerTerm = 15.0, electiveMap = {}, startTerm = "Fall") => {
  const semesters = [];
  let currentCompleted = new Set(completedCourses);
  let remaining = new Set(targetCourses);

  const termOrder = ["Winter", "Summer", "Fall"];
  const startIndex = termOrder.indexOf(startTerm);

  let safetyCounter = 0; 
  
  while (remaining.size > 0 && safetyCounter < 30) {
    safetyCounter++;
    
    let currentSemesterCourses = [];
    let currentSemesterCredits = 0;
    
    const eligibleThisTerm = [];
    for (const course of remaining) {
      if (checkPrerequisites(course, Array.from(currentCompleted), remaining).isEligible) {
        eligibleThisTerm.push(course);
      }
    }

    eligibleThisTerm.sort((a, b) => {
        const getBase = (id) => id.replace(/_\d+$/, '');
        const weightA = BCompSc_Weights[a] || BCompSc_Weights[electiveMap[a]] || BCompSc_Weights[getBase(a)] || 999;
        const weightB = BCompSc_Weights[b] || BCompSc_Weights[electiveMap[b]] || BCompSc_Weights[getBase(b)] || 999;
        return weightA - weightB;
    }); 

    const currentTermIndex = (startIndex + semesters.length) % 3;
    const isSummer = currentTermIndex === 1;
    const termMax = isSummer ? 6.0 : maxCreditsPerTerm;

    for (const course of eligibleThisTerm) {
      const credits = GLOBAL_COURSES[course]?.credits || 3.0; 
      
      if (currentSemesterCredits + credits <= termMax) {
        currentSemesterCourses.push(course);
        currentSemesterCredits += credits;
        remaining.delete(course);
      }
    }

    if (currentSemesterCourses.length === 0) {
        if (isSummer && remaining.size > 0) {
            // Can skip summer if nothing fits, but if there's no progress we might be stuck
            if (eligibleThisTerm.length === 0) {
                console.error("Prerequisite lock detected on remaining courses:", remaining);
                break; 
            }
            // Just add empty summer and try next term
        } else {
            console.error("Prerequisite lock detected on remaining courses:", remaining);
            break; 
        }
    }

    semesters.push(currentSemesterCourses);
    currentSemesterCourses.forEach(c => currentCompleted.add(c));
  }

  return {
    semesters,
    stuckCourses: Array.from(remaining)
  };
};
