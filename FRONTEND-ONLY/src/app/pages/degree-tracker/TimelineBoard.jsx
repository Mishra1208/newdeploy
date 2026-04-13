'use client';
import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GLOBAL_COURSES } from '../../../utils/degreeEngine/prereqGraph'; // For fallback credits
import courseTitles from '../../../utils/degreeEngine/data/courseTitles.json'; // Legacy lookup

// --- Sortable Item Component ---
function SortableCourseCard({ id, name, onRemove, isIP, onToggleIP, isCompleted, onToggleCompleted, userOverrides, setUserOverrides, availableBuckets, resolvedBucketMap }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-white border ${isDragging ? 'border-[#912338] shadow-lg scale-105' : (isCompleted ? 'border-green-500 bg-green-50/40' : isIP ? 'border-amber-400 bg-amber-50/30' : 'border-gray-200 shadow-sm')} rounded-xl mb-3 group hover:border-[#912338]/40 transition-colors relative flex items-center justify-between gap-3`}
    >
      <div 
        {...attributes}
        {...listeners}
        className="flex-1 cursor-grab active:cursor-grabbing truncate"
      >
        <div className="font-bold text-gray-900 truncate flex items-center gap-2">
            {id}
            {isCompleted && <span className="text-[10px] font-black bg-green-200 text-green-900 px-1.5 py-0.5 rounded tracking-wide">DONE</span>}
            {isIP && !isCompleted && <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded tracking-wide">IP</span>}
        </div>
        {name && name !== id && <div className="text-xs text-gray-500 font-medium truncate mt-0.5">{name}</div>}
        
        {/* Glowing Bucket Label */}
        <div className="absolute -top-2.5 -right-1 z-30 pointer-events-none">
            <span className="text-[9px] font-black bg-white border border-[#912338]/20 text-[#912338] px-2 py-1 rounded-md shadow-[0_4px_12px_rgba(145,35,56,0.18)] tracking-tight whitespace-nowrap uppercase italic">
                {resolvedBucketMap?.[id] || "GEN ELEC"}
            </span>
        </div>
        
        {/* Category Override Dropdown */}
        {availableBuckets && availableBuckets.length > 0 && (
          <select 
            value={userOverrides[id] || ""}
            onChange={(e) => {
               e.stopPropagation();
               if (e.target.value) {
                   setUserOverrides(prev => ({...prev, [id]: e.target.value}));
               } else {
                   setUserOverrides(prev => {
                       const copy = {...prev};
                       delete copy[id];
                       return copy;
                   });
               }
            }}
            onClick={(e) => e.stopPropagation()} // Prevent dragging when clicking the dropdown
            className="mt-1.5 text-[10px] bg-gray-50 border border-gray-200 text-gray-600 rounded px-1.5 py-0.5 outline-none focus:border-[#912338] shadow-sm tracking-wide max-w-full"
          >
             <option value="">🎯 Default Category</option>
             {availableBuckets.map(b => (
                <option key={b} value={b}>{b}</option>
             ))}
          </select>
        )}
      </div>
      
      {/* Controls */}
      <div className="flex flex-col gap-1 items-center shrink-0 z-10">
          <div className="flex gap-1">
             <button 
                onClick={(e) => { e.stopPropagation(); onToggleCompleted(id); }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors font-bold ${isCompleted ? 'bg-green-500 text-white shadow-inner' : 'bg-gray-50 text-gray-400 hover:bg-green-100 hover:text-green-600'}`}
                title="Mark as Completed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleIP(id); }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors font-bold text-xs ${isIP ? 'bg-amber-400 text-white shadow-inner' : 'bg-gray-50 text-gray-400 hover:bg-amber-100 hover:text-amber-600'}`}
                title="Mark as In Progress"
              >
                IP
              </button>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(id); }}
            className="w-full h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Remove Course"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
      </div>
    </div>
  );
}

