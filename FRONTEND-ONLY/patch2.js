const fs = require('fs');
let content = fs.readFileSync('src/app/pages/degree-tracker/page.jsx', 'utf8');

// 1. Restore Roadmap changes (the window.open logic)
content = content.replace(
  "import RoadmapVisualizer from './components/RoadmapVisualizer';",
  ""
);

const oldRoadmapBtn = `<button \n                    onClick={() => setShowRoadmap(true)}\n                    className="bg-[#912338] hover:bg-[#912338]/90 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2"\n                  >`;
const newRoadmapBtn = `<button \n                    onClick={() => {\n                      const data = { plan, completedCourses, startTerm, startYear, electiveChoices };\n                      localStorage.setItem('roadmapData', JSON.stringify(data));\n                      window.open('/pages/degree-tracker/roadmap', '_blank');\n                    }}\n                    className="bg-[#912338] hover:bg-[#912338]/90 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2"\n                  >`;
content = content.replace(oldRoadmapBtn, newRoadmapBtn);

const oldRoadmapRender = /\{showRoadmap && plan && \([\s\S]*?<\/>\n\s*\)\}/g;
// Wait, I can just use a regex to strip RoadmapVisualizer
content = content.replace(/\{showRoadmap && plan && \([\s\S]*?RoadmapVisualizer[\s\S]*?\)\}/g, '');


// 2. Implement Premium Dark Mode Colors
// We want to use a pure black background or a very sleek slate-950/black for the container. Let's use dark:bg-black or dark:bg-[#09090b] (zinc-950).
// For cards, we use dark:bg-white/5 and dark:border-white/10
const replacements = [
  // Page Background
  ['bg-slate-50', 'bg-slate-50 dark:bg-[#0a0a0a]'],
  
  // Base Text
  ['text-slate-900', 'text-slate-900 dark:text-white'],
  ['text-slate-800', 'text-slate-800 dark:text-zinc-100'],
  ['text-slate-700', 'text-slate-700 dark:text-zinc-200'],
  ['text-slate-600', 'text-slate-600 dark:text-zinc-300'],
  ['text-slate-500', 'text-slate-500 dark:text-zinc-400'],
  ['text-slate-400', 'text-slate-400 dark:text-zinc-500'],

  // Card Backgrounds (sleek glass/subtle instead of muddy slate)
  ['bg-white', 'bg-white dark:bg-white/[0.03]'],
  ['bg-slate-100', 'bg-slate-100 dark:bg-white/10'],
  ['bg-slate-200', 'bg-slate-200 dark:bg-white/20'],

  // Borders
  ['border-slate-200', 'border-slate-200 dark:border-white/10'],
  ['border-slate-100', 'border-slate-100 dark:border-white/5'],
  ['border-slate-300', 'border-slate-300 dark:border-white/20'],

  // Specifically fix Prior Credits Block
  ['bg-emerald-50', 'bg-emerald-50 dark:bg-emerald-500/10'],
  ['border-emerald-200', 'border-emerald-200 dark:border-emerald-500/20'],
  ['text-emerald-800', 'text-emerald-800 dark:text-emerald-400'],
  ['text-emerald-700', 'text-emerald-700 dark:text-emerald-300'],

  // Elective Blocks (the colors in getElectiveStyles)
  ['bg-blue-50', 'bg-blue-50 dark:bg-blue-500/10'],
  ['border-blue-200', 'border-blue-200 dark:border-blue-500/20'],
  ['text-blue-900', 'text-blue-900 dark:text-blue-300'],
  ['text-blue-700', 'text-blue-700 dark:text-blue-400'],

  ['bg-violet-50', 'bg-violet-50 dark:bg-violet-500/10'],
  ['border-violet-200', 'border-violet-200 dark:border-violet-500/20'],
  ['text-violet-900', 'text-violet-900 dark:text-violet-300'],
  ['text-violet-700', 'text-violet-700 dark:text-violet-400'],

  ['bg-amber-50', 'bg-amber-50 dark:bg-amber-500/10'],
  ['border-amber-200', 'border-amber-200 dark:border-amber-500/20'],
  ['text-amber-900', 'text-amber-900 dark:text-amber-300'],
  ['text-amber-700', 'text-amber-700 dark:text-amber-400'],
];

for (const [search, replace] of replacements) {
  content = content.split(search).join(replace);
}

fs.writeFileSync('src/app/pages/degree-tracker/page.jsx', content);
console.log('Patched page.jsx for beautiful dark mode');
