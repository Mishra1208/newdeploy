"use client";

import { useEffect, useState } from "react";
import { exportPlannerToExcel } from "@/lib/exportPlannerExcel";
import styles from "./planner.module.css";

const KEY = "conu-planner:selected";

/* ------------------------------- helpers -------------------------------- */
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

/* -------------------------------- page ----------------------------------- */
export default function PlannerPage() {
  const [items, setItems] = useState([]);
  const [exporting, setExporting] = useState(false);

  // Drag & Drop State
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverTerm, setDragOverTerm] = useState(null);

  // Load and refresh logic
  const refresh = () => {
    const raw = loadList();
    const clean = dedupeByOffering(raw);
    if (clean.length !== raw.length) saveList(clean);
    setItems(clean);
  };

  useEffect(() => {
    refresh();
    const onStorage = (e) => { if (!e || e.key === KEY) refresh(); };
    const onPlannerUpdate = () => refresh();
    const onVisible = () => { if (!document.hidden) refresh(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("planner:update", onPlannerUpdate);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("planner:update", onPlannerUpdate);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  function removeOffering(offering) {
    const k = courseKey(offering);
    const next = loadList().filter((it) => courseKey(it) !== k);
    saveList(next);
    setItems(next);
    broadcastPlannerChange();
  }

  // --- Drag & Drop Handlers ---

  function handleDragStart(e, course) {
    setDraggedItem(course);
    e.dataTransfer.effectAllowed = "move";
    // Set transparent drag image or use default
    e.dataTransfer.setData("text/plain", JSON.stringify(course));
    // Optional: Add a class for styling
  }

  function handleDragOver(e, term) {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
    if (dragOverTerm !== term) {
      setDragOverTerm(term);
    }
  }

  function handleDragLeave(e) {
    // Basic clearing. Ideally check if leaving the specific drop zone.
    // For simplicity, we clear dragOverTerm on Drop or DragEnd
  }

  function handleDrop(e, targetTerm) {
    e.preventDefault();
    setDragOverTerm(null);

    if (!draggedItem) return;

    // Logic: Remove old instance, add new instance with updated term
    const oldKey = courseKey(draggedItem);

    // Create new object
    const newItem = { ...draggedItem, term: targetTerm };
    const newKey = courseKey(newItem);

    // Filter out old instance
    const others = items.filter(it => courseKey(it) !== oldKey);

    // Check if duplicate in target term (optional, but good practice)
    const exists = others.some(it => courseKey(it) === newKey);

    let nextItems;
    if (exists) {
      // If it exists, just remove the old one (merging)
      nextItems = others;
    } else {
      nextItems = [...others, newItem];
    }

    saveList(nextItems);
    setItems(nextItems);
    broadcastPlannerChange();
    setDraggedItem(null);
  }

  function handleDragEnd() {
    setDraggedItem(null);
    setDragOverTerm(null);
  }

  async function handleClearAll() {
    if (window.confirm("Are you sure you want to remove all courses from your planner?")) {
      saveList([]);
      setItems([]);
      broadcastPlannerChange();
    }
  }

  async function handleExport() {
    try {
      setExporting(true);
      await exportPlannerToExcel(items);
    } finally {
      setExporting(false);
    }
  }

  // Group by Term
  const byTerm = { Fall: [], Winter: [], Summer: [], Others: [] };
  let totalCredits = 0;

  items.forEach(c => {
    const cr = parseFloat(c.credits) || 0;
    totalCredits += cr;

    // Normalize term
    const t = (c.term || "").trim();
    if (/Fall/i.test(t)) byTerm.Fall.push(c);
    else if (/Winter/i.test(t)) byTerm.Winter.push(c);
    else if (/Summer/i.test(t)) byTerm.Summer.push(c);
    else byTerm.Others.push(c);
  });

  const termOrder = ["Fall", "Winter", "Summer", "Others"];

  return (
    <main className={styles.wrap}>
      <header className={styles.head}>
        <div>
          <h1 className="h2" style={{ marginBottom: 4 }}>My Planner</h1>
          <p className={styles.subtitle}>Build your perfect schedule</p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.ghostBtn}
            onClick={handleClearAll}
            disabled={!items.length}
          >
            Clear All
          </button>
          <button
            className={styles.exportBtn}
            onClick={handleExport}
            disabled={!items.length || exporting}
          >
            {exporting ? "Preparing…" : "Download Excel"}
          </button>
        </div>
      </header>

      {/* Overview Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Credits</div>
          <div className={styles.statValue}>{totalCredits.toFixed(1)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Courses</div>
          <div className={styles.statValue}>{items.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Terms</div>
          <div className={styles.statValue}>{Object.values(byTerm).filter(arr => 'length' in arr && arr.length > 0).length}</div>
        </div>
      </div>

      {/* Board Layout */}
      <div className={styles.board}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>
            <h3>Your planner is empty</h3>
            <p>Go to the Courses page to add some classes!</p>
          </div>
        ) : (
          termOrder.map(termKey => {
            const list = byTerm[termKey];
            if (list.length === 0 && termKey === "Others") return null; // hide others if empty

            // Calc credits per term
            const termCreds = list.reduce((acc, c) => acc + (parseFloat(c.credits) || 0), 0);

            // Determine status
            let statusLabel = "N/A";
            let statusColor = "var(--ink-dim)";
            if (termCreds >= 15) { statusLabel = "Heavy Load"; statusColor = "#a78bfa"; }
            else if (termCreds >= 12) { statusLabel = "Full Time"; statusColor = "#22c55e"; }
            else if (termCreds > 0) { statusLabel = "Part Time"; statusColor = "#fca5a5"; }

            const isOver = dragOverTerm === termKey;

            return (
              <div
                key={termKey}
                className={`${styles.column} ${isOver ? styles.columnDragOver : ""}`}
                onDragOver={(e) => handleDragOver(e, termKey)}
                onDrop={(e) => handleDrop(e, termKey)}
                onDragLeave={handleDragLeave}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 className={styles.colTitle} style={{ margin: 0 }}>
                    {termKey} <span className={styles.countBadge}>{list.length}</span>
                  </h3>
                  {list.length > 0 && <span style={{
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.05em', color: statusColor,
                    background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 6
                  }}>
                    {statusLabel}
                  </span>}
                </div>

                <div className={styles.colList}>
                  {list.length === 0 ? (
                    <div className={styles.emptySlot}>Drop here</div>
                  ) : (
                    list.map(c => {
                      const isDragging = draggedItem && courseKey(draggedItem) === courseKey(c);
                      return (
                        <div
                          key={courseKey(c)}
                          className={`${styles.card} ${isDragging ? styles.cardDragging : ""}`}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, c)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className={styles.cardHead}>
                            <span className={styles.code}>{c.subject} {c.catalogue}</span>
                            <span className={styles.credits}>{c.credits} cr</span>
                          </div>
                          <div className={styles.cardTitle}>{c.title}</div>
                          {c.session && c.session !== "N/A" && <div className={styles.cardMeta}>{c.session}</div>}
                          <button className={styles.removeBtn} onClick={() => removeOffering(c)}>
                            Remove
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </main>
  );
}