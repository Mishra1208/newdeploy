const fs = require('fs');
let content = fs.readFileSync('src/app/pages/degree-tracker/page.jsx', 'utf8');

const replacements = [
  ['bg-slate-50', 'bg-slate-50 dark:bg-[#0f172a]'],
  ['text-slate-900', 'text-slate-900 dark:text-white'],
  ['text-slate-800', 'text-slate-800 dark:text-slate-100'],
  ['text-slate-700', 'text-slate-700 dark:text-slate-200'],
  ['text-slate-600', 'text-slate-600 dark:text-slate-300'],
  ['text-slate-500', 'text-slate-500 dark:text-slate-400'],
  ['text-slate-400', 'text-slate-400 dark:text-slate-500'],
  ['bg-white', 'bg-white dark:bg-[#1e293b]'],
  ['bg-slate-100', 'bg-slate-100 dark:bg-slate-800'],
  ['bg-slate-200', 'bg-slate-200 dark:bg-slate-700'],
  ['border-slate-200', 'border-slate-200 dark:border-slate-700'],
  ['border-slate-100', 'border-slate-100 dark:border-slate-800'],
  ['border-slate-300', 'border-slate-300 dark:border-slate-600']
];

for (const [search, replace] of replacements) {
  content = content.split(search).join(replace);
}

fs.writeFileSync('src/app/pages/degree-tracker/page.jsx', content);
console.log('Patched page.jsx for dark mode');