// --- Column Container Component ---
function SemesterColumn({ id, title, items, courseMetadata, onRemoveCourse, ipCourses, onToggleIP, completedCourses, onToggleCompleted, userOverrides, setUserOverrides, availableBuckets, resolvedBucketMap }) {
  // Calculate specific total credits for the column header
  const totalCredits = items.reduce((acc, courseId) => {
      // Prioritize courseMetadata over GLOBAL_COURSES
      return acc + (courseMetadata?.[courseId]?.credits || GLOBAL_COURSES[courseId]?.credits || 3.0);
  }, 0);

  return (
    <div className="flex flex-col bg-gray-50/50 border-2 border-gray-100 rounded-2xl min-w-[300px] w-full max-w-sm">
      <div className="p-4 border-b border-gray-100 bg-white/50 rounded-t-2xl flex justify-between items-end">
        <div>
           <h3 className="font-bold text-gray-900 heading-font">{title}</h3>
           <span className="text-xs text-gray-500 font-medium">{items.length} Courses</span>
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded-md ${totalCredits > 15 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
           {totalCredits} cr
        </div>
      </div>
      
      <div className="p-4 flex-1 min-h-[150px]">
            <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col min-h-[150px]">
                {items.map((courseId) => {
                  // Resolve Name Using New Dictionary
                  const resolvedName = courseMetadata?.[courseId]?.title || courseTitles[courseId] || GLOBAL_COURSES[courseId]?.title || '';
                  return (
                      <SortableCourseCard 
                        key={courseId} 
                        id={courseId} 
                        name={resolvedName}
                        onRemove={onRemoveCourse}
                        isIP={ipCourses?.includes(courseId)}
                        onToggleIP={onToggleIP}
                        isCompleted={completedCourses?.includes(courseId)}
                        onToggleCompleted={onToggleCompleted}
                        userOverrides={userOverrides}
                        setUserOverrides={setUserOverrides}
                        availableBuckets={availableBuckets}
                        resolvedBucketMap={resolvedBucketMap}
                      />
                  );
                })}
              </div>
            </SortableContext>
        {items.length === 0 && (
          <div className="h-full flex items-center justify-center text-sm font-medium text-gray-400 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
            Drop courses here
          </div>
        )}
      </div>
    </div>
  );
}

// --- Dynamic Search Bar Component ---
function SearchCourseBar({ onAddCourse }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        if (val.length < 2) {
            setResults([]);
            return;
        }
        
        const matches = Object.entries(courseTitles)
            .filter(([id, title]) => id.toLowerCase().includes(val.toLowerCase()) || title?.toLowerCase().includes(val.toLowerCase()))
            .slice(0, 8); // take top 8
            
        const formatted = matches.map(([id, title]) => [id, { title }]);
        setResults(formatted);
    };

    return (
        <div className="relative mb-4">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search any course (e.g., COMP 472)"
                    value={query}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#912338] focus:ring-1 focus:ring-[#912338]"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            
            {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50">
                    {results.map(([id, data]) => (
                        <div key={id} className="p-3 hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 group">
                            <div>
                                <div className="font-bold text-gray-900 text-sm">{id}</div>
                                <div className="text-xs text-gray-500 truncate max-w-[200px]">{data.title}</div>
                            </div>
                            <button 
                                onClick={() => {
                                    onAddCourse({ id, name: data.title });
                                    setQuery('');
                                    setResults([]);
                                }}
                                className="w-8 h-8 rounded-full bg-[#912338]/10 text-[#912338] flex items-center justify-center hover:bg-[#912338] hover:text-white transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- Main Board Component ---
export default function TimelineBoard({ columns, onColumnsChange, courseMetadata, setCourseMetadata, ipCourses, onToggleIP, completedCourses, onToggleCompleted, userOverrides, setUserOverrides, availableBuckets, resolvedBucketMap }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find which columns they belong to
    let activeColumnId = Object.keys(columns).find((key) => columns[key].includes(activeId));
    let overColumnId = Object.keys(columns).find((key) => columns[key].includes(overId));
    
    // If dropping onto an empty column, the over.id IS the column id
    if (!overColumnId && columns[overId]) {
      overColumnId = overId;
    }

    if (!activeColumnId || !overColumnId) return;

    if (activeColumnId === overColumnId) {
      // Re-ordering within the same column
      const columnItems = columns[activeColumnId];
      const oldIndex = columnItems.indexOf(activeId);
      const newIndex = columnItems.indexOf(overId);
      
      if (oldIndex !== newIndex) {
        const newItems = [...columnItems];
        newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, activeId);
        onColumnsChange({
          ...columns,
          [activeColumnId]: newItems
        });
      }
    } else {
      // Moving between columns
      const sourceItems = [...columns[activeColumnId]];
      const destItems = [...columns[overColumnId]];
      
      const oldIndex = sourceItems.indexOf(activeId);
      sourceItems.splice(oldIndex, 1);
      
      // Insert at the specific position if hovered over a specific item, or append if hovering column background
      if (columns[overColumnId].includes(overId)) {
          const newIndex = destItems.indexOf(overId);
          destItems.splice(newIndex, 0, activeId);
      } else {
          destItems.push(activeId);
      }

      onColumnsChange({
        ...columns,
        [activeColumnId]: sourceItems,
        [overColumnId]: destItems
      });
    }
  };

  // User clicked "X" on a course card
  const handleRemoveCourse = (courseId) => {
      // Find its current column
      let activeColumnId = Object.keys(columns).find((key) => columns[key].includes(courseId));
      if (!activeColumnId) return;

      if (activeColumnId === 'unplaced') {
          // HARD DELETE! Completely remove from the tracker if it's already in the dump.
          const newUnplaced = columns['unplaced'].filter(id => id !== courseId);
          onColumnsChange({ ...columns, 'unplaced': newUnplaced });
          
          // Also remove IP/Completed state so we don't leak it
          if (ipCourses.includes(courseId)) onToggleIP(courseId);
          if (completedCourses.includes(courseId)) onToggleCompleted(courseId);
          return;
      }

      // Soft delete: Return to Unplaced
      const newSource = columns[activeColumnId].filter(id => id !== courseId);
      const newUnplaced = [...columns['unplaced'], courseId]; 
      
      onColumnsChange({
          ...columns,
          [activeColumnId]: newSource,
          'unplaced': newUnplaced
      });
  };

  const handleAddGlobalCourse = (newCourse) => {
      // Add to unplaced if it doesn't exist anywhere
      const exists = Object.values(columns).some(col => col.includes(newCourse.id));
      if (!exists) {
          onColumnsChange({
              ...columns,
              'unplaced': [newCourse.id, ...columns['unplaced']]
          });
          // Also dynamically register it to the metadata dict so it prints a pretty name!
          setCourseMetadata?.(prev => ({
              ...prev,
              [newCourse.id]: newCourse.name
          }));
      }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid lg:grid-cols-4 gap-6 items-start">
        {/* The horizontal scrolling semantic timeline */}
        <div className="lg:col-span-3 overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max">
            {Object.keys(columns).filter(k => k !== 'unplaced').map((colId, index) => {
               return (
                 <div key={colId} className="min-w-[320px] max-w-[320px]">
                   <SemesterColumn 
                     id={colId} 
                     title={colId} 
                     items={columns[colId]} 
                     courseMetadata={courseMetadata}
                     onRemoveCourse={handleRemoveCourse}
                     ipCourses={ipCourses}
                     onToggleIP={onToggleIP}
                     completedCourses={completedCourses}
                     onToggleCompleted={onToggleCompleted}
                     userOverrides={userOverrides}
                     setUserOverrides={setUserOverrides}
                     availableBuckets={availableBuckets}
                     resolvedBucketMap={resolvedBucketMap}
                   />
                 </div>
               );
            })}
          </div>
        </div>

        {/* The unplaced 'Sidebar' Course Pool */}
        <div className="h-full bg-white border border-gray-200 shadow-sm rounded-2xl p-4 sticky top-24">
           {/* SEARCH BAR WIDGET */}
           <SearchCourseBar onAddCourse={handleAddGlobalCourse} />

           <div className="max-h-[600px] overflow-y-auto pr-2 pb-10">
               <SemesterColumn 
                 id="unplaced" 
                 title="Requirements Dump" 
                 items={columns['unplaced']} 
                 courseMetadata={courseMetadata}
                 onRemoveCourse={handleRemoveCourse} // Now fully supported!
                 ipCourses={ipCourses}
                 onToggleIP={onToggleIP}
                 completedCourses={completedCourses}
                 onToggleCompleted={onToggleCompleted}
               />
           </div>
        </div>
      </div>
    </DndContext>
  );
}
