// --- Constants ---
const BUTTON_ID = "conuplanner-export-btn";

// --- Injected Data (from scraped JSON) ---
const ACADEMIC_DATES = {
  "Fall term 2025": [
    {
      "month": "December 2025",
      "date": "Mon, Dec. 1",
      "description": "Last day to apply for Quebec resident status, fall term 2025",
      "fullDate": "Mon, Dec. 1, 2025"
    },
    {
      "month": "December 2025",
      "date": "Mon, Dec. 1",
      "description": "Last day of classes, fall term",
      "fullDate": "Mon, Dec. 1, 2025"
    },
    {
      "month": "December 2025",
      "date": "Wed, Dec. 3",
      "description": "Examinations begin",
      "fullDate": "Wed, Dec. 3, 2025"
    },
    {
      "month": "December 2025",
      "date": "Thu, Dec. 18",
      "description": "Examinations end",
      "fullDate": "Thu, Dec. 18, 2025"
    },
    {
      "month": "December 2025",
      "date": "Thu, Dec. 18",
      "description": "Aide financière aux études (AFE) end of funding, fall term",
      "fullDate": "Thu, Dec. 18, 2025"
    },
    {
      "month": "December 2025",
      "date": "Mon, Dec. 22",
      "description": "Holiday period, university closed (December 22 to January 4)",
      "fullDate": "Mon, Dec. 22, 2025"
    }
  ],
  "Winter term 2026": [
    {
      "month": "January 2026",
      "date": "Mon, Jan. 12",
      "description": "Classes begin, winter term 2026",
      "fullDate": "Mon, Jan. 12, 2026"
    },
    {
      "month": "January 2026",
      "date": "Mon, Jan. 12",
      "description": "Classes resume, fall/winter term 2025-26",
      "fullDate": "Mon, Jan. 12, 2026"
    },
    {
      "month": "January 2026",
      "date": "Thu, Jan. 15",
      "description": "Last day to apply for spring 2026 graduation",
      "fullDate": "Thu, Jan. 15, 2026"
    },
    {
      "month": "January 2026",
      "date": "Thu, Jan. 15",
      "description": "Last day to apply for DEF (Deferred) or MED (Medical) notation for courses ending in December 2025",
      "fullDate": "Thu, Jan. 15, 2026"
    },
    {
      "month": "January 2026",
      "date": "Mon, Jan. 26",
      "description": "Last day to add winter-term courses",
      "fullDate": "Mon, Jan. 26, 2026"
    },
    {
      "month": "January 2026",
      "date": "Mon, Jan. 26",
      "description": "Deadline for withdrawal with tuition refund (DNE) from winter-term courses",
      "fullDate": "Mon, Jan. 26, 2026"
    },
    {
      "month": "February 2026",
      "date": "Sun, Feb. 1",
      "description": "Last day to apply for supplemental examinations for courses ending in December 2025\n            \n            (graduating students only)",
      "fullDate": "Sun, Feb. 1, 2026"
    },
    {
      "month": "February 2026",
      "date": "Sun, Feb. 1",
      "description": "Last day to apply for re-evaluation of courses ending in December 2025",
      "fullDate": "Sun, Feb. 1, 2026"
    },
    {
      "month": "February 2026",
      "date": "Sun, Feb. 1",
      "description": "Last day to apply for late completion of courses ending in December 2025",
      "fullDate": "Sun, Feb. 1, 2026"
    },
    {
      "month": "February 2026",
      "date": "Sun, Feb. 15",
      "description": "Last day for submission of late completion work for courses ending in December 2025\n            \n            (application deadline February 1)",
      "fullDate": "Sun, Feb. 15, 2026"
    },
    {
      "month": "February 2026",
      "date": "Fri, Feb. 27",
      "description": "Last day to submit required documentation to register with the Access Centre for Students with Disabilities and request exam accommodations for the Winter 2026 final examination period",
      "fullDate": "Fri, Feb. 27, 2026"
    },
    {
      "month": "March 2026",
      "date": "Sun, Mar. 1",
      "description": "Last day to apply for admission to undergraduate programs, full-time regular session 2026-27",
      "fullDate": "Sun, Mar. 1, 2026"
    },
    {
      "month": "March 2026",
      "date": "Sun, Mar. 1",
      "description": "Last day to apply for degree transfer, fall term 2026\n            \n            (for currently registered students to transfer into a different degree in any faculty)",
      "fullDate": "Sun, Mar. 1, 2026"
    },
    {
      "month": "March 2026",
      "date": "Mon, Mar. 2",
      "description": "Reading week begins",
      "fullDate": "Mon, Mar. 2, 2026"
    },
    {
      "month": "March 2026",
      "date": "Mon, Mar. 2",
      "description": "Replacement examinations begin",
      "fullDate": "Mon, Mar. 2, 2026"
    },
    {
      "month": "March 2026",
      "date": "Mon, Mar. 2",
      "description": "Supplemental examinations begin for courses ending in December 2025\n            \n            (graduating students only)",
      "fullDate": "Mon, Mar. 2, 2026"
    },
    {
      "month": "March 2026",
      "date": "Thu, Mar. 5",
      "description": "Replacement and supplemental examinations end",
      "fullDate": "Thu, Mar. 5, 2026"
    },
    {
      "month": "March 2026",
      "date": "Fri, Mar. 6",
      "description": "President’s Holiday, university closed",
      "fullDate": "Fri, Mar. 6, 2026"
    },
    {
      "month": "March 2026",
      "date": "Sun, Mar. 8",
      "description": "Reading week ends",
      "fullDate": "Sun, Mar. 8, 2026"
    },
    {
      "month": "March 2026",
      "date": "Mon, Mar. 23",
      "description": "Last day for academic withdrawal (DISC) from two-term (/3) and winter-term (/4) courses",
      "fullDate": "Mon, Mar. 23, 2026"
    },
    {
      "month": "April 2026",
      "date": "Wed, Apr. 1",
      "description": "Last day to apply for Quebec resident status, winter term 2026",
      "fullDate": "Wed, Apr. 1, 2026"
    },
    {
      "month": "April 2026",
      "date": "Fri, Apr. 3",
      "description": "Easter holidays, university closed (April 3 - April 6)\n            \n            (see April 14, 2026)",
      "fullDate": "Fri, Apr. 3, 2026"
    },
    {
      "month": "April 2026",
      "date": "Tue, Apr. 7",
      "description": "Last day for instructor-scheduled tests or examinations",
      "fullDate": "Tue, Apr. 7, 2026"
    },
    {
      "month": "April 2026",
      "date": "Mon, Apr. 13",
      "description": "Last day of classes, fall/winter and winter terms 2025-26",
      "fullDate": "Mon, Apr. 13, 2026"
    },
    {
      "month": "April 2026",
      "date": "Tue, Apr. 14",
      "description": "Make-up day for classes scheduled on April 3 and 4",
      "fullDate": "Tue, Apr. 14, 2026"
    },
    {
      "month": "April 2026",
      "date": "Thu, Apr. 16",
      "description": "Examinations begin",
      "fullDate": "Thu, Apr. 16, 2026"
    },
    {
      "month": "April 2026",
      "date": "Thu, Apr. 30",
      "description": "Aide financière aux études (AFE) end of funding, winter term",
      "fullDate": "Thu, Apr. 30, 2026"
    }
  ],
  "Summer term 2026": [
    {
      "month": "May 2026",
      "date": "Sun, May 3",
      "description": "Examinations end",
      "fullDate": "Sun, May 3, 2026"
    },
    {
      "month": "May 2026",
      "date": "Sun, May 10",
      "description": "Last day to apply for DEF (Deferred) or MED (Medical) notation for courses ending in April 2026",
      "fullDate": "Sun, May 10, 2026"
    },
    {
      "month": "May 2026",
      "date": "Mon, May 11",
      "description": "Classes begin, first‑term and two‑term summer session courses",
      "fullDate": "Mon, May 11, 2026"
    },
    {
      "month": "May 2026",
      "date": "Fri, May 15",
      "description": "Last day to apply for late completion of courses ending in April 2026",
      "fullDate": "Fri, May 15, 2026"
    },
    {
      "month": "May 2026",
      "date": "Mon, May 18",
      "description": "Journée nationale des patriotes (Quebec), Victoria Day (elsewhere in Canada), university closed",
      "fullDate": "Mon, May 18, 2026"
    },
    {
      "month": "May 2026",
      "date": "Tue, May 19",
      "description": "Last day to add first‑term and two‑term summer session courses",
      "fullDate": "Tue, May 19, 2026"
    },
    {
      "month": "May 2026",
      "date": "Tue, May 19",
      "description": "Deadline for withdrawal with tuition refund (DNE) from first‑term and two‑term summer session courses",
      "fullDate": "Tue, May 19, 2026"
    },
    {
      "month": "May 2026",
      "date": "Fri, May 29",
      "description": "Last day to submit required documentation to register with the Access Centre for Students with Disabilities and request exam accommodations for the Summer 1 2026 final examination period",
      "fullDate": "Fri, May 29, 2026"
    },
    {
      "month": "May 2026",
      "date": "Sat, May 30",
      "description": "Last day for submission of late‑completion work for courses ending in April 2026\n            \n            (application deadline May 15)",
      "fullDate": "Sat, May 30, 2026"
    },
    {
      "month": "May 2026",
      "date": "TBD",
      "description": "Spring convocations. Please see concordia.ca/graduation-convocation",
      "fullDate": "TBD, 2026"
    },
    {
      "month": "June 2026",
      "date": "Wed, June 10",
      "description": "Last day for academic withdrawal (DISC) from first‑term summer session courses",
      "fullDate": "Wed, June 10, 2026"
    },
    {
      "month": "June 2026",
      "date": "Mon, June 15",
      "description": "Last day to apply for supplemental examinations for courses taken during the regular session 2025‑26",
      "fullDate": "Mon, June 15, 2026"
    },
    {
      "month": "June 2026",
      "date": "Mon, June 15",
      "description": "Last day to apply for re-evaluation of courses ending in April 2026",
      "fullDate": "Mon, June 15, 2026"
    },
    {
      "month": "June 2026",
      "date": "Mon, June 15",
      "description": "Last day for instructor‑scheduled tests or examinations for first‑term summer session courses",
      "fullDate": "Mon, June 15, 2026"
    },
    {
      "month": "June 2026",
      "date": "Mon, June 22",
      "description": "Last day of classes, first‑term summer session",
      "fullDate": "Mon, June 22, 2026"
    },
    {
      "month": "June 2026",
      "date": "Tue, June 23",
      "description": "Examinations begin, first‑term summer session finals",
      "fullDate": "Tue, June 23, 2026"
    },
    {
      "month": "June 2026",
      "date": "Tue, June 23",
      "description": "Reading week begins, two‑term summer session",
      "fullDate": "Tue, June 23, 2026"
    },
    {
      "month": "June 2026",
      "date": "Wed, June 24",
      "description": "Fête nationale, university closed",
      "fullDate": "Wed, June 24, 2026"
    },
    {
      "month": "June 2026",
      "date": "Tue, June 30",
      "description": "Examinations end, first‑term summer session finals",
      "fullDate": "Tue, June 30, 2026"
    },
    {
      "month": "June 2026",
      "date": "Tue, June 30",
      "description": "Reading week for two-term summer session ends",
      "fullDate": "Tue, June 30, 2026"
    },
    {
      "month": "July 2026",
      "date": "Wed, July 1",
      "description": "Canada Day, university closed",
      "fullDate": "Wed, July 1, 2026"
    },
    {
      "month": "July 2026",
      "date": "Thu, July 2",
      "description": "Classes begin, second‑term summer session",
      "fullDate": "Thu, July 2, 2026"
    },
    {
      "month": "July 2026",
      "date": "Thu, July 9",
      "description": "Last day to add second-term summer session courses",
      "fullDate": "Thu, July 9, 2026"
    },
    {
      "month": "July 2026",
      "date": "Thu, July 9",
      "description": "Deadline for withdrawal with tuition refund (DNE) from second‑term summer session",
      "fullDate": "Thu, July 9, 2026"
    },
    {
      "month": "July 2026",
      "date": "Wed, July 15",
      "description": "Last day to apply for fall 2026 graduation",
      "fullDate": "Wed, July 15, 2026"
    },
    {
      "month": "July 2026",
      "date": "Wed, July 22",
      "description": "Last day for academic withdrawal (DISC) from two-term summer session courses",
      "fullDate": "Wed, July 22, 2026"
    },
    {
      "month": "July 2026",
      "date": "Fri, July 24",
      "description": "Last day to submit required documentation to register with the Access Centre for Students with Disabilities and request exam accommodations for the Summer 2 2026 final examination period",
      "fullDate": "Fri, July 24, 2026"
    },
    {
      "month": "July 2026",
      "date": "Wed, July 29",
      "description": "Registration start date for returning and newly authorized Independent students, fall 2026 term",
      "fullDate": "Wed, July 29, 2026"
    },
    {
      "month": "July 2026",
      "date": "Fri, July 31",
      "description": "Last day for academic withdrawal (DISC) from second-term summer session courses",
      "fullDate": "Fri, July 31, 2026"
    },
    {
      "month": "August 2026",
      "date": "Sat, Aug. 1",
      "description": "Last day to apply for Quebec resident status for summer session 2026",
      "fullDate": "Sat, Aug. 1, 2026"
    },
    {
      "month": "August 2026",
      "date": "Wed, Aug. 5",
      "description": "Last day for instructor‑scheduled tests or examinations for two‑term and second‑term summer session courses",
      "fullDate": "Wed, Aug. 5, 2026"
    },
    {
      "month": "August 2026",
      "date": "Wed, Aug. 12",
      "description": "Last day of classes, two-term and second-term summer session courses",
      "fullDate": "Wed, Aug. 12, 2026"
    },
    {
      "month": "August 2026",
      "date": "Thu, Aug. 13",
      "description": "Examinations begin, two-term and second-term summer session finals",
      "fullDate": "Thu, Aug. 13, 2026"
    },
    {
      "month": "August 2026",
      "date": "Tue, Aug. 18",
      "description": "Examinations end, two-term and second-term summer session finals",
      "fullDate": "Tue, Aug. 18, 2026"
    },
    {
      "month": "August 2026",
      "date": "Wed, Aug. 19",
      "description": "Replacement and supplemental examinations begin, regular session 2025-26",
      "fullDate": "Wed, Aug. 19, 2026"
    },
    {
      "month": "August 2026",
      "date": "Sat, Aug. 22",
      "description": "Replacement and supplemental examinations end, regular session 2025-26",
      "fullDate": "Sat, Aug. 22, 2026"
    },
    {
      "month": "August 2026",
      "date": "Mon, Aug. 31",
      "description": "Last day to apply for DEF (Deferred) or MED (Medical) notation for courses taken during the summer session 2026",
      "fullDate": "Mon, Aug. 31, 2026"
    }
  ],
  "Fall term 2026": [
    {
      "month": "September 2026",
      "date": "Tue, Sep. 1",
      "description": "Last day to apply for late completion of courses taken during the summer session 2026",
      "fullDate": "Tue, Sep. 1, 2026"
    },
    {
      "month": "September 2026",
      "date": "Mon, Sep. 7",
      "description": "Labour Day, university closed",
      "fullDate": "Mon, Sep. 7, 2026"
    },
    {
      "month": "September 2026",
      "date": "Tue, Sep. 8",
      "description": "Classes begin, fall and fall/winter terms 2026-27",
      "fullDate": "Tue, Sep. 8, 2026"
    },
    {
      "month": "September 2026",
      "date": "Tue, Sep. 15",
      "description": "Last day for submission of late‑completion work for summer session 2026 courses\n            \n            (application deadline September 1)",
      "fullDate": "Tue, Sep. 15, 2026"
    },
    {
      "month": "September 2026",
      "date": "Wed, Sep. 16",
      "description": "Last day to apply for supplemental examinations for courses taken during the summer session 2026",
      "fullDate": "Wed, Sep. 16, 2026"
    },
    {
      "month": "September 2026",
      "date": "Thu, Sep. 17",
      "description": "Registration start date for newly admitted students, winter 2027 term. New students admitted for winter 2027 can register any time after admission and advising criteria have been satisfied",
      "fullDate": "Thu, Sep. 17, 2026"
    },
    {
      "month": "September 2026",
      "date": "Mon, Sep. 21",
      "description": "Last day to add fall-term and two-term courses",
      "fullDate": "Mon, Sep. 21, 2026"
    },
    {
      "month": "September 2026",
      "date": "Mon, Sep. 21",
      "description": "Deadline for withdrawal with tuition refund (DNE) from fall-term and two-term courses",
      "fullDate": "Mon, Sep. 21, 2026"
    },
    {
      "month": "September 2026",
      "date": "Sat, Sep. 26",
      "description": "Replacement and supplemental examinations, summer session 2026 courses",
      "fullDate": "Sat, Sep. 26, 2026"
    },
    {
      "month": "September 2026",
      "date": "TBD",
      "description": "Fall convocations. Please see concordia.ca/graduation-convocation",
      "fullDate": "TBD, 2026"
    },
    {
      "month": "October 2026",
      "date": "Thu, Oct. 1",
      "description": "Last day to apply for re-evaluation of courses taken during the summer session 2026",
      "fullDate": "Thu, Oct. 1, 2026"
    },
    {
      "month": "October 2026",
      "date": "Mon, Oct. 5",
      "description": "Quebec Election Day, no classes held",
      "fullDate": "Mon, Oct. 5, 2026"
    },
    {
      "month": "October 2026",
      "date": "Sat, Oct. 10",
      "description": "Reading week begins",
      "fullDate": "Sat, Oct. 10, 2026"
    },
    {
      "month": "October 2026",
      "date": "Mon, Oct. 12",
      "description": "Thanksgiving Day, university closed",
      "fullDate": "Mon, Oct. 12, 2026"
    },
    {
      "month": "October 2026",
      "date": "Fri, Oct. 16",
      "description": "Reading week ends",
      "fullDate": "Fri, Oct. 16, 2026"
    },
    {
      "month": "October 2026",
      "date": "Fri, Oct. 23",
      "description": "Last day to submit required documentation to register with the Access Centre for Students with Disabilities and request exam accommodations for the fall 2026 final examination period",
      "fullDate": "Fri, Oct. 23, 2026"
    },
    {
      "month": "November 2026",
      "date": "Sun, Nov. 1",
      "description": "Last day to apply for admission to undergraduate programs, winter term 2027",
      "fullDate": "Sun, Nov. 1, 2026"
    },
    {
      "month": "November 2026",
      "date": "Sun, Nov. 1",
      "description": "Last day to apply for degree transfer, winter term 2027\n            \n            (For currently registered students to transfer into the Faculty of Arts and Science or the Gina Cody School of Engineering and Computer Science or the John Molson School of Business)",
      "fullDate": "Sun, Nov. 1, 2026"
    },
    {
      "month": "November 2026",
      "date": "Mon, Nov. 16",
      "description": "Last day for academic withdrawal (DISC) from fall-term courses (/2)",
      "fullDate": "Mon, Nov. 16, 2026"
    },
    {
      "month": "November 2026",
      "date": "Tue, Nov. 24",
      "description": "Registration start date for newly authorized independent students, winter term 2027",
      "fullDate": "Tue, Nov. 24, 2026"
    },
    {
      "month": "November 2026",
      "date": "Mon, Nov. 30",
      "description": "Last day for instructor-scheduled tests or examinations",
      "fullDate": "Mon, Nov. 30, 2026"
    },
    {
      "month": "December 2026",
      "date": "Tue, Dec. 1",
      "description": "Last day to apply for Quebec resident status, fall term 2026",
      "fullDate": "Tue, Dec. 1, 2026"
    },
    {
      "month": "December 2026",
      "date": "Mon, Dec. 7",
      "description": "Last day of classes, fall term",
      "fullDate": "Mon, Dec. 7, 2026"
    },
    {
      "month": "December 2026",
      "date": "Tue, Dec. 8",
      "description": "Make-up day for classes cancelled due to Quebec provincial election on October 5",
      "fullDate": "Tue, Dec. 8, 2026"
    },
    {
      "month": "December 2026",
      "date": "Wed, Dec. 9",
      "description": "Examinations begin",
      "fullDate": "Wed, Dec. 9, 2026"
    },
    {
      "month": "December 2026",
      "date": "Tue, Dec. 22",
      "description": "Examinations end",
      "fullDate": "Tue, Dec. 22, 2026"
    },
    {
      "month": "December 2026",
      "date": "Tue, Dec. 22",
      "description": "Aide financière aux études (AFE) end of funding, fall term",
      "fullDate": "Tue, Dec. 22, 2026"
    },
    {
      "month": "December 2026",
      "date": "Thu, Dec. 24",
      "description": "Holiday period, university closed (December 24 to January 4)",
      "fullDate": "Thu, Dec. 24, 2026"
    }
  ],
  "Winter term 2027": [
    {
      "month": "January 2027",
      "date": "Mon, Jan. 11",
      "description": "Classes begin, winter term 2027",
      "fullDate": "Mon, Jan. 11, 2027"
    },
    {
      "month": "January 2027",
      "date": "Mon, Jan. 11",
      "description": "Classes resume, fall/winter term 2026-27",
      "fullDate": "Mon, Jan. 11, 2027"
    },
    {
      "month": "January 2027",
      "date": "Fri, Jan. 15",
      "description": "Last day to apply for spring 2027 graduation",
      "fullDate": "Fri, Jan. 15, 2027"
    },
    {
      "month": "January 2027",
      "date": "Fri, Jan. 15",
      "description": "Last day to apply for DEF (Deferred) or MED (Medical) notation for courses ending in December 2026",
      "fullDate": "Fri, Jan. 15, 2027"
    },
    {
      "month": "January 2027",
      "date": "Mon, Jan. 25",
      "description": "Last day to add winter-term courses",
      "fullDate": "Mon, Jan. 25, 2027"
    },
    {
      "month": "January 2027",
      "date": "Mon, Jan. 25",
      "description": "Deadline for withdrawal with tuition refund (DNE) from winter-term courses",
      "fullDate": "Mon, Jan. 25, 2027"
    },
    {
      "month": "February 2027",
      "date": "Mon, Feb. 1",
      "description": "Last day to apply for supplemental examinations for courses ending in December 2026\n            \n            (graduating students only)",
      "fullDate": "Mon, Feb. 1, 2027"
    },
    {
      "month": "February 2027",
      "date": "Mon, Feb. 1",
      "description": "Last day to apply for re-evaluation of courses ending in December 2026",
      "fullDate": "Mon, Feb. 1, 2027"
    },
    {
      "month": "February 2027",
      "date": "Mon, Feb. 1",
      "description": "Last day to apply for late completion of courses ending in December 2026",
      "fullDate": "Mon, Feb. 1, 2027"
    },
    {
      "month": "February 2027",
      "date": "Mon, Feb. 15",
      "description": "Last day for submission of late completion work for courses ending in December 2026\n            \n            (application deadline February 1)",
      "fullDate": "Mon, Feb. 15, 2027"
    },
    {
      "month": "March 2027",
      "date": "Mon, Mar. 1",
      "description": "Last day to apply for admission to undergraduate programs, full-time regular session 2027-28",
      "fullDate": "Mon, Mar. 1, 2027"
    },
    {
      "month": "March 2027",
      "date": "Mon, Mar. 1",
      "description": "Last day to apply for degree transfer, fall term 2027\n            \n            (for currently registered students to transfer into a different degree in any faculty)",
      "fullDate": "Mon, Mar. 1, 2027"
    },
    {
      "month": "March 2027",
      "date": "Mon, Mar. 1",
      "description": "Reading week begins",
      "fullDate": "Mon, Mar. 1, 2027"
    },
    {
      "month": "March 2027",
      "date": "Mon, Mar. 1",
      "description": "Replacement examinations begin",
      "fullDate": "Mon, Mar. 1, 2027"
    },
    {
      "month": "March 2027",
      "date": "Mon, Mar. 1",
      "description": "Supplemental examinations begin for courses ending in December 2026\n            \n            (graduating students only)",
      "fullDate": "Mon, Mar. 1, 2027"
    },
    {
      "month": "March 2027",
      "date": "Thu, Mar. 4",
      "description": "Replacement and supplemental examinations end",
      "fullDate": "Thu, Mar. 4, 2027"
    },
    {
      "month": "March 2027",
      "date": "Fri, Mar. 5",
      "description": "Last day to submit required documentation to register with the Access Centre for Students with Disabilities and request exam accommodations for the Winter 2027 final examination period",
      "fullDate": "Fri, Mar. 5, 2027"
    },
    {
      "month": "March 2027",
      "date": "Fri, Mar. 5",
      "description": "President’s Holiday, university closed",
      "fullDate": "Fri, Mar. 5, 2027"
    },
    {
      "month": "March 2027",
      "date": "Sun, Mar. 7",
      "description": "Reading week ends",
      "fullDate": "Sun, Mar. 7, 2027"
    },
    {
      "month": "March 2027",
      "date": "Mon, Mar. 22",
      "description": "Last day for academic withdrawal (DISC) from two-term (/3) and winter-term (/4) courses",
      "fullDate": "Mon, Mar. 22, 2027"
    },
    {
      "month": "March 2027",
      "date": "Fri, Mar. 26",
      "description": "Easter holidays, university closed (March 26 – March 29)\n            \n            (see April 13, 2027)",
      "fullDate": "Fri, Mar. 26, 2027"
    },
    {
      "month": "April 2027",
      "date": "Thu, Apr. 1",
      "description": "Last day to apply for Quebec resident status, winter term 2027",
      "fullDate": "Thu, Apr. 1, 2027"
    },
    {
      "month": "April 2027",
      "date": "Mon, Apr. 5",
      "description": "Last day for instructor-scheduled tests or examinations",
      "fullDate": "Mon, Apr. 5, 2027"
    },
    {
      "month": "April 2027",
      "date": "Mon, Apr. 12",
      "description": "Last day of classes, fall/winter and winter terms 2026-27",
      "fullDate": "Mon, Apr. 12, 2027"
    },
    {
      "month": "April 2027",
      "date": "Tue, Apr. 13",
      "description": "Make-up day for classes scheduled on March 26 and 27",
      "fullDate": "Tue, Apr. 13, 2027"
    },
    {
      "month": "April 2027",
      "date": "Thu, Apr. 15",
      "description": "Examinations begin",
      "fullDate": "Thu, Apr. 15, 2027"
    },
    {
      "month": "April 2027",
      "date": "Fri, Apr. 30",
      "description": "Aide financière aux études (AFE) end of funding, winter term",
      "fullDate": "Fri, Apr. 30, 2027"
    }
  ],
  "Summer term 2027": [
    {
      "month": "May 2027",
      "date": "Sun, May 2",
      "description": "Examinations end",
      "fullDate": "Sun, May 2, 2027"
    },
    {
      "month": "May 2027",
      "date": "Mon, May 10",
      "description": "Last day to apply for DEF (Deferred) or MED (Medical) notation for courses ending in April 2027",
      "fullDate": "Mon, May 10, 2027"
    },
    {
      "month": "May 2027",
      "date": "Sat, May 15",
      "description": "Last day to apply for late completion of courses ending in April 2027",
      "fullDate": "Sat, May 15, 2027"
    },
    {
      "month": "May 2027",
      "date": "Mon, May 24",
      "description": "Journée nationale des patriotes (Quebec), Victoria Day (elsewhere in Canada), university closed",
      "fullDate": "Mon, May 24, 2027"
    },
    {
      "month": "May 2027",
      "date": "Sun, May 30",
      "description": "Last day for submission of late‑completion work for courses ending in April 2027\n            \n            (application deadline May 15)",
      "fullDate": "Sun, May 30, 2027"
    },
    {
      "month": "May 2027",
      "date": "TBD",
      "description": "Spring convocations. Please see concordia.ca/graduation-convocation",
      "fullDate": "TBD, 2027"
    },
    {
      "month": "June 2027",
      "date": "Tue, June 15",
      "description": "Last day to apply for supplemental examinations for courses taken during the regular session 2026-27",
      "fullDate": "Tue, June 15, 2027"
    },
    {
      "month": "June 2027",
      "date": "Tue, June 15",
      "description": "Last day to apply for re-evaluation of courses ending in April 2027",
      "fullDate": "Tue, June 15, 2027"
    }
  ]
};

