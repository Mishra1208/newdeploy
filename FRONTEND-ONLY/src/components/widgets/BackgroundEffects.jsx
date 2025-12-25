"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "@/app/home.module.css"; // We'll add styles here

const BackgroundEffects = () => {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        // Generate static nodes once
        const nodeData = [
            { id: 1, text: "COMP 248", x: "10%", y: "15%", delay: 0, duration: 15 },
            { id: 2, text: "MATH 203", x: "85%", y: "25%", delay: 2, duration: 18 },
            { id: 3, text: "SOEN 287", x: "75%", y: "75%", delay: 5, duration: 20 },
            { id: 4, text: "ENGR 213", x: "15%", y: "65%", delay: 1, duration: 22 },
            { id: 5, text: "COMM 215", x: "45%", y: "85%", delay: 3, duration: 25 },
        ];
        setNodes(nodeData);
    }, []);

    return (
        <div className={styles.cosmosContainer}>
            {/* Floating Nodes */}
            {nodes.map((node) => (
                <motion.div
                    key={node.id}
                    className={styles.floatingNode}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0.2, 0.5, 0.2],
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                    }}
                    transition={{
                        duration: node.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: node.delay,
                    }}
                    style={{ top: node.y, left: node.x }}
                >
                    {node.text}
                </motion.div>
            ))}

            {/* Meteors removed */}
        </div>
    );
};

export default BackgroundEffects;
