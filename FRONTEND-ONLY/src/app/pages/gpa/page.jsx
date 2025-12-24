"use client";

import { useState, useEffect, useMemo } from "react";
import styles from "./gpa.module.css";
import { Plus, Trash2 } from "lucide-react";

/* ---------------- Config & Helpers ---------------- */
const GRADE_POINTS = {
    "A+": 4.3, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "D-": 0.7,
    "F": 0.0, "FNS": 0.0, "R": 0.0, "GNR": 0.0
};

const GRADE_OPTIONS = Object.keys(GRADE_POINTS);

// Simple CSV parser
const parseCSV = (text) => {
    const lines = text.split("\n").filter((l) => l.trim());
    const header = lines[0].split(",");
    // We only need Subject, Catalogue, Title, Credits
    // Assuming standard CSV format from inspection: Subject, Catalogue, ..., Credits, ...
    return lines.slice(1).map((line) => {
        // Handling quoted CSV is complex, but for this specific file, split by comma works reasonably well
        // or regex match. Let's try a regex for better robustness against commas in titles.
        // However, for speed and safety given previous files, let's use a simpler split if no quote parser available.
        // Actually, I'll copy the robust parser I saw in `descriptions/page.jsx` but simplified.
        // Re-implementing a tiny robust parser:
        const row = [];
        let cell = "";
        let inQuote = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') { inQuote = !inQuote; }
            else if (char === ',' && !inQuote) { row.push(cell.trim()); cell = ""; }
            else { cell += char; }
        }
        row.push(cell.trim());

        // Map based on known indices or just heuristic search? 
        // Let's rely on column names being somewhat standard or index-based based on header.
        // Header is: Subject,Catalogue,Title,Days,Time,Room,Term,Session,Credits,Description,...
        // Let's just fuzzy match:
        return {
            subject: row[0], // Subject
            catalogue: row[1], // Catalogue
            title: row[2], // Title
            credits: parseFloat(row[8] || "0") || 0 // Credits index 8 typically
        };
    }).filter(c => c.subject && c.catalogue); // Filter valid rows
};

