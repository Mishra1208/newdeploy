"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./courses.module.css";
import { fetchCourses, fetchSubjects } from "@/lib/mockApi"; // ← add fetchSubjects
import AddButton from "@/components/AddButton";

const KEY = "conu-planner:selected";

/* -------------------------------- helpers -------------------------------- */
const safeUpper = (v) => (v ?? "").toString().trim().toUpperCase();

const loadList = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
};

const saveList = (arr) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch { }
};

function courseKey(c) {
  const subj = safeUpper(c?.subject);
  const cat = safeUpper(c?.catalogue);
  const term = safeUpper(c?.term) || "TERMLESS";
  return `${subj}-${cat}-${term}`;
}

function dedupeByOffering(list) {
  const seen = new Set();
  const out = [];
  for (const it of list) {
    const k = courseKey(it);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(it);
    }
  }
  return out;
}

function broadcastPlannerChange() {
  try {
    window.dispatchEvent(new Event("planner:update"));
  } catch { }
}

/* -------------------------------- component ------------------------------- */
export default function CoursesPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subjects, setSubjects] = useState(["COMP", "COEN", "SOEN", "MECH", "ENGR", "ENCS", "AERO"]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [visibleCount, setVisibleCount] = useState(50);

  const refreshSelectedFromStorage = () => {
    const list = loadList();
    setSelectedKeys(new Set(list.map((i) => courseKey(i))));
  };

  useEffect(() => {
    refreshSelectedFromStorage();
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e?.key === KEY || e?.key == null) refreshSelectedFromStorage();
    };
    const onVisible = () => {
      if (!document.hidden) refreshSelectedFromStorage();
    };
    const onPlannerUpdate = () => refreshSelectedFromStorage();

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("planner:update", onPlannerUpdate);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("planner:update", onPlannerUpdate);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1500);
    return () => clearTimeout(t);
  }, [toast]);

  const f = useMemo(
    () => ({
      search: params.get("search") || "",
      subject: params.get("subject") || "ALL",
      term: params.get("term") || "ALL",
      minCredits: Number(params.get("minCredits") ?? 0),
      maxCredits: Number(params.get("maxCredits") ?? 6),
    }),
    [params]
  );

  // Load subjects
  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await fetchSubjects();
      if (!alive) return;
      setSubjects(list);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Load courses
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const res = await fetchCourses(f);
      if (!alive) return;
      setData(Array.isArray(res) ? res : []);
      setVisibleCount(50);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [f]);

  async function addToPlanner(course) {
    const key = courseKey(course);

    if (selectedKeys.has(key)) {
      const termLabel = course?.term ? ` for ${course.term}` : "";
      setToast({ text: `Course already added to the planner${termLabel}`, kind: "warn" });
      return false;
    }

    const list = loadList();
    const next = dedupeByOffering([...list, course]);
    saveList(next);

    setSelectedKeys((prev) => {
      const s = new Set(prev);
      s.add(key);
      return s;
    });

    broadcastPlannerChange();
    setToast({ text: "Added to planner", kind: "ok" });
    return true;
  }

  // --- Logic for "Catalog View" vs "Grid View" ---

  // Check if we are in "Default Mode" (no active filters)
  const isDefaultView =
    !f.search &&
    f.subject === "ALL" &&
    f.term === "ALL" &&
    f.minCredits === 0 &&
    f.maxCredits === 6;

  // Department Mappings
  const DEPARTMENTS = [
    {
      name: "Engineering & Computer Science",
      codes: new Set(["COMP", "SOEN", "COEN", "ENGR", "MECH", "ELEC", "AERO", "BLDG", "CIVI", "INDU", "BSTA"])
    },
    {
      name: "John Molson School of Business",
      codes: new Set(["ACCO", "MARK", "COMM", "FINA", "MANA", "DESC", "ECON"])
    }
  ];

  function getDepartment(code) {
    for (const d of DEPARTMENTS) {
      if (d.codes.has(code)) return d.name;
    }
    return "Arts & Science / Other";
  }

  // Group data by Department -> Subject for Catalog View
  const groupedData = useMemo(() => {
    if (!isDefaultView) return null;

    // 1. Group by Subject first
    const bySubject = {};
    for (const c of data) {
      if (!bySubject[c.subject]) bySubject[c.subject] = [];
      bySubject[c.subject].push(c);
    }

    // 2. Group Subjects by Department
    const byDept = {
      "Engineering & Computer Science": [],
      "John Molson School of Business": [],
      "Arts & Science / Other": []
    };

    Object.entries(bySubject).forEach(([subject, courses]) => {
      const dept = getDepartment(subject);
      if (!byDept[dept]) byDept[dept] = []; // Safety

      byDept[dept].push({
        subject,
        courses,
        count: courses.length
      });
    });

    // 3. Sort subjects within departments (Priority first for Eng, then alpha)
    const engPriority = ["COMP", "SOEN", "COEN", "ENGR", "MECH"];

    // Helper to sort subjects
    const sortSubjects = (list, priorityList = []) => {
      return list.sort((a, b) => {
        const idxA = priorityList.indexOf(a.subject);
        const idxB = priorityList.indexOf(b.subject);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.subject.localeCompare(b.subject);
      });
    };

    byDept["Engineering & Computer Science"] = sortSubjects(byDept["Engineering & Computer Science"], engPriority);
    byDept["John Molson School of Business"] = sortSubjects(byDept["John Molson School of Business"]);
    byDept["Arts & Science / Other"] = sortSubjects(byDept["Arts & Science / Other"]);

    // Return as array of { name, subjects: [] }
    return [
      { name: "Engineering & Computer Science", subjects: byDept["Engineering & Computer Science"] },
      { name: "John Molson School of Business", subjects: byDept["John Molson School of Business"] },
      { name: "Arts & Science / Other", subjects: byDept["Arts & Science / Other"] }
    ].filter(g => g.subjects.length > 0);
  }, [data, isDefaultView]);


  const [activeDept, setActiveDept] = useState("Engineering & Computer Science");

  // --- Helper for Vibe Tags ---
  function getVibeTags(subject, title = "") {
    const s = safeUpper(subject);
    const t = title.toUpperCase();
    const tags = [];

    // 1. Keyword Scanning (Smart Logic)
    if (t.includes("PROJECT") || t.includes("CAPSTONE") || t.includes("DESIGN")) {
      tags.push({ label: "Project", type: "vibeCode" });
    }
    if (t.includes("CALCULUS") || t.includes("ALGEBRA") || t.includes("STATISTICS") || t.includes("MATH") || t.includes("DISCRETE")) {
      tags.push({ label: "Math Heavy", type: "vibeMath" });
    }
    if (t.includes("PROGRAMMING") || t.includes("OBJECT") || t.includes("WEB") || t.includes("SYSTEM") || t.includes("ALGORITHM") || t.includes("DATA")) {
      tags.push({ label: "Code Heavy", type: "vibeCode" });
    }
    if (t.includes("MANAGEMENT") || t.includes("MARKETING") || t.includes("STRATEGY") || t.includes("BUSINESS") || t.includes("FINANCE")) {
      tags.push({ label: "Case Studies", type: "vibeTeam" });
    }
    if (t.includes("THEORY") || t.includes("HISTORY") || t.includes("ETHICS") || t.includes("SOCIETY")) {
      tags.push({ label: "Theory", type: "vibeTheory" });
    }

    // 2. Department Fallbacks (if too few tags found)
    if (tags.length === 0) {
      if (["COMP", "SOEN"].includes(s)) {
        tags.push({ label: "Code Heavy", type: "vibeCode" });
      } else if (["MATH", "ENGR", "MECH", "ELEC", "CIVI", "AERO", "BSTA"].includes(s)) {
        tags.push({ label: "Math Heavy", type: "vibeMath" });
      } else if (["COMM", "MARK", "MANA", "ACCO", "FINA"].includes(s)) {
        tags.push({ label: "Team Work", type: "vibeTeam" });
      } else {
        tags.push({ label: "Reading", type: "vibeTheory" }); // Arts/General default
      }
    }

    // Dedup tags by label
    const seen = new Set();
    return tags.filter(tag => {
      if (seen.has(tag.label)) return false;
      seen.add(tag.label);
      return true;
    }).slice(0, 2); // Max 2 tags to avoid clutter
  }

  // --- Floating Backpack Widget ---
  const FloatingBackpack = ({ count }) => {
    if (count === 0) return null;
    return (
      <div
        key={count}
        className={styles.floatingBackpack}
        onClick={() => router.push("/pages/planner")}
      >
        <span className={styles.backpackIcon}>🎒</span>
        <span className={styles.backpackText}>{count} Course{count !== 1 ? "s" : ""} in Planner</span>
        <span className={styles.backpackCount}>GO</span>
      </div>
    );
  };

  // --- Spotlight Hero Component ---
  const SpotlightHero = () => (
    <div className={styles.spotlightHero}>
      <div className={styles.spotlightBg} />
      <div className={styles.spotlightContent}>
        <span className={styles.spotlightBadge}>🔥 Trending now</span>
        <h2 className={styles.spotlightTitle}>COMP 352</h2>
        <p className={styles.spotlightDesc}>
          Data Structures & Algorithms. The fundamental logic behind every great piece of software.
          Master the art of efficiency.
        </p>
        <button
          className={styles.applyBtn}
          onClick={() => {
            // Mock add behavior or scroll to it. For now just a trigger.
            router.push("/pages/courses?search=COMP%20352");
          }}
        >
          View Course
        </button>
      </div>
    </div>
  );

  // Helper to render a single card
  const renderCard = (c) => {
    const k = courseKey(c);
    const isSelected = selectedKeys.has(k);
    const anchorId = `${safeUpper(c?.subject)}-${safeUpper(c?.catalogue)}`;
    const descHref = `/pages/courses/descriptions#${anchorId}`;
    const vibes = getVibeTags(c?.subject, c?.title);

    return (
      <div key={k} className={`card ${isSelected ? styles.cardSelected : ""}`} style={{
        display: "flex", flexDirection: "column", gap: "12px", padding: "24px",
        // Force width in flex row (Catalog View) vs auto in Grid
        minWidth: isDefaultView ? "300px" : undefined,
        maxWidth: isDefaultView ? "300px" : undefined,
      }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 2 }}>
          <div className="courseCode" style={{
            background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
            WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
            fontWeight: "800", fontSize: "14px", letterSpacing: "0.05em"
          }}>
            {c?.subject} {c?.catalogue}
          </div>
          {isSelected && <div className={styles.animPop} style={{ color: "#22c55e", fontSize: "12px", fontWeight: "700" }}>ADDED</div>}
        </div>

        <div className={`cardTitle ${isSelected ? styles.cardTitleAdded : ""}`} style={{
          fontSize: "18px", fontWeight: "700", lineHeight: "1.3", margin: "4px 0",
          position: "relative", zIndex: 2
        }}>
          {c?.title}
        </div>

        {/* Vibe Tags */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "4px" }}>
          {vibes.map((v, i) => (
            <span key={i} className={`${styles.vibeTag} ${styles[v.type]}`}>{v.label}</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", position: "relative", zIndex: 2 }}>
          <span className={styles.tag}>{(c?.credits ?? "-")} cr</span>
          {c?.session && <span className={styles.tag}>{c.session}</span>}
          {c?.term && <span className={styles.tag}>{c.term}</span>}
        </div>

        <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
          <div className={isSelected ? styles.animPop : ""}>
            <AddButton onAdd={() => addToPlanner(c)} />
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            <a className={styles.ghostBtn} href={descHref}>
              Details
            </a>
            <a
              className={styles.ghostBtn}
              href={`/pages/tree?code=${c.subject}-${c.catalogue}`}
              title="View Prerequisite Tree"
            >
              Tree ↗
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className={styles.wrap}>
      <div className={styles.head}>
        <h1 className="h2" style={{ fontFamily: "var(--font-outfit)" }}>Courses</h1>
      </div>

      {isDefaultView && <SpotlightHero />}

      <FiltersInline
        subjects={subjects}
        onApply={(q) => router.push(`/pages/courses?${q}`)}
      />

      {loading ? (
        <p className="body">Loading…</p>
      ) : data.length === 0 ? (
        <p className="body">No results. Try adjusting filters.</p>
      ) : (
        <>
          {/* CATALOG VIEW (Netflix Style) */}
          {isDefaultView && groupedData ? (
            <>
              {/* Dept Tabs */}
              <div className={styles.deptTabs}>
                {[
                  "Engineering & Computer Science",
                  "John Molson School of Business",
                  "Arts & Science / Other",
                  "View All"
                ].map((d) => (
                  <button
                    key={d}
                    className={`${styles.deptTab} ${activeDept === d ? styles.deptTabActive : ""}`}
                    onClick={() => setActiveDept(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className={styles.catalogView}>
                {groupedData
                  .filter(d => activeDept === "View All" || d.name === activeDept)
                  .map((dept) => (
                    <div key={dept.name} className={styles.deptSection}>
                      {/* Department Header */}
                      <div className={styles.deptHeader}>
                        <h2 className={styles.deptTitle}>{dept.name}</h2>
                        <div className={styles.deptLine}></div>
                      </div>

                      {/* Subject Rows within Dept */}
                      {dept.subjects.map((subj) => (
                        <div key={subj.subject} className={styles.categorySection}>
                          <h3 className={styles.categoryTitle}>
                            {subj.subject}
                            <span style={{ fontSize: "0.6em", opacity: 0.5, fontWeight: 400, marginLeft: "8px" }}>
                              {subj.count} Courses
                            </span>
                          </h3>
                          <div className={styles.categoryRow}>
                            {subj.courses.map(renderCard)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </>
          ) : (
            /* GRID VIEW (Filtered) */
            <div className="cards grid">
              <div className={styles.grid}>
                {data.slice(0, visibleCount).map(renderCard)}
              </div>
            </div>
          )}

          {/* Pagination Button (Only needed in Grid View) */}
          {!isDefaultView && visibleCount < data.length && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "40px", paddingBottom: "40px" }}>
              <button
                onClick={() => setVisibleCount(prev => prev + 50)}
                className={styles.applyBtn}
                style={{ minWidth: "200px" }}
              >
                Load More ({data.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {toast && (
        <div className={styles.toast} data-kind={toast.kind} aria-live="polite">
          {toast.text}
        </div>
      )}

      {/* Persistent Widget */}
      <FloatingBackpack count={selectedKeys.size} />
    </main>
  );
}

function FiltersInline({ onApply, subjects = [] }) {
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [subject, setSubject] = useState(params.get("subject") ?? "ALL");
  const [term, setTerm] = useState(params.get("term") ?? "ALL");
  const [minCredits, setMinCredits] = useState(params.get("minCredits") ?? "0");
  const [maxCredits, setMaxCredits] = useState(params.get("maxCredits") ?? "6");

  function apply(e) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (subject !== "ALL") q.set("subject", subject);
    if (term !== "ALL") q.set("term", term);
    q.set("minCredits", minCredits);
    q.set("maxCredits", maxCredits);
    onApply?.(q.toString());
  }

  return (
    <form className={styles.filters} onSubmit={apply}>
      <input
        className={styles.input}
        placeholder="Search title/code…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Subject — dynamic from CSV (limited to COMP/COEN/SOEN/MECH/ENGR/ENCS/AERO) */}
      <select className={styles.select} value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="ALL">All Subjects</option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Term — keep your existing options; they’ll still filter correctly */}
      <select className={styles.select} value={term} onChange={(e) => setTerm(e.target.value)}>
        <option value="ALL">All Terms</option>
        <option value="Fall">Fall</option>
        <option value="Winter">Winter</option>
        <option value="Summer">Summer</option>
      </select>

      <input
        className={styles.number}
        type="number"
        min="0"
        max="6"
        value={minCredits}
        onChange={(e) => setMinCredits(e.target.value)}
      />
      <span className={styles.to}>to</span>
      <input
        className={styles.number}
        type="number"
        min="0"
        max="6"
        value={maxCredits}
        onChange={(e) => setMaxCredits(e.target.value)}
      />
      <button className={styles.applyBtn}>Apply</button>
    </form>
  );
}
