"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { ShineBorder } from "@/components/ui/ShineBorder";

const COURSE_COLORS = [
  { bg: "bg-[#f8f1e6]", border: "border-[#C5A059]", borderSide: "border-l-[#C5A059]", text: "text-amber-900" }, // Concordia Gold
  { bg: "bg-blue-50", border: "border-blue-400", borderSide: "border-l-blue-500", text: "text-blue-900" },
  { bg: "bg-emerald-50", border: "border-emerald-400", borderSide: "border-l-emerald-500", text: "text-emerald-900" },
  { bg: "bg-purple-50", border: "border-purple-400", borderSide: "border-l-purple-500", text: "text-purple-900" },
  { bg: "bg-rose-50", border: "border-rose-400", borderSide: "border-l-rose-500", text: "text-rose-900" },
  { bg: "bg-indigo-50", border: "border-indigo-400", borderSide: "border-l-indigo-500", text: "text-indigo-900" },
  { bg: "bg-orange-50", border: "border-orange-400", borderSide: "border-l-orange-500", text: "text-orange-900" },
];

export default function ScheduleBuilderBeta() {
  const { user, isLoaded } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [gridItems, setGridItems] = useState([]);
  const [clashingIds, setClashingIds] = useState(new Set());
  const [isFetching, setIsFetching] = useState(false);
  
  // Custom Search State
  const [searchSubject, setSearchSubject] = useState("COMP");
  const [searchCatalog, setSearchCatalog] = useState("248");
  const [searchTerm, setSearchTerm] = useState("Loading...");
  const [availableTerms, setAvailableTerms] = useState([]);
  const [isFetchingTerms, setIsFetchingTerms] = useState(true);
  
  // Advanced Cart States
  const lastSearchRef = useRef({ subject: "COMP", catalog: "248", term: "Summer 2026" });
  const [courseColorsMap, setCourseColorsMap] = useState({});
  const [expandedFolders, setExpandedFolders] = useState({});

  // Constants for Visual Calendar
  const START_HOUR = 8;
  const END_HOUR = 22;
  const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
  
  const DAYS = [
    { id: "Mo", label: "Mon" },
    { id: "Tu", label: "Tue" },
    { id: "We", label: "Wed" },
    { id: "Th", label: "Thu" },
    { id: "Fr", label: "Fri" }
  ];

  const getMinutesFromStart = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60 + minutes) - (START_HOUR * 60);
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
  
  useEffect(() => {
    // Phase 1: Delay slightly to allow Chrome to inject bridge.js asynchronously
    const pingTimer = setTimeout(() => {
        setIsFetchingTerms(true);
        window.postMessage({ type: "FROM_CONUPLANNER_WEB_FETCH_TERMS" }, "*");
    }, 600);

    // Safety Fallback: Stop spinning if extension is missing/disabled/dead
    const maxWaitTimer = setTimeout(() => {
        setIsFetchingTerms(isWait => {
            if (isWait) {
                console.warn("[ConuPlanner] Term Sync timeout. Falling back to hardcoded terms.");
                setAvailableTerms(["Summer 2026", "Fall 2026", "Winter 2027"]);
                setSearchTerm("Summer 2026");
                return false;
            }
            return isWait;
        });
    }, 4500);

    return () => {
        clearTimeout(pingTimer);
        clearTimeout(maxWaitTimer);
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      // Phase 4: Receive scraped Terms from PeopleSoft
      if (event.data?.type === "FROM_EXTENSION_TERMS_RESPONSE") {
        if (event.data?.payload?.success && event.data.payload.data) {
          const terms = event.data.payload.data;
          setAvailableTerms(terms);
          if (terms.length > 0) setSearchTerm(terms[0]);
        } else {
          setAvailableTerms(["Summer 2026", "Fall 2026", "Winter 2027"]);
          setSearchTerm("Summer 2026");
        }
        setIsFetchingTerms(false);
      }

      // Security: verify origin if needed, but we check type
      if (event.data?.type === "FROM_EXTENSION_RESPONSE") {
        setIsFetching(false);
        if (event.data?.payload?.success) {
           const newClasses = event.data.payload.data;
           
           if (!newClasses || newClasses.length === 0) {
              alert(`No classes found for ${lastSearchRef.current.subject} ${lastSearchRef.current.catalog} in ${lastSearchRef.current.term}.`);
              return;
           }
           
           // Fetch the exact search combination that requested this payload
           const req = lastSearchRef.current;
           const courseCode = `${req.subject} ${req.catalog}`;
           
           // Assign a color dynamically if not already established
           setCourseColorsMap(prev => {
             const next = { ...prev };
             if (!next[courseCode]) {
                const colorIdx = Object.keys(prev).length % COURSE_COLORS.length;
                next[courseCode] = COURSE_COLORS[colorIdx];
             }
             return next;
           });

           // Auto-expand this new folder
           setExpandedFolders(prev => ({ ...prev, [courseCode]: true }));

           setCartItems(prevCart => {
             // Ensure we don't add classes that are already in the cart
             const existingIds = new Set(prevCart.map(i => i.id));
             // Check grid items as well to avoid adding a class to the cart if it's already on the calendar
             const gridIds = new Set(gridItems.map(i => i.id));
             
             // Tag the freshly extracted sections with their parent Course Code and Context Term
             const uniqueClasses = newClasses
                .filter(c => !existingIds.has(c.id) && !gridIds.has(c.id))
                .map(c => ({
                    ...c,
                    courseCode: courseCode,
                    term: req.term
                }));
                
             return [...prevCart, ...uniqueClasses];
           });
           
        } else {
           alert(`Extension Error: ${event.data?.payload?.error || "Could not fetch class data."}`);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [gridItems]);

  const triggerExtensionFetch = () => {
    setIsFetching(true);
    lastSearchRef.current = { subject: searchSubject, catalog: searchCatalog, term: searchTerm };
    window.postMessage({
      type: "FROM_CONUPLANNER_WEB_FETCH",
      payload: { subject: searchSubject, catalogue: searchCatalog, term: searchTerm }
    }, "*");
  };
  
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflowX: 'hidden', backgroundColor: '#f8f9fa' }}>
      
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#912338] opacity-[0.03] blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-[#C5A059] opacity-[0.05] blur-[100px]" />
      </div>

      <motion.main
        className="max-w-[1600px] mx-auto p-4 md:p-8 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-extrabold text-[#912338] tracking-tight">Schedule Engine</h1>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Beta Lab</span>
            </div>
            <p className="text-gray-500 text-lg">The ultimate visual drag-and-drop sequence planner.</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </header>

        {/* Top Middle Extractor Bar Matches SeatFinder */}
        <div className="flex justify-center w-full mb-8 z-20 relative px-4">
           {/* Static Glow Wrapper */}
           <div className="w-full max-w-4xl rounded-[32px] p-[2px] bg-gradient-to-r from-[#912338] via-[#C5A059] to-[#912338] shadow-[0_0_30px_rgba(145,35,56,0.15)]">
               <div className="bg-white p-6 md:p-8 w-full relative overflow-hidden rounded-[30px] shadow-sm">
                   {/* Decorative Gradient */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl opacity-50 pointer-events-none -mr-20 -mt-20"></div>
                   
                   {/* Top Row: Term */}
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="flex items-center gap-2 text-[#912338] font-black text-xs uppercase tracking-widest pl-2">
                            SELECT TERM
                        </div>
                        <div className="bg-white border-2 border-[#912338]/40 rounded-xl flex items-center px-4 py-2 hover:border-[#912338]/80 transition focus-within:border-[#912338] focus-within:shadow-[0_0_15px_rgba(145,35,56,0.15)] shadow-sm">
                           <select 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              disabled={isFetchingTerms}
                              className="bg-transparent text-gray-800 font-bold text-sm outline-none cursor-pointer appearance-none pr-6 w-[180px]"
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
                           <span className="text-gray-400 pointer-events-none -ml-4 font-bold text-xs">▼</span>
                       </div>
                   </div>
    
                   {/* Bottom Row: Inputs & Button */}
                   <div className="flex flex-col md:flex-row gap-4 relative z-10">
                       {/* Subject */}
                       <div className="flex-1 bg-white border-2 border-[#912338]/80 focus-within:border-[#912338] focus-within:shadow-[0_0_15px_rgba(145,35,56,0.2)] rounded-2xl p-4 transition-all">
                            <label className="text-[10px] font-extrabold uppercase text-[#912338] tracking-widest block mb-1">
                                Subject
                            </label>
                            <input 
                              type="text" 
                              placeholder="COMP"
                              maxLength={4}
                              value={searchSubject}
                              onChange={(e) => setSearchSubject(e.target.value.toUpperCase().replace(/\s/g, ""))}
                              className="w-full bg-transparent outline-none text-3xl font-black text-gray-800 uppercase placeholder-gray-300"
                            />
                       </div>
    
                       {/* Number */}
                       <div className="flex-1 bg-white border-2 border-[#C5A059]/80 focus-within:border-[#C5A059] focus-within:shadow-[0_0_15px_rgba(197,160,89,0.25)] rounded-2xl p-4 transition-all">
                            <label className="text-[10px] font-extrabold uppercase text-[#C5A059] tracking-widest block mb-1">
                                Course Number
                            </label>
                            <input 
                              type="number" 
                              placeholder="248"
                              max={999}
                              value={searchCatalog}
                              onChange={(e) => setSearchCatalog(e.target.value)}
                              className="w-full bg-transparent outline-none text-3xl font-black text-gray-800 placeholder-gray-300"
                            />
                       </div>
    
                       {/* Extract Button */}
                       <button 
                          onClick={triggerExtensionFetch}
                          disabled={isFetching || !searchSubject || !searchCatalog}
                          className="mt-2 md:mt-0 px-8 py-5 bg-[#912338] text-white rounded-2xl text-lg font-extrabold shadow-[0_8px_20px_rgba(145,35,56,0.25)] hover:bg-[#7a1d2f] hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center gap-3 uppercase tracking-wider md:w-[220px]"
                       >
                          {isFetching ? (
                             <><span className="animate-spin text-xl">🤖</span> Fetching</>
                          ) : (
                             <>Extract <span className="text-xl">➔</span></>
                          )}
                       </button>
                   </div>
               </div>
           </div>
        </div>

        {/* 2-Zone Layout Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-320px)]">
          
          {/* ZONE A: Unified Shopping & Search Panel */}
          <div className="col-span-1 lg:col-span-1 flex flex-col h-full gap-5">
            
            {/* 2. The Cart Folders (Scrollable List) */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden min-h-0">
               <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    Class Cart <span className="bg-[#912338] text-white px-2.5 py-0.5 rounded-full text-sm shadow-sm">{cartItems.length}</span>
                  </h2>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                  {Object.keys(cartGroups).length === 0 ? (
                      <div className="text-center p-6 my-auto opacity-50 flex flex-col items-center">
                        <div className="text-4xl mb-4 grayscale">🛒</div>
                        <h3 className="font-bold text-gray-600">Cart is empty</h3>
                        <p className="text-sm mt-2 max-w-[200px] text-gray-500">Run the extractor above to load sections directly.</p>
                      </div>
                  ) : (
                      Object.entries(cartGroups).map(([code, items]) => {
                          const isExpanded = expandedFolders[code];
                          const colorTheme = courseColorsMap[code] || COURSE_COLORS[0];
                          
                          return (
                              <div key={code} className={`border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300`}>
                                  
                                  {/* Folder Header */}
                                  <div 
                                      onClick={() => setExpandedFolders(prev => ({...prev, [code]: !isExpanded}))}
                                      className={`p-3.5 flex justify-between items-center cursor-pointer hover:bg-gray-50 select-none border-b border-gray-100 transition`}
                                  >
                                      <span className="font-bold text-gray-800 flex items-center gap-2">
                                          <div className={`w-3.5 h-3.5 rounded-sm ${colorTheme.bg.replace('bg-', 'bg-').split(' ')[0].replace('50', '400')}`} /> 
                                          {code}
                                      </span>
                                      <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md">{items.length} left</span>
                                          <span className={`text-gray-400 font-bold transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
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
                                          className="overflow-hidden bg-gray-50/50"
                                        >
                                            <div className="p-3 space-y-2.5">
                                                {items.map(item => (
                                                    <div 
                                                        key={item.id} 
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, item)}
                                                        className={`p-3 rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col text-sm cursor-grab active:cursor-grabbing hover:shadow-md transition ${colorTheme.borderSide} border-l-[3px]`}
                                                    >
                                                        <div className="flex justify-between font-bold text-gray-900">
                                                            <span>{item.type} {item.section}</span>
                                                            <span className="text-gray-400 font-medium text-xs">#{item.id}</span>
                                                        </div>
                                                        <div className="text-gray-600 mt-1.5 flex items-center gap-1.5 font-medium text-xs">
                                                            <span className="opacity-70">⏱️</span> {item.days} {item.startTime}-{item.endTime}
                                                        </div>
                                                        {item.prof !== "TBA" && (
                                                          <div className="text-gray-500 mt-1 truncate text-xs font-medium">
                                                              👨‍🏫 {item.prof}
                                                          </div>
                                                        )}
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
          <div className="col-span-1 lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                Calendar Canvas
              </h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-100 transition">
                  Check Clashes
                </button>
                <button className="px-4 py-2 bg-[#912338] text-white rounded-xl text-sm font-semibold shadow-md hover:bg-[#7a1d2f] transition">
                  Finalize & Export
                </button>
              </div>
            </div>

            <div 
              className="flex-1 border border-gray-200 rounded-2xl flex relative overflow-y-auto bg-gray-50/50"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {visibleGridItems.length === 0 && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="text-center p-6 text-gray-400 opacity-60">
                        <div className="text-4xl mb-4 text-gray-300">🗓️</div>
                        <h3 className="text-xl font-bold text-gray-400">Empty Grid</h3>
                        <p className="mt-2 text-sm max-w-sm mx-auto">Drag and drop sections from your cart here to lock them into your schedule.</p>
                    </div>
                 </div>
              )}

              {/* Grid Lines and Labels Container */}
              <div className="min-w-[700px] w-full relative flex h-[1000px]">
                
                {/* Time Axis (Y-Axis) */}
                <div className="w-16 border-r border-gray-200 flex flex-col relative bg-white shrink-0 z-10 rounded-l-2xl">
                  {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => (
                    <div key={i} className="absolute w-full text-right pr-2 text-xs font-semibold text-gray-400" 
                         style={{ top: `${(i * 60 / TOTAL_MINUTES) * 100}%`, transform: 'translateY(-50%)' }}>
                      {START_HOUR + i > 12 ? (START_HOUR + i - 12) + " PM" : (START_HOUR + i === 12 ? "12 PM" : (START_HOUR + i) + " AM")}
                    </div>
                  ))}
                </div>

                {/* Day Columns (X-Axis) */}
                <div className="flex-1 flex w-full relative">

                  {/* Horizontal Grid Pattern Background */}
                  <div className="absolute inset-0 z-0 pointer-events-none" style={{
                    backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent calc(100% / ${(END_HOUR - START_HOUR) * 2} - 1px), #f3f4f6 calc(100% / ${(END_HOUR - START_HOUR) * 2} - 1px), #f3f4f6 calc(100% / ${(END_HOUR - START_HOUR) * 2}))`
                  }}></div>

                  {DAYS.map((day, colIdx) => (
                    <div key={day.id} className="flex-1 relative border-r border-gray-100 last:border-r-0">
                      <div className="sticky top-0 bg-white border-b border-gray-200 py-2 text-center text-sm font-bold text-gray-600 z-10 w-full shadow-sm">
                        {day.label}
                      </div>
                      
                      {/* Render dropped chunks matching this day */}
                      {visibleGridItems.map(item => {
                        if (!item.days.includes(day.id)) return null;
                        
                        const startMins = getMinutesFromStart(item.startTime);
                        const endMins = getMinutesFromStart(item.endTime);
                        const topPercent = (startMins / TOTAL_MINUTES) * 100;
                        const heightPercent = ((endMins - startMins) / TOTAL_MINUTES) * 100;
                        const isClashing = clashingIds.has(item.id);
                        
                        // Pick color based on Map
                        const colorTheme = item.courseCode ? (courseColorsMap[item.courseCode] || COURSE_COLORS[0]) : COURSE_COLORS[0];

                        return (
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            key={`${item.id}-${day.id}`}
                            onClick={() => handleRemoveFromGrid(item)}
                            className={`absolute left-1 right-1 rounded-lg p-2 overflow-hidden shadow-sm cursor-pointer border hover:shadow-md hover:scale-[1.02] transition-all z-20 group
                              ${isClashing 
                                ? "bg-red-50 border-red-500 animate-pulse text-red-900 shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
                                : `${colorTheme.bg} ${colorTheme.border} ${colorTheme.text}`}`}
                            style={{ 
                              top: `calc(${topPercent}% + 37px)`, // 37px offset for the sticky header
                              height: `${heightPercent}%`,
                              minHeight: '2.5rem'
                            }}
                          >
                            <div className="font-extrabold uppercase tracking-wide opacity-70 text-[10px] sm:text-[11px] font-sans">
                                {item.courseCode}
                            </div>
                            <div className="font-bold truncate text-[12px] sm:text-[14px] leading-tight mt-0.5">
                                {item.type} {item.section}
                            </div>
                            
                            <div className="opacity-80 truncate text-[11px] mt-1.5 flex items-center gap-1">
                                {item.room !== "TBA" ? `📍 ${item.room}` : ""}
                            </div>
                            
                            {/* Hover delete indicator */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition">
                              Remove
                            </div>
                            
                            {isClashing && (
                              <div className="absolute top-1 right-1 text-red-600 bg-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
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
            </div>

          </div>
        </div>

      </motion.main>
    </div>
  );
}