export default function GPACalculator() {
    /* --- State --- */
    const [coursesBox, setCoursesBox] = useState([]); // Database of courses for autocomplete
    const [rows, setRows] = useState([
        { id: 1, name: "", credits: 3.0, grade: "A" },
        { id: 2, name: "", credits: 3.0, grade: "B" },
        { id: 3, name: "", credits: 3.0, grade: "B+" },
        { id: 4, name: "", credits: 3.0, grade: "A-" },
    ]);

    // Load Course DB
    useEffect(() => {
        fetch("/courses_merged.csv")
            .then((r) => r.text())
            .then((txt) => {
                const raw = txt.split("\n").slice(1);
                const parsed = [];
                const seen = new Set();

                raw.forEach(line => {
                    if (!line.trim()) return;

                    // Robust CSV parsing handling quotes and empty fields
                    const row = [];
                    let cur = "";
                    let inQuote = false;
                    for (let i = 0; i < line.length; i++) {
                        const c = line[i];
                        if (c === '"') {
                            inQuote = !inQuote;
                        } else if (c === ',' && !inQuote) {
                            row.push(cur.trim());
                            cur = "";
                        } else {
                            cur += c;
                        }
                    }
                    row.push(cur.trim());

                    // Clean quotes
                    const clean = (s) => s ? s.replace(/^"|"$/g, '').replace(/""/g, '"').trim() : "";
                    const parts = row.map(clean);

                    // Columns: 1:credits, 7:subject, 8:catalogue, 9:title
                    if (parts.length < 10) return;

                    const subj = parts[7].toUpperCase();
                    const cat = parts[8].toUpperCase();
                    const title = parts[9];
                    const cred = parseFloat(parts[1]);

                    if (!subj || !cat) return;

                    const key = `${subj} ${cat}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        parsed.push({ code: key, title, credits: (!isNaN(cred) ? cred : 3.0) });
                    }
                });
                setCoursesBox(parsed);
            })
            .catch((err) => console.error("Failed to load courses for autocomplete", err));
    }, []);

    const [currentGPA, setCurrentGPA] = useState("");
    const [currentCredits, setCurrentCredits] = useState("");

    /* --- Calculations --- */
    const { semesterGPA, totalSemesterCredits, finalGPA, hasCumulativeData } = useMemo(() => {
        // 1. Calculate Semester details
        let semCreds = 0;
        let semPoints = 0;
        rows.forEach((r) => {
            const cred = parseFloat(r.credits) || 0;
            const pts = GRADE_POINTS[r.grade] || 0;
            semCreds += cred;
            semPoints += (cred * pts);
        });

        const semGPA = semCreds > 0 ? (semPoints / semCreds) : 0;

        // 2. Calculate Cumulative if data exists
        const curG = parseFloat(currentGPA);
        const curC = parseFloat(currentCredits);
        let final = semGPA;
        let hasCum = false;

        if (!isNaN(curG) && !isNaN(curC) && curC > 0) {
            const totalPoints = (curG * curC) + semPoints;
            const totalCreds = curC + semCreds;
            final = totalCreds > 0 ? (totalPoints / totalCreds) : 0;
            hasCum = true;
        }

        return {
            semesterGPA: semGPA,
            totalSemesterCredits: semCreds,
            finalGPA: final,
            hasCumulativeData: hasCum
        };
    }, [rows, currentGPA, currentCredits]);

    /* --- Handlers --- */
    const updateRow = (id, field, value) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const removeRow = (id) => {
        setRows(prev => prev.filter(r => r.id !== id));
    };

    const addRow = () => {
        const newId = Math.max(0, ...rows.map(r => r.id)) + 1;
        setRows(prev => [...prev, { id: newId, name: "", credits: 3.0, grade: "B" }]);
    };

    const clearAll = () => {
        setRows([
            { id: 1, name: "", credits: 3.0, grade: "B" },
            { id: 2, name: "", credits: 3.0, grade: "B" },
            { id: 3, name: "", credits: 3.0, grade: "B" },
            { id: 4, name: "", credits: 3.0, grade: "B" },
        ]);
    };

    // Autocomplete Select
    const handleSelectCourse = (id, course) => {
        setRows(prev => prev.map(r => r.id === id ? {
            ...r,
            name: course.code, // Show code in input? Or Title? User said "COMP 248"
            credits: course.credits
        } : r));
    };

    return (
        <main className={styles.wrap}>
            <header className={styles.intro}>
                <div>
                    <h1 className="h2" style={{ marginBottom: 4 }}>GPA Calculator</h1>
                    <p className={styles.desc}>Estimate your semester GPA with our precision tool.</p>
                </div>
            </header>

            <div className={styles.content}>
                {/* --- Calculator Left Column --- */}
                <div className={styles.leftCol}>
                    <div className={styles.gradeCards}>
                        {rows.map((row) => (
                            <CourseRow
                                key={row.id}
                                row={row}
                                coursesDB={coursesBox}
                                onChange={(f, v) => updateRow(row.id, f, v)}
                                onRemove={() => removeRow(row.id)}
                                onSelect={(c) => handleSelectCourse(row.id, c)}
                            />
                        ))}
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.addBtn} onClick={addRow}>
                            <Plus size={18} /> Add Course
                        </button>
                        <button className={styles.clearBtn} onClick={clearAll}>
                            Reset
                        </button>
                    </div>
                </div>

                {/* --- Result Dashboard --- */}
                <aside className={styles.resultCard}>
                    {/* Gauge & Value */}
                    <div className={styles.gaugeContainer}>
                        <GPAGauge value={finalGPA} />
                        <div className={styles.gpaOverlay}>
                            <div className={styles.gpaValue}>{finalGPA.toFixed(2)}</div>
                            <div className={styles.gpaLabel}>GPA</div>
                        </div>
                    </div>

                    <div className={styles.statGrid}>
                        <div className={styles.statBox}>
                            <div className={styles.statLabel}>Credits</div>
                            <div className={styles.statNum}>{totalSemesterCredits}</div>
                        </div>
                        <div className={styles.statBox}>
                            <div className={styles.statLabel}>Points</div>
                            <div className={styles.statNum}>{(semesterGPA * totalSemesterCredits || 0).toFixed(0)}</div>
                        </div>
                    </div>

                    <div className={styles.divider} />

                    {/* Cumulative Inputs (HUD Style) */}
                    <div className={styles.cumulativeSection}>
                        <h3 className={styles.cardTitle}>Cumulative (Optional)</h3>
                        <div className={styles.cumInputs}>
                            <div className={styles.inputStack}>
                                <label>Current GPA</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className={styles.inputHud}
                                    value={currentGPA}
                                    onChange={(e) => setCurrentGPA(e.target.value)}
                                    step="0.01"
                                    max="4.3"
                                />
                            </div>
                            <div className={styles.inputStack}>
                                <label>Credits Earned</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className={styles.inputHud}
                                    value={currentCredits}
                                    onChange={(e) => setCurrentCredits(e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}

/* --- Subcomponents --- */

function CourseRow({ row, coursesDB, onChange, onRemove, onSelect }) {
    const [suggestions, setSuggestions] = useState([]);
    const [showSugg, setShowSugg] = useState(false);

    // Autocomplete filter
    const handleInput = (val) => {
        onChange("name", val);
        if (val.length < 2) {
            setSuggestions([]);
            return;
        }

        const q = val.toUpperCase();
        const matches = coursesDB.filter(c =>
            c.code.includes(q) || (c.title && c.title.toUpperCase().includes(q))
        ).slice(0, 5);
        setSuggestions(matches);
        setShowSugg(true);
    };

    const handleBlur = () => { setTimeout(() => setShowSugg(false), 200); };

    return (
        <div className={styles.gradeCard}>
            <div className={styles.cardMain}>
                <div className={styles.inputGroup} style={{ flex: 1 }}>
                    <label className={styles.fieldLabel}>Course Code</label>
                    <input
                        className={styles.input}
                        placeholder="e.g. COMP 248"
                        value={row.name}
                        onChange={(e) => handleInput(e.target.value)}
                        onBlur={handleBlur}
                        onFocus={() => row.name.length >= 2 && setShowSugg(true)}
                    />
                    {showSugg && suggestions.length > 0 && (
                        <div className={styles.suggestions}>
                            {suggestions.map((s, i) => (
                                <div key={i} className={styles.suggestion} onMouseDown={() => onSelect(s)}>
                                    <span className={styles.code}>{s.code}</span>
                                    <span className={styles.creditsHint}>{s.credits} cr</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.rowMeta}>
                    <div style={{ width: 80 }}>
                        <label className={styles.fieldLabel}>Credits</label>
                        <input
                            className={styles.input}
                            type="number"
                            min="0"
                            step="0.5"
                            value={row.credits}
                            onChange={(e) => onChange("credits", e.target.value)}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label className={styles.fieldLabel}>Grade</label>
                        <select
                            className={styles.select}
                            value={row.grade}
                            onChange={(e) => onChange("grade", e.target.value)}
                        >
                            {GRADE_OPTIONS.map(g => (
                                <option key={g} value={g}>{g} ({GRADE_POINTS[g]})</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <button className={styles.removeBtn} onClick={onRemove} aria-label="Remove">
                <Trash2 size={16} />
            </button>
        </div>
    );
}

function GPAGauge({ value }) {
    // 0 to 4.3 map to 0 to 180 degrees (semi-circle)
    const max = 4.3;
    const clamped = Math.min(Math.max(value, 0), max);
    const percent = clamped / max;

    // Circle math
    const r = 80;
    const c = 3.14159 * r; // circumference (half circle logic needs care)
    // Actually full circle circumference is 2*pi*r. 
    // We want a semi-circle stroke.

    // Let's use simple stroke-dasharray trick.
    // FULL circle perimeter = 2 * pi * 80 ~= 502.
    // We want the gauge to be a 180 degree arc. 
    // So we set stroke-dasharray to "251 502"? No, simpler:
    // Path is an arc.

    // Just drawing an arc path is easier
    return (
        <svg viewBox="0 0 200 110" width="100%" height="100%">
            <defs>
                <linearGradient id="gpaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
            </defs>
            {/* Background Arc */}
            <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="16"
                strokeLinecap="round"
            />
            {/* Foreground Value Arc */}
            {/* We calculate end point using trigonometry */}
            {/* Angle goes from 180 (left) to 360/0 (right) -> actually in SVG coord system:
                Start (20, 100) is 180 deg. 
                End (180, 100) is 0 deg.
                We want to travel clockwise? No, usually gauges go left to right.
                Start Angle = 180 (Pi). End Angle = 0.
                Current Angle = 180 - (percent * 180).
             */}
            <GaugeArc value={percent} />
        </svg>
    );
}

function GaugeArc({ value }) {
    // value 0..1
    const r = 80;
    const cx = 100;
    const cy = 100;

    // Start point (left) corresponds to 180 degrees
    const startAngle = Math.PI;
    // End point varies. 0% -> 180 deg. 100% -> 0 deg.
    const endAngle = Math.PI * (1 - value);

    // Convert polar to cartesian
    const x1 = cx + r * Math.cos(startAngle); // Should be 20
    const y1 = cy - r * Math.sin(startAngle); // Should be 100 (if y grows down)

    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy - r * Math.sin(endAngle);

    // SVG Path A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    // large-arc-flag: 0 because we never exceed 180 deg here?
    const d = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;

    return (
        <path
            d={d}
            fill="none"
            stroke="url(#gpaGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            style={{ transition: "d 0.5s ease-out" }}
        />
    );
}
