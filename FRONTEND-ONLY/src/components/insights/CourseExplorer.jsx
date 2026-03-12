"use client";
import React, { useState, useEffect, useRef } from 'react';
import { calculateCourseStats } from '../../lib/data-utils';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Search, ChevronDown, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseExplorer({ data }) {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courseData, setCourseData] = useState(null);
    const [stats, setStats] = useState(null);
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        // Simple theme detection
        if (typeof document !== 'undefined') {
            const isDark = document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark";
            setTheme(isDark ? "dark" : "light");

            const observer = new MutationObserver(() => {
                const isDark = document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark";
                setTheme(isDark ? "dark" : "light");
            });
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
            return () => observer.disconnect();
        }
    }, []);

    const isDark = theme === "dark";
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (data && data.length > 0) {
            // Get unique courses
            const list = [...new Set(data.map(row => row.Course))].sort();
            setCourses(list);
            if (list.length > 0 && !selectedCourse) {
                setSelectedCourse(list[0]);
                setQuery(list[0]);
            }
        }
    }, [data]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    useEffect(() => {
        if (!selectedCourse || !data) return;

        const courseRows = data.filter(row => row.Course === selectedCourse);

        // Transform data for Recharts: {grade: 'A+', count: 10 }
        const distribution = {
            'A+': 0, 'A': 0, 'A-': 0,
            'B+': 0, 'B': 0, 'B-': 0,
            'C+': 0, 'C': 0, 'C-': 0,
            'D+': 0, 'D': 0, 'D-': 0,
            'F': 0, 'FNS': 0
        };

        // Term Analysis Logic
        const termPerformance = {}; // {'Fall 2024': {students: 100, highGrades: 50, failures: 10 } }

        courseRows.forEach(row => {
            // Global Distribution
            Object.keys(distribution).forEach(grade => {
                distribution[grade] += (row[grade] || 0);
            });

            // Term Analysis
            const term = row.Term;
            if (term) {
                if (!termPerformance[term]) termPerformance[term] = { students: 0, highGrades: 0, failures: 0 };

                let termStudents = 0;
                let termHigh = 0; // A+, A, A- (80%+)
                let termFail = 0; // F, FNS or < 60% (D-, D, D+, C-, F, FNS)?
                // User asked for "most failure < 60%".
                // In Concordia: C- is 60-62. D+ is 57-59. So < 60% is D+, D, D-, F, FNS.
                const failGrades = ['D+', 'D', 'D-', 'F', 'FNS'];
                const highGrades = ['A+', 'A', 'A-'];

                const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'FNS'];
                grades.forEach(grade => {
                    const count = row[grade] || 0;
                    // Ensure we only add numbers
                    if (typeof count === 'number') {
                        termStudents += count;
                        if (highGrades.includes(grade)) termHigh += count;
                        if (failGrades.includes(grade)) termFail += count;
                    }
                });

                termPerformance[term].students += termStudents;
                termPerformance[term].highGrades += termHigh;
                termPerformance[term].failures += termFail;
            }
        });

        // Find Insights
        let maxStudentsTerm = { term: 'N/A', count: 0 };
        let easeTerm = { term: 'N/A', rate: -1 };
        let hardTerm = { term: 'N/A', rate: -1 };

        Object.keys(termPerformance).forEach(term => {
            const stats = termPerformance[term];
            if (stats.students > 0) {
                if (stats.students > maxStudentsTerm.count) {
                    maxStudentsTerm = { term, count: stats.students };
                }

                const highRate = stats.highGrades / stats.students;
                if (highRate > easeTerm.rate) {
                    easeTerm = { term, rate: highRate };
                }

                const failRate = stats.failures / stats.students;
                if (failRate > hardTerm.rate) {
                    hardTerm = { term, rate: failRate };
                }
            }
        });

        const chartData = Object.keys(distribution).map(key => ({
            grade: key,
            students: distribution[key]
        }));

        setCourseData(chartData);
        setStats({
            ...calculateCourseStats(courseRows),
            insights: {
                maxStudents: maxStudentsTerm,
                easiest: easeTerm,
                hardest: hardTerm
            }
        });
    }, [selectedCourse, data]);

    const filteredCourses = query === ""
        ? courses
        : courses.filter((course) =>
            course.toLowerCase().includes(query.toLowerCase().trim())
        );

    const getDifficultyColor = (failRate) => {
        if (failRate < 5) return 'text-green-600';
        if (failRate < 15) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (!stats) return <div className="text-center p-10">Loading Data...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-50">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Grade Distribution for <span className="text-burgundy dark:text-red-400">{selectedCourse}</span>
                </h2>

                {/* Custom Searchable Dropdown */}
                <div className="relative w-full md:w-72" ref={wrapperRef}>
                    <div
                        className="relative"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setIsOpen(true);
                            }}
                            placeholder="Search course..."
                            className="w-full pl-10 pr-10 py-3 border rounded-xl text-lg font-bold bg-white dark:bg-[#222] dark:text-white dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-burgundy outline-none transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute w-full mt-2 bg-white dark:bg-[#222] border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl max-h-80 overflow-y-auto z-50 overflow-hidden"
                            >
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map((c) => (
                                        <div
                                            key={c}
                                            onClick={() => {
                                                setSelectedCourse(c);
                                                setQuery(c);
                                                setIsOpen(false);
                                            }}
                                            className={`px-4 py-3 cursor-pointer transition-colors ${c === selectedCourse
                                                ? "bg-burgundy/10 text-burgundy dark:bg-red-500/20 dark:text-red-400 font-bold"
                                                : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200"
                                                }`}
                                        >
                                            {c}
                                        </div>
                                    ))
                                ) : (
                                    /* --- MISSING DATA CTA --- */
                                    <div className="p-4 bg-gray-50 dark:bg-white/5 mx-2 my-2 rounded-lg text-center border border-dashed border-gray-200 dark:border-gray-700">
                                        <AlertCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                            Course "{query}" not found
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                                            We don't have enough data to show this course yet. Help us and other students!
                                        </p>
                                        <Link
                                            href="/insights/help"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                                        >
                                            <Zap className="w-3 h-3" />
                                            Sync Grades
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl text-center border border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Avg GPA</p>
                    <p className="text-3xl font-black text-gray-800 dark:text-white">{stats.gpa}</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl text-center border border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Pass Rate</p>
                    <p className="text-3xl font-black text-green-600 dark:text-green-400">{stats.passRate}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl text-center border border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Fail Rate</p>
                    <p className={`text-3xl font-black ${getDifficultyColor(stats.failRate)}`}>{stats.failRate}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl text-center border border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Sample Size</p>
                    <p className="text-3xl font-black text-gray-800 dark:text-white">{stats.totalStudents}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[400px] w-full bg-white dark:bg-[#1a1a1a] rounded-xl pt-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                        chart: {
                            type: 'column',
                            backgroundColor: 'transparent',
                            style: { fontFamily: 'inherit' },
                            marginBottom: 60 // Ensure labels are not hidden
                        },
                        title: { text: '' },
                        xAxis: {
                            categories: courseData.map(d => d.grade),
                            lineColor: 'transparent',
                            tickWidth: 0,
                            labels: {
                                rotation: 0, // Keep flat
                                style: {
                                    color: isDark ? '#e5e7eb' : '#374151',
                                    fontSize: '13px', // Slightly larger
                                    fontWeight: '700',
                                    textOverflow: 'none' // Prevent "..." truncation
                                }
                            }
                        },
                        yAxis: {
                            title: { text: '' },
                            gridLineColor: isDark ? '#333' : '#f3f4f6',
                            gridLineDashStyle: 'Dash',
                            labels: { enabled: false }
                        },
                        legend: { enabled: false },
                        tooltip: {
                            backgroundColor: isDark ? 'rgba(38,38,38,0.95)' : 'rgba(255,255,255,0.95)',
                            borderColor: isDark ? '#404040' : '#e5e7eb',
                            borderRadius: 16,
                            shadow: true,
                            style: { color: isDark ? '#ffffff' : '#1f2937' },
                            headerFormat: '<span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af">{point.key} Grade</span><br/>',
                            pointFormat: '<span style="font-size: 18px; font-weight: 800; color: {point.color}">{point.y}</span> Students'
                        },
                        plotOptions: {
                            column: {
                                borderRadius: 8, // More rounded
                                borderWidth: 0,
                                groupPadding: 0.1,
                                pointPadding: 0.05,
                                colorByPoint: true,
                                states: {
                                    hover: {
                                        brightness: 0.1 // Brighten heavily on hover
                                    }
                                },
                                colors: courseData.map(d => {
                                    // A+, A, A- = Emerald to Teal Mix
                                    if (['A+', 'A', 'A-'].includes(d.grade)) return {
                                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                        stops: [
                                            [0, '#34d399'], // Emerald-400 (Top)
                                            [1, '#059669']  // Emerald-600 (Bottom)
                                        ]
                                    };
                                    // B+, B, B- = Indigo to Blue (Premium Mid)
                                    if (['B+', 'B', 'B-'].includes(d.grade)) return {
                                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                        stops: [
                                            [0, '#60a5fa'], // Blue-400
                                            [1, '#2563eb']  // Blue-600
                                        ]
                                    };
                                    // C+, C, C- = Amber/Orange (Warning)
                                    if (['C+', 'C', 'C-'].includes(d.grade)) return {
                                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                        stops: [
                                            [0, '#fbbf24'], // Amber-400
                                            [1, '#d97706']  // Amber-600
                                        ]
                                    };
                                    // D+, D, D-, F, FNS = Red to Burgundy
                                    if (['D+', 'D', 'D-', 'F', 'FNS'].includes(d.grade)) return {
                                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                        stops: [
                                            [0, '#f87171'], // Red-400
                                            [1, '#991b1b']  // Red-800
                                        ]
                                    };
                                    // Fallback
                                    return {
                                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                        stops: [[0, '#94a3b8'], [1, '#475569']]
                                    };
                                })
                            }
                        },
                        credits: { enabled: false },
                        series: [{
                            name: 'Students',
                            data: courseData.map(d => d.students),
                            showInLegend: false
                        }]
                    }}
                />
            </div>

            {/* AI Insights Panel */}
            {stats.insights && (
                <div className="bg-gray-50 dark:bg-[#1a1a1a] border-l-4 border-burgundy p-6 rounded-r-xl shadow-sm space-y-3">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                        <span>🤖</span> Quick Analysis
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Highest Intake:</strong> The <span className="text-burgundy dark:text-red-400 font-bold">{stats.insights.maxStudents.term}</span> term had the most students ({stats.insights.maxStudents.count}).
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Easiest Term:</strong> <span className="text-green-600 dark:text-green-400 font-bold">{stats.insights.easiest.term}</span> had the most students in the 80%+ range ({(stats.insights.easiest.rate * 100).toFixed(0)}%).
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Hardest Term:</strong> <span className="text-red-600 dark:text-red-400 font-bold">{stats.insights.hardest.term}</span> had the highest rate of grades &lt;60% ({(stats.insights.hardest.rate * 100).toFixed(0)}%).
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 italic">
                            * Based on {stats.totalStudents} total student records.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
