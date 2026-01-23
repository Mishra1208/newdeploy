"use client";
import { useEffect, useState } from "react";
import styles from "./AddButton.module.css";

export default function AddButton({ onAdd, onRemove, isAdded }) {
  const [state, setState] = useState("idle"); // "idle" | "added" | "exists"
  const [hovering, setHovering] = useState(false);

  // Sync state if parent says it's added
  useEffect(() => {
    if (isAdded) {
      setState("added");
    } else if (state === "added") {
      setState("idle");
    }
  }, [isAdded]);

  // Reset transient "exists" state
  useEffect(() => {
    if (state === "exists") {
      const t = setTimeout(() => setState("idle"), 2000);
      return () => clearTimeout(t);
    }
  }, [state]);

  async function handleClick(e) {
    e.stopPropagation(); // prevent card click
    e.preventDefault();

    if (state === "added") {
      // It's already added, so remove it
      await onRemove?.();
      // Parent should flip isAdded to false, which resets state
    } else {
      // Add it
      const ok = await onAdd?.();
      if (!ok) setState("exists");
      // if ok, parent flips isAdded -> true -> useEffect sets "added"
    }
  }

  // Determine text/icon based on state + hover
  let label = "Add to Planner";
  let icon = (
    <svg className={styles.addIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  if (state === "added") {
    if (hovering) {
      label = "Remove";
      icon = (
        <svg className={styles.addIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      );
    } else {
      label = "Added";
      icon = (
        <svg className={styles.addIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      );
    }
  } else if (state === "exists") {
    label = "In Planner";
    icon = (
      <svg className={styles.addIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    );
  }

  return (
    <button
      type="button"
      className={styles.addBtn}
      data-state={state}
      onClick={handleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
