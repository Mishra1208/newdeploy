"use client";

import { useEffect, useState } from "react";
import styles from "./Meteors.module.css";

export const Meteors = ({ number = 20 }) => {
    const [meteors, setMeteors] = useState([]);

    useEffect(() => {
        const styles = [];
        for (let i = 0; i < number; i++) {
            styles.push({
                top: Math.floor(Math.random() * 100) + "%",
                left: Math.floor(Math.random() * 100) + "%",
                animationDelay: Math.random() * 1 + 0.2 + "s",
                animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
            });
        }
        setMeteors(styles);
    }, [number]);

    return (
        <>
            {meteors.map((style, idx) => (
                <span
                    key={idx}
                    className={styles.meteor}
                    style={style}
                />
            ))}
        </>
    );
};
