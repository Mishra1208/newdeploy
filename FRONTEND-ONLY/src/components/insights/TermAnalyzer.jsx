"use client";
import React, { useState, useEffect } from 'react';
import { calculateCourseStats } from '../../lib/data-utils';

export default function TermAnalyzer({ data }) {
    const [allCourses, setAllCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [currentSelection, setCurrentSelection] = useState('');
    const [termStats, setTermStats] = useState(null);

    useEffect(() => {
        if (data) {
            const list = [...new Set(data.map(row => row.Course).filter(c => typeof c === 'string'))].sort();
            setAllCourses(list);
        }
    }, [data]);

    const addCourse = () => {
        if (currentSelection && !selectedCourses.includes(currentSelection)) {
            const newSelection = [...selectedCourses, currentSelection];
            setSelectedCourses(newSelection);
            calculateTerm(newSelection);
            setCurrentSelection('');
        }
    };

    const removeCourse = (course) => {
        const newSelection = selectedCourses.filter(c => c !== course);
        setSelectedCourses(newSelection);
        calculateTerm(newSelection);
    };

    const calculateTerm = (coursesToCalc) => {
        if (coursesToCalc.length === 0) {
            setTermStats(null);
            return;
        }

        let totalFailRateSum = 0;
        let totalGPA = 0;
        let count = 0;

        for (const courseCode of coursesToCalc) {
            // Filter rows for this course
            const courseRows = data.filter(row => row.Course === courseCode);
            const stats = calculateCourseStats(courseRows);
            if (stats) {
                totalFailRateSum += parseFloat(stats.failRate);
                totalGPA += parseFloat(stats.gpa);
                count++;
            }
        }

        if (count > 0) {
            setTermStats({
                avgFailRate: (totalFailRateSum / count).toFixed(1),
                avgGPA: (totalGPA / count).toFixed(2),
                cumulativeRisk: (totalFailRateSum).toFixed(1) // Summing fail rates as a "Risk Score"
            });
        }
    };

    const getRiskVerdict = (riskScore) => {
        const score = parseFloat(riskScore);
        if (score < 15) return { text: "Safe & Chill 🏖️", color: "bg-green-100 text-green-800" };
        if (score < 30) return { text: "Balanced ⚖️", color: "bg-blue-100 text-blue-800" };
        if (score < 50) return { text: "Heavy Load 🏋️", color: "bg-yellow-100 text-yellow-800" };
        return { text: "Academic Suicide ☠️", color: "bg-red-100 text-red-800" };
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Is Your Semester Doable?</h2>

            <div className="flex gap-2 max-w-md mx-auto">
                <select
                    value={currentSelection}
                    onChange={(e) => setCurrentSelection(e.target.value)}
                    className="flex-1 p-3 border rounded-xl bg-white dark:bg-[#222] dark:text-gray-200 dark:border-gray-700"
                >
                    <option value="">Select a course...</option>
                    {allCourses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                    onClick={addCourse}
                    className="bg-burgundy text-white px-6 py-3 rounded-xl font-bold hover:bg-burgundy/90"
                >
                    Add
                </button>
            </div>

            {/* Selected Courses Chips */}
            <div className="flex flex-wrap justify-center gap-2">
                {selectedCourses.map(c => (
                    <span key={c} className="bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                        <span className="font-bold text-gray-700 dark:text-gray-300">{c}</span>
                        <button onClick={() => removeCourse(c)} className="text-red-400 hover:text-red-600 font-bold">×</button>
                    </span>
                ))}
            </div>

            {/* Verdict */}
            {termStats && (
                <div key="result" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className={`inline-block px-8 py-4 rounded-2xl text-2xl font-black mb-8 shadow-sm ${getRiskVerdict(termStats.cumulativeRisk).color}`}>
                        Verdict: {getRiskVerdict(termStats.cumulativeRisk).text}
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                        <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <p className="text-xs uppercase font-bold text-gray-400 mb-1">Avg Hist. GPA</p>
                            <p className="text-4xl font-black text-gray-800 dark:text-white">{termStats.avgGPA}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <p className="text-xs uppercase font-bold text-gray-400 mb-1">Risk Score</p>
                            <p className="text-4xl font-black text-gray-800 dark:text-white">{termStats.cumulativeRisk}</p>
                        </div>
                    </div>
                </div>
            )}

            {selectedCourses.length === 0 && (
                <div className="py-12 opacity-30">
                    <p className="text-6xl mb-4">🔮</p>
                    <p>Add courses to forecast your fate.</p>
                </div>
            )}
        </div>
    );
}
