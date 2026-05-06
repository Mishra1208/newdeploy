import React, { useRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { toPng } from 'html-to-image';

export default function RoadmapVisualizer({ plan, completedCourses, getTermName, courseTitles, getPrereqString, programName = "My Journey", onClose }) {
  const roadmapRef = useRef(null);

  const handleDownload = async () => {
    if (!roadmapRef.current) return;
    try {
      const dataUrl = await toPng(roadmapRef.current, {
        backgroundColor: '#f8f9fa',
        pixelRatio: 2,
        skipFonts: true // skip inline font downloading to prevent layout shifts during capture
      });
      const link = document.createElement('a');
      link.download = 'My-Degree-Roadmap.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download roadmap", err);
      alert("Failed to download roadmap image. Please try again.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f8f9fa] dark:bg-[#0f172a] transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-[#1e293b] text-slate-800 dark:text-white p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-slate-200 dark:border-slate-800 shadow-sm z-10 transition-colors duration-300">
        <div>
          <h2 className="text-3xl font-black mb-1">Interactive Degree Roadmap</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Scroll to zoom, click and drag to pan.</p>
        </div>
        <div>
          <button onClick={handleDownload} className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(4,120,87,1)] flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download High-Res PNG
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing bg-[#f8f9fa] dark:bg-[#0f172a] transition-colors duration-300">
        <TransformWrapper
          initialScale={0.8}
          minScale={0.1}
          maxScale={3}
          centerOnInit={true}
          limitToBounds={false}
          wheel={{ step: 0.1, smoothStep: 0.05 }}
          panning={{ velocityDisabled: true }}
        >
          <TransformComponent wrapperClass="w-full h-full" contentClass="w-max h-max p-10 flex items-center justify-center">

            {/* The actual roadmap content to be captured */}
            <div ref={roadmapRef} className="bg-[#f8f9fa] w-[1400px] flex flex-col items-center pt-10 pb-32">

              {/* Title */}
              <div className="text-center mb-16">
                <h1 className="text-6xl font-black text-slate-800 mb-4">{programName}</h1>
                <div className="h-2 w-32 bg-[#912338] mx-auto rounded-full"></div>
              </div>

              {/* Completed/Exempt Block */}
              {completedCourses.length > 0 && (
                <div className="mb-16 relative w-full flex flex-col items-center">
                  <div className="bg-emerald-50 border-4 border-emerald-400 p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(52,211,153,1)] max-w-4xl w-full">
                    <h3 className="text-2xl font-black text-emerald-800 mb-6 flex items-center justify-center gap-3 uppercase">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Prior Credits & Exemptions
                    </h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {completedCourses.map(c => (
                        <div key={c} className="bg-white border-2 border-emerald-400 px-4 py-2 rounded-xl text-emerald-700 font-black shadow-[4px_4px_0px_0px_rgba(52,211,153,1)]">
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Line down to first semester */}
                  <div className="h-16 w-2 bg-slate-300 mx-auto my-0 relative">
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-slate-300"></div>
                  </div>
                </div>
              )}

              {/* Semesters Sequence */}
              <div className="flex flex-col items-center gap-0 w-full">
                {plan.map((semester, idx) => {
                  const isLast = idx === plan.length - 1;
                  return (
                    <div key={idx} className="flex flex-col items-center w-full relative">

                      {/* Term Label Node */}
                      <div className="z-10 bg-slate-800 text-white px-10 py-3 rounded-full font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 uppercase border-4 border-slate-600 transform -rotate-1 hover:rotate-0 transition-transform">
                        {getTermName(idx)}
                      </div>

                      {/* Course Grid */}
                      <div className="bg-white border-4 border-slate-300 p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(203,213,225,1)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
                        {semester.map((course, cIdx) => {
                          const isElective = course.includes('Elective');
                          const title = courseTitles[course] || (isElective ? "Selected Elective" : "Course Title Unavailable");

                          // Roadmap.sh style styling (Neo-brutalism)
                          let boxStyle = "bg-yellow-50 border-yellow-400 text-yellow-900 shadow-[4px_4px_0px_0px_rgba(250,204,21,1)]"; // Default (Core)
                          let titleStyle = "text-yellow-700";
                          let dotColor = "bg-yellow-400";

                          if (course.includes('Math')) {
                            boxStyle = "bg-blue-50 border-blue-400 text-blue-900 shadow-[4px_4px_0px_0px_rgba(96,165,250,1)]";
                            titleStyle = "text-blue-700";
                            dotColor = "bg-blue-400";
                          } else if (course.includes('CS Elective') || course.includes('Technical Elective')) {
                            boxStyle = "bg-purple-50 border-purple-400 text-purple-900 shadow-[4px_4px_0px_0px_rgba(192,132,252,1)]";
                            titleStyle = "text-purple-700";
                            dotColor = "bg-purple-400";
                          } else if (course.includes('General Elective')) {
                            boxStyle = "bg-amber-50 border-amber-400 text-amber-900 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)]";
                            titleStyle = "text-amber-700";
                            dotColor = "bg-amber-400";
                          } else if (!isElective) {
                            boxStyle = "bg-white border-slate-800 text-slate-800 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]";
                            titleStyle = "text-slate-500";
                            dotColor = "bg-slate-800";
                          }

                          return (
                            <div key={cIdx} className={`border-4 rounded-2xl p-5 flex flex-col justify-between relative bg-white`}>
                              <div className={`absolute top-0 left-0 w-full h-full rounded-xl -z-10 opacity-30 ${boxStyle.split(' ')[0]}`}></div>
                              <div className={`absolute inset-0 border-4 rounded-xl -z-10 ${boxStyle.split(' ')[1]}`}></div>

                              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 border-4 border-white rounded-full z-10 flex items-center justify-center">
                                <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
                              </div>

                              <div className={`font-black text-2xl mb-2 ${boxStyle.split(' ')[2]}`}>{course}</div>
                              <div className={`text-sm font-bold leading-tight mb-4 ${titleStyle}`}>{title}</div>
                              {!isElective && (
                                <div className={`mt-auto pt-3 border-t-2 text-xs font-black uppercase ${boxStyle.includes('slate') ? 'border-slate-200 text-slate-400' : 'border-black/10 opacity-70'}`}>
                                  {getPrereqString(course) === "None" ? "No Prerequisites" : "Has Prerequisites"}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Connection Line */}
                      {!isLast && (
                        <div className="h-16 w-2 bg-slate-300 relative">
                          {/* Arrow head */}
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-slate-300"></div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Finish Node */}
              <div className="mt-12 bg-[#912338] text-white px-12 py-8 rounded-full font-black text-4xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-slate-900 transform hover:scale-105 transition-transform flex items-center gap-4">
                <span>🎉</span>
                Graduation
              </div>

            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}
