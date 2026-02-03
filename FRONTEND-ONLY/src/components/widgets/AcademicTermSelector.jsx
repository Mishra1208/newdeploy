"use client";
import React, { useState, useEffect } from 'react';
import { generateICS, downloadICS } from '@/utils/icsGenerator';
import academicDates from '@/data/academic-dates.json';

const AcademicTermSelector = () => {
    const [terms, setTerms] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Hydration fix
        setIsClient(true);
        // Extract term keys from JSON
        const termKeys = Object.keys(academicDates);
        setTerms(termKeys);
        if (termKeys.length > 0) {
            setSelectedTerm(termKeys[0]);
        }
    }, []);

    const handleDownload = () => {
        if (!selectedTerm) return;

        const events = academicDates[selectedTerm];
        if (!events) return;

        const icsContent = generateICS(selectedTerm, events);
        // Create filename: "Fall_term_2026.ics"
        const filename = `${selectedTerm.replace(/\s+/g, '_')}.ics`;

        downloadICS(filename, icsContent);
    };

    if (!isClient) return null;

    return (
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Export Academic Calendar</h3>
            <p className="text-sm text-gray-400 mb-6">
                Never miss a deadline. Add key dates for <strong>{selectedTerm || 'your term'}</strong> directly to your personal calendar.
            </p>

            <div className="flex flex-col gap-4">
                <div className="relative">
                    <select
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                        {terms.map(term => (
                            <option key={term} value={term} className="bg-gray-900 text-white">
                                {term}
                            </option>
                        ))}
                    </select>
                    {/* Select Arrow Icon */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <button
                    onClick={handleDownload}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download .ICS File
                </button>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <p className="text-xs text-gray-500">Works with Apple Calendar, Google Calendar, and Outlook.</p>
            </div>
        </div>
    );
};

export default AcademicTermSelector;
