"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import styles from "./descriptions.module.css";
import { motion, AnimatePresence } from "framer-motion";
import TiltCard from "@/components/widgets/TiltCard";

/* helpers */
const anchorIdFor = (r) =>
  `${(r?.subject || "").toUpperCase()}-${(r?.catalogue || "").toUpperCase()}`;

/* --- CSV PARSER (Keep existing logic) --- */
function parseCSV(text) {
  const rows = [];
  let i = 0, cell = "", inQ = false, row = [];
  while (i < text.length) {
    const ch = text[i], nx = text[i + 1];
    if (inQ) {
      if (ch === '"' && nx === '"') { cell += '"'; i += 2; continue; }
      if (ch === '"') { inQ = false; i++; continue; }
      cell += ch; i++; continue;
    }
    if (ch === '"') { inQ = true; i++; continue; }
    if (ch === ",") { row.push(cell); cell = ""; i++; continue; }
    if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; i++; continue; }
    if (ch === "\r") { i++; continue; }
    cell += ch; i++;
  }
  row.push(cell); rows.push(row);
  const header = rows.shift().map((h) => h.trim());
  return rows
    .filter((r) => r.length && r.some(Boolean))
    .map((r) => Object.fromEntries(header.map((h, idx) => [h, r[idx] ?? ""])));
}

const norm = (v) => (typeof v === "string" ? v.trim() : v);
const pick = (row, keys) => {
  for (const k of keys) {
    if (row[k] != null && String(row[k]).trim() !== "") return norm(row[k]);
  }
  return undefined;
};
const parseCredits = (v) => {
  if (v == null) return 0;
  const m = String(v).replace(",", ".").match(/[0-9]+(\.[0-9]+)?/);
  return m ? Number.parseFloat(m[0]) : 0;
};
const longer = (a = "", b = "") =>
  (String(a).trim().length >= String(b).trim().length ? a : b);

