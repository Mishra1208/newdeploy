
"use client";
import React, { useState, useRef, useEffect } from "react";
import { User, Bot, Send } from "lucide-react";

export default function ChatTestPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const endRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { role: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Reverted to legacy rule-based API (v1) for stability
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg.text }),
            });
            const data = await res.json();

            let botMsg = { role: "bot", raw: data };

            if (data.reply) {
                botMsg.text = data.reply;
            }

            if (data.tool) {
                botMsg.tool = data.tool; // "RMP", "REDDIT", "COURSE"
                botMsg.data = data.data; // The payload
            }

            setMessages((prev) => [...prev, botMsg]);
        } catch (e) {
            setMessages((prev) => [...prev, { role: "bot", text: "Error: " + e.message }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-mono">
            <div className="max-w-4xl mx-auto border border-gray-200 rounded-xl overflow-hidden shadow-2xl bg-white">

                {/* Header */}
                <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                    <h1 className="font-bold text-xl text-emerald-600">Standard Chatbot (Rule-Based)</h1>
                    <div className="text-xs text-gray-500">API: /api/chat</div>
                </div>

                {/* Chat Area */}
                <div className="h-[600px] overflow-y-auto p-6 space-y-6 bg-gray-50">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${m.role === "user" ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"}`}>
                                {m.role === "user" ? <User size={18} /> : <Bot size={18} />}
                            </div>

                            <div className={`max-w-[80%] space-y-2`}>
                                <div className={`p-4 rounded-xl shadow-sm ${m.role === "user" ? "bg-blue-50 border border-blue-100 text-blue-900" : "bg-white border border-gray-200 text-gray-800"}`}>
                                    <p className="whitespace-pre-wrap">{m.text}</p>

                                    {/* --- Tool Cards --- */}
                                    {m.tool === "RMP" && m.data && (
                                        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <div className="font-bold text-lg text-gray-900">{m.data.firstName} {m.data.lastName}</div>
                                            <div className="text-sm text-gray-500 mb-2">{m.data.department}</div>
                                            <div className="flex gap-3">
                                                <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded font-bold">
                                                    ★ {m.data.avgRating} / 5
                                                </div>
                                                <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded font-bold">
                                                    Diff: {m.data.avgDifficulty} / 5
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-blue-600 underline cursor-pointer">View on RateMyProfessors</div>
                                        </div>
                                    )}

                                    {m.tool === "COURSE" && m.data && (
                                        <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                            <div className="font-bold text-lg text-blue-900">{m.data.title}</div>
                                            <div className="text-sm text-blue-600 font-mono mb-2">{m.data.name} • {m.data.credits} Credits</div>
                                            <p className="text-sm text-gray-700 mb-2">{m.data.description}</p>
                                            <div className="text-xs text-gray-500">
                                                <strong>Prereqs:</strong> {m.data.prereq || "None"}
                                            </div>
                                        </div>
                                    )}

                                    {m.tool === "REDDIT" && m.data && (
                                        <div className="mt-3 p-3 bg-orange-50 border border-orange-100 rounded-lg">
                                            <div className="font-bold text-orange-900 flex items-center gap-2">
                                                <span>🔥 Reddit Consensus</span>
                                            </div>
                                            <div className="text-sm text-gray-700 mt-1">
                                                Analysis of recent discussions from r/Concordia.
                                            </div>
                                            {/* Add link or more details if available in data */}
                                        </div>
                                    )}
                                </div>

                                {/* Debug Info (Hidden by default or smaller) */}
                                {/* {m.tool && (
                                    <div className="text-xs font-mono p-3 bg-gray-100 border border-gray-300 rounded text-gray-700 overflow-x-auto">
                                        <div className="font-bold mb-1 opacity-70">TOOL PAYLOAD ({m.tool}):</div>
                                        <pre>{JSON.stringify(m.data, null, 2)}</pre>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center animate-pulse">
                                <Bot size={18} className="text-emerald-600" />
                            </div>
                            <div className="p-4 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 text-sm italic">
                                Gemini is thinking...
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                        className="flex gap-2"
                    >
                        <input
                            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-gray-900 placeholder:text-gray-400"
                            placeholder="Ask about a course, professor, or difficulty..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={loading || !input}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                        >
                            <Send size={18} /> Send
                        </button>
                    </form>
                </div>

            </div>

            <div className="max-w-xl mx-auto mt-8 text-center text-gray-500 text-sm">
                <p>Make sure GEMINI_API_KEY is allowed in your .env.local</p>
            </div>
        </div>
    );
}
