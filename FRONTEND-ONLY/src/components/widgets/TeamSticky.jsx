"use client";
import React from "react";
import { motion } from "motion/react";
import styles from "./team-sticky.module.css";
import { Outfit } from "next/font/google";
import { Github, Linkedin, Instagram } from "lucide-react"; // Using lucide-react for consistent icons

const display = Outfit({ subsets: ["latin"], weight: ["700", "800"] });

const TEAM = [
    {
        name: "Narendra Mishra",
        role: "Founder & Lead Dev",
        avatar: "/team/narendra.JPG",
        links: {
            github: "https://github.com/Mishra1208",
            instagram: "https://www.instagram.com/nar.endra_mis.hra?igsh=MWUyOWx0NHFxbm1sMg==",
            linkedin: "https://www.linkedin.com/in/narendra-mishra-3a0136240/",
        },
    },
    {
        name: "Aryan Kotecha",
        role: "Backend Architect",
        avatar: "/team/aryan.JPG",
        hidden: true,
        links: {
            github: "https://github.com/aryann2212",
            instagram: "https://www.instagram.com/aryann.__.__?igsh=ZDJiNGJzY2syaDNu",
            linkedin: "https://www.linkedin.com/in/aryankotecha/",
        },
    },
    {
        name: "Neelendra Mishra",
        role: "Product Designer",
        avatar: "/team/neelendra.jpeg",
        links: {
            github: "https://github.com/Neelendra-Mishra",
            instagram: "https://www.instagram.com/neelendra_mish.ra?igsh=Y3I5ZXE4ZG02eWY0",
            linkedin: "https://www.linkedin.com/in/neelendra-mishra-031045229/",
        },
    },
];

const TeamItem = ({ member, index }) => {
    return (
        <motion.div
            className={styles.teamItem}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <div className={styles.avatarWrapper}>
                <img src={member.avatar} alt={member.name} className={styles.avatar} />
            </div>

            <div className={styles.content}>
                <div className={styles.roleWrapper}>
                    <span className={styles.role}>{member.role}</span>
                </div>
                <h3 className={`${styles.name} ${display.className}`}>{member.name}</h3>

                <div className={styles.links}>
                    {member.links.github && (
                        <a href={member.links.github} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                            <Github size={24} />
                        </a>
                    )}
                    {member.links.linkedin && (
                        <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                            <Linkedin size={24} />
                        </a>
                    )}
                    {member.links.instagram && (
                        <a href={member.links.instagram} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                            <Instagram size={24} />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default function TeamSticky() {
    return (
        <section className={styles.container}>
            <div className={styles.stickyWrapper}>

                {/* Left Column: Sticky Heading */}
                <div className={styles.leftColumn}>
                    <div className={styles.stickyContent}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className={styles.kicker}>THE BUILDERS</span>
                            <h2 className={`${styles.heading} ${display.className}`}>
                                Driven by <br />
                                <span className={styles.gradientText}>Expertise.</span>
                            </h2>
                            <p className={styles.intro}>
                                United by the same purpose: to unsnarl the academic web.
                                We are students building for students.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Column: Scrolling List */}
                <div className={styles.rightColumn}>
                    <div className={styles.list}>
                        {TEAM.filter(member => !member.hidden).map((member, i) => (
                            <TeamItem key={member.name} member={member} index={i} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
