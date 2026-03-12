"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Star, BookOpen, MessageCircle } from "lucide-react";
import styles from "./ChatWidget.module.css";

const API = "/api/chat";
const WELCOME_FLAG = "clara:welcomeShown";
const HISTORY_KEY = "clara:history";

/* --------------------------------- component --------------------------------- */
/* --------------------------------- Sound --------------------------------- */
const SoundManager = {
  ctx: null,
  init: () => {
    if (!SoundManager.ctx && typeof window !== "undefined") {
      SoundManager.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playPop: () => {
    SoundManager.init();
    if (!SoundManager.ctx) return;
    const osc = SoundManager.ctx.createOscillator();
    const gain = SoundManager.ctx.createGain();
    osc.connect(gain);
    gain.connect(SoundManager.ctx.destination);

    // Simple "Click" (Send)
    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, SoundManager.ctx.currentTime);

    gain.gain.setValueAtTime(0.15, SoundManager.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, SoundManager.ctx.currentTime + 0.05);

    osc.start();
    osc.stop(SoundManager.ctx.currentTime + 0.05);
  },
  playDing: () => {
    SoundManager.init();
    if (!SoundManager.ctx) return;
    const osc = SoundManager.ctx.createOscillator();
    const gain = SoundManager.ctx.createGain();
    osc.connect(gain);
    gain.connect(SoundManager.ctx.destination);

    // Simple "Bloop" (Receive)
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, SoundManager.ctx.currentTime);

    gain.gain.setValueAtTime(0.15, SoundManager.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, SoundManager.ctx.currentTime + 0.15);

    osc.start();
    osc.stop(SoundManager.ctx.currentTime + 0.15);
  }
};

