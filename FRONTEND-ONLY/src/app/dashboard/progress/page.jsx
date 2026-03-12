'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';
import { parseTranscript } from '@/lib/transcript/parseTranscript';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, ReferenceLine
} from 'recharts';
import {
    Activity, Download, GraduationCap, TrendingUp, Trophy, Calendar, Target,
    BookOpen, Sparkles, ChevronDown, ChevronUp, AlertCircle, Maximize2, Plus, Trash2, ArrowRight
} from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#6366f1', '#eab308'];

const GRADE_POINTS = {
    'A+': 4.3, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0, 'FNS': 0.0, 'R': 0.0
};

export default function TranscriptAnalyticsPage() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [expandedTerms, setExpandedTerms] = useState(new Set());

    // What-If Calculator State
    const [whatIfCourses, setWhatIfCourses] = useState([
        { id: 1, credits: 3, grade: 'A' }
    ]);

    // Handle auto-sync from extension via URL parameter
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const rawData = params.get('data');
            if (rawData) {
                try {
                    const parsed = JSON.parse(decodeURIComponent(rawData));
                    if (parsed && parsed.terms) {
                        setData(parsed);
                        if (parsed.terms.length > 0) {
                            setExpandedTerms(new Set([parsed.terms[parsed.terms.length - 1].term]));
                        } else {
                            setError("The transcript appears to be empty or contains no valid terms.");
                        }
                        // Clear the URL to avoid re-parsing on refresh if desired, 
                        // but keeping for now for simplicity
                    }
                } catch (e) {
                    console.error("Failed to parse auto-sync data:", e);
                    setError("Failed to load data from extension. Please try manual upload.");
                }
            }
        }
    }, []);

    const toggleTerm = (termStr) => {
        const newExpanded = new Set(expandedTerms);
        if (newExpanded.has(termStr)) {
            newExpanded.delete(termStr);
        } else {
            newExpanded.add(termStr);
        }
        setExpandedTerms(newExpanded);
    };

    const expandAll = () => {
        if (data && data.terms) {
            setExpandedTerms(new Set(data.terms.map(t => t.term)));
        }
    };

    const collapseAll = () => setExpandedTerms(new Set());

    const processFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target.result;
                let result;

                if (file.name.endsWith('.json')) {
                    result = JSON.parse(text);
                    // Backward compatibility: If it's an old JSON export missing GPA calculations, calculate it now
                    if (result.overallCumGPA === 0 && result.terms.length > 0) {
                        let totalPoints = 0;
                        let totalCredits = 0;
                        const GRADE_POINTS = { 'A+': 4.3, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0.0, 'FNS': 0.0, 'R': 0.0 };
                        const courseHistory = {};

                        result.terms.forEach(t => {
                            let termPoints = 0;
                            let termGradedCredits = 0;
                            t.courses.forEach(c => {
                                if (GRADE_POINTS[c.grade] !== undefined) {
                                    const points = GRADE_POINTS[c.grade] * c.credits;
                                    termPoints += points;
                                    termGradedCredits += c.credits;
                                    courseHistory[c.code] = { credits: c.credits, points };
                                }
                            });

                            if (t.termGPA === 0 && termGradedCredits > 0) t.termGPA = parseFloat((termPoints / termGradedCredits).toFixed(2));

                            let curPoints = 0, curCredits = 0;
                            Object.values(courseHistory).forEach(entry => { curPoints += entry.points; curCredits += entry.credits; });
                            t.cumGPA = curCredits > 0 ? parseFloat((curPoints / curCredits).toFixed(2)) : 0;
                        });

                        let finalPoints = 0, finalCredits = 0;
                        Object.values(courseHistory).forEach(entry => { finalPoints += entry.points; finalCredits += entry.credits; });
                        result.overallCumGPA = finalCredits > 0 ? parseFloat((finalPoints / finalCredits).toFixed(2)) : 0;
                    }
                } else {
                    result = parseTranscript(text);
                }

                if (!result || !result.terms || result.terms.length === 0) {
                    throw new Error("No academic terms found. Please ensure you uploaded the Unofficial Transcript HTML or JSON.");
                }
                setData(result);
                setError(null);
                setExpandedTerms(new Set([result.terms[result.terms.length - 1].term])); // Expand latest by default
            } catch (err) {
                console.error(err);
                setError(err.message || "Failed to parse transcript. Please upload the correct HTML file.");
            }
        };
        reader.readAsText(file);
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
    };

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
    };

    const downloadJSON = () => {
        if (!data) return;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `academic_history_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const downloadExcel = async () => {
        if (!data) return;

        const includeGrades = window.confirm(
            "Would you like to include your grades and GPA in this Excel export?\n\n" +
            "Select 'OK' to include them, or 'Cancel' for a clean course list without grades."
        );

        let inProgressCredits = 0;
        data.terms.forEach(t => {
            t.courses.forEach(c => {
                if (c.grade === 'IP' || c.grade === 'DISC' || c.earned === 0 && c.grade === '') {
                    if (c.grade === 'IP' || c.grade === '') {
                        inProgressCredits += c.credits;
                    }
                }
            });
        });

        const wb = await XlsxPopulate.fromBlankAsync();
        const ws = wb.sheet(0);
        ws.name("Academic History");

        let row = 1;
        ws.column("A").width(18);
        ws.column("B").width(45);
        ws.column("C").width(12);
        ws.column("D").width(12);
        ws.column("E").width(12);

        const setLabelStyle = (cell) => cell.style({ bold: true, fontColor: "111827" });

        // --- STUDENT PROFILE ---
        ws.cell(`A${row}`).value("STUDENT PROFILE").style({ bold: true, fontSize: 13, fontColor: "ffffff", fill: "912338" });
        ws.range(`A${row}:E${row}`).merged(true).style({ fill: "912338" });
        row++;

        setLabelStyle(ws.cell(`A${row}`).value("Name:"));
        ws.cell(`B${row}`).value(data.studentName || 'N/A').style({ fontColor: "4b5563" });
        ws.range(`B${row}:E${row}`).merged(true);
        row++;

        setLabelStyle(ws.cell(`A${row}`).value("Student ID:"));
        ws.cell(`B${row}`).value(data.studentId || 'N/A').style({ fontColor: "4b5563" });
        ws.range(`B${row}:E${row}`).merged(true);
        row++;

        const progString = data.programName ? data.programName.replace(/\n/g, ' | ') : 'N/A';
        setLabelStyle(ws.cell(`A${row}`).value("Program Name:"));
        ws.cell(`B${row}`).value(progString).style({ fontColor: "4b5563" });
        ws.range(`B${row}:E${row}`).merged(true);
        ws.range(`A1:E${row}`).style({ border: true, borderColor: "d1d5db" });
        row++;

        setLabelStyle(ws.cell(`A${row}`).value("Total Credits Needed:"));
        ws.cell(`B${row}`).value(data.minCreditsRequired || 'N/A').style({ fontColor: "4b5563", bold: true });
        ws.range(`B${row}:E${row}`).merged(true);
        row++;

        setLabelStyle(ws.cell(`A${row}`).value("Credits Completed:"));
        ws.cell(`B${row}`).value(data.totalCreditsEarned).style({ fontColor: "10b981", bold: true });
        ws.range(`B${row}:E${row}`).merged(true);
        row++;

        setLabelStyle(ws.cell(`A${row}`).value("In Progress Credits:"));
        ws.cell(`B${row}`).value(inProgressCredits).style({ fontColor: "f59e0b", bold: true });
        ws.range(`B${row}:E${row}`).merged(true);

        ws.range(`A${row - 2}:E${row}`).style({ fill: "f9fafb", border: true, borderColor: "e5e7eb" });
        row += 2;

        // --- TERMS ---
        data.terms.forEach(t => {
            let termCreditsEarned = 0;
            let termCreditsAttempted = 0;
            t.courses.forEach(c => {
                termCreditsAttempted += c.credits;
                termCreditsEarned += c.earned;
            });

            // Semester Header
            ws.cell(`A${row}`).value(t.term.toUpperCase()).style({ bold: true, fontSize: 12, fill: "e2e8f0", fontColor: "1e293b", border: true });
            ws.range(`A${row}:E${row}`).merged(true).style({ fill: "e2e8f0", border: true });
            row++;

            if (includeGrades) {
                // Semester Stats
                ws.cell(`A${row}`).value("Total Credits Taken:").style({ bold: true, fontColor: "64748b" });
                ws.cell(`B${row}`).value(termCreditsAttempted).style({ bold: true });
                ws.cell(`C${row}`).value("Term GPA:").style({ bold: true, fontColor: "64748b" });
                ws.cell(`D${row}`).value(t.termGPA).style({ bold: true, fontColor: "db9e1e" });
                row++;

                ws.cell(`A${row}`).value("Credits Passed:").style({ bold: true, fontColor: "64748b" });
                ws.cell(`B${row}`).value(termCreditsEarned).style({ bold: true, fontColor: "10b981" });
                ws.cell(`C${row}`).value("Cumulative GPA:").style({ bold: true, fontColor: "64748b" });
                ws.cell(`D${row}`).value(t.cumGPA).style({ bold: true, fontColor: "912338" });
                row++;

                // Course Table Headers
                ['Course', 'Title', 'Credits', 'Earned', 'Grade'].forEach((txt, idx) => {
                    const colLetter = String.fromCharCode(65 + idx);
                    ws.cell(`${colLetter}${row}`).value(txt).style({ fill: "e0f2fe", bold: true, fontColor: "0369a1", border: true, borderColor: "bae6fd" });
                });
                row++;

                // Course Rows
                t.courses.forEach(c => {
                    const rowFill = "f0f9ff";
                    ws.cell(`A${row}`).value(c.code).style({ border: true, borderColor: "bae6fd", fill: rowFill });
                    ws.cell(`B${row}`).value(c.title).style({ border: true, borderColor: "bae6fd", fill: rowFill });
                    ws.cell(`C${row}`).value(c.credits).style({ border: true, borderColor: "bae6fd", horizontalAlignment: "center", fill: rowFill });
                    ws.cell(`D${row}`).value(c.earned).style({ border: true, borderColor: "bae6fd", horizontalAlignment: "center", fill: rowFill });

                    const gradeCell = ws.cell(`E${row}`).value(c.grade).style({ border: true, borderColor: "bae6fd", horizontalAlignment: "center", bold: true, fill: rowFill });
                    if (c.grade === 'A+' || c.grade === 'A' || c.grade === 'A-') gradeCell.style({ fontColor: "10b981" });
                    else if (c.grade === 'F' || c.grade === 'FNS' || c.grade === 'DISC') gradeCell.style({ fontColor: "ef4444" });

                    row++;
                });
            } else {
                // Course Table Headers (Without Grades)
                ['Course', 'Title', 'Credits'].forEach((txt, idx) => {
                    const colLetter = String.fromCharCode(65 + idx);
                    ws.cell(`${colLetter}${row}`).value(txt).style({ fill: "e0f2fe", bold: true, fontColor: "0369a1", border: true, borderColor: "bae6fd" });
                });
                row++;

                // Course Rows
                t.courses.forEach(c => {
                    const rowFill = "f0f9ff";
                    ws.cell(`A${row}`).value(c.code).style({ border: true, borderColor: "bae6fd", fill: rowFill });
                    ws.cell(`B${row}`).value(c.title).style({ border: true, borderColor: "bae6fd", fill: rowFill });
                    ws.cell(`C${row}`).value(c.credits).style({ border: true, borderColor: "bae6fd", horizontalAlignment: "center", fill: rowFill });

                    row++;
                });
            }

            row += 2;
        });

        const blob = await wb.outputAsync();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `academic_history_${new Date().getTime()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Pre-compute analytics
    let trendData = [];
    let subjectData = [];

    // Metrics for GPA Calculator
    let totalGradedCredits = 0;
    let totalGradePoints = 0;

    // Metrics for Trophies
    let bestTerm = { term: 'N/A', gpa: 0, credits: 0 };
    const subjectGrades = {};

    if (data) {
        trendData = data.terms.map((t, idx) => ({
            name: `${t.term.split(' ')[0][0]}${t.term.split(' ')[1].slice(2)}`, // e.g. "F22"
            fullTerm: t.term,
            termGPA: t.termGPA || 0,
            cumGPA: t.cumGPA || 0
        })).filter(t => t.termGPA > 0 || t.cumGPA > 0);

        const subjects = {};
        data.terms.forEach(t => {
            // Trophy: Best Term (must have taken at least 9 credits)
            const termAttempted = t.courses.reduce((acc, c) => acc + c.credits, 0);
            if (termAttempted >= 9 && t.termGPA > bestTerm.gpa) {
                bestTerm = { term: t.term, gpa: t.termGPA, credits: termAttempted };
            }

            t.courses.forEach(c => {
                // For Subject Mastery Radar
                const subj = c.code.split(' ')[0];
                if (!subjects[subj]) subjects[subj] = { credits: 0, count: 0 };
                subjects[subj].credits += c.earned;
                subjects[subj].count += 1;

                // For GPA Calculation & Strongest Subject
                if (c.grade && GRADE_POINTS[c.grade] !== undefined) {
                    totalGradedCredits += c.credits;
                    totalGradePoints += (GRADE_POINTS[c.grade] * c.credits);

                    if (!subjectGrades[subj]) subjectGrades[subj] = { points: 0, credits: 0 };
                    subjectGrades[subj].points += (GRADE_POINTS[c.grade] * c.credits);
                    subjectGrades[subj].credits += c.credits;
                }
            });
        });

        subjectData = Object.keys(subjects)
            .filter(s => subjects[s].credits > 0)
            .map(s => ({
                subject: s,
                credits: subjects[s].credits,
                count: subjects[s].count
            }))
            .sort((a, b) => b.credits - a.credits)
            .slice(0, 6);
    }

    // Calculate Strongest Subject
    let strongestSubject = { subject: 'N/A', gpa: 0 };
    Object.keys(subjectGrades).forEach(subj => {
        if (subjectGrades[subj].credits >= 6) { // Minimum 6 credits to qualify
            const subjGPA = subjectGrades[subj].points / subjectGrades[subj].credits;
            if (subjGPA > strongestSubject.gpa) {
                strongestSubject = { subject: subj, gpa: subjGPA };
            }
        }
    });

    // Calculate What-If GPA
    const getWhatIfGPA = () => {
        if (totalGradedCredits === 0) return 0;
        let newPoints = totalGradePoints;
        let newCredits = totalGradedCredits;

        whatIfCourses.forEach(c => {
            if (c.credits > 0 && GRADE_POINTS[c.grade] !== undefined) {
                newPoints += (GRADE_POINTS[c.grade] * c.credits);
                newCredits += c.credits;
            }
        });

        return newCredits > 0 ? (newPoints / newCredits).toFixed(2) : data?.overallCumGPA.toFixed(2);
    };

    const StatCard = ({ label, value, subtext, colorClass }) => (
        <div className={`p-6 rounded-3xl border shadow-lg dark:shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden group transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-purple-200 dark:hover:shadow-purple-500/10 ${colorClass}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 w-full">
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400 mb-2">{label}</p>
                <p className="text-4xl font-black mb-1 text-gray-900 dark:text-white tracking-tight">{value}</p>
                {subtext && <p className="text-xs font-semibold text-gray-500">{subtext}</p>}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen p-6 md:p-8 bg-[#FDFBF7] dark:bg-[#050505] text-gray-900 dark:text-gray-100 font-sans relative overflow-hidden selection:bg-purple-500/30">
            {/* Premium Ambient Background Orbs */}
            <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#DB9E1E]/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none dark:mix-blend-screen" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#912338]/5 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none dark:mix-blend-screen" />
            <div className="fixed top-[40%] left-[60%] w-[30vw] h-[30vw] bg-[#DB9E1E]/5 dark:bg-pink-600/5 rounded-full blur-[100px] pointer-events-none dark:mix-blend-screen" />

            <div className="max-w-[1400px] mx-auto space-y-8 relative z-10">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-br from-[#912338] to-[#DB9E1E] dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                            Academic Journey
                        </h1>
                        {!data ? (
                            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 font-medium">
                                Premium analytics from your unofficial transcript.
                            </p>
                        ) : (
                            <div className="mt-4 space-y-1">
                                {data.studentName && data.studentId && (
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        {data.studentName}
                                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-[#912338]/10 text-[#912338] dark:bg-purple-500/20 dark:text-purple-300">
                                            ID: {data.studentId}
                                        </span>
                                    </h2>
                                )}
                                {data.programName && (
                                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide whitespace-pre-line leading-relaxed mt-2 border-l-2 border-[#DB9E1E] pl-4">
                                        {data.programName}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {data && (
                        <div className="flex gap-2">
                            <button onClick={downloadExcel} className="px-5 py-2.5 text-sm font-bold bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl hover:bg-white dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-700 dark:text-white transition-all shadow-sm dark:shadow-xl flex items-center gap-2">
                                <Download className="w-4 h-4" /> Excel
                            </button>
                            <button onClick={downloadJSON} className="px-5 py-2.5 text-sm font-bold bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl hover:bg-white dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-700 dark:text-white transition-all shadow-sm dark:shadow-xl flex items-center gap-2">
                                {'{ }'} JSON
                            </button>
                        </div>
                    )}
                </header>

                {!data && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`
                            relative group mt-12
                            border-2 border-dashed rounded-[2rem] p-16 text-center transition-all duration-300 backdrop-blur-xl
                            ${isDragging
                                ? 'border-[#912338] bg-[#912338]/5 dark:bg-purple-500/10 scale-[1.02] shadow-xl dark:shadow-2xl shadow-[#912338]/10 dark:shadow-purple-500/20'
                                : 'border-[#DB9E1E]/30 dark:border-white/20 hover:border-[#912338]/50 dark:hover:border-white/40 bg-white/60 dark:bg-white/5'}
                        `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            accept=".html,.htm"
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="space-y-6 pointer-events-none">
                            <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center transition-colors shadow-sm dark:shadow-2xl ${isDragging ? 'bg-[#912338]/10 dark:bg-purple-500/20 text-[#912338] dark:text-purple-400' : 'bg-white/80 dark:bg-white/10 text-[#DB9E1E] dark:text-gray-400'}`}>
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold tracking-tight text-[#912338] dark:text-white mb-2">Drop Transcript HTML</p>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                                    Navigate to <strong className="text-[#912338] dark:text-purple-400">View Unofficial Transcript</strong> in your Student Center, save the page as HTML, and drop it here.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <div className="p-5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {data && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 mt-8">

                        {/* Summary Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            <StatCard
                                label="Cumulative GPA"
                                value={data.overallCumGPA.toFixed(2)}
                                subtext={data.programName}
                                colorClass="bg-gradient-to-br from-[#912338]/5 to-[#DB9E1E]/5 dark:from-indigo-500/10 dark:to-purple-500/10 border-[#DB9E1E]/30 dark:border-indigo-500/20 text-[#912338] dark:text-white hover:border-[#912338]/50 dark:hover:border-purple-500/50 hover:shadow-[#912338]/10"
                            />
                            <StatCard
                                label="Total Earned"
                                value={data.totalCreditsEarned.toFixed(1)}
                                subtext="Credits successfully passed"
                                colorClass="bg-white/60 dark:bg-white/5 border-[#912338]/10 dark:border-white/10 text-gray-900 dark:text-white hover:border-[#DB9E1E]/40"
                            />
                            <StatCard
                                label="Terms Logged"
                                value={data.terms.length}
                                subtext="Total academic semesters"
                                colorClass="bg-white/60 dark:bg-white/5 border-[#912338]/10 dark:border-white/10 text-gray-900 dark:text-white hover:border-[#DB9E1E]/40"
                            />
                        </div>

                        {/* Analytics Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                            {/* GPA Trend Chart */}
                            <div className="lg:col-span-12 bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-[2rem] p-6 md:p-8 shadow-xl dark:shadow-2xl shadow-[#912338]/5 dark:shadow-black/50 border border-[#DB9E1E]/20 dark:border-white/10 relative z-10 w-full h-[450px] flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-xl flex items-center gap-3 text-gray-900 dark:text-white">
                                        <TrendingUp className="w-6 h-6 text-[#912338] dark:text-purple-400" /> GPA Trajectory
                                    </h3>
                                </div>
                                <div className="flex-1 w-full min-h-0 [--term-stroke:#912338] dark:[--term-stroke:#a855f7] [--term-fill:url(#colorTerm)] dark:[--term-fill:url(#colorTermDark)] [--cum-stroke:#DB9E1E] dark:[--cum-stroke:#ec4899] [--cum-fill:url(#colorCum)] dark:[--cum-fill:url(#colorCumDark)]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={trendData} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorTerm" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#912338" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#912338" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorTermDark" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#DB9E1E" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#DB9E1E" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorCumDark" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-[#912338]/10 dark:stroke-white/5" />
                                            <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600, fill: '#9ca3af' }} axisLine={false} tickLine={false} dy={10} />
                                            <YAxis domain={[0, 4.3]} tick={{ fontSize: 11, fontWeight: 600, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                            <RechartsTooltip
                                                contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', fontWeight: 'bold' }}
                                                labelStyle={{ color: '#fff', marginBottom: '8px' }}
                                                itemStyle={{ fontSize: '12px' }}
                                            />
                                            <Area type="monotone" dataKey="termGPA" name="Term GPA" stroke="var(--term-stroke)" strokeWidth={3} fillOpacity={0} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--term-stroke)' }} />
                                            <Area type="monotone" dataKey="cumGPA" name="Cumulative" stroke="var(--cum-stroke)" strokeWidth={3} fillOpacity={0} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--cum-stroke)' }} />
                                            <ReferenceLine y={4.3} stroke="#10b981" strokeDasharray="3 3" opacity={0.3} label={{ position: 'top', value: '4.3 Max', fill: '#10b981', fontSize: 10, fontWeight: 'bold' }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>



                        {/* Subway Map / Timeline */}
                        <div className="pt-8">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-[#912338] dark:text-white tracking-tight">Timeline</h2>
                                    <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">Your term-by-term progression</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={expandAll} className="text-sm font-bold text-[#912338] dark:text-purple-400 hover:text-[#DB9E1E] dark:hover:text-purple-300 transition-colors">Expand All</button>
                                    <span className="text-gray-300 dark:text-white/20">|</span>
                                    <button onClick={collapseAll} className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#912338] dark:hover:text-white transition-colors">Collapse All</button>
                                </div>
                            </div>

                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 md:before:ml-10 before:-translate-x-[1px] before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[#912338]/40 dark:before:from-purple-500/50 before:via-[#DB9E1E]/30 dark:before:via-pink-500/30 before:to-transparent">
                                {data.terms.map((term, index) => {
                                    const isExpanded = expandedTerms.has(term.term);
                                    const isCurrent = term.courses.some(c => c.grade === 'IP');

                                    return (
                                        <div key={index} className="relative flex items-start gap-4 md:gap-8 group">
                                            {/* Track Dot */}
                                            <div className="flex-shrink-0 w-12 h-12 md:w-20 md:h-20 flex items-center justify-center relative z-10">
                                                <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-[3px] shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-125 ${isCurrent ? 'bg-[#912338] border-[#DB9E1E] dark:bg-indigo-500 dark:border-indigo-200 shadow-[#DB9E1E]/50 dark:shadow-indigo-500/80' : 'bg-[#FDFBF7] dark:bg-[#0a0a0a] border-[#DB9E1E]/50 dark:border-purple-500/60 group-hover:bg-[#DB9E1E] group-hover:border-[#DB9E1E] dark:group-hover:bg-purple-500 dark:group-hover:border-purple-300'}`} />
                                            </div>

                                            {/* Content Card */}
                                            <div className="flex-1 bg-white/70 dark:bg-white/5 backdrop-blur-2xl rounded-[2rem] shadow-lg dark:shadow-2xl border border-[#DB9E1E]/20 dark:border-white/10 hover:border-[#912338]/40 dark:hover:border-purple-500/50 hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300 mt-2 md:mt-0 overflow-hidden text-gray-900 dark:text-white hover:shadow-[#912338]/10 dark:group-hover:shadow-[0_0_40px_-15px_rgba(168,85,247,0.3)]">
                                                <div
                                                    className="p-5 md:p-6 cursor-pointer relative min-h-[5rem] bg-transparent"
                                                    onClick={() => toggleTerm(term.term)}
                                                >
                                                    {/* Chevron right */}
                                                    <div className="absolute right-5 md:right-6 top-5 w-10 h-10 rounded-full bg-[#912338]/5 dark:bg-white/5 flex items-center justify-center text-[#912338]/60 dark:text-gray-400 group-hover:text-[#912338] dark:group-hover:text-purple-400 group-hover:bg-[#912338]/10 dark:group-hover:bg-purple-500/10 transition-all">
                                                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                    </div>

                                                    <div className="flex flex-col pr-12">
                                                        <div className={`flex w-full ${isExpanded ? 'justify-center' : 'justify-start'} transition-all duration-300`}>
                                                            <h3 className="font-bold text-lg md:text-xl text-[#912338] dark:text-white tracking-tight flex items-center gap-3">
                                                                {term.term}
                                                                {isCurrent && <span className="px-2.5 py-1 bg-[#DB9E1E]/10 dark:bg-indigo-500/20 text-[#DB9E1E] dark:text-indigo-300 border border-[#DB9E1E]/30 dark:border-indigo-500/30 text-[9px] uppercase tracking-widest rounded-full leading-none shadow-sm dark:shadow-[0_0_10px_rgba(99,102,241,0.2)]">In Progress</span>}
                                                            </h3>
                                                        </div>

                                                        <div className="flex items-center gap-4 mt-2 justify-start transition-all duration-300">
                                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400">
                                                                <BookOpen className="w-3.5 h-3.5 opacity-70" /> {term.courses.length} courses
                                                            </div>
                                                            {(term.termGPA > 0 || term.cumGPA > 0) && (
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    {term.termGPA > 0 && <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-black bg-[#912338]/10 dark:bg-purple-500/20 text-[#912338] dark:text-purple-300 border border-[#912338]/20 dark:border-purple-500/20">GPA {term.termGPA.toFixed(2)}</span>}
                                                                    {term.cumGPA > 0 && <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-black bg-[#DB9E1E]/10 dark:bg-pink-500/20 text-[#DB9E1E] dark:text-pink-300 border border-[#DB9E1E]/20 dark:border-pink-500/20">CUM {term.cumGPA.toFixed(2)}</span>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="border-t border-[#DB9E1E]/20 dark:border-white/10 bg-[#FDFBF7]/80 dark:bg-black/40 backdrop-blur-md"
                                                        >
                                                            <div className="p-5 md:p-6">
                                                                <div className="overflow-x-auto">
                                                                    <table className="w-full text-sm text-left whitespace-nowrap md:whitespace-normal">
                                                                        <thead>
                                                                            <tr className="text-[10px] font-black uppercase tracking-widest text-[#912338]/80 dark:text-gray-500 border-b border-[#DB9E1E]/20 dark:border-white/5 pb-2">
                                                                                <th className="pb-3 pr-4">Course</th>
                                                                                <th className="pb-3 px-4 w-full text-center">Title</th>
                                                                                <th className="pb-3 px-4 text-center">Grade</th>
                                                                                <th className="pb-3 pl-4 text-right">Cr.</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-[#DB9E1E]/20 dark:divide-white/5">
                                                                            {term.courses.map((course, idx) => (
                                                                                <tr key={idx} className="hover:bg-[#DB9E1E]/5 dark:hover:bg-white/5 transition-colors">
                                                                                    <td className="py-3 pr-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">{course.code}</td>
                                                                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300 text-xs md:text-sm text-center font-medium">{course.title.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</td>
                                                                                    <td className="py-3 px-4 text-center">
                                                                                        <span className={`px-2 py-1 rounded border text-[10px] font-black uppercase tracking-wider ${['F', 'FNS', 'DISC', 'DNW'].includes(course.grade)
                                                                                            ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
                                                                                            : course.grade === 'IP'
                                                                                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                                                                                                : 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20'
                                                                                            }`}>
                                                                                            {course.grade || '-'}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="py-3 pl-4 text-right font-mono text-gray-500 dark:text-gray-400 font-bold">{course.credits.toFixed(1)}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </motion.div>
                )}
            </div>
        </div>
    );
}
