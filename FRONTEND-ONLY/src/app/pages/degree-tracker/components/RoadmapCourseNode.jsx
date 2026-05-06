import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function RoadmapCourseNode({ data }) {
  const { course, title, isElective, prereqStatus, isCompleted } = data;

  let boxStyle = "bg-yellow-50 border-yellow-400 text-yellow-900 shadow-[4px_4px_0px_0px_rgba(250,204,21,1)]";
  let titleStyle = "text-yellow-700";
  let dotColor = "bg-yellow-400";

  if (isCompleted) {
    boxStyle = "bg-emerald-50 border-emerald-400 text-emerald-900 shadow-[4px_4px_0px_0px_rgba(52,211,153,1)]";
    titleStyle = "text-emerald-700";
    dotColor = "bg-emerald-400";
  } else if (course.includes('Math')) {
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
    <div className="border-4 rounded-2xl p-5 flex flex-col justify-between relative bg-white w-[280px] h-[160px] cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-lg transition-transform">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400 border-2 border-white rounded-full opacity-0 hover:opacity-100" />
      
      <div className={`absolute top-0 left-0 w-full h-full rounded-xl -z-10 opacity-30 ${boxStyle.split(' ')[0]}`}></div>
      <div className={`absolute inset-0 border-4 rounded-xl -z-10 ${boxStyle.split(' ')[1]}`}></div>

      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 border-4 border-white rounded-full z-10 flex items-center justify-center">
        <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
      </div>

      <div className={`font-black text-2xl mb-2 ${boxStyle.split(' ')[2]}`}>{course}</div>
      <div className={`text-sm font-bold leading-tight mb-4 ${titleStyle}`}>{title}</div>
      
      {!isElective && (
        <div className={`mt-auto pt-3 border-t-2 text-xs font-black uppercase ${boxStyle.includes('slate') ? 'border-slate-200 text-slate-400' : 'border-black/10 opacity-70'}`}>
          {prereqStatus}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400 border-2 border-white rounded-full opacity-0 hover:opacity-100" />
    </div>
  );
}
