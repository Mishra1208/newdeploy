"use client";

import { useEffect, useState, useCallback } from 'react'; // removed unused useMemo
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MiniMap,
    Handle,
    Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { fetchCourses } from '@/lib/mockApi';
import { buildGraphData } from '@/lib/prereqParser';

// --- Theme Colors (Cyberpunk Glaze) ---
const COLORS = {
    dark: {
        bg: '#020617', // deep space blue

        // Node Types
        prereq: {
            bg: 'rgba(30, 41, 59, 0.7)',
            border: '#94a3b8',
            text: '#e2e8f0',
            glow: '0 0 15px rgba(148, 163, 184, 0.3)'
        },
        target: {
            bg: 'rgba(255, 100, 50, 0.85)', // solid vibrant orange
            border: '#ffedd5',
            text: '#ffffff',
            glow: '0 0 30px rgba(249, 115, 22, 0.6)'
        },
        unlock: {
            bg: 'rgba(16, 185, 129, 0.2)', // green glass
            border: '#34d399',
            text: '#6ee7b7',
            glow: '0 0 20px rgba(52, 211, 153, 0.4)'
        },
        missing: {
            bg: 'rgba(39, 39, 42, 0.5)',
            border: '#52525b',
            text: '#71717a',
            glow: 'none'
        },

        edge: '#475569',
        edgeAnim: '#f97316',
    },
    light: {
        bg: '#eff6ff', // blue-50 (sky)

        // Node Types
        prereq: {
            bg: 'rgba(255, 255, 255, 0.6)',
            border: '#0ea5e9', // sky-500
            text: '#0c4a6e', // sky-900
            glow: '0 4px 12px rgba(14, 165, 233, 0.25)'
        },
        target: {
            bg: 'rgba(249, 115, 22, 0.9)',
            border: '#c2410c',
            text: '#ffffff',
            glow: '0 8px 30px rgba(249, 115, 22, 0.5)'
        },
        unlock: {
            bg: 'rgba(255, 255, 255, 0.6)',
            border: '#10b981', // emerald-500
            text: '#064e3b', // emerald-900
            glow: '0 4px 12px rgba(16, 185, 129, 0.25)'
        },
        missing: {
            bg: 'rgba(241, 245, 249, 0.8)',
            border: '#94a3b8',
            text: '#64748b',
            glow: 'none'
        },

        edge: '#94a3b8',
        edgeAnim: '#f97316',
    }
};

// --- Custom Node ---
function CourseNode({ data }) {
    const theme = data.theme || 'dark';
    const category = data.category || (data.isTarget ? 'target' : (data.exists ? 'prereq' : 'missing'));

    // Handle fallback for old parser output (though we updated it)
    // 'unlock' is only explicitly set by parser. 'target'/'prereq' inferred if missing.

    const pal = COLORS[theme];
    const style = pal[category] || pal.missing; // safety fallback

    return (
        <div style={{
            background: style.bg,
            border: `2px solid ${style.border}`,
            borderRadius: 16,
            padding: '16px 24px',
            minWidth: 180,
            color: style.text,
            textAlign: 'center',
            boxShadow: style.glow,
            backdropFilter: 'blur(12px)', // GLAZE effect
            WebkitBackdropFilter: 'blur(12px)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // bouncy
            cursor: 'default'
        }}>
            <Handle type="target" position={Position.Top} style={{ background: style.border, width: 10, height: 10 }} />

            {category === 'unlock' && <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, opacity: 0.8 }}>Unlocks</div>}
            {category === 'prereq' && <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, opacity: 0.6 }}>Prerequisite</div>}

            <div style={{ fontWeight: '800', fontSize: 18, letterSpacing: -0.5 }}>{data.label}</div>

            {data.title && (
                <div style={{
                    fontSize: 12,
                    marginTop: 6,
                    opacity: 0.9,
                    maxWidth: 200,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {data.title}
                </div>
            )}

            <Handle type="source" position={Position.Bottom} style={{ background: style.border, width: 10, height: 10 }} />
        </div>
    );
}

const nodeTypes = { course: CourseNode };

// --- Layout Helper ---
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 220, height: 100 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            targetPosition: isHorizontal ? 'left' : 'top',
            sourcePosition: isHorizontal ? 'right' : 'bottom',
            position: {
                x: nodeWithPosition.x - 110,
                y: nodeWithPosition.y - 50,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

export default function TreePage() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [loading, setLoading] = useState(true);
    const [courseCode, setCourseCode] = useState("COMP-352");

    // Theme State
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // 1. Initial read
        const root = document.documentElement;
        const initial = root.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(initial);

        // 2. Observer
        const obs = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
                if (m.attributeName === 'data-theme') {
                    setTheme(root.dataset.theme);
                }
            });
        });
        obs.observe(root, { attributes: true });

        return () => obs.disconnect();
    }, []);

    // Sync from URL
    useEffect(() => {
        const hash = window.location.hash.replace("#", "");
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code") || hash || "COMP-352";
        if (code) setCourseCode(code.toUpperCase().replace(" ", "-"));
    }, []);

    const loadGraph = useCallback(async () => {
        setLoading(true);
        try {
            const db = await fetchCourses({ subject: 'ALL', term: 'ALL', search: '', minCredits: 0, maxCredits: 99 });
            const rawData = buildGraphData(db, courseCode);

            const rfNodes = rawData.nodes.map(n => ({
                id: n.id,
                type: 'course',
                data: {
                    label: n.data.label,
                    title: n.data.title,
                    exists: n.data.exists,
                    isTarget: n.id === courseCode,
                    category: n.data.category,
                    theme // pass current theme to node
                },
                position: { x: 0, y: 0 }
            }));

            const rfEdges = rawData.edges.map(e => ({
                id: e.id,
                source: e.source,
                target: e.target,
                type: 'smoothstep',
                animated: true,
                style: { stroke: COLORS[theme].edge, strokeWidth: 2 }
            }));

            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                rfNodes,
                rfEdges
            );

            setNodes(layoutedNodes);
            setEdges(layoutedEdges);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [courseCode, setNodes, setEdges, theme]); // re-run when theme changes to update node data/edge color

    useEffect(() => {
        loadGraph();
    }, [loadGraph]);

    const pal = COLORS[theme];

    return (
        <div style={{ width: '100vw', height: '100vh', background: pal.bg, transition: 'background 0.3s' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.1}
                maxZoom={2}
                colorMode={theme}
            >
                <Background color={pal.nodeBorder} gap={20} />
                <Controls style={{ fill: pal.text }} />
                <MiniMap style={{ background: pal.minimapBg }} nodeColor={pal.minimapArg} />

                <div style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    zIndex: 10,
                    background: pal.panelBg,
                    padding: 16,
                    borderRadius: 8,
                    border: `1px solid ${pal.panelBorder}`,
                    color: pal.text,
                    maxWidth: 300,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    transition: 'background 0.3s'
                }}>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: 18 }}>Prerequisite Tree</h1>
                    <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
                        Visualizing dependencies for <strong style={{ color: pal.targetBorder }}>{courseCode}</strong>.
                        Scroll to zoom, drag to pan.
                    </p>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <input
                            style={{
                                background: pal.inputBg,
                                border: `1px solid ${pal.panelBorder}`,
                                padding: '4px 8px',
                                color: pal.text,
                                borderRadius: 4,
                                width: '100%'
                            }}
                            placeholder="Search e.g. COMP-352"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setCourseCode(e.currentTarget.value.toUpperCase().replace(" ", "-"));
                                }
                            }}
                        />
                    </div>
                </div>
            </ReactFlow>
        </div>
    );
}
