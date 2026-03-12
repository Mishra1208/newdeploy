"use client";
import React, { useState } from 'react';
import CourseExplorer from "./CourseExplorer";
import TermAnalyzer from "./TermAnalyzer";
import ElectiveFinder from "./ElectiveFinder";

export default function InsightsClient({ allData }) {
    const [activeTab, setActiveTab] = useState('explorer');

    return (
        <>
            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                <button
                    onClick={() => setActiveTab('explorer')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'explorer'
                        ? 'bg-burgundy text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#252525]'
                        }`}
                >
                    📊 Course Explorer
                </button>
                <button
                    onClick={() => setActiveTab('analyzer')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'analyzer'
                        ? 'bg-burgundy text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#252525]'
                        }`}
                >
                    ⚖️ Term Analyzer
                </button>
                <button
                    onClick={() => setActiveTab('electives')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'electives'
                        ? 'bg-burgundy text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#252525]'
                        }`}
                >
                    💎 Elective Finder
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-[#151515] rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gray-800 min-h-[600px] transition-colors">
                {activeTab === 'explorer' && <CourseExplorer data={allData} />}
                {activeTab === 'analyzer' && <TermAnalyzer data={allData} />}
                {activeTab === 'electives' && <ElectiveFinder data={allData} />}
            </div>
        </>
    );
}