// -- Main Injection Logic ---
function init() {

  // Inject immediately to test visibility
  injectFloatingButton();
}

function injectFloatingButton() {
  const existingBtn = document.getElementById("conuplanner-export-wrapper");
  if (existingBtn) return;

  const wrapper = document.createElement("div");
  wrapper.id = "conuplanner-export-wrapper";

  Object.assign(wrapper.style, {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    zIndex: "9999",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
  });

  // The main export button
  const btn = document.createElement("button");
  btn.id = BUTTON_ID;

  // Create Icon Image
  const iconUrl = chrome.runtime.getURL("icon_128.png");
  const img = document.createElement("img");
  img.src = iconUrl;
  Object.assign(img.style, {
    height: "22px",
    width: "22px",
    objectFit: "contain",
    marginRight: "8px"
  });

  btn.appendChild(img);
  const textSpan = document.createElement("span");
  textSpan.innerText = "Export Schedule";
  btn.appendChild(textSpan);

  // Modern sleek styling matching ConuPlanner theme
  Object.assign(btn.style, {
    backgroundColor: "#912338",
    color: "white",
    border: "none",
    borderRadius: "24px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(145, 35, 56, 0.3)",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap"
  });

  // Hover effect
  btn.onmouseover = () => {
    btn.style.transform = "translateY(-2px)";
    btn.style.boxShadow = "0 6px 20px rgba(145, 35, 56, 0.4)";
  };
  btn.onmouseout = () => {
    btn.style.transform = "translateY(0)";
    btn.style.boxShadow = "0 4px 15px rgba(145, 35, 56, 0.3)";
  };

  btn.onclick = parseAndExport;

  // Close/Minimize button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "✕";
  Object.assign(closeBtn.style, {
    backgroundColor: "white",
    color: "#912338",
    border: "1px solid rgba(145, 35, 56, 0.2)",
    borderRadius: "50%",
    width: "26px",
    height: "26px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease"
  });

  // Minimized Icon (Floating Circle)
  const minBtn = document.createElement("button");
  const minImg = document.createElement("img");
  minImg.src = iconUrl;
  Object.assign(minImg.style, {
    height: "26px",
    width: "26px",
    objectFit: "contain"
  });
  minBtn.appendChild(minImg);
  Object.assign(minBtn.style, {
    backgroundColor: "white",
    border: "2px solid #912338",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    display: "none", // hidden initially
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease"
  });

  // Toggle Logic
  closeBtn.onclick = () => {
    btn.style.display = "none";
    closeBtn.style.display = "none";
    minBtn.style.display = "flex";
  };

  minBtn.onclick = () => {
    btn.style.display = "flex";
    closeBtn.style.display = "flex";
    minBtn.style.display = "none";
  };

  wrapper.appendChild(minBtn);
  wrapper.appendChild(btn);
  wrapper.appendChild(closeBtn);

  document.body.appendChild(wrapper);
}

