"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ChatWidget.module.css";

const API = "/api/chat";
const WELCOME_FLAG = "clara:welcomeShown";
const HISTORY_KEY = "clara:history";

/* --------------------------------- component --------------------------------- */
export default function ChatWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const endRef = useRef();

  // Scroll on update
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load History on Mount
  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" && sessionStorage.getItem(HISTORY_KEY);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
  }, []);

  // Save History on Change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-open Welcome (only if no history)
  useEffect(() => {
    if (messages.length > 0) return; // Don't show welcome if history exists

    const alreadyShown = typeof window !== "undefined" && sessionStorage.getItem(WELCOME_FLAG);
    if (alreadyShown) return;

    const t = setTimeout(() => {
      try { sessionStorage.setItem(WELCOME_FLAG, "1"); } catch { }
      setOpen(true);
      setMessages((m) => {
        if (m.length) return m;
        return [...m, {
          role: "assistant",
          html: "Hi! I'm your student guide.<br/><br/>Ask me about <strong>Courses</strong> (e.g. COMP 248), <strong>Profs</strong>, or <strong>Difficulty</strong>.",
          actions: [
            { label: "View Tree Graph", link: "/pages/tree" },
            { label: "Search Courses", link: "/pages/courses" },
            { label: "GPA Calculator", link: "/pages/gpa" },
          ]
        }];
      });
    }, 6000);

    return () => clearTimeout(t);
  }, [messages.length]);

  // Focus when opening
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  function TypingBubble() {
    return (
      <div className={`${styles.msgAi}`}>
        <div className={`${styles.msgText} ${styles.typing}`} aria-live="polite" aria-label="Assistant is typing">
          <span className={styles.dots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </span>
          <span className={styles.typingText}>Clara is typing…</span>
        </div>
      </div>
    );
  }

  function pushMessage(msg) {
    setMessages((m) => [...m, msg]);
  }

  async function send() {
    if (!text.trim()) return;
    const user = { role: "user", text: text.trim() };
    pushMessage(user);
    setLoading(true);
    setText("");

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: user.text }),
      });
      const data = await res.json();

      if (data.reply) {
        pushMessage({ role: "assistant", text: data.reply, actions: data.actions });
      } else if (data.html) {
        pushMessage({ role: "assistant", html: data.html, actions: data.actions });
      } else {
        pushMessage({ role: "assistant", text: "I'm not sure how to answer that." });
      }

    } catch {
      pushMessage({ role: "assistant", text: "Network error — try again." });
    } finally {
      setLoading(false);
    }
  }

  function handleAction(action) {
    if (action.link) {
      // Soft Navigation for internal links
      if (action.link.startsWith("/") || action.link.includes(window.location.host)) {
        router.push(action.link);
      } else {
        window.open(action.link, "_blank");
      }
    }
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className={styles.container} data-open={open ? "1" : "0"}>
      <button className={styles.fab} aria-label="Chat" onClick={() => setOpen(v => !v)}>
        <img src="/clara_launcher.png" alt="Clara Chatbot" className={styles.fabIcon} />
      </button>

      {open && (
        <div className={styles.panel} role="dialog" aria-modal="true">
          <div className={styles.header}>
            <div className={styles.title}>Clara — Student Guide</div>
            <button className={styles.close} onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? styles.msgUser
                    : `${styles.msgAi} ${m.isCommunity ? styles.msgCommunity : ""}`
                }
              >
                {m.html ? (
                  <div
                    className={`${styles.msgText} ${styles.msgTextHtml || ""}`}
                    dangerouslySetInnerHTML={{ __html: m.html }}
                  />
                ) : (
                  <div className={styles.msgText} style={{ whiteSpace: "pre-wrap" }}>
                    {m.text}
                  </div>
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
            {loading && <TypingBubble />}

            <div ref={endRef} /> {/* scroll anchor */}
          </div>

          <div className={styles.inputRow}>
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about a course..."
              className={styles.input}
              rows={1}
            />
            <button className={styles.send} onClick={send} disabled={loading || !text.trim()}>
              {loading ? "…" : "Send"}
            </button>
          </div>

          <div className={styles.hint}>
            No AI Limits. Ask freely about Courses, Profs, and Reddit Advice.
          </div>
        </div>
      )}
    </div>
  );
}
