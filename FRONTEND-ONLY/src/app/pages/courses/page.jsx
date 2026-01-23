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
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Scroll to Top Logic
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 400) setShowTopBtn(true);
      else setShowTopBtn(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  async function removeFromPlanner(course) {
    const key = courseKey(course);
    const list = loadList();
    const next = list.filter((i) => courseKey(i) !== key);
    saveList(next);

    setSelectedKeys((prev) => {
      const s = new Set(prev);
      s.delete(key);
      return s;
    });

    broadcastPlannerChange();
    setToast({ text: "Removed from planner", kind: "ok" });
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

  // --- Spotlight Hero Component (Premium Carousel) ---
  const SpotlightHero = () => {
    const [current, setCurrent] = useState(0);

    const SLIDES = [
      {
        badge: "🔥 Featured Course",
        title: "COMP 352",
        subtitle: "Data Structures & Algorithms",
        desc: "The fundamental logic behind every great piece of software. Master efficiency, complexity analysis, and advanced data organization.",
        btnPrimary: "View Details",
        actionPrimary: () => router.push("/pages/courses?search=COMP%20352"),
        btnSecondary: "Prerequisites: COMP 248, MATH 203",
        visual: "book"
      },
      {
        badge: "🎓 Degree Planner",
        title: "Build Your Degree",
        subtitle: "Simple & Powerful",
        desc: "Swipe courses into your backpack. Check credits, terms, and conflicts in seconds. Your entire degree map, visualized.",
        btnPrimary: "Go to Planner",
        actionPrimary: () => router.push("/pages/planner"),
        btnSecondary: "Try it now",
        visual: "planner"
      },
      {
        badge: "🌳 Prerequisite Tree",
        title: "Visualize Your Path",
        subtitle: "Never Get Stuck",
        desc: "See exactly what you need for 400-level electives with our interactive dependency trees. Plan 3 steps ahead.",
        btnPrimary: "Explore Trees",
        actionPrimary: () => router.push("/pages/tree"),
        btnSecondary: "Interactive Demo",
        visual: "tree"
      },
      {
        badge: "💺 Seat Finder",
        title: "Find Your Spot",
        subtitle: "Real-time Seat Availability",
        desc: "Don't gamble with your study time. Check real-time seat availability in the library and quiet zones before you go.",
        btnPrimary: "Check Seats",
        actionPrimary: () => router.push("/pages/seat-finder"),
        btnSecondary: "View Map",
        visual: "seat"
      }
    ];

    // Auto-rotate
    useEffect(() => {
      const t = setInterval(() => {
        setCurrent(prev => (prev + 1) % SLIDES.length);
      }, 8000);
      return () => clearInterval(t);
    }, []);

    const slide = SLIDES[current];

    return (
      <div className={styles.spotlightHero}>
        <div className={styles.spotlightBg} />

        {/* Carousel Content */}
        {SLIDES.map((s, idx) => (
          <div
            key={idx}
            className={`${styles.heroSlide} ${idx === current ? styles.heroSlideActive : ""}`}
          >
            <div className={styles.spotlightContent}>
              <div className={styles.spotlightBadge}>
                <span className={styles.fireIcon}>{s.badge.split(" ")[0]}</span> {s.badge.split(" ").slice(1).join(" ")}
              </div>
              <h2 className={styles.spotlightTitle}>{s.title}</h2>
              <div className={styles.spotlightSubtitle}>{s.subtitle}</div>
              <p className={styles.spotlightDesc}>{s.desc}</p>

              <div className={styles.heroActions}>
                <button className={styles.heroBtnPrimary} onClick={s.actionPrimary}>
                  {s.btnPrimary}
                </button>
                <button className={styles.heroBtnSecondary}>
                  {s.btnSecondary}
                </button>
              </div>
            </div>

            {/* Unique Visual per Slide */}
            <div className={styles.spotlightVisual}>
              {s.visual === "book" && (
                <div className={styles.book3d}>
                  <div className={styles.bookCover}>
                    <div className={styles.bookSpine}></div>
                    <div className={styles.bookFace}>
                      <span className={styles.bookTitle}>DS &<br />ALGO</span>
                      <span className={styles.bookCode}>COMP 352</span>
                    </div>
                  </div>
                  <div className={styles.bookPages}></div>
                  <div className={styles.bookShadow}></div>
                </div>
              )}

              {s.visual === "planner" && (
                <div className={styles.plannerStack}>
                  <div className={`${styles.plannerCard} ${styles.pCard3}`}>ELECTIVE</div>
                  <div className={`${styles.plannerCard} ${styles.pCard2}`}>CORE</div>
                  <div className={`${styles.plannerCard} ${styles.pCard1}`}>
                    <span>Next Term</span>
                  </div>
                </div>
              )}

              {s.visual === "tree" && (
                <div className={styles.treeVisual}>
                  <div className={`${styles.treeLine} ${styles.line1}`}></div>
                  <div className={`${styles.treeLine} ${styles.line2}`}></div>
                  <div className={`${styles.treeLine} ${styles.line3}`}></div>
                  <div className={`${styles.treeLine} ${styles.line4}`}></div>

                  <div className={`${styles.treeNode} ${styles.tNode1}`}>ROOT</div>
                  <div className={`${styles.treeNode} ${styles.tNode2}`}>PRE</div>
                  <div className={`${styles.treeNode} ${styles.tNode3}`}>REQ</div>
                  <div className={`${styles.treeNode} ${styles.tNode4}`}>NEXT</div>
                </div>
              )}

              {s.visual === "seat" && (
                <div className={styles.seatVisual}>
                  <div className={styles.seatMap}>
                    {/* Row 1 */}
                    <div className={`${styles.seat} ${styles.seattaken}`} />
                    <div className={`${styles.seat} ${styles.seatfree}`} />
                    {/* Row 2 */}
                    <div className={styles.seat} />
                    <div className={`${styles.seat} ${styles.seattaken}`} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Navigation Dots */}
        <div className={styles.heroNav}>
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`${styles.heroDot} ${idx === current ? styles.heroDotActive : ""}`}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      </div>
    );
  };

  // Helper to render a single card (Premium Card Style)
  const renderCard = (c) => {
    const k = courseKey(c);
    const isSelected = selectedKeys.has(k);
    const anchorId = `${safeUpper(c?.subject)}-${safeUpper(c?.catalogue)}`;
    const descHref = `/pages/courses/descriptions#${anchorId}`;
    const vibes = getVibeTags(c?.subject, c?.title);

    return (
      <div key={k} className={`card ${isSelected ? styles.cardSelected : ""}`} style={{
        display: "flex", flexDirection: "column", padding: "0",
        minWidth: isDefaultView ? "340px" : undefined,
        maxWidth: isDefaultView ? "340px" : undefined,
      }}>
        {/* Card Header / Gradient Strip */}
        <div className={styles.cardHeaderStrip}></div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1, gap: "12px" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div className={styles.courseCodeBadge}>
              {c?.subject} {c?.catalogue}
            </div>
            {isSelected &&
              <div className={styles.animPop} style={{
                color: "#10b981", fontSize: "11px", fontWeight: "800",
                textTransform: "uppercase", letterSpacing: "0.05em",
                background: "rgba(16, 185, 129, 0.1)", padding: "4px 8px", borderRadius: "99px"
              }}>
                Added
              </div>
            }
          </div>

          <div className={styles.cardTitle}>
            {c?.title}
          </div>

          {/* Vibe Tags & Info */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
            {vibes.map((v, i) => (
              <span key={i} className={`${styles.vibeTag} ${styles[v.type]}`}>{v.label}</span>
            ))}
          </div>

          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {(c?.credits ?? "-")} Credits
            </div>
            {c?.term && (
              <div className={styles.metaItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                {c.term}
              </div>
            )}
          </div>

          {/* Actions Footer */}
          <div className={styles.cardActions}>
            <div className={isSelected ? styles.animPop : ""}>
              <AddButton
                onAdd={() => addToPlanner(c)}
                onRemove={() => removeFromPlanner(c)}
                isAdded={isSelected}
              />
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <a className={styles.iconAction} href={descHref} title="View Details">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </a>
              <a className={styles.iconAction} href={`/pages/tree?code=${c.subject}-${c.catalogue}`} title="View Prerequisite Tree">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><line x1="14" y1="21" x2="14" y2="8"></line></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className={styles.wrap}>
      {/* Scroll to Top Button */}
      <button
        className={`${styles.scrollTopBtn} ${showTopBtn ? styles.visible : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>

      <div className={styles.head}>
        <h1 className="h2" style={{ fontFamily: "var(--font-outfit)" }}>Courses</h1>
      </div>

      {isDefaultView && <SpotlightHero />}

      <FiltersInline
        subjects={subjects}
        onApply={(q) => router.push(`/pages/courses?${q}`)}
      />

      {loading ? (
        <p className="body" style={{ textAlign: "center", padding: "40px", opacity: 0.6 }}>Loading Catalog…</p>
      ) : data.length === 0 ? (
        <p className="body" style={{ textAlign: "center", padding: "40px" }}>No results found. Try adjusting your filters.</p>
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
                            <span className={styles.countBadge}>
                              {subj.count} Courses
                            </span>
                          </h3>
                          <div className={styles.rowWrapper}>
                            <div className={styles.categoryRow}>
                              {subj.courses.map(renderCard)}
                            </div>
                            <div className={styles.scrollHint}>
                              Swipe →
                            </div>
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
