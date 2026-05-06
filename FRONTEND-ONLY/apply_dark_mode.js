const fs = require('fs');

let content = fs.readFileSync('src/app/pages/degree-tracker/page.jsx', 'utf8');

// Replace dark mode slates with glassmorphism
content = content.replace(/dark:bg-\[#0f172a\]/g, 'dark:bg-black');
content = content.replace(/dark:bg-\[#1e293b\]/g, 'dark:bg-white/[0.03] backdrop-blur-md');
content = content.replace(/dark:border-slate-700/g, 'dark:border-white/[0.08]');
content = content.replace(/dark:border-slate-800/g, 'dark:border-white/[0.08]');
content = content.replace(/dark:text-slate-100/g, 'dark:text-white/90');
content = content.replace(/dark:text-slate-200/g, 'dark:text-white/80');
content = content.replace(/dark:text-slate-300/g, 'dark:text-white/70');
content = content.replace(/dark:text-slate-400/g, 'dark:text-white/60');
content = content.replace(/dark:text-slate-500/g, 'dark:text-white/50');
content = content.replace(/dark:bg-slate-700/g, 'dark:bg-white/[0.06]');
content = content.replace(/dark:bg-slate-800/g, 'dark:bg-white/[0.04]');

// Add dark text inversions to missing text-slate-800
content = content.replace(/text-slate-800(?! dark:)/g, 'text-slate-800 dark:text-white/90');
content = content.replace(/text-slate-500(?! dark:)/g, 'text-slate-500 dark:text-white/60');
content = content.replace(/bg-white(?! dark:)/g, 'bg-white dark:bg-white/[0.03] dark:backdrop-blur-md');
content = content.replace(/bg-slate-50(?! dark:)/g, 'bg-slate-50 dark:bg-black');
content = content.replace(/border-slate-200(?! dark:)/g, 'border-slate-200 dark:border-white/[0.08]');
content = content.replace(/border-slate-100(?! dark:)/g, 'border-slate-100 dark:border-white/[0.06]');

fs.writeFileSync('src/app/pages/degree-tracker/page.jsx', content);
console.log('Applied premium dark mode!');
