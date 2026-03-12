import React from 'react';
import { Outfit } from "next/font/google";
import InsightsClient from "../../components/insights/InsightsClient";
import { getGradeData } from "../../lib/data-source";

const outfit = Outfit({ subsets: ["latin"] });

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function InsightsPage() {
    // Fetch data on the server
    const allData = await getGradeData();

    return (
        <div className={`min-h-screen bg-[#FAFAFA] dark:bg-[#050505] transition-colors duration-300 ${outfit.className}`}>

            <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-burgundy/10 dark:bg-burgundy/20 text-burgundy dark:text-red-400 text-sm font-bold mb-4">
                        PHASE 4: BETA
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#2c3e50] dark:text-white mb-4">
                        Academic Insight Engine
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Stop guessing. Start strategizing. Use historical grade data to investigate courses,
                        calculate term difficulty, and find the perfect electives.
                    </p>
                </div>

                {/* Client Component handling state and tabs */}
                <InsightsClient allData={allData} />

                <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800 text-center transition-colors">
                    <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-2">Missing Data?</h3>
                    <p className="text-blue-700 dark:text-blue-200 mb-6">
                        We currently only have data for partial COMP courses (87 rows).
                        Help your classmates by calculating more data.
                    </p>
                    <a href="/insights/help" className="font-bold underline text-blue-900 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100">
                        View Step-by-Step Guide →
                    </a>
                </div>
            </div>

        </div>
    );
}
