
export const checkPrerequisites = (courseCode, completedCourses, remainingSet, allCourses) => {
  const courseInfo = allCourses[courseCode];
  
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

export const generateOptimalPath = (targetCourses, completedCourses, allCourses, weights = {}, maxCreditsPerTerm = 15.0, electiveMap = {}, startTerm = "Fall") => {
  const semesters = [];
  let currentCompleted = new Set(completedCourses);
  let remaining = new Set(targetCourses);

  const termOrder = ["Winter", "Summer", "Fall"];
  const startIndex = termOrder.indexOf(startTerm);

  let safetyCounter = 0; 
  
  while (remaining.size > 0 && safetyCounter < 40) {
    safetyCounter++;
    
    let currentSemesterCourses = [];
    let currentSemesterCredits = 0;
    
    const eligibleThisTerm = [];
    for (const course of remaining) {
      if (checkPrerequisites(course, Array.from(currentCompleted), remaining, allCourses).isEligible) {
        eligibleThisTerm.push(course);
      }
    }

    eligibleThisTerm.sort((a, b) => {
        const getBase = (id) => id.replace(/_\d+$/, '');
        const weightA = weights[a] || weights[electiveMap[a]] || weights[getBase(a)] || 999;
        const weightB = weights[b] || weights[electiveMap[b]] || weights[getBase(b)] || 999;
        return weightA - weightB;
    }); 

    const currentTermIndex = (startIndex + semesters.length) % 3;
    const isSummer = currentTermIndex === 1;
    const termMax = isSummer ? 6.0 : maxCreditsPerTerm;

    for (const course of eligibleThisTerm) {
      const credits = allCourses[course]?.credits || 3.0; 
      
      if (currentSemesterCredits + credits <= termMax) {
        currentSemesterCourses.push(course);
        currentSemesterCredits += credits;
        remaining.delete(course);
      }
    }

    if (currentSemesterCourses.length === 0) {
        if (isSummer && remaining.size > 0) {
            // Empty summer
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

