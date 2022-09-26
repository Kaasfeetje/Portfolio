import React, { useEffect, useState } from "react";
import styles from "./hand.module.css";

type PropTypes = {
    state: "rock" | "paper" | "scissors";
    direction: "left" | "right";
    onFinished?: () => void;
};

const Hand = ({ state, direction, onFinished }: PropTypes) => {
    const [isRolling, setIsRolling] = useState(true);
    useEffect(() => {
        const timerOne = setTimeout(() => {
            setIsRolling(false);
        }, 3000);
        let timerTwo: NodeJS.Timeout;
        if (onFinished) {
            timerTwo = setTimeout(() => {
                onFinished();
            }, 4500);
        }
        return () => {
            clearTimeout(timerOne);
            if (timerTwo) {
                clearTimeout(timerTwo);
            }
        };
    }, [onFinished]);

    const getStyle = () => {
        switch (state) {
            case "rock":
                return styles.rock;
            case "paper":
                return styles.paper;
            case "scissors":
                return styles.scissors;
            default:
                return styles.rock;
        }
    };

    const style = getStyle();

    return (
        <div
            className={`${styles.hand} ${isRolling ? styles.rolling : ""} ${
                direction === "left" ? styles.left : ""
            }`}
        >
            <div className={`${direction === "left" ? styles.left : ""}`}>
                <div
                    className={`${styles.finger} ${styles.pinky} ${
                        !isRolling ? style : ""
                    }`}
                ></div>
                <div
                    className={`${styles.finger} ${styles.ring} ${
                        !isRolling ? style : ""
                    }`}
                ></div>
                <div
                    className={`${styles.finger} ${styles.middle} ${
                        !isRolling ? style : ""
                    }`}
                ></div>
                <div
                    className={`${styles.finger} ${styles.pointy} ${
                        !isRolling ? style : ""
                    }`}
                ></div>
                <div
                    className={`${styles.finger} ${styles.thumb} ${
                        !isRolling ? style : ""
                    }`}
                ></div>
            </div>
        </div>
    );
};

export default Hand;
