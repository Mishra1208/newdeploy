
export const checkPrerequisites = (courseCode, completedCourses, remainingSet, allCourses, currentSemesterCourses = []) => {
  const courseInfo = allCourses[courseCode];
  
  if (!courseInfo) {
    return { isEligible: true, missing: [] };
  }

  let prereqGroups = courseInfo.prerequisites || [];
  if (typeof prereqGroups === 'string') prereqGroups = [[prereqGroups]];
  
  let coreqGroups = courseInfo.corequisites || [];
  if (typeof coreqGroups === 'string') coreqGroups = [[coreqGroups]];
  const completedSet = new Set(completedCourses);
  const currentSet = new Set(currentSemesterCourses);

  const missingGroups = [];

  // Check Prerequisites (Must be completed BEFORE)
  for (const group of prereqGroups) {
    const items = Array.isArray(group) ? group : [group];
    const isCompleted = items.some(course => completedSet.has(course));
    const isTargeted = remainingSet ? items.some(course => remainingSet.has(course) || currentSet.has(course)) : true;
    
    if (!isCompleted && isTargeted) {
      missingGroups.push(items);
    }
  }

  // Check Corequisites (Can be completed BEFORE or DURING)
  for (const group of coreqGroups) {
    const items = Array.isArray(group) ? group : [group];
    const isSatisfied = items.some(course => completedSet.has(course) || currentSet.has(course));
    const isTargeted = remainingSet ? items.some(course => remainingSet.has(course) || currentSet.has(course)) : true;

    if (!isSatisfied && isTargeted) {
      missingGroups.push({ type: 'coreq', group: items });
    }
  }

  return {
    isEligible: missingGroups.length === 0,
    missing: missingGroups
  };
};

export const generateOptimalPath = (targetCourses, completedCourses, allCourses, weights = {}, maxCreditsPerTerm = 15.0, electiveMap = {}, startTerm = "Fall", forcedDelays = {}, skippedSemesters = []) => {
  const semesters = [];
  let currentCompleted = new Set(completedCourses);
  let remaining = new Set(targetCourses);

  const termOrder = ["Winter", "Summer", "Fall"];
  const startIndex = termOrder.indexOf(startTerm);

  let safetyCounter = 0; 
  
  while (remaining.size > 0 && safetyCounter < 40) {
    safetyCounter++;
    
    // NEW: Handle Skipped Semesters
    if (skippedSemesters.includes(semesters.length)) {
      semesters.push([]);
      continue;
    }
    
    let currentSemesterCourses = [];
    let currentSemesterCredits = 0;
    
    let currentTermIndex = (startIndex + semesters.length) % 3;
    const isSummer = termOrder[currentTermIndex] === "Summer";
    const termMax = isSummer ? 6.0 : maxCreditsPerTerm;

    const getCredits = (c) => allCourses[c]?.credits || 3.0;
    const totalCreditsCompleted = Array.from(currentCompleted).reduce((sum, c) => sum + getCredits(c), 0);

    let changed = true;
    while (changed && currentSemesterCredits < termMax) {
      changed = false;
      const candidates = [];
      
      const isElective = (c) => c.includes('Elective') || c.includes('Group') || c.includes('General Education');
      const currentElectives = currentSemesterCourses.filter(isElective).length;

      for (const course of remaining) {
        if (forcedDelays[course] !== undefined && semesters.length < forcedDelays[course]) continue;
        
        // Advanced rules: Capstones
        if (course.includes('490') || course.includes('495')) {
          if (totalCreditsCompleted < 75) continue;
        }

        if (checkPrerequisites(course, Array.from(currentCompleted), remaining, allCourses, currentSemesterCourses).isEligible) {
          candidates.push(course);
        }
      }

      candidates.sort((a, b) => {
        const getBase = (id) => id.replace(/_\d+$/, '');
        let weightA = weights[a] || weights[electiveMap[a]] || weights[getBase(a)] || 999;
        let weightB = weights[b] || weights[electiveMap[b]] || weights[getBase(b)] || 999;

        // BALANCING LOGIC:
        // If we already have 2 electives, push other electives to the bottom 
        // to encourage taking Core courses instead.
        if (currentElectives >= 2) {
          if (isElective(a)) weightA += 1000;
          if (isElective(b)) weightB += 1000;
        }

        // If a semester is very light (< 9 credits), prioritize EVERYTHING that is eligible
        // by ignoring weights temporarily to pull courses forward.
        if (currentSemesterCredits < 9.0 && !isSummer) {
          const isA_Core = !isElective(a);
          const isB_Core = !isElective(b);
          if (isA_Core && !isB_Core) return -1;
          if (!isA_Core && isB_Core) return 1;
        }

        return weightA - weightB;
      });

      for (const course of candidates) {
        const credits = allCourses[course]?.credits || 3.0;
        if (currentSemesterCredits + credits <= termMax) {
          currentSemesterCourses.push(course);
          currentSemesterCredits += credits;
          remaining.delete(course);
          changed = true;
          break; 
        }
      }
    }

    if (currentSemesterCourses.length === 0 && remaining.size > 0) {
      // If we are stuck (no courses can be taken this term), but courses remain:
      // 1. If it's summer, it's normal.
      // 2. If courses are just delayed by the user, we just push an empty term and keep going.
      // 3. Only if it's a permanent lock (safetyCounter hits) will we stop.
    }

    semesters.push(currentSemesterCourses);
    currentSemesterCourses.forEach(c => currentCompleted.add(c));
  }

  return {
    semesters,
    stuckCourses: Array.from(remaining)
  };
};