// --- Parsing & ICS Generation ---
function parseAndExport() {
  try {
    const scheduleData = scrapeSchedule();

    if (!scheduleData || scheduleData.length === 0) {
      alert("Could not find any visible courses.\n\nPlease ensure you have selected a schedule and the 'Schedule Results' pane is visible.");
      return;
    }

    const icsContent = generateICS(scheduleData);
    downloadICS(icsContent);
  } catch (e) {
    console.error("ConuPlanner Export Error:", e);
    alert("Error parsing schedule: " + e.message + "\n\nCheck console for details.");
  }
}

function scrapeSchedule() {
  const courses = [];

  // 1. Detect Term Name
  const termHeader = document.querySelector(".term_label, .term_header")?.innerText || document.body.innerText;
  let detectedTerm = "Winter term 2026"; // Default

  // Simple heuristic: check if any key exists in the text
  const terms = Object.keys(ACADEMIC_DATES);
  for (const t of terms) {
    if (termHeader.includes(t) || termHeader.includes(t.replace("term ", ""))) {
      detectedTerm = t;
      break;
    }
  }

  // 2. Get Academic Dates & Determine Term Start/End
  const academicEvents = getTermEvents(detectedTerm);

  // Find Term Start (Classes begin)
  const classesStartEvent = academicEvents.find(e => e.description.toLowerCase().includes("classes begin"));
  let termStartDate = new Date("2026-01-12T00:00:00"); // Fallback
  if (classesStartEvent) {
    // YYYYMMDD -> YYYY-MM-DD
    const ds = classesStartEvent.start;
    termStartDate = new Date(`${ds.slice(0, 4)}-${ds.slice(4, 6)}-${ds.slice(6, 8)}T00:00:00`);
  }

  // Find Term End (Classes end / Exams end) for RRULE
  const classesEndEvent = academicEvents.find(e => e.description.toLowerCase().includes("classes end"));
  let recurrenceEnd = "20260413T235959Z"; // Fallback
  if (classesEndEvent) {
    const ds = classesEndEvent.start;
    recurrenceEnd = `${ds}T235959Z`;
  }

  // 3. Scrape Courses
  const courseBoxes = document.querySelectorAll(".course_box");

  courseBoxes.forEach(box => {
    // 1. Get Course Title (e.g., "COMP 346")
    const titleEl = box.querySelector(".course_title, h4, .header_cell");
    if (!titleEl) return;

    let titleRaw = titleEl.innerText.split("\n")[0].trim();
    const titleMatch = titleRaw.match(/([A-Z]{4}\s+\d{3,4})/);
    const title = titleMatch ? titleMatch[0] : titleRaw;

    // 2. Extract Ordered Time Strings
    const hoursDiv = box.querySelector("#hoursInLegend, .hours-legend");
    const timeText = hoursDiv ? hoursDiv.innerText : box.innerText;

    // REGEX: Allows "Tue, Thu" or "Mon" explicitly
    const fullTimeRegex = /([A-Za-z, \s]+)\s*:\s*(\d{1,2}:\d{2})\s*(AM|PM)?\s*to\s*(\d{1,2}:\d{2})\s*(AM|PM)?/gi;
    const timeSegments = [];
    let match;
    while ((match = fullTimeRegex.exec(timeText)) !== null) {
      timeSegments.push({
        dayStr: match[1].trim(), // "Tue, Thu"
        startStr: match[2],
        ampm1: match[3],
        endStr: match[4],
        ampm2: match[5]
      });
    }

    // 3. Extract Ordered Components (LEC, TUT, LAB)
    const componentRows = [];
    const selectionTable = box.querySelector(".vsbselectionnew .selection_table");
    if (selectionTable) {
      const rows = selectionTable.querySelectorAll("tr");
      rows.forEach(row => {
        const typeEl = row.querySelector(".type_block");
        if (typeEl) {
          const type = typeEl.innerText.trim(); // "LEC", "TUT"
          const locationEl = row.querySelector(".location_block");
          const location = locationEl ? locationEl.innerText.trim() : "Concordia University";
          componentRows.push({ type, location });
        }
      });
    }

    // 4. Pair Them Up (Time[i] <-> Component[i])
    timeSegments.forEach((seg, index) => {
      let comp = componentRows[index];
      if (!comp && componentRows.length > 0) {
        comp = componentRows[Math.min(index, componentRows.length - 1)];
      }
      if (!comp) comp = { type: "LEC", location: "Concordia" };

      // Time Parse
      const start24 = convertTo24Hour(seg.startStr, seg.ampm1 || seg.ampm2);
      const end24 = convertTo24Hour(seg.endStr, seg.ampm2 || seg.ampm1);
      const dayMap = { "Mon": "MO", "Tue": "TU", "Wed": "WE", "Thu": "TH", "Fri": "FR", "Sat": "SA", "Sun": "SU" };
      const days = seg.dayStr.split(",").map(d => d.trim());
      const byDay = days.map(d => dayMap[d.substring(0, 3)]).filter(Boolean).join(",");
      const firstDayStr = days[0].substring(0, 3); // "Tue"

      // Calculate Start Date based on Term Start
      const startDate = parseDateTime(start24, firstDayStr, termStartDate);
      // End date is just for the first event duration, so reuse same day
      const endDate = startDate.split('T')[0] + `T${end24}:00`;

      // Deduplicate
      // FIX 2: Compare against the raw properties (title, type, start) 
      // because we haven't constructed the appended title yet.
      const isDuplicate = courses.some(c =>
        c.title === title &&
        c.type === comp.type &&
        c.start === startDate &&
        c.rrule.includes(byDay)
      );

      if (!isDuplicate) {
        courses.push({
          title: title, // FIX 3: Store CLEAN title "COMP 346" (don't append type yet)
          type: comp.type,
          start: startDate, // "YYYY-MM-DDTHH:MM:00"
          end: endDate,
          rrule: `FREQ=WEEKLY;UNTIL=${recurrenceEnd};BYDAY=${byDay}`,
          location: comp.location,
          description: `Course: ${title}\nType: ${comp.type}\nRoom: ${comp.location}`
        });
      }
    });
  });

  // Handle Online Courses (unchanged)
  const onlineMsg = document.querySelector(".timetableMsg");
  if (onlineMsg) {
    const onlineLabels = onlineMsg.querySelectorAll(".minilabel");
    onlineLabels.forEach(label => {
      const courseCode = label.innerText.trim();
      if (courseCode) {
        // Online courses start on term start
        const startStr = termStartDate.toISOString().split('T')[0];
        // For end, just next day
        const endStr = new Date(termStartDate.getTime() + 86400000).toISOString().split('T')[0];

        courses.push({
          title: courseCode,
          type: "ONL",
          start: startStr,
          end: endStr,
          allDay: true,
          rrule: `FREQ=WEEKLY;UNTIL=${recurrenceEnd};BYDAY=MO`, // Default to Monday
          location: "ONLINE - Econcordia",
          description: `Online Class: ${courseCode}\nNo scheduled time.`
        });
      }
    });
  }

  return [...courses, ...academicEvents];
}

