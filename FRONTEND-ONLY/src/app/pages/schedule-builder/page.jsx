"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShineBorder } from "@/components/ui/ShineBorder";
import { toPng } from "html-to-image";

const COURSE_COLORS = [
  { bg: "bg-[#f8f1e6] dark:bg-amber-900/30", border: "border-[#C5A059] dark:border-amber-500/50", borderSide: "border-l-[#C5A059] dark:border-l-amber-500", text: "text-amber-900 dark:text-amber-300", vibrantBg: "bg-[#fffbeb]", vibrantText: "text-amber-900", vibrantBorder: "border-amber-200" },
  { bg: "bg-blue-50 dark:bg-blue-900/30", border: "border-blue-400 dark:border-blue-500/50", borderSide: "border-l-blue-500 dark:border-l-blue-400", text: "text-blue-900 dark:text-blue-300", vibrantBg: "bg-blue-50", vibrantText: "text-blue-900", vibrantBorder: "border-blue-200" },
  { bg: "bg-emerald-50 dark:bg-emerald-900/30", border: "border-emerald-400 dark:border-emerald-500/50", borderSide: "border-l-emerald-500 dark:border-l-emerald-400", text: "text-emerald-900 dark:text-emerald-300", vibrantBg: "bg-emerald-50", vibrantText: "text-emerald-900", vibrantBorder: "border-emerald-200" },
  { bg: "bg-purple-50 dark:bg-purple-900/30", border: "border-purple-400 dark:border-purple-500/50", borderSide: "border-l-purple-500 dark:border-l-purple-400", text: "text-purple-900 dark:text-purple-300", vibrantBg: "bg-purple-50", vibrantText: "text-purple-900", vibrantBorder: "border-purple-200" },
  { bg: "bg-rose-50 dark:bg-rose-900/30", border: "border-rose-400 dark:border-rose-500/50", borderSide: "border-l-rose-500 dark:border-l-rose-400", text: "text-rose-900 dark:text-rose-300", vibrantBg: "bg-rose-50", vibrantText: "text-rose-900", vibrantBorder: "border-rose-200" },
  { bg: "bg-indigo-50 dark:bg-indigo-900/30", border: "border-indigo-400 dark:border-indigo-500/50", borderSide: "border-l-indigo-500 dark:border-l-indigo-400", text: "text-indigo-900 dark:text-indigo-300", vibrantBg: "bg-indigo-50", vibrantText: "text-indigo-900", vibrantBorder: "border-indigo-200" },
  { bg: "bg-orange-50 dark:bg-orange-900/30", border: "border-orange-400 dark:border-orange-500/50", borderSide: "border-l-orange-500 dark:border-l-orange-400", text: "text-orange-900 dark:text-orange-300", vibrantBg: "bg-orange-50", vibrantText: "text-orange-900", vibrantBorder: "border-orange-200" },
];

