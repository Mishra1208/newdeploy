import { Github, Instagram, Linkedin } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useRef } from "react";
import styles from "./profile.module.css";

export default function Profile({ name, role, avatar, links = {} }) {
  const ref = useRef(null);

  // Magnetic movement values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate distance from center (max 20px pull)
    const moveX = (e.clientX - centerX) * 0.2;
    const moveY = (e.clientY - centerY) * 0.2;

    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className={styles.card}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
        className={styles.imgWrapper}
      >
        <img src={avatar} alt={`${name} avatar`} className={styles.img} />
      </motion.div>

      <div className={styles.meta}>
        <div className={styles.name}>{name}</div>
        <div className={styles.role}>{role}</div>
      </div>

      <div className={styles.socialBar}>
        {links.github && (
          <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={18} />
          </a>
        )}
        {links.instagram && (
          <a href={links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram size={18} />
          </a>
        )}
        {links.linkedin && (
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
        )}
      </div>
    </div>
  );
}