// ... unchanged helpers ...

function extractTextDeep(node) {
  let text = [];
  if (node.nodeType === 3) return [node.textContent.trim()];
  node.childNodes.forEach(child => text.push(...extractTextDeep(child)));
  return text.filter(t => t.length > 0);
}

function generateICS(events) {
  let icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ConuPlanner//VSB Exporter//EN",
    "CALSCALE:GREGORIAN"
  ];

  events.forEach(event => {
    icsLines.push("BEGIN:VEVENT");
    // FIX 4: Correct Summary Formatting "COMP 346 (LEC UU)"
    icsLines.push(`SUMMARY:${event.title} (${event.type})`);

    if (event.allDay) {
      // All-Day Event Format: DTSTART;VALUE=DATE:YYYYMMDD
      const startStr = event.start.replace(/-/g, "");
      const endStr = event.end.replace(/-/g, "");
      icsLines.push(`DTSTART;VALUE=DATE:${startStr}`);
      icsLines.push(`DTEND;VALUE=DATE:${endStr}`);
    } else {
      // Standard Event Format: DTSTART:YYYYMMDDTHHMMSSZ
      icsLines.push(`DTSTART:${sanitizeDate(event.start)}`);
      icsLines.push(`DTEND:${sanitizeDate(event.end)}`);
    }

    if (event.rrule) icsLines.push(`RRULE:${event.rrule}`);
    if (event.location) icsLines.push(`LOCATION:${event.location}`);
    if (event.description) icsLines.push(`DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`);

    icsLines.push("END:VEVENT");
  });

  icsLines.push("END:VCALENDAR");
  return icsLines.join("\r\n");
}

