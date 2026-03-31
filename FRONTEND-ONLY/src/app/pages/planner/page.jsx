"use client";

import { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { exportPlannerToExcel } from "@/lib/exportPlannerExcel";
import Link from "next/link";
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
  const [downloadStatus, setDownloadStatus] = useState("idle"); // idle | downloading | downloaded
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const isBeta = searchParams.get("beta") === "true";
  const [hydrated, setHydrated] = useState(false);

  // --- Cloud Sync Helper ---
  const handleUpdate = (newItems) => {
    // 1. Local Persistence
    saveList(newItems);
    setItems(newItems);
    broadcastPlannerChange();

    // 2. Cloud Persistence (if logged in)
    if (isLoaded && user) {
      user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          planner: newItems
        }
      }).catch(err => console.error("Cloud Sync Error:", err));
    }
  };

  // --- Hydrate from Cloud on Login (ONCE) ---
  useEffect(() => {
    if (isLoaded && user && !hydrated) {
      const cloudData = user.unsafeMetadata?.planner;
      if (Array.isArray(cloudData) && cloudData.length > 0) {
        console.log("☁️ Restoring Planner from Cloud:", cloudData.length, "items");
        saveList(cloudData);
        setItems(cloudData);
      }
      setHydrated(true);
    }
  }, [isLoaded, user, hydrated]);

  // Drag & Drop State
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverTerm, setDragOverTerm] = useState(null);

  // Load and refresh logic
  // Load and refresh logic
  const refresh = () => {
    const raw = loadList();
    const clean = dedupeByOffering(raw);
    // Note: We don't push to cloud here to avoid infinite loops or overwriting cloud with stale local data on mount
    if (clean.length !== raw.length) saveList(clean);
    setItems(clean);
  };

  useEffect(() => {
    refresh();
    const onStorage = (e) => { if (!e || e.key === KEY) refresh(); };
    const onPlannerUpdate = () => {
      refresh();
      // Reset download status on any change
      setDownloadStatus("idle");
    };
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
    handleUpdate(next);
  }

  // --- Drag & Drop Handlers ---

  function handleDragStart(e, course) {
    setDraggedItem(course);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", JSON.stringify(course));
  }

  function handleDragOver(e, term) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverTerm !== term) {
      setDragOverTerm(term);
    }
  }

  function handleDragLeave() {
    // For simplicity, we clear dragOverTerm on Drop or DragEnd
  }

  function handleDrop(e, targetTerm) {
    e.preventDefault();
    setDragOverTerm(null);

    if (!draggedItem) return;

    const oldKey = courseKey(draggedItem);
    const newItem = { ...draggedItem, term: targetTerm };
    const newKey = courseKey(newItem);
    const others = items.filter(it => courseKey(it) !== oldKey);
    const exists = others.some(it => courseKey(it) === newKey);

    let nextItems;
    if (exists) {
      nextItems = others;
    } else {
      nextItems = [...others, newItem];
    }

    if (exists) {
      nextItems = others;
    } else {
      nextItems = [...others, newItem];
    }

    handleUpdate(nextItems);
    setDraggedItem(null);
  }

  function handleDragEnd() {
    setDraggedItem(null);
    setDragOverTerm(null);
  }

  async function handleClearAll() {
    if (window.confirm("Are you sure you want to remove all courses from your planner?")) {
      handleUpdate([]);
    }
  }

  async function handleExport() {
    try {
      setDownloadStatus("downloading");
      await exportPlannerToExcel(items);
      // Artificial delay for better UX if it's too fast
      await new Promise(r => setTimeout(r, 800));
      setDownloadStatus("downloaded");
    } catch (e) {
      console.error(e);
      setDownloadStatus("idle");
      alert("Export failed. Please try again.");
    }
  }

  const handleSaveProgress = () => {
    router.push('/login');
  };

  const getButtonText = () => {
    switch (downloadStatus) {
      case "downloading": return "Downloading...";
      case "downloaded": return "Downloaded ✓";
      default: return "Export to Excel";
    }
  };

  const isExportDisabled = !items.length || downloadStatus === "downloading" || downloadStatus === "downloaded";

  // Group by Term
  const byTerm = { Fall: [], Winter: [], Summer: [], Others: [] };
  let totalCredits = 0;

  const getNextTerm = (t) => {
    if (/Fall/i.test(t)) return "Winter";
    if (/Winter/i.test(t)) return "Summer";
    return "Others";
  };

  items.forEach(c => {
    const rawCreds = parseFloat(c.credits) || 0;
    totalCredits += rawCreds;

    const t = (c.term || "").trim();
    let targetTerm = "Others";
    if (/Fall/i.test(t)) targetTerm = "Fall";
    else if (/Winter/i.test(t)) targetTerm = "Winter";
    else if (/Summer/i.test(t)) targetTerm = "Summer";

    if (rawCreds >= 5.5) {
      byTerm[targetTerm].push({
        ...c,
        credits: 3,
        isSplit: true,
        splitPart: 1,
        displayTitle: "(Part 1)"
      });

      const nextT = getNextTerm(targetTerm);
      byTerm[nextT].push({
        ...c,
        id: `virtual-${c.id || c.title}`,
        term: nextT,
        credits: 3,
        isSplit: true,
        splitPart: 2,
        isVirtual: true,
        displayTitle: "(Part 2)"
      });
    } else {
      byTerm[targetTerm].push(c);
    }
  });

  const termOrder = ["Fall", "Winter", "Summer", "Others"];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      {/* Premium Background Decor */}
      {/* Premium Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#912338] dark:bg-violet-600 opacity-[0.03] dark:opacity-[0.2] rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-[#C5A059] dark:bg-pink-500 opacity-[0.05] dark:opacity-[0.15] rounded-full blur-[100px]" />
        {/* Extra center glow for depth */}
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-[#912338] dark:bg-violet-900 opacity-[0.02] dark:opacity-[0.2] rounded-full blur-[140px]" />
      </div>

      <motion.main
        className={styles.wrap}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 10 }}
      >
        <header className={styles.head}>
          <div>
            <h1 className="h1">My Planner</h1>
            <p className={styles.subtitle}>Curate your academic journey with precision.</p>
          </div>
          <div className={styles.actions}>
            <div style={{ marginRight: 8 }}>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            <SignedIn>
              <button
                className={styles.ghostBtn}
                onClick={() => alert("Cloud Sync is active! Your data is safe.")}
                style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.2)' }}
              >
                Sync Active
              </button>
            </SignedIn>

            <SignedOut>
              <button className={styles.ghostBtn} onClick={handleSaveProgress}>
                Cloud Sync (Login)
              </button>
            </SignedOut>

            <button
              className={styles.ghostBtn}
              onClick={handleClearAll}
              disabled={!items.length}
            >
              Clear Board
            </button>

            <button
              className={`${styles.exportBtn} ${downloadStatus === 'downloaded' ? styles.downloaded : ''}`}
              onClick={handleExport}
              disabled={isExportDisabled}
            >
              {getButtonText()}
            </button>
          </div>
        </header>

        {/* Schedule Engine Bridge Banner (Hidden from public, visible with ?beta=true) */}
        {isBeta && (
          <motion.div 
             className="w-full bg-gradient-to-r from-[#912338]/90 via-[#7a1d2f] to-[#912338]/90 p-[1px] rounded-2xl mb-8 shadow-lg shadow-rose-900/10"
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
          >
             <div className="bg-white rounded-[15px] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
               {/* Subtle internal gradient glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl opacity-50 pointer-events-none -mr-20 -mt-20"></div>

               <div className="z-10 max-w-2xl">
                  <div className="flex items-center gap-3 mb-2">
                     <h2 className="text-2xl font-black text-[#912338] tracking-tight">Ready to plot your schedule?</h2>
                     <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">NEW</span>
                  </div>
                  <p className="text-gray-600 font-medium">
                    You've planned your degree—now visualize your literal week. Import exactly what you created here into the all-new <strong>Schedule Engine</strong>. It features live seating capacities, professor ratings, intelligent prerequisite scanning, and a visual drag-and-drop Cartesian calendar!
                  </p>
               </div>
               
               <div className="z-10 shrink-0">
                  <Link href="/pages/schedule-builder">
                    <button className="px-8 py-4 bg-[#912338] hover:bg-[#7a1d2f] text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-xl hover:-translate-y-1 flex items-center gap-2 text-sm whitespace-nowrap">
                      Launch Engine 🚀
                    </button>
                  </Link>
               </div>
             </div>
          </motion.div>
        )}

        {/* Stats Section */}
        < div className={styles.statsRow} >
          {
            [
              { label: "Total Credits", value: totalCredits.toFixed(1), icon: "🎓" },
              { label: "Courses Added", value: items.length, icon: "📚" },
              { label: "Active Semesters", value: Object.values(byTerm).filter(a => a.length).length, icon: "🗓️" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className={styles.statCard}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className={styles.statLabel}>{stat.label}</span>
                <div className={styles.statValue}>{stat.value}</div>
              </motion.div>
            ))
          }
        </div >

        <div className={styles.board}>
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                key="empty"
                className={styles.emptyState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.emptyIcon}>✨</div>
                <h3>Your whiteboard is clean</h3>
                <p>Explore our catalog and find the perfect courses for your degree.</p>
                <Link href="/pages/courses" className={styles.exportBtn}>
                  Browse Courses
                </Link>
              </motion.div>
            ) : (
              termOrder.map(termKey => {
                const list = byTerm[termKey];
                if (list.length === 0 && termKey === "Others") return null;

                const termCreds = list.reduce((acc, c) => acc + (parseFloat(c.credits) || 0), 0);
                let statusLabel = "N/A";
                let statusColor = "var(--ink-dim)";
                if (termCreds >= 15) { statusLabel = "Heavy Load"; statusColor = "#a78bfa"; }
                else if (termCreds >= 12) { statusLabel = "Full Time"; statusColor = "#22c55e"; }
                else if (termCreds > 0) { statusLabel = "Part Time"; statusColor = "#fca5a5"; }

                const isOver = dragOverTerm === termKey;

                return (
                  <motion.div
                    key={termKey}
                    layout
                    className={`${styles.column} ${isOver ? styles.columnDragOver : ""}`}
                    onDragOver={(e) => handleDragOver(e, termKey)}
                    onDrop={(e) => handleDrop(e, termKey)}
                    onDragLeave={handleDragLeave}
                  >
                    <div className={styles.colHeader}>
                      <h3 className={styles.colTitle}>
                        {termKey} <span className={styles.countBadge}>{list.length}</span>
                      </h3>
                      {list.length > 0 && (
                        <span style={{
                          fontSize: 10, fontWeight: 800, color: statusColor,
                          background: `${statusColor}15`, padding: '4px 8px', borderRadius: 8
                        }}>
                          {statusLabel}
                        </span>
                      )}
                    </div>

                    <motion.div className={styles.colList} layout>
                      <AnimatePresence mode="popLayout">
                        {list.length === 0 ? (
                          <motion.div
                            key={`empty-${termKey}`}
                            className={styles.emptySlot}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            Drop Courses Here
                          </motion.div>
                        ) : (
                          list.map(c => (
                            <motion.div
                              key={courseKey(c)}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className={`${styles.card} ${draggedItem && courseKey(draggedItem) === courseKey(c) ? styles.cardDragging : ""}`}
                              draggable={true}
                              onDragStart={(e) => handleDragStart(e, c)}
                              onDragEnd={handleDragEnd}
                            >
                              <div className={styles.cardHead}>
                                <span className={styles.code}>{c.subject} {c.catalogue}</span>
                                <span className={styles.credits}>{c.credits} CR</span>
                              </div>
                              <div className={styles.cardTitle}>
                                {c.title}
                                {c.displayTitle && <span style={{ opacity: 0.5, fontSize: '0.8em', marginLeft: 4 }}>{c.displayTitle}</span>}
                              </div>
                              {c.session && c.session !== "N/A" && <div className={styles.cardMeta}>{c.session}</div>}
                              {!c.isVirtual && (
                                <button className={styles.removeBtn} onClick={() => removeOffering(c)}>
                                  Remove Offering
                                </button>
                              )}
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </motion.main >
    </div >
  );
}