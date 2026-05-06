import React from 'react';

export default function RoadmapTermNode({ data }) {
  return (
    <div className="z-10 bg-slate-800 text-white px-10 py-3 rounded-full font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase border-4 border-slate-600 transform -rotate-1 hover:rotate-0 transition-transform cursor-default whitespace-nowrap">
      {data.label}
    </div>
  );
}