function sniffDescriptionFromAnyCell(row, { avoid = [] } = {}) {
  let best = "";
  for (const [_, v] of Object.entries(row)) {
    const s = String(v || "").trim();
    if (!s) continue;
    if (avoid.includes(s)) continue;
    const looks = (s.length >= 60) && /[\.!?]\s/.test(s) && /\s/.test(s);
    if (!looks) continue;
    if (s.length > best.length) best = s;
  }
  return best;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function DescriptionsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [visibleCount, setVisibleCount] = useState(40);

  // Manual Load More Logic
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 50);
  };

  // Load Data
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const text = await fetch("/courses_merged.csv", { cache: "no-store" }).then((r) => r.text());
        if (!alive) return;

        const raw = parseCSV(text);

        // Normalize
        const normalized = raw.map((r) => {
          const subject = (pick(r, ["subject", "Subject", "SUBJECT"]) || "").toString().toUpperCase();
          const catalogue = (pick(r, ["catalogue", "Catalogue", "catalog", "number", "catalogue_number"]) || "").toString().trim();
          let title = pick(r, ["title", "Title", "course_title", "course_name_short"]) || "";
          const rawCourseName = pick(r, ["course_name"]) || "";
          if (!title && rawCourseName && rawCourseName.trim().length <= 80) title = rawCourseName.trim();
          const credits = parseCredits(pick(r, ["credits", "Credits", "course_credit"]));
          let description = pick(r, ["description", "Description", "course_description", "calendar_description", "long_description", "desc"]) || "";
          if (!description && rawCourseName && rawCourseName.trim().length > 80) description = rawCourseName.trim();
          const prereq = pick(r, ["prereqdescription", "prerequisite", "Prerequisite", "corequisite"]) || "";
          const equivalent = pick(r, ["equivalent", "Equivalent", "course_equivalent"]) || "";
          if (!String(description).trim()) description = sniffDescriptionFromAnyCell(r, { avoid: [title, prereq, equivalent].filter(Boolean) });
          if (!subject || !catalogue || !title) return null;
          return { subject, catalogue, title: String(title).trim(), credits: Number.isFinite(credits) ? credits : 0, description: String(description || "").trim(), prereqdescription: String(prereq || "").trim(), equivalent_course_description: String(equivalent || "").trim() };
        }).filter(Boolean);

        // Dedupe
        const map = new Map();
        for (const r of normalized) {
          const key = `${r.subject}-${r.catalogue}`.toUpperCase();
          const prev = map.get(key);
          if (!prev) map.set(key, r);
          else map.set(key, { ...prev, title: longer(prev.title, r.title), description: longer(prev.description, r.description), prereqdescription: longer(prev.prereqdescription, r.prereqdescription), equivalent_course_description: longer(prev.equivalent_course_description, r.equivalent_course_description) });
        }

        const arr = Array.from(map.values()).sort((a, b) => `${a.subject} ${a.catalogue}`.localeCompare(`${b.subject} ${b.catalogue}`, "en", { numeric: true }));
        setItems(arr);
        setLoading(false);

        // Check hash for direct open
        const hash = decodeURIComponent((window.location.hash || "").slice(1));
        if (hash) {
          const match = arr.find(x => anchorIdFor(x) === hash);
          if (match) setSelectedCourse(match);
        }

      } catch (e) {
        console.error("CSV Load Failed", e);
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Filter Logic
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    const lower = searchTerm.toLowerCase();
    return items.filter(i =>
      `${i.subject} ${i.catalogue}`.toLowerCase().includes(lower) ||
      i.title.toLowerCase().includes(lower)
    );
  }, [items, searchTerm]);

  // Open Modal
  const handleCardClick = (course) => {
    setSelectedCourse(course);
    // Update hash silently
    history.replaceState(null, "", `#${anchorIdFor(course)}`);
  };

  // Close Modal
  const closeModal = () => {
    setSelectedCourse(null);
    history.replaceState(null, "", location.pathname + location.search);
  };

  // Scroll to Top Logic
  const [showTopBtn, setShowTopBtn] = useState(false);
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

      {/* Hero Section */}
      <motion.div
        className={styles.hero}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className={styles.title}>Course Directory</h1>
        <p className={styles.subtitle}>Access the complete academic archive of Concordia University. Over 12,000 courses at your fingertips.</p>
      </motion.div>

      {/* Sticky Search */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by code, title, or keywords..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setVisibleCount(40); // Reset scroll on search
          }}
        />
        <div className={styles.searchIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className={styles.loading}>
          <div>Loading Archive...</div>
        </div>
      ) : (
        <motion.div
          className={styles.grid}
          key={searchTerm} // Force re-animate on search
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {filteredItems.slice(0, visibleCount).map((course, idx) => {
            return (
              <motion.div
                key={anchorIdFor(course)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div /* Replaced TiltCard with standard Div for cleaner glass look */
                  className={styles.card}
                  onClick={() => handleCardClick(course)}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.codeBadge}>{course.subject} {course.catalogue}</span>
                    <h3 className={styles.courseTitle}>{course.title}</h3>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.descriptionPreview}>
                      {course.description || "No description available."}
                    </p>

                    <div className={styles.footerRow}>
                      <span className={styles.creditsBadge}>{course.credits} Credits</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Load More Button */}
      {!loading && visibleCount < filteredItems.length && (
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
            Load More Courses ↓
          </button>
        </div>
      )}

      {/* Detail Modal - Dossier Style */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            className={styles.modalOverlay}
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modalContent}
              onClick={e => e.stopPropagation()}
              initial={{ x: "100%" }}
              animate={{ x: 0, transition: { type: "spring", damping: 25, stiffness: 200 } }}
              exit={{ x: "100%" }}
            >
              <div className={styles.modalHeader}>
                <button className={styles.modalClose} onClick={closeModal}>✕</button>
                <div className={styles.modalSubtitle}>Course Dossier</div>
                <h2 className={styles.modalTitle}>{selectedCourse.title}</h2>
                <div style={{ marginTop: '8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span className={styles.codeBadge}>{selectedCourse.subject} {selectedCourse.catalogue}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#666' }}>{selectedCourse.credits} Credits</span>
                </div>
              </div>

              <div className={styles.modalBody}>
                <p className={styles.modalP}>{selectedCourse.description || "No description info available for this course."}</p>

                {selectedCourse.prereqdescription && (
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Prerequisites / Corequisites</span>
                    <div style={{ lineHeight: 1.6, fontSize: '0.95rem', color: '#444' }}>{selectedCourse.prereqdescription}</div>
                  </div>
                )}

                {selectedCourse.equivalent_course_description && (
                  <div className={styles.infoBlock}>
                    <span className={styles.infoLabel}>Equivalencies</span>
                    <div style={{ lineHeight: 1.6, fontSize: '0.95rem', color: '#444' }}>{selectedCourse.equivalent_course_description}</div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                  <button
                    className={styles.primaryBtn}
                    onClick={() => {
                      const query = `${selectedCourse.subject} ${selectedCourse.catalogue}`.replace(" ", "+");
                      window.open(`/pages/courses?search=${query}&minCredits=0&maxCredits=6`, '_blank');
                    }}
                  >
                    Add to Planner
                  </button>

                  <button
                    className={styles.secondaryBtn}
                    onClick={() => window.location.href = `/pages/tree?code=${selectedCourse.subject}-${selectedCourse.catalogue}`}
                  >
                    View Graph ↗
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
