"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
// We'll create the component in the same file for now to keep it self-contained in the playground,
// or import it if we want to reuse it later. For now, inline is easier for "playground".

export default function SmartChatPlayground() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const endRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Initial greeting
    useEffect(() => {
        setMessages([
            {
                role: "assistant",
                type: "text",
                content: "Hi! I'm the new **Smart Router** bot.\n\nI have zero AI limits. Try asking:\n- *\"How many credits is COMP 248?\"*\n- *\"Who teaches SOEN 341?\"*\n- *\"Is COEN 231 hard?\"*",
                actions: [
                    { label: "View Tree Graph", link: "/pages/tree" },
                    { label: "Search Courses", link: "/pages/courses" },
                    { label: "GPA Calculator", link: "/pages/gpa" },
                ]
            },
        ]);
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: "user", type: "text", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/smart-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg.content }),
            });
            const data = await res.json();

            // Append bot response
            if (data.reply) {
                // simple text reply
                setMessages(prev => [...prev, { role: "assistant", type: "text", content: data.reply }]);
            } else if (data.html) {
                // rich HTML (RMP card, etc)
                setMessages(prev => [...prev, { role: "assistant", type: "html", content: data.html }]);
            }

            // If there's structured data (like 'course' details), we could render a special card too.
            // For now, the API returns 'reply' (text) or 'html' (cards).

        } catch (e) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", type: "text", content: "Error connecting to server." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (action) => {
        if (action.link) {
            window.location.href = action.link;
        }
    }

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <h1>Smart Router Playground</h1>
                <p>No LLM. Pure Logic. ⚡</p>
            </header>

            <div className={styles.chatWindow}>
                <div className={styles.messages}>
                    {messages.map((m, i) => (
                        <div key={i} className={`${styles.bubble} ${m.role === "user" ? styles.user : styles.ai}`}>
                            {m.type === "html" ? (
                                <div dangerouslySetInnerHTML={{ __html: m.content }} />
                            ) : (
                                <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                            )}

                            {m.actions && (
                                <div className={styles.actionRow}>
                                    {m.actions.map((act, idx) => (
                                        <button key={idx} className={styles.actionChip} onClick={() => handleAction(act)}>
                                            {act.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className={`${styles.bubble} ${styles.ai} ${styles.typing}`}>
                            <span>•</span><span>•</span><span>•</span>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>

                <div className={styles.inputArea}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type your question..."
                    />
                    <button onClick={handleSend} disabled={loading || !input.trim()}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