function sanitizeDate(isoString) {
  // Input: 2026-01-12T11:45:00 -> Output: 20260112T114500 (Floating Time)
  // REMOVED 'Z' so it uses Local Time (EST) instead of UTC
  return isoString.replace(/[-:]/g, "").split(".")[0];
}

function downloadICS(content) {
  const blob = new Blob([content], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "conuplanner-schedule.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getTermEvents(termName) {
  const rawEvents = ACADEMIC_DATES[termName] || [];

  return rawEvents.map(evt => {
    // Parse date "Mon, Jan. 12, 2026"
    const cleanDate = evt.fullDate.replace(/^[A-Za-z]{3},\s+/, '');
    const d = new Date(cleanDate);

    if (isNaN(d.getTime())) return null;

    const yyyymmdd = d.toISOString().split('T')[0].replace(/-/g, '');

    return {
      title: `📅 ${evt.description}`, // Add emoji to distinguish
      start: yyyymmdd,
      end: yyyymmdd, // One day event
      allDay: true,
      description: evt.description
    };
  }).filter(Boolean);
}

function convertTo24Hour(timePart, modifier) {
  let [hours, minutes] = timePart.split(':');
  hours = parseInt(hours, 10);

  if (!modifier) {
    if (hours < 8 || hours === 12) modifier = "PM";
    else modifier = "AM";
  }

  modifier = modifier.toUpperCase();

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

function parseDateTime(time24, dayStr, termStartDate) {
  const dayMap = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 };
  // Normalize Day to 3 chars
  const normalizedDay = dayStr.charAt(0).toUpperCase() + dayStr.slice(1, 3).toLowerCase(); // "Mon"
  const targetDayIndex = dayMap[normalizedDay]; // 0-6

  if (targetDayIndex === undefined) {
    // Fallback to today if parsing fails
    return `${termStartDate.toISOString().split('T')[0]}T${time24}:00`;
  }

  const currentDayIndex = termStartDate.getDay(); // 0-6

  // Calculate days to add: (Target - Current + 7) % 7
  let daysToAdd = (targetDayIndex - currentDayIndex + 7) % 7;

  // Create new date instance
  const resultDate = new Date(termStartDate);
  resultDate.setDate(resultDate.getDate() + daysToAdd);

  // Format YYYY-MM-DD
  const yyyy = resultDate.getFullYear();
  const mm = String(resultDate.getMonth() + 1).padStart(2, '0');
  const dd = String(resultDate.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${time24}:00`;
}

function detectTypeByDuration(start24, end24) {
  // Helper to guess LEC vs TUT
  try {
    const [h1, m1] = start24.split(":").map(Number);
    const [h2, m2] = end24.split(":").map(Number);
    const diffMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);

    if (diffMinutes <= 65) return "TUT";
    if (diffMinutes > 160) return "LAB"; // > 2h40m
    return "LEC";
  } catch (e) {
    return "LEC"; // Default
  }
}

// --- Scraper Logic for Student Centre ---

function scrapeGrades() {

  // Attempt to find the "Grade Distribution" table
  // Broaden table selector to catch different PeopleSoft grid classes
  const tables = document.querySelectorAll("table.PSLEVEL1GRIDWBO, table.PSLEVEL2GRIDWBO, table.PSLEVEL1GRID, table.PSLEVEL2GRID, table.ps_grid-flex, table");
  let targetTable = null;

  for (let tbl of tables) {
    // Look for keywords that identify the distribution table
    if (tbl.innerText.includes("Grade Distribution") && tbl.innerText.includes("A+") && tbl.innerText.includes("FNS")) {
      targetTable = tbl;
      break;
    }
  }

  if (!targetTable) {
    alert("⚠️ Grade Distribution table not found!\n\nPlease make sure you have:\n1. Selected a term\n2. Expanded the 'Grade Distribution' section");
    return;
  }

  // Term Detection: Look for "Class Grades - Fall 2025"
  // CRITICAL FIX: Ensure we don't grab a huge parent container!
  let term = "Unknown Term";

  // Strategy: Find all elements containing the text, but pick the shortest one.
  const candidates = Array.from(document.querySelectorAll("span, div, h1, h2, h3, b, strong"));
  let bestMatch = null;
  let minLength = Infinity;

  for (let el of candidates) {
    const text = el.innerText ? el.innerText.trim() : "";
    // Must contain the key phrase AND be reasonably short (e.g. < 50 chars)
    // AND should not contain multiple newlines (which indicates it's a container)
    if (text.includes("Class Grades - ") && text.length < 50 && !text.includes("\n")) {
      if (text.length < minLength) {
        minLength = text.length;
        bestMatch = text;
      }
    }
  }

  if (bestMatch) {
    // "Class Grades - Fall 2025" -> "Fall 2025"
    const parts = bestMatch.split("-");
    if (parts.length > 1) {
      term = parts[1].trim();
    }
  }

  if (term === "Unknown Term") {
    // Fallback 1: Breadcrumb (also check for shortness)
    const breadcrumb = document.querySelector("#win0divPAGETITLE span");
    if (breadcrumb && breadcrumb.innerText.length < 100) {
      const parts = breadcrumb.innerText.split(">");
      if (parts.length > 1) {
        term = parts[parts.length - 1].trim();
      }
    }
  }

  const rows = targetTable.querySelectorAll("tr");
  const extractedData = [];

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll("td");
    // We expect at least Class + 16 grades = 17 columns.
    if (cells.length >= 16) {

      // Helper: Extract ONLY digits from cell text
      const getVal = (idx) => {
        if (!cells[idx]) return "0";
        const text = cells[idx].innerText.trim();
        // "A+ 1" -> "1"
        const digits = text.replace(/\D/g, '');
        return digits || "0";
      };

      const rawClass = cells[0]?.innerText.trim() || "";

      // CRITICAL FIX: The "Garbage Rows" are parent rows that contain the whole table text!
      // The first cell of a valid row should JUST be "COMP 333" (8 chars) or "Class\nCOMP 333" (< 20 chars).
      // If it's huge, it's a container. Skip it.
      if (rawClass.length > 30) {
        return; // Skip this row, it's likely a parent container
      }

      // Extract "COMP 333" from "Class\nCOMP 333"
      const courseMatch = rawClass.match(/[A-Z]{3,4}\s\d{3}/);

      if (courseMatch) {
        extractedData.push({
          term: term,
          course: courseMatch[0], // pure "COMP 333"
          // description removed as it's not present in this view
          distribution: {
            // Indices shifted by 1 because there is no separate Description column
            "A+": getVal(1), "A": getVal(2), "A-": getVal(3),
            "B+": getVal(4), "B": getVal(5), "B-": getVal(6),
            "C+": getVal(7), "C": getVal(8), "C-": getVal(9),
            "D+": getVal(10), "D": getVal(11), "D-": getVal(12),
            "F": getVal(13), "FNS": getVal(14), "R": getVal(15), "NR": getVal(16)
          },
          timestamp: getFormattedTimestamp()
        });
      }
    }
  });

  if (extractedData.length === 0) {
    alert("Found the table but couldn't extract data. The format might have changed.");
    return;
  }


  // --- API CONNECTION ---
  // Pointing to PRODUCTION API
  const API_URL = "https://www.conuplanner.com/api/upload-grades";

  if (confirm(`Ready to sync ${extractedData.length} courses to ConuPlanner?\n\n(Click OK to Upload)`)) {
    // Change button text to show progress
    const btn = document.getElementById("conuplanner-sync-grades-btn");
    if (btn) btn.innerText = "⏳ Uploading...";

    // Route through background script to avoid CORS and ensure permission usage
    chrome.runtime.sendMessage({
      action: "uploadGrades",
      data: extractedData
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        alert(`❌ Connection Failed!\n\nCould not reach Background Service.`);
        if (btn) btn.innerText = "❌ Conn Err";
        return;
      }

      if (response && response.success) {
        alert(`✅ Upload Successful!\n\nAdded ${response.data.count || extractedData.length} entries to the database.`);
        if (btn) btn.innerText = "✅ Done!";
      } else {
        alert(`❌ Upload Failed: ${response?.error || 'Unknown error'}`);
        if (btn) btn.innerText = "❌ Retry";
      }
    });
  }
}


// --- Main Entry Point ---

if (window.location.hostname.includes("vsb.concordia.ca") && window === window.top) {
  // Run existing VSB logic
  init();

  const vsbObserver = new MutationObserver(() => {
    if (!document.getElementById(BUTTON_ID)) {
      injectFloatingButton();
    }
  });
  vsbObserver.observe(document.body, { childList: true, subtree: true });

  const transObserver = new MutationObserver(() => {
    const pageText = document.body.innerText;
    const hasTranscriptSignatures = pageText.includes("Unofficial Transcript") ||
      pageText.includes("Term GPA") ||
      pageText.includes("Academic Program History") ||
      pageText.includes("Student Record");

    if (hasTranscriptSignatures && !document.body.dataset.conuTranscriptInjected) {
      document.body.dataset.conuTranscriptInjected = "true";
      injectTranscriptUI();
    }
  });

  transObserver.observe(document.body, { childList: true, subtree: true });

} else if (window.location.hostname.includes("campus.concordia.ca")) {

  const checkTranscript = () => {
    const pageText = document.body.innerText;
    const hasTranscriptSignatures = pageText.includes("Unofficial Transcript") ||
      pageText.includes("Term GPA") ||
      pageText.includes("Academic Program History") ||
      pageText.includes("Student Record");

    if (hasTranscriptSignatures && !document.body.dataset.conuTranscriptInjected) {
      document.body.dataset.conuTranscriptInjected = "true";
      injectTranscriptUI();
    }
  };

  const campusObserver = new MutationObserver(checkTranscript);
  campusObserver.observe(document.body, { childList: true, subtree: true });
  checkTranscript(); // Run immediately on load

  const checkGrades = () => {
    // Look for ANY table that contains the grade distribution text
    const tables = Array.from(document.querySelectorAll("table.PSLEVEL1GRIDWBO, table.PSLEVEL2GRIDWBO, table.PSLEVEL1GRID, table.PSLEVEL2GRID, table.ps_grid-flex, table"));
    let targetTable = null;

    for (let tbl of tables) {
      if (tbl.innerText.includes("Grade Distribution") && tbl.innerText.includes("A+") && tbl.innerText.includes("FNS")) {
        targetTable = tbl;
        break;
      }
    }

    // If we found the table, and it is a BRAND NEW table DOM element (AJAX reload or first load)
    if (targetTable && !targetTable.dataset.conuInjected) {
      targetTable.dataset.conuInjected = "true"; // Mark this exact table reference

      const containerId = "conuplanner-sync-container";
      const existingContainer = document.getElementById(containerId);

      // If there's an old button sitting on the body from a previous AJAX load, destroy it
      if (existingContainer) {
        existingContainer.remove();
      }

      // Inject a fresh UI for this new table
      injectFloatingSyncUI();
    }
  };

  const scraperObserver = new MutationObserver(checkGrades);
  scraperObserver.observe(document.body, { childList: true, subtree: true });
  checkGrades(); // Run immediately on load
}

function injectFloatingSyncUI() {
  const containerId = "conuplanner-sync-container";
  if (document.getElementById(containerId)) return;

  const container = document.createElement("div");
  container.id = containerId;

  // Container Syles: Fixed at top, centered (like Export button)
  Object.assign(container.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "2147483647",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "8px 20px",
    borderRadius: "50px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    border: "1px solid rgba(0,0,0,0.1)",
    fontFamily: "Segoe UI, sans-serif"
  });

  // 1. The Sync Button
  const btn = document.createElement("button");
  const GRADE_BTN_ID = "conuplanner-sync-grades-btn";
  btn.id = GRADE_BTN_ID;
  btn.innerHTML = "📊 Sync Grades";

  // Premium Styling
  Object.assign(btn.style, {
    background: "linear-gradient(135deg, #800000 0%, #500000 100%)",
    color: "white",
    border: "2px solid white",
    borderRadius: "30px",
    padding: "10px 24px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    whiteSpace: "nowrap"
  });

  btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    scrapeGrades();
  };

  // 2. The Help Link
  const helpLink = document.createElement("a");
  helpLink.href = "https://www.conuplanner.com/insights/help";
  helpLink.target = "_blank";
  helpLink.innerHTML = "❓ How to use";
  Object.assign(helpLink.style, {
    color: "#555",
    fontSize: "13px",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: "600",
    whiteSpace: "nowrap"
  });

  container.appendChild(btn);
  container.appendChild(helpLink);

  document.body.appendChild(container);
}

function getFormattedTimestamp() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${yyyy}-${mm}-${dd} ${hours}:${minutes} ${ampm}`;
}

const GRADE_POINTS = {
  'A+': 4.3, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0, 'FNS': 0.0, 'R': 0.0
};

// --- Unofficial Transcript Scraper ---

function extractTranscriptData() {
  const terms = [];
  let currentTerm = null;
  let programName = "";
  let studentName = "";
  let studentId = "";
  let minCreditsRequired = "";
  let foundProgram = false;

  const rows = document.querySelectorAll('tr');

  // Also pre-scan for the student name and ID if they exist in the PersonInfo box
  const bTags = document.querySelectorAll('b');
  bTags.forEach(b => {
    const bText = b.innerText ? b.innerText.trim() : b.textContent.trim();
    if (bText.includes('Student ID:')) {
      studentId = bText.replace('Student ID:', '').trim();
      // The name is usually in a <b> tag right before the ID
      const parentRow = b.closest('tr');
      if (parentRow && parentRow.cells && parentRow.cells.length > 0) {
        const nameB = parentRow.cells[0].querySelector('b');
        if (nameB) {
          studentName = nameB.innerText ? nameB.innerText.trim() : nameB.textContent.trim();
        }
      }
    }
  });

  // Extract the latest Active Program by scanning classes CUProg and CUPlan
  const progRows = Array.from(document.querySelectorAll('.CUProg, .CUPlan'));
  // We want the LAST contiguous block of CUProg/CUPlan before the first course table
  // Since the unofficial transcript lists all past active program statuses chronologically,
  // the last distinct group represents the current "Active in Program".
  let latestProgramSet = [];
  progRows.forEach(el => {
    const txt = el.innerText ? el.innerText.trim() : el.textContent.trim();
    if (txt && !txt.includes('(Co-op)') && !txt.includes('Withdrew')) {
      latestProgramSet.push(txt);
    }
  });

  if (latestProgramSet.length > 0) {
    // It will push all historical ones, but the last 3 or so are the active ones.
    // E.g. [..., "Bachelor of Computer Science", "Computer Science", "Extended Credit Program"]
    // Actually, a better way is to collect ALL CUProg/CUPlan elements in document order
    // and then just take the final contiguous block.
  }

  // A more robust approach for program Name: Let's extract from the last 'Active in Program' block
  let activeBlocks = document.querySelectorAll('td.t1');
  let lastActiveRowIndex = -1;
  const allTrs = Array.from(document.querySelectorAll('tr'));
  allTrs.forEach((tr, index) => {
    if (tr.innerText.includes('Active in Program')) {
      lastActiveRowIndex = index;
    }
  });

  if (lastActiveRowIndex !== -1) {
    let collectedProgram = [];
    for (let i = lastActiveRowIndex + 1; i < allTrs.length; i++) {
      const rowText = allTrs[i].innerText.trim();
      if (rowText.includes('Min. Credits Required:')) {
        minCreditsRequired = rowText.replace('Min. Credits Required:', '').replace(/[^0-9.]/g, '').trim();
        break;
      }
      if (rowText.includes('Term GPA') || i > lastActiveRowIndex + 10) {
        break;
      }
      if (allTrs[i].querySelector('.CUProg, .CUPlan')) {
        let planText = rowText;
        if (planText && !planText.includes('(Co-op)') && !planText.includes('Withdrew')) {
          collectedProgram.push(planText);
        }
      }
    }
    if (collectedProgram.length > 0) {
      programName = collectedProgram.join('\\n');
    }
  }

  // Fallback if the above doesn't work for some reason
  rows.forEach(row => {
    const clone = row.cloneNode(true);
    Array.from(clone.querySelectorAll('.ui-table-cell-label, .sr-only')).forEach(el => el.remove());

    const text = clone.innerText ? clone.innerText.replace(/\s+/g, ' ').trim() : clone.textContent.replace(/\s+/g, ' ').trim();

    if (!programName && !foundProgram && (text.includes('Bachelor') || text.includes('Master') || text.includes('Certificate') || text.includes('Engineering'))) {
      if (text.length > 5 && text.length < 150) {
        programName = text;
        foundProgram = true;
      }
    }

    if (text.startsWith('Fall 20') || text.startsWith('Winter 20') || text.startsWith('Summer 20')) {
      if (text.length < 20 && !text.includes('Description') && !text.includes('Attempted')) {
        currentTerm = { term: text, courses: [], termGPA: 0, cumGPA: 0 };
        terms.push(currentTerm);
      }
    }

    if (currentTerm) {
      const termMatch = text.match(/Term GPA\s*([\d.]+)/i);
      if (termMatch) currentTerm.termGPA = parseFloat(termMatch[1]);

      // Note: We no longer extract Cum GPA from text because it is often missing.
      // We will dynamically calculate it below.

      const tds = Array.from(clone.querySelectorAll('td'));
      if (tds.length >= 8) {
        const tdTexts = tds.map(td => (td.innerText || td.textContent).replace(/\s+/g, ' ').trim());
        if (tdTexts[0] && tdTexts[1] && tdTexts[3]) {
          let codeRaw = tdTexts[0].replace('Course', '').trim();
          let number = tdTexts[1];
          let name = tdTexts[3].replace('Description', '').trim();

          if (codeRaw.match(/^[A-Z]{3,4}$/) || codeRaw.match(/^[A-Z]{3,4}\s*\d{3}/)) {
            let code = codeRaw.replace(/\s+/g, '');
            let attemptedText = tdTexts[4] || '';
            let gradeText = tdTexts[5] || '';
            let earnedText = tdTexts[10] || '';

            let credits = parseFloat(attemptedText.replace(/[^\d.]/g, '')) || 0;
            let earned = parseFloat(earnedText.replace(/[^\d.]/g, '')) || 0;
            let grade = gradeText.replace('Grade', '').trim();
            if (grade === '' && credits > 0 && earned === 0) grade = 'IP';

            currentTerm.courses.push({
              code: `${code} ${number}`.trim(), title: name, credits, earned, grade, subject: code
            });
          }
        }
      }
    }
  });

  let totalCreditsAttempted = 0;
  let totalCreditsEarned = 0;

  // Manual GPA tracking
  const courseHistory = {}; // Maps course code to latest grade information
  let runningCumGPA = 0;

  terms.forEach(t => {
    let termPoints = 0;
    let termGradedCredits = 0;

    t.courses.forEach(c => {
      totalCreditsAttempted += c.credits;
      if (c.grade !== 'IP' && c.grade !== 'F' && c.grade !== 'FNS' && c.grade !== 'DISC') {
        totalCreditsEarned += c.earned;
      }

      // Track graded courses for GPA
      if (GRADE_POINTS[c.grade] !== undefined) {
        const points = GRADE_POINTS[c.grade] * c.credits;
        termPoints += points;
        termGradedCredits += c.credits;

        // Update cumulative history (most recent grade overrides older ones for cumGPA)
        courseHistory[c.code] = { credits: c.credits, points: points };
      }
    });

    // Calculate dynamic Term GPA if it was missing from HTML
    if (t.termGPA === 0 && termGradedCredits > 0) {
      t.termGPA = parseFloat((termPoints / termGradedCredits).toFixed(2));
    }

    // Calculate dynamic Cumulative GPA up to this term
    let totalCumPoints = 0;
    let totalCumCredits = 0;
    Object.values(courseHistory).forEach(entry => {
      totalCumPoints += entry.points;
      totalCumCredits += entry.credits;
    });

    if (totalCumCredits > 0) {
      runningCumGPA = parseFloat((totalCumPoints / totalCumCredits).toFixed(2));
    }
    t.cumGPA = runningCumGPA;
  });

  const validTerms = terms.filter(t => t.courses.length > 0 || t.termGPA > 0);

  return { studentName, studentId, programName, minCreditsRequired, overallCumGPA: runningCumGPA, totalCreditsAttempted, totalCreditsEarned, terms: validTerms };
}

function injectTranscriptUI() {
  const containerId = "conuplanner-transcript-sync-container";
  if (document.getElementById(containerId)) return;

  const container = document.createElement("div");
  container.id = containerId;
  Object.assign(container.style, {
    position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
    zIndex: "2147483647", display: "flex", alignItems: "center", gap: "15px",
    backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "8px 20px",
    borderRadius: "50px", boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    border: "1px solid rgba(0,0,0,0.1)", fontFamily: "Segoe UI, sans-serif"
  });

  const btn = document.createElement("button");
  btn.innerHTML = "✨ Sync Academic History";
  Object.assign(btn.style, {
    background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    color: "white", border: "2px solid white", borderRadius: "30px",
    padding: "10px 24px", fontSize: "15px", fontWeight: "bold",
    cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap"
  });

  btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const data = extractTranscriptData();

    if (!data || data.terms.length === 0) {
      alert("⚠️ No Transcript Data Found!\n\nPlease ensure the Unofficial Transcript has fully loaded on the screen before clicking Sync.\n\n(Tip: Scroll down to make sure all terms are visible)");
      return;
    }

    try {
      const jsonString = JSON.stringify(data);
      const encodedData = encodeURIComponent(jsonString);

      // Open the dashboard in a new tab with the payload
      const dashboardUrl = `https://conuplanner.com/dashboard/progress?data=${encodedData}`;
      window.open(dashboardUrl, '_blank');

      btn.innerHTML = "✅ Analytics Generated!";
      setTimeout(() => { btn.innerHTML = "✨ Sync Academic History"; }, 3000);
    } catch (err) {
      console.error("Error redirecting to dashboard:", err);
      alert("Found transcript data, but failed to automatically open the dashboard. Please check console.");
    }
  };

  container.appendChild(btn);
  document.body.appendChild(container);
}
