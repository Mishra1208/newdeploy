import React from 'react';
import PremiumNavbar from '@/components/PremiumNavbar';
import AcademicTermSelector from '@/components/widgets/AcademicTermSelector';

export const metadata = {
    title: 'Academic Calendar Export | ConU Planner',
    description: 'Download Concordia University academic dates for Fall, Winter, and Summer terms directly to your calendar.',
};

export default function AcademicCalendarPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navbar is usually loaded in layout, but ensuring we have container spacing */}

            <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
                <div className="text-center mb-12 max-w-2xl">
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-6 py-2">
                        Sync Your Schedule
                    </h1>
                    <p className="text-xl text-gray-400">
                        Instantly add all Concordia deadlines, exams, and holidays to your personal calendar.
                        Stay ahead of the game with one click.
                    </p>
                </div>

                <div className="w-full flex justify-center">
                    <AcademicTermSelector />
                </div>

                {/* Optional: Preview Section could go here if we wanted to show the list of dates */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-500">
                    <div className="p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                        <div className="mb-3 text-blue-400">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h4 className="text-white font-medium mb-1">Never Miss a Deadline</h4>
                        <p className="text-sm">DNE, DISC, and exam dates populated automatically.</p>
                    </div>
                    <div className="p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                        <div className="mb-3 text-purple-400">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <h4 className="text-white font-medium mb-1">Standard Format</h4>
                        <p className="text-sm">Compatible with all major calendar apps (.ics format).</p>
                    </div>
                    <div className="p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                        <div className="mb-3 text-indigo-400">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        </div>
                        <h4 className="text-white font-medium mb-1">Always Updated</h4>
                        <p className="text-sm">Data scraped directly from Concordia's official site.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