export default function ScheduleBuilderBeta() {
  const { user, isLoaded } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [gridItems, setGridItems] = useState([]);
  const [clashingIds, setClashingIds] = useState(new Set());
  const [isFetching, setIsFetching] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(""); // "" | "extension" | "api"
  const [isExporting, setIsExporting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("cart"); // "cart" | "schedule"

  const fetchTimeoutRef = useRef(null);
  const deepTimeoutRef = useRef(null);
  const [deepFetching, setDeepFetching] = useState(null);
  const deepTargetRef = useRef(null);
  const calendarRef = useRef(null);
  const exportRef = useRef(null);

  // Resize listener
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Professional PNG Export Engine (High-Res Snapshot)
  const handleExportPNG = () => {
    setIsExporting(true);
    setTimeout(async () => {
      if (exportRef.current === null) {
          setIsExporting(false);
          alert("Export engine failed to initialize.");
          return;
      }
      try {
        const dataUrl = await toPng(exportRef.current, { 
          cacheBust: true, 
          backgroundColor: '#ffffff',
          pixelRatio: 3,
          style: { 
            opacity: '1',
            visibility: 'visible',
            position: 'relative',
            left: '0'
          }
        });
        const link = document.createElement('a');
        link.download = `conuplanner-schedule-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Snapshot Engine failed:', err);
        alert('Failed to capture schedule image. Please try again.');
      } finally {
        setIsExporting(false);
      }
    }, 300);
  };

  // Directory Loader
  const [courseDirectory, setCourseDirectory] = useState({});
  useEffect(() => {
    fetch('/course_index.json')
      .then(r => r.json())
      .then(d => {
        const dict = {};
        if (d.list) { d.list.forEach(c => dict[c.code] = c.title); }
        setCourseDirectory(dict);
      })
      .catch(e => console.error(e));
  }, []);

  // De-Hydration State Management
  const [hydrated, setHydrated] = useState(false);
  const ENGINE_KEY = "conu-engine:selected";

  useEffect(() => {
    if (isLoaded && !hydrated) {
      if (user) {
        const cloudData = user.unsafeMetadata?.scheduleEngine;
        if (cloudData) {
          setCartItems(cloudData.cartItems || []);
          setGridItems(cloudData.gridItems || []);
        } else {
          try {
            const local = JSON.parse(localStorage.getItem(ENGINE_KEY));
            if (local) { setCartItems(local.cartItems || []); setGridItems(local.gridItems || []); }
          } catch (e) {}
        }
      } else {
        try {
          const local = JSON.parse(localStorage.getItem(ENGINE_KEY));
          if (local) { setCartItems(local.cartItems || []); setGridItems(local.gridItems || []); }
        } catch (e) {}
      }
      setHydrated(true);
    }
  }, [isLoaded, user, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const payload = { cartItems, gridItems };
    localStorage.setItem(ENGINE_KEY, JSON.stringify(payload));
    const syncTimer = setTimeout(() => {
      if (isLoaded && user) {
        user.update({ unsafeMetadata: { ...user.unsafeMetadata, scheduleEngine: payload } }).catch(err => console.error("Engine Sync Error", err));
      }
    }, 2000);
    return () => clearTimeout(syncTimer);
  }, [cartItems, gridItems, hydrated, isLoaded, user]);

  const [searchSubject, setSearchSubject] = useState("");
  const [searchCatalog, setSearchCatalog] = useState("");
  const [searchTerm, setSearchTerm] = useState("Summer 2026");
  const [availableTerms] = useState(["Summer 2026", "Fall 2026", "Fall/Winter 2026-27", "Winter 2027"]);
  const [isFetchingTerms] = useState(false);
  const lastSearchRef = useRef({ subject: "", catalog: "", term: "" });

  const courseColorsMap = useMemo(() => {
     const codesSet = new Set();
     [...cartItems, ...gridItems].forEach(item => { if (item.courseCode) codesSet.add(item.courseCode); });
     const uniqueCodes = Array.from(codesSet).sort(); 
     const map = {};
     uniqueCodes.forEach((code, i) => { map[code] = COURSE_COLORS[i % COURSE_COLORS.length]; });
     return map;
  }, [cartItems, gridItems]);

  const termMap = { "Summer 2026": "2261", "Fall 2026": "2262", "Fall/Winter 2026-27": "2263", "Winter 2027": "2264" };
  const [expandedFolders, setExpandedFolders] = useState({});

  const START_HOUR = 8;
  const END_HOUR = 24;
  const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
  
  const DAYS = [ { id: "Mo", label: "Mon" }, { id: "Tu", label: "Tue" }, { id: "We", label: "Wed" }, { id: "Th", label: "Thu" }, { id: "Fr", label: "Fri" } ];

  const getMinutesFromStart = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const clean = timeStr.replace(/\s+/g, '').toUpperCase();
    const match = clean.match(/^(\d{1,2}):(\d{2})(AM|PM)?$/);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3];
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return Math.max(0, (hours * 60 + minutes) - (START_HOUR * 60));
  };

  const visibleCartItems = cartItems.filter(item => item.term === searchTerm);
  const visibleGridItems = gridItems.filter(item => item.term === searchTerm);

  const cartGroups = visibleCartItems.reduce((acc, item) => {
    const code = item.courseCode || "Unknown";
    if (!acc[code]) acc[code] = [];
    acc[code].push(item);
    return acc;
  }, {});

  useEffect(() => {
    const clashes = new Set();
    for (let i = 0; i < visibleGridItems.length; i++) {
      for (let j = i + 1; j < visibleGridItems.length; j++) {
        const itemA = visibleGridItems[i];
        const itemB = visibleGridItems[j];
        if (!itemA.days || !itemB.days) continue;
        const sharedDays = DAYS.some(d => itemA.days.includes(d.id) && itemB.days.includes(d.id));
        if (sharedDays) {
          const startA = getMinutesFromStart(itemA.startTime);
          const endA = getMinutesFromStart(itemA.endTime);
          const startB = getMinutesFromStart(itemB.startTime);
          const endB = getMinutesFromStart(itemB.endTime);
          if (startA < endB && endA > startB) { clashes.add(itemA.id); clashes.add(itemB.id); }
        }
      }
    }
    setClashingIds(clashes);
  }, [gridItems]);

  const handleDragStart = (e, item) => { e.dataTransfer.setData("application/json", JSON.stringify(item)); };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData("application/json");
    if (itemData) {
      const item = JSON.parse(itemData);
      setCartItems(prev => prev.filter(i => i.id !== item.id));
      setGridItems(prev => prev.find(i => i.id === item.id) ? prev : [...prev, item]);
    }
  };

  const handleRemoveFromGrid = (item) => {
    setGridItems(prev => prev.filter(i => i.id !== item.id));
    setCartItems(prev => [...prev, item]);
  };

  const fetchDeepDetails = (e, item) => {
      e.stopPropagation(); e.preventDefault();
      const parts = item.courseCode.split(" ");
      setDeepFetching(item.id);
      deepTargetRef.current = item.id;
      window.postMessage({ type: "FROM_CONUPLANNER_WEB_DEEP_FETCH", payload: { classId: item.id, subject: parts[0], catalogue: parts[1], term: item.term } }, "*");
      if (deepTimeoutRef.current) clearTimeout(deepTimeoutRef.current);
      deepTimeoutRef.current = setTimeout(() => { fallbackDeepFetch(item); }, isMobile ? 1500 : 3000);
  };

  const fallbackDeepFetch = async (item) => {
      const parts = item.courseCode.split(" ");
      const numericTerm = termMap[item.term] || "2261";
      try {
          const res = await fetch('/api/schedule/deep-fetch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ term: numericTerm, subject: parts[0], number: parts[1], classId: item.id }) });
          const result = await res.json();
          if (result.success && result.data) {
              const deepData = result.data;
              const mapDeepData = (arr) => arr.map(i => i.id === item.id ? { ...i, prerequisites: deepData.prerequisites || i.prerequisites, liveCapacity: deepData } : i);
              setCartItems(prev => mapDeepData(prev));
              setGridItems(prev => mapDeepData(prev));
          }
      } catch (err) {} finally { setDeepFetching(null); deepTargetRef.current = null; }
  };

  const toggleCartItem = (item) => {
      const isInGrid = gridItems.find(i => i.id === item.id);
      if (isInGrid) {
          setGridItems(prev => prev.filter(i => i.id !== item.id));
          setCartItems(prev => [...prev, item]);
      } else {
          if (item.prerequisites && item.prerequisites !== "None") {
              if (!window.confirm(`⚠️ PREREQUISITE LOCK:\n\n${item.prerequisites}\n\nConfirm you meet these rules?`)) return;
          }
          setCartItems(prev => prev.filter(i => i.id !== item.id));
          setGridItems(prev => prev.find(i => i.id === item.id) ? prev : [...prev, item]);
      }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "FROM_EXTENSION_DEEP_RESPONSE") {
          const targetId = deepTargetRef.current;
          setDeepFetching(null); deepTargetRef.current = null;
          if (event.data?.payload?.success && event.data.payload.data) {
              const deepData = event.data.payload.data;
              const mapDeepData = (arr) => arr.map(i => i.id === targetId ? { ...i, prerequisites: deepData.prerequisites || i.prerequisites, liveCapacity: deepData } : i);
              setCartItems(prev => mapDeepData(prev));
              setGridItems(prev => mapDeepData(prev));
          }
      }
      if (event.data?.type === "FROM_EXTENSION_RESPONSE") {
        if (fetchTimeoutRef.current) { clearTimeout(fetchTimeoutRef.current); fetchTimeoutRef.current = null; }
        setIsFetching(false); setFetchingStatus("");
        if (event.data?.payload?.success) {
           handleNewClasses(event.data.payload.data, `${lastSearchRef.current.subject} ${lastSearchRef.current.catalog}`, lastSearchRef.current.term);
        } else {
           alert(`Extension Error: ${event.data?.payload?.error || "Could not fetch data."}`);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [gridItems]);

  const triggerExtensionFetch = () => {
    if (!searchSubject || !searchCatalog) return;
    setIsFetching(true); setFetchingStatus("extension");
    lastSearchRef.current = { subject: searchSubject.toUpperCase(), catalog: searchCatalog, term: searchTerm };
    window.postMessage({ type: "FROM_CONUPLANNER_WEB_FETCH", payload: { subject: searchSubject.toUpperCase(), catalogue: searchCatalog, term: searchTerm } }, "*");
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    fetchTimeoutRef.current = setTimeout(() => { fallbackToApiFetch(); }, isMobile ? 1500 : 3000);
  };

  const fallbackToApiFetch = async () => {
      setFetchingStatus("api");
      const req = lastSearchRef.current;
      const numericTerm = termMap[req.term] || "2261";
      try {
          const res = await fetch('/api/check-seats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: req.subject, number: req.catalog, term: numericTerm }) });
          const data = await res.json();
          if (data.success && data.data) { handleNewClasses(data.data, `${req.subject} ${req.catalog}`, req.term); }
      } catch (err) {} finally { setIsFetching(false); setFetchingStatus(""); fetchTimeoutRef.current = null; }
  };

  const handleNewClasses = (newClasses, courseCode, searchContextTerm) => {
      if (!newClasses || newClasses.length === 0) return;
      setExpandedFolders(prev => ({ ...prev, [courseCode]: true }));
      setCartItems(prevCart => {
          const existingIds = new Set(prevCart.map(i => i.id));
          const gridIds = new Set(gridItems.map(i => i.id));
          const uniqueClasses = newClasses
             .filter(c => !existingIds.has(c.id) && !gridIds.has(c.id))
             .map(c => ({ ...c, courseCode, term: searchContextTerm }));
          return [...prevCart, ...uniqueClasses];
      });
  };

  return (
    <div className="relative h-screen w-full lg:overflow-hidden bg-[#f8f9fa] dark:bg-[#0a0a0a] transition-colors duration-300 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#912338] dark:bg-purple-900 opacity-[0.03] blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-[#C5A059] dark:bg-amber-600 opacity-[0.05] blur-[100px]" />
      </div>

      <motion.main className="flex-1 w-full max-w-[1600px] mx-auto p-2 md:p-4 relative z-10 flex flex-col min-h-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* ULTRA COMPACT HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-1 border-b border-gray-200 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold text-[#912338] dark:text-amber-500 tracking-tight">Schedule Builder</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Sequence planner beta.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
            <SignedIn><button className="px-3 py-1.5 rounded-full border border-emerald-500/30 text-emerald-600 bg-emerald-50 text-[10px] font-bold shadow-sm">Sync Active ✅</button></SignedIn>
            <SignedOut><Link href="/login"><button className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-white/10 text-[10px] font-bold bg-white dark:bg-[#111]">Cloud Sync (Login)</button></Link></SignedOut>
            <button onClick={() => { if (window.confirm("Clear board?")) { setCartItems([]); setGridItems([]); } }} className="px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 hover:bg-rose-50 text-[10px] font-bold bg-white dark:bg-[#111]" disabled={!cartItems.length && !gridItems.length}>Clear Board</button>
            <SignedIn><div className="ml-2 scale-75 border border-gray-200 dark:border-white/10 rounded-full p-0.5 bg-white dark:bg-[#111]"><UserButton afterSignOutUrl="/" /></div></SignedIn>
          </div>
        </header>

        {/* NEW SLIM HORIZONTAL SEARCH BAR - RECOVERING Massive Vertical Space */}
        <div className="flex justify-center w-full mb-4 z-20 relative px-2 shrink-0">
            <div className="w-full max-w-[1400px] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-2 shadow-lg flex flex-wrap lg:flex-nowrap items-center gap-3">
                {/* 1. Term Selector */}
                <div className="flex items-center gap-2 bg-gray-50/50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-white/5 w-full lg:w-auto">
                    <span className="text-[10px] font-black text-[#912338] dark:text-amber-500 uppercase tracking-tighter whitespace-nowrap">Term</span>
                    <select 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={isFetchingTerms}
                        className="bg-transparent text-gray-800 dark:text-gray-100 font-extrabold text-sm outline-none cursor-pointer pr-5 min-w-[130px]"
                    >
                        {isFetchingTerms ? <option>Loading...</option> : availableTerms.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* 2. Subject Input */}
                <div className="flex items-center gap-2 bg-gray-50/50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-white/5 flex-1 min-w-[100px]">
                    <span className="text-[10px] font-black text-[#912338] dark:text-amber-500 uppercase tracking-tighter">Subject</span>
                    <input 
                        type="text" 
                        placeholder="COMP"
                        maxLength={4}
                        value={searchSubject}
                        onChange={(e) => setSearchSubject(e.target.value.toUpperCase().replace(/\s/g, ""))}
                        className="w-full bg-transparent outline-none text-sm font-black text-gray-800 dark:text-white uppercase"
                    />
                </div>

                {/* 3. Catalog Number */}
                <div className="flex items-center gap-2 bg-gray-50/50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-white/5 flex-1 min-w-[90px]">
                    <span className="text-[10px] font-black text-[#C5A059] dark:text-amber-500 uppercase tracking-tighter whitespace-nowrap">Catalog #</span>
                    <input 
                        type="number" 
                        placeholder="248"
                        max={999}
                        value={searchCatalog}
                        onChange={(e) => setSearchCatalog(e.target.value)}
                        className="w-full bg-transparent outline-none text-sm font-black text-gray-800 dark:text-white"
                    />
                </div>

                {/* 4. Action Button */}
                <button 
                    onClick={triggerExtensionFetch}
                    disabled={isFetching || !searchSubject || !searchCatalog}
                    className="px-6 py-2 bg-[#912338] dark:bg-gradient-to-r dark:from-amber-500 dark:to-orange-600 text-white dark:text-black rounded-xl text-xs font-black shadow-md hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-wider min-w-[150px] w-full lg:w-auto"
                >
                    {isFetching ? (
                       <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin text-sm">🤖</span> {fetchingStatus === "api" ? "Cloud Mode" : "Fetching..."}
                       </span>
                    ) : (
                       <span className="flex items-center justify-center gap-2">
                          EXTRACT 🚀
                       </span>
                    )}
                </button>
            </div>
        </div>

        {/* MAIN 2-ZONE LAYOUT - Using 100% Remaining Height */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0 overflow-hidden">
          
          {/* ZONE A: SHOPPING CART (LEFT) */}
          <div className={`col-span-1 flex flex-col gap-4 min-h-0 h-full overflow-hidden ${isMobile && activeTab !== 'cart' ? 'hidden' : 'flex'}`}>
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 flex-1 flex flex-col overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex justify-between items-center shrink-0">
                  <h2 className="text-base font-bold flex items-center gap-2">
                    Class Cart 
                    <span className="bg-[#912338] text-white px-2 py-0.5 rounded-full text-[10px] font-black">{visibleCartItems.length}</span>
                  </h2>
                </div>
                
                {/* Scrollable list content */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-[#0a0a0a]">
                  {Object.entries(cartGroups).map(([code, items]) => {
                    const colorTheme = courseColorsMap[code] || COURSE_COLORS[0];
                    const isExpanded = expandedFolders[code];
                    return (
                        <div key={code} className="border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#111] overflow-hidden shadow-sm">
                            <div 
                              className="p-3 flex justify-between items-center cursor-pointer select-none"
                              onClick={() => setExpandedFolders(p => ({ ...p, [code]: !isExpanded }))}
                            >
                                <span className="font-extrabold text-sm flex items-center gap-2 whitespace-nowrap">
                                  <div className={`w-3 h-3 rounded-full ${colorTheme.borderSide.split(' ')[0].replace('border-l-', 'bg-')}`} />
                                  {code}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-gray-400 font-bold">{items.length} sections</span>
                                  <span className="text-[10px] text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                                </div>
                            </div>
                            
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }} 
                                  animate={{ height: 'auto', opacity: 1 }} 
                                  exit={{ height: 0, opacity: 0 }} 
                                  className="overflow-hidden bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 shadow-inner"
                                >
                                    <div className="p-2 space-y-2">
                                        {items.map(item => (
                                            <div 
                                              key={item.id} 
                                              draggable 
                                              onDragStart={(e) => handleDragStart(e, item)}
                                              className={`group p-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] flex flex-col text-xs transition-all cursor-grab active:scale-95 ${colorTheme.borderSide} border-l-[4px] shadow-sm hover:shadow-md`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                  <span className="font-bold opacity-80 tracking-tight">{item.type} {item.section}</span>
                                                  <button 
                                                    onClick={(e) => { e.stopPropagation(); setCartItems(p => p.filter(i => i.id !== item.id)); }}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm -mt-1 -mr-1"
                                                    title="Remove from Cart"
                                                  >
                                                    <span className="text-xs font-black">✕</span>
                                                  </button>
                                                </div>
                                                <div className="text-gray-500 font-medium">⏱️ {item.days} {item.startTime}–{item.endTime}</div>
                                                
                                                {/* LIVE SEAT DATA DISPLAY */}
                                                <AnimatePresence>
                                                  {item.liveCapacity && (
                                                    <motion.div 
                                                      initial={{ height: 0, opacity: 0 }}
                                                      animate={{ height: 'auto', opacity: 1 }}
                                                      exit={{ height: 0, opacity: 0 }}
                                                      className="mt-2 p-2 bg-gray-50 dark:bg-black/20 rounded-lg flex flex-col gap-1.5 border border-gray-100 dark:border-white/5 overflow-hidden"
                                                    >
                                                      <div className="flex justify-between items-center">
                                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Live Status</span>
                                                        <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[8px] font-black animate-pulse">
                                                          <span className="w-1 h-1 rounded-full bg-current" /> LIVE
                                                        </span>
                                                      </div>
                                                      <div className="flex gap-2">
                                                        <div className="flex-1 flex flex-col items-start px-2 py-1 bg-white dark:bg-[#111] rounded border border-gray-100 dark:border-white/5 shadow-sm">
                                                          <span className="text-[8px] font-bold text-gray-400 uppercase">Available</span>
                                                          <span className={`text-xs font-black ${parseInt(item.liveCapacity.available) > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                            {item.liveCapacity.available}
                                                          </span>
                                                        </div>
                                                        <div className="flex-1 flex flex-col items-start px-2 py-1 bg-white dark:bg-[#111] rounded border border-gray-100 dark:border-white/5 shadow-sm">
                                                          <span className="text-[8px] font-bold text-gray-400 uppercase">Waitlist</span>
                                                          <span className="text-xs font-black text-amber-600">
                                                            {item.liveCapacity.waitlisted}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </motion.div>
                                                  )}
                                                </AnimatePresence>

                                                <div className="mt-3 flex justify-between items-center">
                                                  <button onClick={(e) => fetchDeepDetails(e, item)} className="text-[10px] font-black underline underline-offset-2 text-[#912338] dark:text-amber-500 hover:opacity-70">
                                                    {deepFetching === item.id ? "DECODING..." : "🔍 DEEP INSPECT"}
                                                  </button>
                                                  <button 
                                                    onClick={() => toggleCartItem(item)}
                                                    className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all bg-white dark:bg-black border hover:translate-y-[-1px] ${colorTheme.text} ${colorTheme.border}`}
                                                  >
                                                    ＋ ADD
                                                  </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                        </div>
                    );
                  })}
                  {visibleCartItems.length === 0 && (
                    <div className="h-40 flex flex-col items-center justify-center text-gray-400 opacity-60">
                      <span className="text-3xl mb-2">🔎</span>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-center">Your cart is empty.<br/>Extract classes above.</p>
                    </div>
                  )}
                </div>
            </div>
          </div>

          {/* ZONE B: CALENDAR CANVAS (RIGHT) */}
          <div className={`col-span-1 lg:col-span-3 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col overflow-hidden p-4 min-h-0 h-full shadow-sm ${isMobile && activeTab !== 'schedule' ? 'hidden' : 'flex'}`}>
            <div className="flex justify-between items-center mb-4 shrink-0">
               <div className="flex flex-col">
                  <h2 className="text-base font-bold">Visual Plan</h2>
               </div>
               <button 
                  onClick={handleExportPNG}
                  disabled={isExporting}
                  className="px-4 py-2 bg-[#912338] text-white rounded-xl text-[10px] font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
               >
                  {isExporting ? "PREPARING..." : <>📸 SAVE PHOTO</>}
               </button>
            </div>

            {/* Scrollable grid channel */}
            <div ref={calendarRef} className="border border-gray-200 dark:border-white/10 rounded-xl flex relative bg-gray-50 dark:bg-[#080808] flex-1 min-h-0 overflow-y-auto" onDragOver={handleDragOver} onDrop={handleDrop}>
                {isMobile ? (
                  <div className="w-full flex flex-col p-4 space-y-4">
                    {DAYS.map(day => {
                       const items = visibleGridItems.filter(i => i.days && i.days.includes(day.id));
                       if (!items.length) return null;
                       return (
                         <div key={day.id} className="space-y-2">
                             <h3 className="font-extrabold text-[10px] uppercase tracking-widest text-[#912338] dark:text-amber-500 border-b pb-1 flex items-center justify-between">
                               {day.label}
                               <span className="text-[10px] opacity-40">{items.length} blocks</span>
                             </h3>
                             {items.map(item => {
                               const color = courseColorsMap[item.courseCode] || COURSE_COLORS[0];
                               return (
                                 <div key={item.id} className={`p-4 bg-white dark:bg-[#111] border rounded-xl flex justify-between items-center text-xs shadow-sm ${color.borderSide} border-l-4`}>
                                   <div>
                                       <div className="font-black text-sm tracking-tight">{item.courseCode}</div>
                                       <div className="opacity-60 font-bold uppercase text-[10px]">{item.type} {item.section}</div>
                                       <div className="mt-1 font-bold">{item.startTime} — {item.endTime}</div>
                                   </div>
                                   <button onClick={() => handleRemoveFromGrid(item)} className="p-3 bg-gray-50 dark:bg-white/5 rounded-full text-rose-500">✕</button>
                                 </div>
                               );
                             })}
                         </div>
                       );
                    })}
                    {visibleGridItems.filter(i => i.days && i.days !== 'TBA').length === 0 && (
                      <div className="h-60 flex flex-col items-center justify-center text-gray-400 opacity-40">
                         <span className="text-4xl mb-3">📅</span>
                         <p className="font-black uppercase tracking-widest text-[10px] text-center leading-loose">Schedule visualized here.<br/>Add classes or drag one in.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="min-w-[700px] w-full flex h-[1100px] relative">
                    {/* Time Gutter */}
                    <div className="w-14 border-r border-gray-200 dark:border-white/10 text-[9px] font-black text-gray-400 uppercase p-1 flex flex-col relative shrink-0">
                      {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => (
                        <div key={i} className="absolute w-full text-right pr-2" style={{ top: `calc(${(i * 60 / TOTAL_MINUTES) * 100}% + 42px)` }}>
                          {START_HOUR + i > 12 ? (START_HOUR + i - 12) + " PM" : (START_HOUR + i === 12 ? "12 PM" : (START_HOUR + i) + " AM")}
                        </div>
                      ))}
                    </div>
                    
                    {/* Day Columns */}
                    {DAYS.map(day => (
                      <div key={day.id} className="flex-1 border-r border-gray-100 dark:border-white/5 last:border-r-0 relative">
                        <div className="sticky top-0 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-white/10 text-[10px] font-black tracking-widest uppercase text-center py-3 z-10 text-gray-400 shadow-sm">{day.label}</div>
                        
                        {/* Hour Markings lines */}
                        <div className="absolute inset-0 top-[40px] pointer-events-none">
                            {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => (
                                <div key={i} className="absolute w-full border-t border-gray-100 dark:border-white/5" style={{ top: `${(i * 60 / TOTAL_MINUTES) * 100}%` }} />
                            ))}
                        </div>

                        {/* Schedule blocks for the day */}
                        {visibleGridItems.map(item => {
                          if (!item.days || !item.days.includes(day.id)) return null;
                          const start = getMinutesFromStart(item.startTime);
                          const duration = Math.max(30, getMinutesFromStart(item.endTime) - start);
                          const color = courseColorsMap[item.courseCode] || COURSE_COLORS[0];
                          const isClashing = clashingIds.has(item.id);

                          return (
                            <motion.div 
                              layoutId={`item-${item.id}-${day.id}`}
                              key={item.id + day.id} 
                              onClick={() => handleRemoveFromGrid(item)} 
                              className={`group absolute left-0.5 right-0.5 rounded-lg border-2 p-1.5 flex flex-col justify-start overflow-hidden cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:scale-[1.03] hover:shadow-xl hover:z-20 transition-all ${color.bg} ${color.border} ${color.text} ${isClashing ? 'ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-[#111]' : ''}`} 
                              style={{ 
                                top: `calc(${(start / TOTAL_MINUTES) * 100}% + 42px)`, 
                                height: `${(duration / TOTAL_MINUTES) * 100}%` 
                              }}
                            >
                              <div className="font-extrabold text-[10px] leading-tight flex items-center gap-1">
                                {item.courseCode}
                                {isClashing && (
                                  <span className="flex items-center gap-1 bg-white/90 dark:bg-black/80 px-1 rounded text-[8px] text-rose-600 animate-pulse border border-rose-500/30 shadow-sm">
                                    ⚠️ CLASH
                                  </span>
                                )}
                              </div>
                              <div className="text-[12px] font-black truncate">{item.section}</div>
                              
                              {/* Remove Overlay on Hover - Now triggers on full block hover */}
                              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10">
                                <span className="bg-rose-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase shadow-2xl tracking-widest scale-90 group-hover:scale-100 transition-transform">
                                  REMOVE ✕
                                </span>
                              </div>

                              <div className="mt-auto flex justify-between items-end">
                                <span className="text-[8px] font-black opacity-80">{item.startTime}</span>
                                {item.location && <span className="text-[8px] opacity-40">📍 {item.location}</span>}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* PRECISE ONLINE & eCONCORDIA STRIP - Only shows strictly non-grid classes */}
            {visibleGridItems.filter(item => !item.days || item.days === 'TBA' || item.startTime === '00:00' || (item.section && (item.section === 'EC' || item.section.startsWith('EC-')))).length > 0 && (
              <div className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-500/30 shrink-0 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                   <h3 className="text-[10px] font-black text-blue-900 dark:text-blue-300 flex items-center gap-2 uppercase tracking-widest">
                     <span className="text-sm">🌐</span> ONLINE / eCONCORDIA SECTIONS
                   </h3>
                   <span className="text-[9px] font-bold text-blue-700/60 dark:text-blue-300/60 uppercase">Async &bull; No specified grid timeline</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {visibleGridItems.filter(item => !item.days || item.days === 'TBA' || item.startTime === '00:00' || (item.section && (item.section === 'EC' || item.section.startsWith('EC-')))).map(item => {
                    const colorTheme = courseColorsMap[item.courseCode] || COURSE_COLORS[0];
                    return (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        key={item.id} 
                        onClick={() => handleRemoveFromGrid(item)} 
                        className={`px-4 py-2 bg-white dark:bg-[#111] border rounded-xl flex items-center gap-3 text-xs font-black cursor-pointer shadow-sm hover:shadow-md transition-all group ${colorTheme.text}`}
                      >
                         <div className="flex flex-col">
                            <span className="opacity-50 text-[9px] leading-tight">{item.courseCode}</span>
                            <span>{item.type} {item.section}</span>
                         </div>
                         <span className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-lg group-hover:scale-110 transition-transform">✕</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE SEGMENTED CONTROL BAR */}
        {isMobile && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[240px] p-1.5 bg-white/90 dark:bg-[#111]/90 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl flex gap-1 items-center">
            <button 
              onClick={() => setActiveTab("cart")} 
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'cart' ? 'bg-[#912338] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
               🛒 CART
            </button>
            <button 
              onClick={() => setActiveTab("schedule")} 
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'schedule' ? 'bg-[#912338] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
               📅 PLAN
            </button>
          </div>
        )}

        {/* 📸 HIDDEN GHOST EXPORT ENGINE (RECONSTRUCTED) */}
        <div 
          ref={exportRef} 
          style={{ position: 'fixed', left: '0', top: '0', width: '1200px', height: '1400px', pointerEvents: 'none', zIndex: -100, opacity: 0 }} 
          className="bg-white p-4 flex flex-col font-sans"
        >
            <div className="flex-1 flex border-[2px] border-gray-200 overflow-hidden bg-white">
                {/* Time Sidebar */}
                <div className="w-20 flex flex-col border-r border-gray-100 bg-gray-50/50 pt-[60px]">
                  {Array.from({ length: 16 }, (_, i) => i + 8).map(h => (
                    <div key={h} className="h-20 flex justify-end items-start text-[14px] font-black text-gray-400 uppercase tracking-tighter -mt-2.5 pr-2">
                      {h === 12 ? '12 PM' : h > 12 ? `${h-12} PM` : `${h} AM`}
                    </div>
                  ))}
                </div>

                <div className="flex-1 flex flex-col relative bg-white">
                  {/* Grid Headers */}
                  <div className="flex w-full h-[60px] border-b-2 border-gray-200 bg-gray-50/50">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI'].map(day => (
                      <div key={day} className="flex-1 flex items-center justify-center font-black text-slate-800 border-r border-gray-100 last:border-0 text-2xl tracking-tighter italic">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="relative flex-1">
                    {/* Horizontal Grid Lines - 80px per hour */}
                    {Array.from({ length: 16 }, (_, i) => i + 8).map((_, i) => (
                      <div key={i} className="absolute w-full h-20 border-b border-gray-100/60" style={{ top: `${i * 80}px` }} />
                    ))}
                    
                    {/* Vertical Column Lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {[0,1,2,3,4].map(i => (
                        <div key={i} className="flex-1 border-r border-gray-100 last:border-0" />
                      ))}
                    </div>

                    {/* Classes Grid Overlay */}
                    {DAYS.map((day, dayIdx) => (
                      <div key={day.id} className="absolute top-0 bottom-0" style={{ left: `${dayIdx * 20}%`, width: '20%' }}>
                        {visibleGridItems
                          .filter(c => c.days && c.days.includes(day.id))
                          .map((c, idx) => {
                            const start = getMinutesFromStart(c.startTime);
                            const duration = Math.max(30, getMinutesFromStart(c.endTime) - start);
                            const top = (start / 60) * 80;
                            const height = (duration / 60) * 80;
                            
                            const colorTheme = courseColorsMap[c.courseCode] || COURSE_COLORS[0];
                            const isShort = height < 80;
                            
                            return (
                              <div 
                                key={`export-${c.id}-${day.id}-${idx}`}
                                className={`absolute left-0.5 right-0.5 ${colorTheme.vibrantBg} ${colorTheme.vibrantBorder} border-[3px] rounded-lg shadow-md overflow-hidden flex flex-col justify-start p-2`}
                                style={{ 
                                  top: `${top}px`, 
                                  height: `${height}px`,
                                  zIndex: 10
                                }}
                              >
                                <div className={`font-black ${colorTheme.vibrantText} ${isShort ? 'text-[12px]' : 'text-sm'} opacity-80 mb-0.5 uppercase tracking-tighter`}>{c.courseCode}</div>
                                <div className={`font-black ${colorTheme.vibrantText} ${isShort ? 'text-2xl' : 'text-3xl'} leading-[0.9] mb-1`}>{c.section.split('-').pop()}</div>
                                <div className={`mt-auto font-black ${colorTheme.vibrantText} ${isShort ? 'text-[11px]' : 'text-[13px]'} opacity-90 truncate`}>
                                  {c.startTime}–{c.endTime}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ))}
                  </div>
                </div>
            </div>

            {/* Ultra-Compact Legend */}
            <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-t border-gray-200">
                <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-black text-gray-400 tracking-[.3em] uppercase">Online/TBA:</span>
                    {visibleGridItems.filter(c => !c.days || c.days === 'TBA' || c.type === 'EC').map(c => (
                        <div key={c.id} className="text-[11px] font-black text-slate-700 bg-white px-3 py-1 border border-gray-200 rounded-full flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${courseColorsMap[c.courseCode]?.borderSide.split(' ')[0].replace('border-l-', 'bg-')}`} />
                             {c.courseCode} {c.section}
                        </div>
                    ))}
                </div>
                <div className="text-right">
                    <span className="text-[12px] font-black text-[#912338] tracking-widest uppercase italic">{searchTerm}</span>
                </div>
            </div>
        </div>
      </motion.main>
    </div>
  );
}