/* ---------------------------------- Typewriter --------------------------------- */
function Typewriter({ text, speed = 20, onComplete }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;
    const t = setInterval(() => {
      if (index < text.length) {
        setDisplayed((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(t);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);

  return <span>{displayed}</span>;
}

/* --------------------------------- component --------------------------------- */
export default function ChatWidget() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname?.startsWith("/dev-docs")) return null;

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const inputRef = useRef();
  const endRef = useRef();
  const messagesRef = useRef();

  // Scroll on update (debounced slightly for typewriter)
  useEffect(() => {
    const t = setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(t);
  }, [messages, loading]);

  // Load History on Mount
  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" && sessionStorage.getItem(HISTORY_KEY);
      if (saved) {
        // Mark all loaded history as NOT animating
        const parsed = JSON.parse(saved).map(m => ({ ...m, animate: false }));
        setMessages(parsed);
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
  }, []);

  // Save History on Change
  useEffect(() => {
    if (messages.length > 0) {
      // Don't save 'animate' flag to storage
      const clean = messages.map(({ animate, ...rest }) => rest);
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(clean));
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
      if (soundEnabled) SoundManager.playDing(); // Ding on welcome
      setMessages((m) => {
        if (m.length) return m;
        return [...m, {
          role: "assistant",
          html: "Hi! I'm your student guide.<br/><br/>Ask me about <strong>Courses</strong> (e.g. COMP 248), <strong>Profs</strong>, or <strong>Difficulty</strong>.",
          actions: [
            { label: "View Tree Graph", link: "/pages/tree" },
            { label: "Search Courses", link: "/pages/courses" },
            { label: "GPA Calculator", link: "/pages/gpa" },
          ],
          animate: true // Animate welcome? Maybe not HTML, just text. HTML handles fade itself.
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
    setMessages((m) => {
      // Mark previous messages as animate:false to stop them
      const old = m.map(x => ({ ...x, animate: false }));
      return [...old, msg];
    });
  }

  async function send() {
    if (!text.trim()) return;
    if (soundEnabled) SoundManager.playPop(); // Pop on send

    // Normalize text
    const input = text.trim();
    const inputLower = input.toLowerCase();

    const user = { role: "user", text: input };
    pushMessage(user);
    setLoading(true);
    setText("");

    // Quick Greeting Intercept (Client-side)
    const greetings = ["hello", "hi", "hey", "hola", "bonjour", "greetings"];
    if (greetings.some(g => inputLower.startsWith(g)) && inputLower.length < 15) {
      setTimeout(() => {
        if (soundEnabled) SoundManager.playDing();
        pushMessage({
          role: "assistant",
          text: "Hello! 👋 I'm Clara. How can I help you today?",
          actions: [
            { label: "Search Courses", link: "/pages/courses" },
            { label: "GPA Calculator", link: "/pages/gpa" },
          ],
          animate: true
        });
        setLoading(false);
      }, 600); // Slight natural delay
      return;
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: user.text }),
      });
      const data = await res.json();

      if (soundEnabled) SoundManager.playDing(); // Ding on reply

      // Decide response type
      // Decide response type
      let aiMsg = { role: "assistant", animate: true };

      if (data.reply) {
        aiMsg.text = data.reply;
      }

      if (data.tool) {
        aiMsg.tool = data.tool;
        aiMsg.data = data.data;
      } else if (!data.reply && !data.tool) {
        aiMsg.text = "I'm not sure how to answer that.";
      }

      pushMessage(aiMsg);

    } catch {
      pushMessage({ role: "assistant", text: "Network error — try again.", animate: true });
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
        <img src="/clara.svg" alt="Clara Chatbot" className={styles.fabIcon} />
      </button>

      {open && (
        <div className={styles.panel} role="dialog" aria-modal="true">
          <div className={styles.header}>
            <div className={styles.title}>Clara — Student Guide</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className={styles.close}
                onClick={() => setSoundEnabled(v => !v)}
                title={soundEnabled ? "Mute" : "Unmute"}
                style={{ fontSize: "1rem" }}
              >
                {soundEnabled ? "🔊" : "🔇"}
              </button>
              <button className={styles.close} onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
          </div>

          <div className={styles.messages} ref={messagesRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? styles.msgUser
                    : `${styles.msgAi} ${m.isCommunity ? styles.msgCommunity : ""}`
                }
              >
                {m.role !== "user" && (
                  <img src="/clara.svg" alt="AI" className={styles.avatar} />
                )}

                <div style={{ display: "flex", flexDirection: "column", maxWidth: "100%" }}>
                  {m.html ? (
                    <div
                      className={`${styles.msgText} ${styles.msgTextHtml || ""}`}
                      dangerouslySetInnerHTML={{ __html: m.html }}
                    />
                  ) : (
                    m.text && (
                      <div className={styles.msgText} style={{ whiteSpace: "pre-wrap" }}>
                        {m.animate && i === messages.length - 1 ? (
                          <Typewriter text={m.text || ""} />
                        ) : (
                          m.text
                        )}
                      </div>
                    )
                  )}

                  {/* --- Tool Cards Integration (Inline Styles for reliability) --- */}
                  {m.tool === "RMP" && m.data && (
                    <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
                      <div style={{ fontWeight: "700", fontSize: "1.1rem", color: "#111827" }}>
                        {m.data.firstName} {m.data.lastName}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "8px" }}>
                        {m.data.department}
                      </div>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#d1fae5", color: "#065f46", padding: "4px 8px", borderRadius: "4px", fontWeight: "700", fontSize: "0.875rem" }}>
                          <Star size={14} /> {m.data.avgRating} / 5
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#e5e7eb", color: "#374151", padding: "4px 8px", borderRadius: "4px", fontWeight: "700", fontSize: "0.875rem" }}>
                          Diff: {m.data.avgDifficulty} / 5
                        </div>
                      </div>
                      <a
                        href={`https://www.ratemyprofessors.com/search/professors?q=${m.data.firstName}%20${m.data.lastName}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: "block", marginTop: "8px", fontSize: "0.75rem", color: "#2563eb", textDecoration: "underline", cursor: "pointer" }}
                      >
                        View on RateMyProfessors
                      </a>
                    </div>
                  )}

                  {m.tool === "COURSE" && m.data && (
                    <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "#eff6ff", border: "1px solid #dbeafe", borderRadius: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#1e3a8a", fontWeight: "700", fontSize: "1.1rem" }}>
                        <BookOpen size={18} /> {m.data.title}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#2563eb", fontFamily: "monospace", margin: "4px 0 8px 0" }}>
                        {m.data.name} • {m.data.credits} Credits
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#374151", lineHeight: "1.4" }}>
                        {m.data.description}
                      </div>
                      <div style={{ marginTop: "8px", fontSize: "0.75rem", color: "#6b7280" }}>
                        <strong>Prereqs:</strong> {m.data.prereq || "None"}
                      </div>
                    </div>
                  )}

                  {m.tool === "REDDIT" && m.data && (
                    <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "#fff7ed", border: "1px solid #ffedd5", borderRadius: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#7c2d12", fontWeight: "700" }}>
                        <MessageCircle size={18} /> Reddit Consensus
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#374151", marginTop: "4px" }}>
                        See {m.data.sources ? m.data.sources.length : 0} discussion(s) below.
                      </div>
                      {/* Optional: List sources title */}
                      {m.data.sources && (
                        <ul style={{ marginTop: "8px", paddingLeft: "16px", fontSize: "0.75rem", color: "#ea580c" }}>
                          {m.data.sources.map((s, idx) => (
                            <li key={idx} style={{ marginBottom: "4px" }}>
                              <a href={s.url} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                                {s.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
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
            <button className={styles.send} onClick={send} disabled={loading || !text.trim()} aria-label="Send message">
              {loading && "…"}
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
