import { BCompSc_Schema, ECP_Bucket } from './programSchema';
import { GLOBAL_COURSES } from './prereqGraph'; // To look up credits

/**
 * Valutes a student profile against the BCompSc program schema.
 * @param {Object} studentProfile - { program, isECP, exemptions: ["CHEM 205", "MATH 203"...], courseHistory: [] }
 * @returns {Object} { buckets: [...], remainingRequirements: [...] }
 */
export const validateDegree = (studentProfile) => {
    // 1. Compile Schema
    const activeBuckets = [...BCompSc_Schema.buckets];
    if (studentProfile.isECP) {
        activeBuckets.unshift(ECP_Bucket);
    } 
    
    if (studentProfile.deficiencies && studentProfile.deficiencies.length > 0) {
        // Compute exact credits for deficiencies
        let defCredits = 0;
        studentProfile.deficiencies.forEach(course => {
            defCredits += (GLOBAL_COURSES[course]?.credits || (course.startsWith('ESL') ? 6.0 : 3.0));
        });

        // Append to target!
        activeBuckets.push({
            id: "DEFICIENCIES",
            title: "Assigned Deficiencies",
            requiredCredits: defCredits,
            type: "STRICT", 
            courses: studentProfile.deficiencies,
            description: "Additional courses assigned upon admission (ESL, Math, etc)."
        });
    }

    const availableCourses = [...(studentProfile.courseHistory || [])];
    const availableExemptions = [...(studentProfile.exemptions || [])];

    const validationResults = {};
    const remainingRequirements = [];
    
    // We must replace any credits lost to exemptions with General Electives
    let totalExemptedCreditsToReplace = 0;

    for (const bucket of activeBuckets) {
        let fulfilledCredits = 0;
        let exemptedCredits = 0; // Credits satisfied via exemption
        let consumedInBucket = [];

        // STRICT BUCKET (Core Courses & Deficiencies)
        if (bucket.type === "STRICT" || bucket.type === "STRICT_ECP") {
            const missingCourses = [];
            for (const reqCourse of bucket.courses) {
                const isCompleted = availableCourses.includes(reqCourse);
                const isExempt = availableExemptions.includes(reqCourse);
                const c_credits = (GLOBAL_COURSES[reqCourse]?.credits || (reqCourse.startsWith('ESL') ? 6.0 : 3.0));

                if (isCompleted) {
                    availableCourses.splice(availableCourses.indexOf(reqCourse), 1);
                    consumedInBucket.push(reqCourse);
                    fulfilledCredits += c_credits;
                } else if (isExempt) {
                    availableExemptions.splice(availableExemptions.indexOf(reqCourse), 1);
                    consumedInBucket.push(reqCourse + " (EXEMPT)");
                    exemptedCredits += c_credits;
                    if (bucket.type !== "STRICT_ECP") {
                        totalExemptedCreditsToReplace += c_credits;
                    }
                } else {
                    missingCourses.push(reqCourse);
                    remainingRequirements.push({
                        id: reqCourse,
                        bucketId: bucket.id,
                        isSpecific: true,
                        credits: c_credits
                    });
                }
            }
            // For the UI Progress bar, we want to know what is actually completed vs mathematically bypassed
            validationResults[bucket.id] = { 
                fulfilledCredits: fulfilledCredits, 
                exemptedCredits: exemptedCredits,
                target: bucket.requiredCredits, 
                consumed: consumedInBucket, 
                missing: missingCourses 
            };
            continue;
        }

        // CHOOSE_LIST BUCKET
        if (bucket.type === "CHOOSE_LIST") {
            let creditsNeeded = bucket.requiredCredits;
            
            // Check completed
            for (let i = availableCourses.length - 1; i >= 0; i--) {
                const course = availableCourses[i];
                if (bucket.courses.includes(course)) {
                    const c_credits = (GLOBAL_COURSES[course]?.credits || (course.startsWith('ESL') ? 6.0 : 3.0));
                    if (fulfilledCredits + exemptedCredits + c_credits <= creditsNeeded) {
                        fulfilledCredits += c_credits;
                        consumedInBucket.push(course);
                        availableCourses.splice(i, 1);
                    }
                }
            }
            // Check exemptions
            for (let i = availableExemptions.length - 1; i >= 0; i--) {
                const course = availableExemptions[i];
                if (bucket.courses.includes(course)) {
                    const c_credits = (GLOBAL_COURSES[course]?.credits || 3.0);
                    if (fulfilledCredits + exemptedCredits + c_credits <= creditsNeeded) {
                        exemptedCredits += c_credits;
                        totalExemptedCreditsToReplace += c_credits;
                        consumedInBucket.push(course + " (EXEMPT)");
                        availableExemptions.splice(i, 1);
                    }
                }
            }

            const creditsMissing = creditsNeeded - (fulfilledCredits + exemptedCredits);
            const blocksNeeded = Math.ceil(creditsMissing / 3.0);
            for (let b = 0; b < blocksNeeded; b++) {
                remainingRequirements.push({
                    id: `${bucket.id}_PLACEHOLDER_${b}`,
                    name: `Any ${bucket.title} Course`,
                    bucketId: bucket.id,
                    isSpecific: false,
                    credits: (blocksNeeded === 1 ? creditsMissing : 3.0)
                });
            }

            validationResults[bucket.id] = { 
                fulfilledCredits: fulfilledCredits,
                exemptedCredits: exemptedCredits,
                target: bucket.requiredCredits, 
                consumed: consumedInBucket, 
                missing: [] // Assume handled downstream
            };
            continue;
        }

        // REGEX / WILDCARD BUCKET (CS Electives)
        if (bucket.type === "REGEX_MATCH") {
            let creditsNeeded = bucket.requiredCredits;

            for (let i = availableCourses.length - 1; i >= 0; i--) {
                const course = availableCourses[i];
                if (bucket.regex.test(course) || bucket.whitelist?.includes(course)) {
                    const c_credits = (GLOBAL_COURSES[course]?.credits || (course.startsWith('ESL') ? 6.0 : 3.0));
                    if (fulfilledCredits + exemptedCredits + c_credits <= creditsNeeded) {
                        fulfilledCredits += c_credits;
                        consumedInBucket.push(course);
                        availableCourses.splice(i, 1);
                    }
                }
            }

             for (let i = availableExemptions.length - 1; i >= 0; i--) {
                const course = availableExemptions[i];
                if (bucket.regex.test(course) || bucket.whitelist?.includes(course)) {
                    const c_credits = (GLOBAL_COURSES[course]?.credits || 3.0);
                    if (fulfilledCredits + exemptedCredits + c_credits <= creditsNeeded) {
                        exemptedCredits += c_credits;
                        totalExemptedCreditsToReplace += c_credits;
                        consumedInBucket.push(course + " (EXEMPT)");
                        availableExemptions.splice(i, 1);
                    }
                }
            }

            const creditsMissing = creditsNeeded - (fulfilledCredits + exemptedCredits);
            const blocksNeeded = Math.ceil(creditsMissing / 3.0);
            for (let b = 0; b < blocksNeeded; b++) {
                remainingRequirements.push({
                    id: `${bucket.id}_PLACEHOLDER_${b}`,
                    name: `Any ${bucket.title} Course`,
                    bucketId: bucket.id,
                    isSpecific: false,
                    credits: (blocksNeeded === 1 ? creditsMissing : 3.0)
                });
            }
            validationResults[bucket.id] = { 
                 fulfilledCredits: fulfilledCredits + exemptedCredits, 
                 target: bucket.requiredCredits, 
                 consumed: consumedInBucket 
            };
            continue;
        }

        // OPEN BUCKET (General Electives)
        if (bucket.type === "OPEN") {
             // General electives must now absorb any credits lost to exemptions!
             let creditsNeeded = bucket.requiredCredits + totalExemptedCreditsToReplace;
             
             // Consume all remaining available courses
             for (let i = availableCourses.length - 1; i >= 0; i--) {
                const course = availableCourses[i];
                const c_credits = (GLOBAL_COURSES[course]?.credits || 3.0);
                fulfilledCredits += c_credits;
                consumedInBucket.push(course);
                availableCourses.splice(i, 1);
             }

             // We don't really process exemptions for open electives because if you are exempt from a random class, 
             // you don't get wildcard credits anyway.

             let creditsMissing = Math.max(0, creditsNeeded - fulfilledCredits);
             const blocksNeeded = Math.ceil(creditsMissing / 3.0);

             for (let b = 0; b < blocksNeeded; b++) {
                 remainingRequirements.push({
                     id: `${bucket.id}_PLACEHOLDER_${b}`,
                     name: `Any General Elective`,
                     bucketId: bucket.id,
                     isSpecific: false,
                     credits: (blocksNeeded === 1 ? creditsMissing : 3.0)
                 });
             }
             
             validationResults[bucket.id] = { 
                 fulfilledCredits: fulfilledCredits, 
                 target: creditsNeeded, 
                 consumed: consumedInBucket 
             };
        }
    }

    return {
        schema: BCompSc_Schema.program,
        status: validationResults,
        remainingRequirements,
        unusableCourses: availableCourses
    };
};
