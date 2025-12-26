"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const inputRef = useRef();
  const endRef = useRef();

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

      if (soundEnabled) SoundManager.playDing(); // Ding on reply

      // Decide response type
      let aiMsg = { role: "assistant", animate: true };
      if (data.reply) {
        aiMsg.text = data.reply;
        aiMsg.actions = data.actions;
      } else if (data.html) {
        aiMsg.html = data.html;
        aiMsg.actions = data.actions;
        // HTML is hard to typewriter reliably without breaking tags, so we just fade it in (CSS default)
        aiMsg.animate = false;
      } else {
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
                    <div className={styles.msgText} style={{ whiteSpace: "pre-wrap" }}>
                      {m.animate && i === messages.length - 1 ? (
                        <Typewriter text={m.text || ""} />
                      ) : (
                        m.text
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
