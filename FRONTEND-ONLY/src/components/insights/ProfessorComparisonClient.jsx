"use client";

import React, { useState, useEffect } from "react";
import { calculateCourseStats } from "../../lib/data-utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ArrowLeft, User, Calendar, Award, AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProfessorComparisonClient({ data }) {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [offerings, setOfferings] = useState([]);
    const [selectionA, setSelectionA] = useState("");
    const [selectionB, setSelectionB] = useState("");
    const [comparisonData, setComparisonData] = useState(null);

    // Initial Load
    useEffect(() => {
        if (data && data.length > 0) {
            const list = [...new Set(data.map(row => row.Course))].sort();
            setCourses(list);
            if (list.length > 0) setSelectedCourse(list[0]);
        }
    }, [data]);

    // When Course Changes, Update Offerings
    useEffect(() => {
        if (!selectedCourse) return;

        // Get all rows for this course
        const rows = data.filter(r => r.Course === selectedCourse);

        // Create unique offerings list: "Term - Professor"
        // Since we currently have "Staff", we will just use Term for now, but display Professor if available.
        const uniqueOfferings = rows.map(r => ({
            id: r.Term, // Assuming 1 row per term per course (usually true for distributions)
            term: r.Term,
            professor: r.Professor || "Staff",
            label: `${r.Term} (${r.Professor || "Staff"})`,
            data: r
        }));

        setOfferings(uniqueOfferings);

        // Default selections (First and Last, or First and Second)
        if (uniqueOfferings.length >= 2) {
            setSelectionA(uniqueOfferings[0].id);
            setSelectionB(uniqueOfferings[1].id);
        } else if (uniqueOfferings.length === 1) {
            setSelectionA(uniqueOfferings[0].id);
            setSelectionB("");
        }
    }, [selectedCourse, data]);

    // Calculate Comparison
    useEffect(() => {
        if (!selectionA || !selectionB || !offerings.length) {
            setComparisonData(null);
            return;
        }

        const offerA = offerings.find(o => o.id === selectionA);
        const offerB = offerings.find(o => o.id === selectionB);

        if (!offerA || !offerB) return;

        const statsA = calculateCourseStats([offerA.data]);
        const statsB = calculateCourseStats([offerB.data]);

        // Prepare Chart Data
        const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
        const chartData = grades.map(g => ({
            grade: g,
            [offerA.term]: offerA.data[g] || 0,
            [offerB.term]: offerB.data[g] || 0,
        }));

        setComparisonData({
            a: { ...offerA, stats: statsA },
            b: { ...offerB, stats: statsB },
            chart: chartData
        });

    }, [selectionA, selectionB, offerings]);

    if (offerings.length === 0) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] p-4 md:p-8 font-sans text-gray-900 dark:text-white transition-colors duration-300">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/insights" className="p-2 rounded-full bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 transition">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            Professor Comparison <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded">Beta</span>
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Comparing offerings for {selectedCourse}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white dark:bg-[#151515] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    {/* Course Select */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-gray-700 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition"
                        >
                            {courses.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Selection A */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Profile A</label>
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/10 p-1 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">A</div>
                            <select
                                value={selectionA}
                                onChange={(e) => setSelectionA(e.target.value)}
                                className="w-full bg-transparent p-2 font-semibold text-blue-900 dark:text-blue-100 outline-none"
                            >
                                {offerings.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Selection B */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-purple-500 uppercase tracking-widest mb-2">Profile B</label>
                        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/10 p-1 rounded-xl border border-purple-100 dark:border-purple-900/30">
                            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white font-bold">B</div>
                            <select
                                value={selectionB}
                                onChange={(e) => setSelectionB(e.target.value)}
                                className="w-full bg-transparent p-2 font-semibold text-purple-900 dark:text-purple-100 outline-none"
                            >
                                {offerings.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* VISUALIZATION */}
                {comparisonData && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN: Head-to-Head Stats */}
                        <div className="space-y-6">
                            {/* Winner Card */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Award className="w-24 h-24 rotate-12" />
                                </div>
                                <h3 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-1">Recommendation</h3>
                                <p className="text-2xl font-bold mb-4">
                                    {Number(comparisonData.a.stats.gpa) > Number(comparisonData.b.stats.gpa)
                                        ? "Profile A is easier"
                                        : Number(comparisonData.a.stats.gpa) < Number(comparisonData.b.stats.gpa)
                                            ? "Profile B is easier"
                                            : "Both are similar"}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-300">
                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    Based on historical GPA and Pass Rate.
                                </div>
                            </div>

                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 gap-4">
                                {/* GPA Comparison */}
                                <div className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <div className="text-center">
                                        <p className="text-xs uppercase text-gray-400 font-bold">GPA (A)</p>
                                        <p className="text-2xl font-black text-blue-600">{comparisonData.a.stats.gpa}</p>
                                    </div>
                                    <div className="text-gray-300 dark:text-gray-700 font-bold">VS</div>
                                    <div className="text-center">
                                        <p className="text-xs uppercase text-gray-400 font-bold">GPA (B)</p>
                                        <p className="text-2xl font-black text-purple-600">{comparisonData.b.stats.gpa}</p>
                                    </div>
                                </div>

                                {/* Pass Rate Comparison */}
                                <div className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <div className="text-center">
                                        <p className="text-xs uppercase text-gray-400 font-bold">Pass Rate (A)</p>
                                        <p className="text-2xl font-black text-green-600">{comparisonData.a.stats.passRate}%</p>
                                    </div>
                                    <div className="text-gray-300 dark:text-gray-700 font-bold">VS</div>
                                    <div className="text-center">
                                        <p className="text-xs uppercase text-gray-400 font-bold">Pass Rate (B)</p>
                                        <p className="text-2xl font-black text-green-600">{comparisonData.b.stats.passRate}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Chart */}
                        <div className="lg:col-span-2 bg-white dark:bg-[#151515] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm h-[400px]">
                            <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-gray-400" />
                                Grade Distribution Comparison
                            </h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={comparisonData.chart} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" strokeOpacity={0.1} />
                                    <XAxis dataKey="grade" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey={comparisonData.a.term} name={`A: ${comparisonData.a.term}`} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey={comparisonData.b.term} name={`B: ${comparisonData.b.term}`} fill="#a855f7" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
