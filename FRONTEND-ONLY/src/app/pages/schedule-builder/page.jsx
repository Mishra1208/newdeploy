"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShineBorder } from "@/components/ui/ShineBorder";
import { toPng } from "html-to-image";

const COURSE_COLORS = [
  { bg: "bg-[#f8f1e6] dark:bg-amber-900/30", border: "border-[#C5A059] dark:border-amber-500/50", borderSide: "border-l-[#C5A059] dark:border-l-amber-500", text: "text-amber-900 dark:text-amber-300" },
  { bg: "bg-blue-50 dark:bg-blue-900/30", border: "border-blue-400 dark:border-blue-500/50", borderSide: "border-l-blue-500 dark:border-l-blue-400", text: "text-blue-900 dark:text-blue-300 dark:text-blue-300" },
  { bg: "bg-emerald-50 dark:bg-emerald-900/30", border: "border-emerald-400 dark:border-emerald-500/50", borderSide: "border-l-emerald-500 dark:border-l-emerald-400", text: "text-emerald-900 dark:text-emerald-300" },
  { bg: "bg-purple-50 dark:bg-purple-900/30", border: "border-purple-400 dark:border-purple-500/50", borderSide: "border-l-purple-500 dark:border-l-purple-400", text: "text-purple-900 dark:text-purple-300" },
  { bg: "bg-rose-50 dark:bg-rose-900/30", border: "border-rose-400 dark:border-rose-500/50", borderSide: "border-l-rose-500 dark:border-l-rose-400", text: "text-rose-900 dark:text-rose-300" },
  { bg: "bg-indigo-50 dark:bg-indigo-900/30", border: "border-indigo-400 dark:border-indigo-500/50", borderSide: "border-l-indigo-500 dark:border-l-indigo-400", text: "text-indigo-900 dark:text-indigo-300" },
  { bg: "bg-orange-50 dark:bg-orange-900/30", border: "border-orange-400 dark:border-orange-500/50", borderSide: "border-l-orange-500 dark:border-l-orange-400", text: "text-orange-900 dark:text-orange-300" },
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

  // Resolution detection for Mobile UX
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleExportPNG = () => {
    setIsExporting(true);
    // Give time for the Ghost Grid to mount if it wasnt already
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
          pixelRatio: 3, // Ultra-High-Resolution Export
          width: 1200,   // Fixed width for professional look
          height: 1000   // Fixed height for professional look
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
  
  // Local Data Index matching
  const [courseDirectory, setCourseDirectory] = useState({});
  useEffect(() => {
    fetch('/course_index.json')
      .then(r => r.json())
      .then(d => {
        const dict = {};
        if (d.list) {
            d.list.forEach(c => dict[c.code] = c.title);
        }
        setCourseDirectory(dict);
      })
      .catch(e => console.error(e));
  }, []);
  
  // Cloud Sync
  const [hydrated, setHydrated] = useState(false);
  const ENGINE_KEY = "conu-engine:selected";

  // 1. Cloud Hydration
  useEffect(() => {
    if (isLoaded && user && !hydrated) {
      const cloudData = user.unsafeMetadata?.scheduleEngine;
      if (cloudData) {
        console.log("☁️ Restoring Schedule Builder from Cloud");
        setCartItems(cloudData.cartItems || []);
        setGridItems(cloudData.gridItems || []);
      } else {
        try {
          const local = JSON.parse(localStorage.getItem(ENGINE_KEY));
          if (local) { setCartItems(local.cartItems || []); setGridItems(local.gridItems || []); }
        } catch (e) {}
      }
      setHydrated(true);
    } else if (isLoaded && !user && !hydrated) {
      try {
        const local = JSON.parse(localStorage.getItem(ENGINE_KEY));
        if (local) { setCartItems(local.cartItems || []); setGridItems(local.gridItems || []); }
      } catch (e) {}
      setHydrated(true);
    }
  }, [isLoaded, user, hydrated]);

  // 2. Continuous Cloud Save (Debounced)
  useEffect(() => {
    if (!hydrated) return; // Prevent overwriting cloud with empty state on initial boot
    const payload = { cartItems, gridItems };
    localStorage.setItem(ENGINE_KEY, JSON.stringify(payload));
    
    // Clerk rate limits rapid updates, so we debounce the cloud push by 2 seconds
    const syncTimer = setTimeout(() => {
      if (isLoaded && user) {
        user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            scheduleEngine: payload
          }
        }).catch(err => console.error("Engine Sync Error", err));
      }
    }, 2000);
    
    return () => clearTimeout(syncTimer);
  }, [cartItems, gridItems, hydrated, isLoaded]);
  
  // Custom Search State
  const [searchSubject, setSearchSubject] = useState("");
  const [searchCatalog, setSearchCatalog] = useState("");
  const [searchTerm, setSearchTerm] = useState("Summer 2026");
  const [availableTerms, setAvailableTerms] = useState(["Summer 2026", "Fall 2026", "Fall/Winter 2026-27", "Winter 2027"]);
  const [isFetchingTerms, setIsFetchingTerms] = useState(false);
  
  // Advanced Cart States
  const lastSearchRef = useRef({ subject: "COMP", catalog: "248", term: "Summer 2026" });
  // Re-engineered deterministic colour mapping based purely on physical items
  const courseColorsMap = useMemo(() => {
     const codesSet = new Set();
     [...cartItems, ...gridItems].forEach(item => {
         if (item.courseCode) codesSet.add(item.courseCode);
     });
     // Sorting guarantees color stability across page reloads!
     const uniqueCodes = Array.from(codesSet).sort(); 
     const map = {};
     uniqueCodes.forEach((code, i) => {
         map[code] = COURSE_COLORS[i % COURSE_COLORS.length];
     });
     return map;
  }, [cartItems, gridItems]);

  const termMap = {
    "Summer 2026": "2261",
    "Fall 2026": "2262",
    "Fall/Winter 2026-27": "2263",
    "Winter 2027": "2264"
  };

  const [expandedFolders, setExpandedFolders] = useState({});

  // Constants for Visual Calendar
  const START_HOUR = 8;
  const END_HOUR = 24;
  const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
  
  const DAYS = [
    { id: "Mo", label: "Mon" },
    { id: "Tu", label: "Tue" },
    { id: "We", label: "Wed" },
    { id: "Th", label: "Thu" },
    { id: "Fr", label: "Fri" }
  ];

  const getMinutesFromStart = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    
    // Normalize format (e.g. "10:15 AM" -> "10:15AM")
    const clean = timeStr.replace(/\s+/g, '').toUpperCase();
    
    // Match "HH:MM" with optional AM/PM
    const match = clean.match(/^(\d{1,2}):(\d{2})(AM|PM)?$/);
    if (!match) {
        // Fallback or handle "N/A"
        return 0;
    }
    
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3];

    // Convert 12h to 24h
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    
    // Return relative minutes from START_HOUR
    const totalMinutes = hours * 60 + minutes;
    const startOffset = START_HOUR * 60;
    
    return Math.max(0, totalMinutes - startOffset);
  };

  // --- TERM CONTEXT SEGREGATION ---
  const visibleCartItems = cartItems.filter(item => item.term === searchTerm);
  const visibleGridItems = gridItems.filter(item => item.term === searchTerm);

  // Group cartItems dynamically based on courseCode (Filtered strictly to Active Term)
  const cartGroups = visibleCartItems.reduce((acc, item) => {
    const code = item.courseCode || "Unknown Course";
    if (!acc[code]) acc[code] = [];
    acc[code].push(item);
    return acc;
  }, {});

  // Clash Detection Engine
  useEffect(() => {
    const calculateClashes = () => {
      const clashes = new Set();
      // Evaluate overlaps STRICTLY within the isolated Term layout
      for (let i = 0; i < visibleGridItems.length; i++) {
        for (let j = i + 1; j < visibleGridItems.length; j++) {
          const itemA = visibleGridItems[i];
          const itemB = visibleGridItems[j];
          
          // Check if they share any days
          const sharedDays = DAYS.some(d => itemA.days.includes(d.id) && itemB.days.includes(d.id));
          if (sharedDays) {
            const startA = getMinutesFromStart(itemA.startTime);
            const endA = getMinutesFromStart(itemA.endTime);
            const startB = getMinutesFromStart(itemB.startTime);
            const endB = getMinutesFromStart(itemB.endTime);
            
            // Overlap math: StartA < EndB AND EndA > StartB
            if (startA < endB && endA > startB) {
              clashes.add(itemA.id);
              clashes.add(itemB.id);
            }
          }
        }
      }
      setClashingIds(clashes);
    };
    calculateClashes();
  }, [gridItems]);

  // Drag and Drop Handlers
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // allow dropping
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData("application/json");
    if (itemData) {
      const item = JSON.parse(itemData);
      
      // Prerequisite Defense Engine
      if (item.prerequisites && item.prerequisites !== "None") {
          const confirmed = window.confirm(`⚠️ PREREQUISITE LOCK DETECTED:\n\n${item.prerequisites}\n\nConcordia requires you to fulfill this requirement before enrollment. Do you confirm you have met these rules?`);
          if (!confirmed) {
              console.log("User aborted prerequisite-locked drop.");
              return; // Halt drop safely
          }
      }
      
      // Remove from cart, add to grid
      setCartItems(prev => prev.filter(i => i.id !== item.id));
      setGridItems(prev => {
        if (!prev.find(i => i.id === item.id)) return [...prev, item];
        return prev;
      });
    }
  };

  const handleRemoveFromGrid = (item) => {
    setGridItems(prev => prev.filter(i => i.id !== item.id));
    setCartItems(prev => [...prev, item]); // Put it back in cart
  };

  const fetchDeepDetails = (e, item) => {
      e.stopPropagation();
      e.preventDefault();
      
      const parts = item.courseCode.split(" ");
      setDeepFetching(item.id);
      deepTargetRef.current = item.id;
      
      // 1. Extension Hit
      window.postMessage({
          type: "FROM_CONUPLANNER_WEB_DEEP_FETCH",
          payload: {
              classId: item.id,
              subject: parts[0],
              catalogue: parts[1],
              term: item.term
          }
      }, "*");

      // 2. Race: If no response in 3s, fallback to Cloud API
      const timeoutMs = isMobile ? 1500 : 3000;
      if (deepTimeoutRef.current) clearTimeout(deepTimeoutRef.current);
      deepTimeoutRef.current = setTimeout(() => {
          fallbackDeepFetch(item);
      }, timeoutMs);
  };

  const fallbackDeepFetch = async (item) => {
      const parts = item.courseCode.split(" ");
      const numericTerm = termMap[item.term] || "2261";

      try {
          const res = await fetch('/api/schedule/deep-fetch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  term: numericTerm,
                  subject: parts[0],
                  number: parts[1],
                  classId: item.id
              }),
          });
          
          const result = await res.json();
          if (result.success && result.data) {
              const deepData = result.data;
              const mapDeepData = (arr) => arr.map(i => {
                if (i.id === item.id) {
                    return {
                        ...i,
                        prerequisites: deepData.prerequisites && deepData.prerequisites !== "None" ? deepData.prerequisites : i.prerequisites,
                        liveCapacity: deepData
                    };
                }
                return i;
              });
              
              setCartItems(prev => mapDeepData(prev));
              setGridItems(prev => mapDeepData(prev));
          } else {
              throw new Error(result.error || "Deep Scraper failed");
          }
      } catch (err) {
          console.error("🏁 Deep Fallback Error:", err);
      } finally {
          setDeepFetching(null);
          deepTargetRef.current = null;
      }
  };

  const toggleCartItem = (item) => {
      const isInGrid = gridItems.find(i => i.id === item.id);
      
      if (isInGrid) {
          // Remove from grid, back to cart
          setGridItems(prev => prev.filter(i => i.id !== item.id));
          setCartItems(prev => [...prev, item]);
      } else {
          // Add to grid
          if (item.prerequisites && item.prerequisites !== "None") {
              const confirmed = window.confirm(`⚠️ PREREQUISITE LOCK DETECTED:\n\n${item.prerequisites}\n\nConcordia requires you to fulfill this requirement before enrollment. Do you confirm you have met these rules?`);
              if (!confirmed) return;
          }
          setCartItems(prev => prev.filter(i => i.id !== item.id));
          setGridItems(prev => {
            if (!prev.find(i => i.id === item.id)) return [...prev, item];
            return prev;
          });
      }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      // Phase 5: Deep Seat Scraper Response
      if (event.data?.type === "FROM_EXTENSION_DEEP_RESPONSE") {
          const targetId = deepTargetRef.current;
          setDeepFetching(null);
          deepTargetRef.current = null;
          
          if (event.data?.payload?.success && event.data.payload.data) {
              const deepData = event.data.payload.data;
              const mapDeepData = (arr) => arr.map(i => {
                  if (i.id === targetId) {
                      return {
                          ...i,
                          prerequisites: deepData.prerequisites && deepData.prerequisites !== "None" ? deepData.prerequisites : i.prerequisites,
                          liveCapacity: deepData
                      };
                  }
                  return i;
              });
              
              setCartItems(prev => mapDeepData(prev));
              setGridItems(prev => mapDeepData(prev));
          } else {
              alert(`⚠️ Analyzer Error: ${event.data?.payload?.error || "Bot timed out trying to reach the unique Class Page. Try again!"}`);
          }
      }

      // Security: verify origin if needed, but we check type
      if (event.data?.type === "FROM_EXTENSION_RESPONSE") {
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
            fetchTimeoutRef.current = null;
        }
        setIsFetching(false);
        setFetchingStatus("");
        if (event.data?.payload?.success) {
           const newClasses = event.data.payload.data;
           const req = lastSearchRef.current;
           handleNewClasses(newClasses, `${req.subject} ${req.catalog}`, req.term);
        } else {
           alert(`Extension Error: ${event.data?.payload?.error || "Could not fetch class data."}`);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [gridItems]);

  const triggerExtensionFetch = () => {
    if (!searchSubject || !searchCatalog) return;
    
    setIsFetching(true);
    setFetchingStatus("extension");
    lastSearchRef.current = { subject: searchSubject.toUpperCase(), catalog: searchCatalog, term: searchTerm };
    
    // 1. Send message to extension
    window.postMessage({
      type: "FROM_CONUPLANNER_WEB_FETCH",
      payload: { subject: searchSubject.toUpperCase(), catalogue: searchCatalog, term: searchTerm }
    }, "*");

    // 2. Race: If no response in 3s, fallback to API
    const timeoutMs = isMobile ? 1500 : 3000;
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    fetchTimeoutRef.current = setTimeout(() => {
        console.log("⚡ Extension timeout. Falling back to Cloud Scraper...");
        fallbackToApiFetch();
    }, timeoutMs);
  };

  const fallbackToApiFetch = async () => {
      setFetchingStatus("api");
      const req = lastSearchRef.current;
      const numericTerm = termMap[req.term] || "2261";
      
      try {
          const res = await fetch('/api/check-seats', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  subject: req.subject, 
                  number: req.catalog, 
                  term: numericTerm 
              }),
          });
          
          const data = await res.json();
          if (data.success && data.data) {
              handleNewClasses(data.data, `${req.subject} ${req.catalog}`, req.term);
          } else {
              throw new Error(data.error || "Cloud Scraper failed");
          }
      } catch (err) {
          console.error("🏁 Cloud Fallback Error:", err);
          alert(`Could not fetch data for ${req.subject} ${req.catalog}. Please ensure the course exists and your extension is updated.`);
      } finally {
          setIsFetching(false);
          setFetchingStatus("");
          fetchTimeoutRef.current = null;
      }
  };

  const handleNewClasses = (newClasses, courseCode, searchContextTerm) => {
      if (!newClasses || newClasses.length === 0) {
          alert(`No classes found for ${courseCode} in ${searchContextTerm}.`);
          return;
      }

      setExpandedFolders(prev => ({ ...prev, [courseCode]: true }));

      setCartItems(prevCart => {
          const existingIds = new Set(prevCart.map(i => i.id));
          const gridIds = new Set(gridItems.map(i => i.id));
          
          const uniqueClasses = newClasses
             .filter(c => !existingIds.has(c.id) && !gridIds.has(c.id))
             .map(c => ({
                 ...c,
                 id: c.id || c.classNbr, // Fallback check
                 courseCode: courseCode,
                 term: searchContextTerm
             }));
             
          return [...prevCart, ...uniqueClasses];
      });
  };
  
  return (
    <div className="relative h-screen w-full lg:overflow-hidden bg-[#f8f9fa] dark:bg-[#0a0a0a] transition-colors duration-300 text-slate-900 dark:text-slate-100 flex flex-col">
      
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#912338] dark:bg-purple-900 opacity-[0.03] dark:opacity-[0.2] blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-[#C5A059] dark:bg-amber-600 opacity-[0.05] dark:opacity-[0.15] blur-[100px]" />
      </div>

      <motion.main
        className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8 relative z-10 flex flex-col min-h-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-extrabold text-[#912338] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-amber-400 dark:to-orange-500 tracking-tight">Schedule Builder</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">The ultimate visual drag-and-drop sequence planner.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
            <SignedIn>
              <button
                className="px-4 py-2 rounded-full border border-emerald-500/30 text-emerald-600 bg-emerald-50 text-xs font-bold shadow-sm cursor-default"
                onClick={() => alert("Cloud Sync is actively bridging your local Canvas to your profile. You're protected! 🌩️")}
              >
                Sync Active ✅
              </button>
            </SignedIn>
            
            <SignedOut>
              <Link href="/login">
                <button className="px-4 py-2 rounded-full border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:hover:bg-white/10 text-xs font-bold shadow-sm transition-all bg-white dark:bg-[#111]">
                  Cloud Sync (Login)
                </button>
              </Link>
            </SignedOut>

            <button
               onClick={() => {
                   if (window.confirm("Are you sure you want to completely wipe your Cartesian calendar block?")) {
                       setCartItems([]);
                       setGridItems([]);
                   }
               }}
               className="px-4 py-2 rounded-full border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 border-[1.5px] text-xs font-bold shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-[#111]"
               disabled={!cartItems.length && !gridItems.length}
            >
               Clear Board
            </button>

            <SignedIn>
              <div className="ml-2 scale-90 border border-gray-200 dark:border-white/10 rounded-full p-0.5 bg-white dark:bg-[#111]">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </header>

        {/* Top Middle Extractor Bar Matches SeatFinder */}
        <div className="flex justify-center w-full mb-8 z-20 relative px-4">
           {/* Static Glow Wrapper */}
           <div className="w-full max-w-4xl rounded-[32px] p-[2px] bg-gradient-to-r from-[#912338] via-[#C5A059] to-[#912338] shadow-[0_0_30px_rgba(145,35,56,0.15)]">
               <div className="bg-white dark:bg-[#111] p-6 md:p-8 w-full relative overflow-hidden rounded-[30px] shadow-sm transition-colors duration-300">
                   {/* Decorative Gradient */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 dark:bg-amber-900/20 rounded-full blur-3xl opacity-50 pointer-events-none -mr-20 -mt-20"></div>
                   
                   {/* Top Row: Term */}
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="flex items-center gap-2 text-[#912338] dark:text-amber-500 font-black text-xs uppercase tracking-widest pl-2">
                            SELECT TERM
                        </div>
                        <div className="bg-white dark:bg-[#111] border-2 border-[#912338]/40 dark:border-amber-500/30 rounded-xl flex items-center px-4 py-2 hover:border-[#912338]/80 transition focus-within:border-[#912338] focus-within:shadow-[0_0_15px_rgba(145,35,56,0.15)] shadow-sm">
                           <select 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              disabled={isFetchingTerms}
                              className="bg-transparent text-gray-800 dark:text-gray-100 font-bold text-sm outline-none cursor-pointer appearance-none pr-6 w-[180px]"
                           >
                              {isFetchingTerms ? (
                                 <option value="Loading...">Loading Terms...</option>
                              ) : (
                                 availableTerms.map(term => (
                                    <option key={term} value={term}>
                                       {term}
                                    </option>
                                 ))
                              )}
                           </select>
                           <span className="text-gray-400 dark:text-gray-500 pointer-events-none -ml-4 font-bold text-xs">▼</span>
                       </div>
                   </div>
    
                   {/* Bottom Row: Inputs & Button */}
                   <div className="flex flex-col md:flex-row gap-4 relative z-10">
                       {/* Subject */}
                       <div className="flex-1 bg-white dark:bg-[#111] border-2 border-[#912338]/80 dark:border-[#111] focus-within:border-[#912338] dark:focus-within:border-amber-500 focus-within:shadow-[0_0_15px_rgba(145,35,56,0.2)] rounded-2xl p-4 transition-all">
                            <label className="text-[10px] font-extrabold uppercase text-[#912338] tracking-widest block mb-1">
                                Subject
                            </label>
                            <input 
                              type="text" 
                              placeholder="COMP"
                              maxLength={4}
                              value={searchSubject}
                              onChange={(e) => setSearchSubject(e.target.value.toUpperCase().replace(/\s/g, ""))}
                              className="w-full bg-transparent outline-none text-3xl font-black text-gray-800 dark:text-white uppercase placeholder-gray-300 dark:placeholder-white/20"
                            />
                       </div>
    
                       {/* Number */}
                       <div className="flex-1 bg-white dark:bg-[#111] border-2 border-[#C5A059]/80 dark:border-[#111] focus-within:border-[#C5A059] dark:focus-within:border-amber-500 focus-within:shadow-[0_0_15px_rgba(197,160,89,0.25)] rounded-2xl p-4 transition-all">
                            <label className="text-[10px] font-extrabold uppercase text-[#C5A059] tracking-widest block mb-1">
                                Course Number
                            </label>
                            <input 
                              type="number" 
                              placeholder="248"
                              max={999}
                              value={searchCatalog}
                              onChange={(e) => setSearchCatalog(e.target.value)}
                              className="w-full bg-transparent outline-none text-3xl font-black text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-white/20"
                            />
                       </div>
    
                       {/* Extract Button */}
                       <button 
                          onClick={triggerExtensionFetch}
                          disabled={isFetching || !searchSubject || !searchCatalog}
                          className="mt-2 md:mt-0 px-8 py-5 bg-[#912338] dark:bg-gradient-to-r dark:from-amber-500 dark:to-orange-600 text-white dark:text-black rounded-2xl text-lg font-extrabold shadow-[0_8px_20px_rgba(145,35,56,0.25)] dark:shadow-orange-500/20 hover:bg-[#7a1d2f] dark:hover:to-orange-700 dark:hover:text-white hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center gap-3 uppercase tracking-wider md:w-[220px]"
                       >
                          {isFetching ? (
                             <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2">
                                   <span className="animate-spin text-xl">🤖</span>
                                   <span>{fetchingStatus === "api" ? "Cloud Mode" : (isMobile ? "Fetching..." : "Checking Extension...")}</span>
                                </div>
                                {fetchingStatus === "api" && (
                                   <span className="text-[10px] font-bold opacity-60 tracking-tight leading-none mt-1 animate-pulse">Connecting to Concordia...</span>
                                )}
                                {fetchingStatus === "extension" && !isMobile && (
                                   <span className="text-[10px] font-bold opacity-60 tracking-tight leading-none mt-1">PeopleSoft search in progress</span>
                                )}
                             </div>
                          ) : (
                             <>Extract <span className="text-xl">➔</span></>
                          )}
                       </button>
                   </div>
               </div>
           </div>
        </div>

        {/* 2-Zone Layout Area - FIXED HEIGHT ON DESKTOP */}
        <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0 ${isMobile ? 'min-h-[500px]' : ''}`}>
          
          {/* ZONE A: Unified Shopping & Search Panel */}
          <div className={`col-span-1 lg:col-span-1 flex flex-col h-full gap-5 ${isMobile && activeTab !== 'cart' ? 'hidden' : 'flex'} overflow-hidden`}>
            
            {/* 2. The Cart Folders (Scrollable List) */}
            <div className="bg-white dark:bg-[#111] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors flex-1 flex flex-col overflow-hidden min-h-0 h-full">
               <div className="p-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    Class Cart <span className="bg-[#912338] text-white px-2.5 py-0.5 rounded-full text-sm shadow-sm">{cartItems.length}</span>
                  </h2>
                  {cartItems.length > 0 && (
                      <button 
                          onClick={() => { setCartItems([]); setGridItems([]); localStorage.removeItem("conu-engine:selected"); }}
                          className="text-xs font-bold text-red-500 hover:text-white bg-red-50 hover:bg-red-500 transition px-3 py-1.5 rounded-lg border border-red-100"
                      >
                          Clear All
                      </button>
                  )}
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-[#0a0a0a]">
                  {Object.keys(cartGroups).length === 0 ? (
                      <div className="text-center p-6 my-auto opacity-50 flex flex-col items-center">
                        <div className="text-4xl mb-4 grayscale">🛒</div>
                        <h3 className="font-bold text-gray-600 dark:text-gray-400">Cart is empty</h3>
                        <p className="text-sm mt-2 max-w-[200px] text-gray-500 dark:text-gray-400">Run the extractor above to load sections directly.</p>
                      </div>
                  ) : (
                      Object.entries(cartGroups).map(([code, items]) => {
                          const isExpanded = expandedFolders[code];
                          const colorTheme = courseColorsMap[code] || COURSE_COLORS[0];
                          
                          return (
                              <div key={code} className={`border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#111] shadow-sm transition-all duration-300`}>
                                  
                                  {/* Folder Header */}
                                  <div 
                                      onClick={() => setExpandedFolders(prev => ({...prev, [code]: !isExpanded}))}
                                      className={`p-3.5 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 select-none border-b border-gray-100 dark:border-white/5 transition`}
                                  >
                                      <span className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                          <div className={`w-3.5 h-3.5 rounded-sm ${colorTheme.bg.replace('bg-', 'bg-').split(' ')[0].replace('50', '400')}`} /> 
                                          {code}
                                      </span>
                                      <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-md">{items.length} left</span>
                                          <span className={`text-gray-400 dark:text-gray-500 font-bold transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
                                      </div>
                                  </div>

                                  {/* Folder Content (Draggable Classes) */}
                                  <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div 
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden bg-gray-50 dark:bg-[#0a0a0a]"
                                        >
                                            <div className="p-3 space-y-2.5">
                                                {items.map(item => (
                                                    <div 
                                                        key={item.id} 
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, item)}
                                                        className={`p-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] shadow-sm flex flex-col text-sm cursor-grab active:cursor-grabbing hover:shadow-md transition ${colorTheme.borderSide} border-l-[3px]`}
                                                    >
                                                        <div className="flex justify-between font-bold text-gray-900 border-b border-gray-100 dark:border-white/5 pb-2 mb-2 items-center">
                                                            <div className="flex gap-2 items-center">
                                                              <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 dark:text-gray-400 text-xs px-2 py-0.5 rounded-md">{item.type} {item.section}</span>
                                                              <span className="text-gray-400 dark:text-gray-500 font-medium text-xs">#{item.id}</span>
                                                            </div>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setCartItems(prev => prev.filter(i => i.id !== item.id)); }} 
                                                                className="text-gray-300 hover:text-red-500 transition hover:bg-red-50 rounded-full w-5 h-5 flex items-center justify-center -mr-1"
                                                                title="Remove class"
                                                            >✕</button>
                                                        </div>
                                                        <div className="text-gray-600 dark:text-gray-400 mt-1.5 flex items-center gap-1.5 font-medium text-xs">
                                                            <span className="opacity-70">⏱️</span> {item.days} {item.startTime}-{item.endTime}
                                                        </div>
                                                        {item.prof !== "TBA" && (
                                                          <div className="text-gray-500 dark:text-gray-400 mt-1 truncate text-[11px] font-medium">
                                                              👨‍🏫 {item.prof}
                                                          </div>
                                                        )}
                                                        {item.prerequisites && item.prerequisites !== "None" && (
                                                          <div className="mt-2 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/50 rounded-md p-2 leading-tight shadow-sm">
                                                              ⚠️ {item.prerequisites}
                                                          </div>
                                                        )}

                                                        {item.liveCapacity && (
                                                          <div className="mt-2.5 p-2 bg-slate-50/80 rounded-md border border-slate-200 flex flex-col gap-1.5 text-[10px] font-bold shadow-inner">
                                                              <div className="flex justify-between items-center w-full">
                                                                 <span className="text-emerald-700">🟢 Available: {item.liveCapacity.available} / {item.liveCapacity.capacity}</span>
                                                                 <span className="text-yellow-600">🟡 Waitlist: {item.liveCapacity.waitlisted} / {item.liveCapacity.waitlistCapacity}</span>
                                                              </div>
                                                          </div>
                                                        )}

                                                        <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                                                            <button 
                                                              onClick={(e) => fetchDeepDetails(e, item)}
                                                              disabled={deepFetching === item.id}
                                                              className="text-xs font-bold text-[#912338] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-3 py-1.5 rounded-md transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-800 disabled:opacity-50 flex items-center gap-1.5 focus:ring-2 focus:ring-[#912338]/20"
                                                            >
                                                               {deepFetching === item.id ? (
                                                                  <><span className="animate-spin text-[10px]">🔄</span> Decoding...</>
                                                               ) : (
                                                                  <>🔍 Deep Inspect</>
                                                               )}
                                                            </button>

                                                            <button 
                                                              onClick={(e) => { e.stopPropagation(); toggleCartItem(item); }}
                                                              className={`text-xs font-black px-4 py-1.5 rounded-full shadow-sm transition-all flex items-center gap-2 transform active:scale-95 ${colorTheme.bg.replace('bg-', 'bg-').split(' ')[0]} ${colorTheme.text} border-2 ${colorTheme.border}`}
                                                            >
                                                                <span className="text-sm">＋</span> ADD
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
                      })
                  )}
               </div>
            </div>
          </div>

          {/* ZONE B: Visual Calendar Grid */}
          <div 
            ref={calendarRef}
            className={`col-span-1 lg:col-span-3 bg-white dark:bg-[#111] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors flex flex-col overflow-hidden p-6 ${isMobile && activeTab !== 'schedule' ? 'hidden' : 'flex'} h-full`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                Calendar Canvas
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleExportPNG}
                  className="px-4 py-2 bg-[#912338] text-white rounded-xl text-sm font-semibold shadow-md hover:bg-[#7a1d2f] transition flex items-center gap-1.5 focus:ring-2 focus:ring-[#912338]/40"
                >
                  📸 Export PNG
                </button>
              </div>
            </div>

            <div 
              className="border border-gray-200 dark:border-white/10 rounded-2xl flex relative bg-gray-50 dark:bg-[#080808] shadow-inner flex-1 overflow-y-auto"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {visibleGridItems.length === 0 && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="text-center p-6 text-gray-400 dark:text-gray-500 opacity-60">
                        <div className="text-4xl mb-4 text-gray-300">🗓️</div>
                        <h3 className="text-xl font-bold text-gray-400 dark:text-gray-500">Empty Grid</h3>
                        <p className="mt-2 text-sm max-w-sm mx-auto">{isMobile ? "Tap '+' on classes in your cart to build your schedule." : "Drag and drop sections from your cart here to lock them into your schedule."}</p>
                    </div>
                 </div>
              )}

              {isMobile ? (
                  /* --- MOBILE VERTICAL TIMELINE VIEW --- */
                  <div className="w-full flex flex-col p-4 space-y-8 bg-gray-50/50 dark:bg-[#080808]">
                      {visibleGridItems.length > 0 && DAYS.map(day => {
                          const dayItems = visibleGridItems.filter(i => i.days.includes(day.id)).sort((a,b) => a.startTime.localeCompare(b.startTime));
                          if (dayItems.length === 0) return null;
                          
                          return (
                              <div key={day.id} className="space-y-4">
                                  <div className="flex items-center gap-4 px-2">
                                      <div className="w-10 h-10 rounded-2xl bg-[#912338] text-white flex items-center justify-center font-black text-xs shadow-lg shadow-[#912338]/20">
                                          {day.id}
                                      </div>
                                      <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">{day.label}</h3>
                                      <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-white/10" />
                                  </div>
                                  <div className="space-y-4 px-1">
                                      {dayItems.map(item => {
                                          const colorTheme = courseColorsMap[item.courseCode] || COURSE_COLORS[0];
                                          const isClashing = clashingIds.has(item.id);
                                          return (
                                              <motion.div 
                                                  key={item.id} 
                                                  initial={{ x: -20, opacity: 0 }}
                                                  animate={{ x: 0, opacity: 1 }}
                                                  className={`group relative p-5 rounded-[24px] border-2 shadow-xl transition-all flex justify-between items-center overflow-hidden ${colorTheme.bg} ${isClashing ? 'border-red-500 shadow-red-500/30' : colorTheme.border}`}
                                              >
                                                  {/* Aurora Glow Effect */}
                                                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 dark:bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                                                  
                                                  <div className="flex flex-col relative z-20">
                                                      <div className="flex items-center gap-2 mb-1.5">
                                                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/20 backdrop-blur-md border border-white/40 dark:border-white/5 shadow-sm">
                                                              {item.type} {item.section}
                                                          </span>
                                                          {isClashing && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full animate-pulse">CLASH ⚠️</span>}
                                                      </div>
                                                      <span className={`text-2xl font-black leading-tight tracking-tight ${colorTheme.text}`}>{item.courseCode}</span>
                                                      <div className="flex items-center gap-3 mt-2">
                                                          <span className="text-xs font-bold opacity-80 flex items-center gap-1">
                                                              <span className="text-lg">🕒</span> {item.startTime} - {item.endTime}
                                                          </span>
                                                          {item.room !== "TBA" && (
                                                              <span className="text-xs font-bold opacity-80 flex items-center gap-1">
                                                                  <span className="text-lg">📍</span> {item.room}
                                                              </span>
                                                          )}
                                                      </div>
                                                      <div className="text-[11px] font-bold opacity-60 mt-1 line-clamp-1 italic">
                                                          {courseDirectory[item.courseCode] || "Course Details"}
                                                      </div>
                                                  </div>
                                                  
                                                  <button 
                                                      onClick={() => toggleCartItem(item)}
                                                      className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/40 dark:border-white/5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 hover:border-red-200 transition-all shadow-sm flex items-center justify-center group/btn active:scale-90"
                                                  >
                                                      <span className="text-xl font-light transform group-hover/btn:rotate-90 transition-transform">✕</span>
                                                  </button>
                                              </motion.div>
                                          );
                                      })}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              ) : (
                  /* --- DESKTOP GRID VIEW (EXISTING) --- */
                  <div className="min-w-[700px] w-full relative flex h-[1000px]">
                    
                    {/* Time Axis (Y-Axis) */}
                    <div className="w-16 border-r border-gray-200 dark:border-white/10 flex flex-col relative bg-white dark:bg-[#111] shrink-0 z-10 rounded-l-2xl">
                      {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => (
                        <div key={i} className="absolute w-full text-right pr-2 text-xs font-semibold text-gray-400 dark:text-gray-500" 
                             style={{ top: `calc(${(i * 60 / TOTAL_MINUTES) * 100}% + 37px)`, transform: 'translateY(-50%)' }}>
                          {START_HOUR + i === 24 ? "12 AM" : (START_HOUR + i > 12 ? (START_HOUR + i - 12) + " PM" : (START_HOUR + i === 12 ? "12 PM" : (START_HOUR + i) + " AM"))}
                        </div>
                      ))}
                    </div>

                    {/* Day Columns (X-Axis) */}
                    <div className="flex-1 flex w-full relative">

                      {/* Horizontal Grid Pattern Background */}
                      <div className="absolute inset-x-0 bottom-0 z-0 pointer-events-none" style={{
                        top: '37px',
                        backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent calc(100% / ${(END_HOUR - START_HOUR) * 2} - 1px), var(--fallback-grid, rgba(120,120,120,0.1)) calc(100% / ${(END_HOUR - START_HOUR) * 2} - 1px), var(--fallback-grid, rgba(120,120,120,0.1)) calc(100% / ${(END_HOUR - START_HOUR) * 2}))`
                      }}></div>

                      {DAYS.map((day, colIdx) => (
                        <div key={day.id} className="flex-1 relative border-r border-gray-100 dark:border-white/5 last:border-r-0">
                          <div className="sticky top-0 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-white/10 py-2 text-center text-sm font-bold text-gray-600 dark:text-gray-400 z-10 w-full shadow-sm">
                            {day.label}
                          </div>
                          
                          {/* Render dropped chunks matching this day */}
                          {visibleGridItems.map(item => {
                            if (!item.days.includes(day.id)) return null;
                            
                            const startMins = getMinutesFromStart(item.startTime);
                            const endMins = getMinutesFromStart(item.endTime);
                            const durationMins = endMins - startMins;
                            const topPercent = (startMins / TOTAL_MINUTES) * 100;
                            const heightPercent = (durationMins / TOTAL_MINUTES) * 100;
                            const isClashing = clashingIds.has(item.id);
                            
                            // Pick color based on Map
                            const colorTheme = item.courseCode ? (courseColorsMap[item.courseCode] || COURSE_COLORS[0]) : COURSE_COLORS[0];

                            return (
                              <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                key={`${item.id}-${day.id}`}
                                onClick={() => handleRemoveFromGrid(item)}
                                className={`absolute left-1 right-1 rounded-xl overflow-hidden shadow-sm cursor-pointer border hover:shadow-md hover:scale-[1.02] transition-all z-20 group flex flex-col justify-between
                                  ${durationMins <= 75 ? 'p-1.5' : 'p-2'}
                                  ${isClashing 
                                    ? "bg-red-50 border-red-500 animate-pulse text-red-900 shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
                                    : `${colorTheme.bg} ${colorTheme.border} ${colorTheme.text}`}`}
                                style={{ 
                                  top: `calc(${topPercent}% + 37px)`, // 37px offset for the sticky header
                                  height: `${heightPercent}%`,
                                  minHeight: '2.5rem'
                                }}
                              >
                                <div className="flex justify-between items-start">
                                    <div className={`font-extrabold uppercase tracking-wide opacity-90 font-sans ${durationMins < 60 ? 'text-[9px]' : 'text-[11px]'}`}>
                                        {item.courseCode}
                                    </div>
                                    <div className={`opacity-90 font-bold shrink-0 bg-white dark:bg-[#111]/40 rounded-md shadow-sm border border-black/5 dark:border-white/10 ${durationMins < 60 ? 'text-[8.5px] px-1 py-0' : 'text-[10px] px-1'}`}>
                                        {item.startTime}-{item.endTime}
                                    </div>
                                </div>
                                
                                <div className={`font-bold leading-tight opacity-95 flex-shrink bg-transparent overflow-hidden ${
                                    durationMins <= 75 ? "text-[10px] line-clamp-1 mt-0.5" : 
                                    durationMins <= 90 ? "text-[11px] line-clamp-2 mt-1" : 
                                    "text-[13px] sm:text-[14px] line-clamp-3 mt-1"
                                }`}>
                                    {courseDirectory[item.courseCode] || "Loading..."}
                                </div>
                                
                                <div className={`flex flex-wrap items-center font-bold opacity-90 overflow-hidden ${durationMins <= 75 ? 'mt-0.5 text-[9px] gap-1' : 'mt-auto pt-1 text-[11px] gap-1.5'}`}>
                                    <div className={`bg-white dark:bg-[#111]/50 rounded-md shadow-sm border border-black/5 dark:border-white/10 uppercase tracking-wide flex items-center gap-1 ${durationMins <= 75 ? 'px-1 py-0' : 'px-1.5 py-0.5'}`}>
                                        <span className="opacity-95 text-[10px] font-black">{item.type}</span> <span className="truncate">{item.section}</span>
                                    </div>
                                    {item.room !== "TBA" && durationMins >= 60 && (
                                        <div className={`bg-black/5 rounded-md border border-black/5 dark:border-white/10 truncate max-w-[100px] ${durationMins <= 75 ? 'px-1 py-0 text-[8.5px]' : 'px-1.5 py-0.5'}`} title={item.room}>
                                            📍 {item.room}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Hover delete indicator */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition">
                                  Remove
                                </div>
                                
                                {isClashing && (
                                  <div className="absolute top-1 right-1 text-red-600 bg-white dark:bg-[#111] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                    ⚠️
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      ))}
                    </div>

                  </div>
              )}
            </div>
            {/* eConcordia & Asynchronous Classes Strip */}
            {visibleGridItems.filter(item => !item.days || (typeof item.days === 'string' && item.days.trim() === 'TBA') || item.startTime === '00:00' || (item.section && item.section.includes('EC'))).length > 0 && (
              <div className="mt-4 p-4 border border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl shadow-sm shrink-0 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                  <span className="text-xl">🌐</span>
                  Online / eConcordia Sections
                  <span className="text-xs font-medium text-blue-700/70 dark:text-blue-300/70 ml-2 bg-blue-100/50 dark:bg-blue-500/20 px-2 py-0.5 rounded-md">Asynchronous &bull; No specified timeline</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {visibleGridItems.filter(item => !item.days || (typeof item.days === 'string' && item.days.trim() === 'TBA') || item.startTime === '00:00' || (item.section && item.section.includes('EC'))).map(item => {
                    const colorTheme = item.courseCode ? (courseColorsMap[item.courseCode] || COURSE_COLORS[0]) : COURSE_COLORS[0];
                    return (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={`online-${item.id}`}
                        onClick={() => handleRemoveFromGrid(item)}
                        className={`group relative overflow-hidden flex items-center gap-4 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 cursor-pointer shadow-sm hover:shadow-md transition-all ${colorTheme.bg.replace('50', '50/80')}`}
                      >
                         <div className={`w-1.5 absolute left-0 top-0 bottom-0 ${colorTheme.bg.replace('bg-', 'bg-').split(' ')[0].replace('50', '400')}`} />
                         <div className="flex flex-col pl-2 whitespace-nowrap">
                             <span className={`font-black text-[11px] opacity-70 tracking-tight uppercase ${colorTheme.text}`}>
                                 {item.courseCode} — {courseDirectory[item.courseCode] || "Loading..."}
                             </span>
                             <span className={`font-bold text-[14px] leading-tight ${colorTheme.text}`}>{item.type} {item.section}</span>
                             <span className={`text-[11px] opacity-80 font-bold ${colorTheme.text}`}>ID #{item.id} • {item.startTime}-{item.endTime}</span>
                         </div>
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition">
                           Remove
                         </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* MOBILE TAB SWITCHER - Segmented Control */}
        {isMobile && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[240px] p-1.5 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl flex items-center gap-1">
            <button 
              onClick={() => setActiveTab("cart")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'cart' ? 'bg-[#912338] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
               🛒 Cart
            </button>
            <button 
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'schedule' ? 'bg-[#912338] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
               📅 Visual
            </button>
          </div>
        )}

        {/* GHOST EXPORT GRID (Always Desktop Version) */}
        <div 
          ref={exportRef}
          style={{ position: 'absolute', left: '-9999px', top: '0', width: '1200px', height: '1000px', pointerEvents: 'none' }}
          className="bg-white p-8"
        >
            <div className="flex justify-between items-center mb-6">
               <div className="flex flex-col">
                  <h1 className="text-3xl font-black text-[#912338] tracking-tighter">My Concordia Schedule</h1>
                  <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">{searchTerm}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Generated by ConU Planner</p>
                  <p className="text-[10px] font-bold text-gray-300">{new Date().toLocaleDateString()}</p>
               </div>
            </div>
            
            <div className="border-2 border-gray-100 rounded-3xl flex relative bg-gray-50 shadow-inner h-[800px] overflow-hidden">
                <div className="w-16 border-r border-gray-200 flex flex-col relative bg-white shrink-0 z-10">
                  {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => (
                    <div key={i} className="absolute w-full text-right pr-2 text-[10px] font-bold text-gray-400" 
                         style={{ top: `calc(${(i * 60 / TOTAL_MINUTES) * 100}% + 37px)`, transform: 'translateY(-50%)' }}>
                      {START_HOUR + i === 24 ? "12 AM" : (START_HOUR + i > 12 ? (START_HOUR + i - 12) + " PM" : (START_HOUR + i === 12 ? "12 PM" : (START_HOUR + i) + " AM"))}
                    </div>
                  ))}
                </div>

                <div className="flex-1 flex w-full relative">
                  {DAYS.map((day) => (
                    <div key={day.id} className="flex-1 relative border-r border-gray-100 last:border-r-0">
                      <div className="bg-white border-b border-gray-200 py-2 text-center text-xs font-black text-[#912338] uppercase tracking-widest">
                        {day.label}
                      </div>
                      
                      {visibleGridItems.map(item => {
                        if (!item.days.includes(day.id)) return null;
                        const startMins = getMinutesFromStart(item.startTime);
                        const endMins = getMinutesFromStart(item.endTime);
                        const durationMins = endMins - startMins;
                        const topPercent = (startMins / TOTAL_MINUTES) * 100;
                        const heightPercent = (durationMins / TOTAL_MINUTES) * 100;
                        const colorTheme = item.courseCode ? (courseColorsMap[item.courseCode] || COURSE_COLORS[0]) : COURSE_COLORS[0];

                        return (
                          <div
                            key={`export-${item.id}-${day.id}`}
                            className={`absolute left-1.5 right-1.5 rounded-2xl p-3 border shadow-sm flex flex-col justify-between ${colorTheme.bg.split(' ')[0]} ${colorTheme.border} ${colorTheme.text.split(' ')[0]}`}
                            style={{ 
                              top: `calc(${topPercent}% + 37px)`,
                              height: `${heightPercent}%`,
                              minHeight: '3rem'
                            }}
                          >
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">{item.courseCode}</span>
                                <span className="text-[10px] font-bold bg-white/40 px-1.5 rounded-md">{item.startTime}-{item.endTime}</span>
                            </div>
                            <div className="text-[12px] font-black leading-none my-1.5 line-clamp-2">
                                {courseDirectory[item.courseCode] || "Course Details"}
                            </div>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-[9px] font-black bg-white/40 px-1.5 py-0.5 rounded-md">{item.type} {item.section}</span>
                                {item.room !== "TBA" && (
                                   <span className="text-[9px] font-bold bg-black/5 px-1.5 py-0.5 rounded-md truncate max-w-[60px]">📍 {item.room}</span>
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
            </div>
            
            {/* Online Sections in Export */}
            {visibleGridItems.filter(item => !item.days || item.days.trim() === 'TBA' || item.startTime === '00:00' || (item.section && item.section.includes('EC'))).length > 0 && (
               <div className="mt-6 flex flex-wrap gap-2">
                  {visibleGridItems.filter(item => !item.days || item.days.trim() === 'TBA' || item.startTime === '00:00' || (item.section && item.section.includes('EC'))).map(item => (
                     <div key={`export-online-${item.id}`} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-bold text-gray-600">
                        🌐 {item.courseCode}: {item.type} {item.section} (Online)
                     </div>
                  ))}
               </div>
            )}
        </div>

      </motion.main>
    </div>
  );
}
