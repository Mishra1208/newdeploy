"use client";
import React, { useState, useEffect } from 'react';
import { calculateCourseStats } from '../../lib/data-utils';

export default function ElectiveFinder({ data }) {
    const [rankings, setRankings] = useState([]);
    const [filterLevel, setFilterLevel] = useState('all'); // all, 200, 300, 400

    useEffect(() => {
        if (data && data.length > 0) {
            const list = [...new Set(data.map(row => row.Course).filter(c => typeof c === 'string'))].sort();
            const statsList = [];

            for (const c of list) {
                const courseRows = data.filter(row => row.Course === c);
                const stats = calculateCourseStats(courseRows);
                if (stats) {
                    statsList.push({
                        code: c,
                        ...stats
                    });
                }
            }

            // Sort by easiest (highest GPA)
            statsList.sort((a, b) => b.gpa - a.gpa);
            setRankings(statsList);
        }
    }, [data]);

    const filteredList = rankings.filter(r => {
        if (filterLevel === 'all') return true;
        return r.code && typeof r.code === 'string' && r.code.includes(filterLevel); // Cheap level check e.g., "COMP 200"
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">🏆 The Holy Grail List</h2>

                <div className="flex gap-2 mt-2 md:mt-0">
                    {['all', '2', '3', '4'].map(lvl => (
                        <button
                            key={lvl}
                            onClick={() => setFilterLevel(lvl)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold ${filterLevel === lvl
                                ? 'bg-burgundy text-white'
                                : 'bg-white dark:bg-[#222] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333]'
                                }`}
                        >
                            {lvl === 'all' ? 'All Levels' : `${lvl}00-level`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-3">
                {filteredList.map((course, index) => (
                    <div key={course.code} className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                            <span className={`
                                w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                                ${index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 dark:bg-[#333] text-gray-500 dark:text-gray-400'}
                            `}>
                                #{index + 1}
                            </span>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-burgundy dark:group-hover:text-red-400 transition-colors">{course.code}</h3>
                                <p className="text-xs text-gray-400">{course.totalStudents} records</p>
                            </div>
                        </div>

                        <div className="flex gap-6 text-right">
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-400">Pass Rate</p>
                                <p className="font-bold text-green-600 dark:text-green-400">{course.passRate}%</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold text-gray-400">Avg GPA</p>
                                <p className="font-bold text-gray-800 dark:text-white text-lg">{course.gpa}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
