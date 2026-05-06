import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';
import RoadmapCourseNode from './RoadmapCourseNode';
import RoadmapTermNode from './RoadmapTermNode';

const nodeTypes = {
  courseNode: RoadmapCourseNode,
  termNode: RoadmapTermNode
};

export default function FlowRoadmapVisualizer({ plan, completedCourses, getTermName, courseTitles, getPrereqString, programName = "My Journey", curriculum, onClose }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef(null);

  const initGraph = useCallback(() => {
    const newNodes = [];
    const newEdges = [];

    // Track position to draw edges
    const courseToNodeId = {};
    const TERM_X_SPACING = 350;
    const COURSE_Y_SPACING = 200;
    const START_X = 100;
    const START_Y = 150;

    // Optional: Add a "Completed" term if there are prior credits
    let currentX = START_X;
    
    if (completedCourses && completedCourses.length > 0) {
      // Completed node header
      newNodes.push({
        id: 'term-completed',
        type: 'termNode',
        position: { x: currentX, y: START_Y - 80 },
        data: { label: 'Prior Credits' }
      });

      completedCourses.forEach((course, cIdx) => {
        const id = `node-${course.replace(/\s+/g, '-')}`;
        courseToNodeId[course] = id;
        newNodes.push({
          id,
          type: 'courseNode',
          position: { x: currentX, y: START_Y + (cIdx * COURSE_Y_SPACING) },
          data: {
            course,
            title: courseTitles[course] || "Course Title Unavailable",
            isElective: false,
            prereqStatus: "Completed",
            isCompleted: true
          }
        });
      });
      currentX += TERM_X_SPACING;
    }

    // Build the semesters
    plan.forEach((semester, sIdx) => {
      // Add term label
      newNodes.push({
        id: `term-${sIdx}`,
        type: 'termNode',
        position: { x: currentX, y: START_Y - 80 },
        data: { label: getTermName(sIdx) }
      });

      semester.forEach((course, cIdx) => {
        const isElective = course.includes('Elective');
        const title = courseTitles[course] || (isElective ? "Selected Elective" : "Course Title Unavailable");
        
        // Ensure unique ID if a generic elective appears twice
        const baseId = course.replace(/\s+/g, '-');
        let id = `node-${baseId}`;
        if (courseToNodeId[course]) {
           id = `node-${baseId}-${sIdx}-${cIdx}`; // disambiguate
        }
        courseToNodeId[course] = id;

        newNodes.push({
          id,
          type: 'courseNode',
          position: { x: currentX, y: START_Y + (cIdx * COURSE_Y_SPACING) },
          data: {
            course,
            title,
            isElective,
            prereqStatus: getPrereqString(course) === "None" ? "No Prerequisites" : "Has Prerequisites",
            isCompleted: false
          }
        });
      });
      currentX += TERM_X_SPACING;
    });

    // Build edges for prerequisites
    // For each course in the plan, look up its prerequisites in curriculum.courses
    plan.forEach((semester) => {
      semester.forEach((course) => {
        const targetId = courseToNodeId[course];
        const courseData = curriculum.courses?.[course];
        
        if (courseData && courseData.prerequisites) {
          courseData.prerequisites.forEach((group) => {
            const items = Array.isArray(group) ? group : [group];
            items.forEach(prereq => {
              const sourceId = courseToNodeId[prereq];
              if (sourceId && targetId) {
                newEdges.push({
                  id: `edge-${sourceId}-${targetId}`,
                  source: sourceId,
                  target: targetId,
                  type: 'smoothstep',
                  animated: true,
                  style: { stroke: '#cbd5e1', strokeWidth: 3 },
                  markerEnd: { type: MarkerType.ArrowClosed, color: '#cbd5e1' }
                });
              }
            });
          });
        }
        
        if (courseData && courseData.corequisites) {
          courseData.corequisites.forEach((group) => {
            const items = Array.isArray(group) ? group : [group];
            items.forEach(coreq => {
              const sourceId = courseToNodeId[coreq];
              if (sourceId && targetId) {
                newEdges.push({
                  id: `edge-coreq-${sourceId}-${targetId}`,
                  source: sourceId,
                  target: targetId,
                  type: 'straight',
                  animated: true,
                  style: { stroke: '#fbbf24', strokeWidth: 3, strokeDasharray: '5,5' },
                  markerEnd: { type: MarkerType.ArrowClosed, color: '#fbbf24' }
                });
              }
            });
          });
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [plan, completedCourses, curriculum, courseTitles, getTermName, getPrereqString]);

  useEffect(() => {
    initGraph();
  }, [initGraph]);

  const handleDownload = async () => {
    const viewportNode = document.querySelector('.react-flow__viewport');
    if (!viewportNode) return;

    try {
      // Find bounding box of all nodes
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      nodes.forEach(n => {
        if (n.position.x < minX) minX = n.position.x;
        if (n.position.y < minY) minY = n.position.y;
        if (n.position.x > maxX) maxX = n.position.x;
        if (n.position.y > maxY) maxY = n.position.y;
      });

      // Add padding
      minX -= 100;
      minY -= 100;
      maxX += 400; // rough node width + padding
      maxY += 300;

      const width = maxX - minX;
      const height = maxY - minY;

      const dataUrl = await toPng(viewportNode, {
        backgroundColor: '#f8f9fa',
        pixelRatio: 2,
        width: width,
        height: height,
        style: {
          width: width,
          height: height,
          transform: `translate(${-minX}px, ${-minY}px) scale(1)`
        }
      });

      const link = document.createElement('a');
      link.download = 'My-Degree-Roadmap.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download roadmap", err);
      alert("Failed to download roadmap image. Please try again.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f8f9fa] dark:bg-[#0f172a]">
      {/* Header */}
      <div className="bg-white dark:bg-[#1e293b] text-slate-800 dark:text-white p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-slate-200 dark:border-slate-800 shadow-sm z-10 transition-colors duration-300">
        <div>
          <h2 className="text-3xl font-black mb-1">Interactive Degree Roadmap</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Scroll to zoom, click and drag to pan. Arrows show prerequisite chains.</p>
        </div>
        <div>
          <button onClick={handleDownload} className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(4,120,87,1)] flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download High-Res PNG
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
          attributionPosition="bottom-right"
        >
          <Background color="#cbd5e1" gap={30} size={2} />
          <Controls />
          <MiniMap 
            nodeColor={(n) => {
              if (n.type === 'termNode') return '#1e293b';
              if (n.data.isCompleted) return '#34d399';
              if (n.data.course.includes('Math')) return '#60a5fa';
              if (n.data.isElective) return '#fbbf24';
              return '#cbd5e1';
            }} 
            maskColor="rgba(248, 249, 250, 0.7)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
