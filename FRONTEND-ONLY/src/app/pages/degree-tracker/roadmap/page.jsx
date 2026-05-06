"use client";
import React, { useEffect, useState } from 'react';
import FlowRoadmapVisualizer from '../components/FlowRoadmapVisualizer';
import courseTitles from '../../../../utils/degreeEngine/data/courseTitles.json';

export default function RoadmapPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('roadmapData');
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  const getPrereqString = (course) => {
    if (course === 'ENCS 282') {
      return "Students must pass the Engineering Writing Test (EWT), or pass ENCS 272 with a grade of C- or higher.";
    }
    const courseData = data.curriculum.courses[course];
    if (!courseData || !courseData.prerequisites || courseData.prerequisites.length === 0) return "None";
    
    return courseData.prerequisites.map(group => {
      if (group.length > 1) return `(${group.join(' OR ')})`;
      return group[0];
    }).join(' AND ');
  };

  if (!data) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white font-bold text-2xl">
      Loading Roadmap...
    </div>
  );

  const getTermName = (idx) => {
    const termOrder = ["Winter", "Summer", "Fall"];
    const startIndex = termOrder.indexOf(data.startTerm);
    const totalTerms = startIndex + idx;
    const currentTerm = termOrder[totalTerms % 3];
    const yearsAdded = Math.floor(totalTerms / 3);
    const currentYear = data.startYear + yearsAdded;
    return `${currentTerm} ${currentYear}`;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f8f9fa] dark:bg-[#0f172a] transition-colors duration-300">
      <FlowRoadmapVisualizer 
        plan={data.plan}
        completedCourses={data.completedCourses}
        getTermName={getTermName}
        courseTitles={courseTitles}
        getPrereqString={getPrereqString}
        curriculum={data.curriculum}
        programName={data.curriculum.name || data.curriculum.program}
      />
    </div>
  );
}
