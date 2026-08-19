"use client";

import styles from '../styles/Featured.module.css'
import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'

export default function Featured() {
    const [index, setIndex] = useState(0)
    const [noTransition, setNoTransition] = useState(false)
    const images = [
        "/img/featured.avif",
        "/img/featured3.avif",
        "/img/featured1.avif",
        "/img/featured4.avif",
        "/img/featured2.avif"
    ]

    const handleArrow = (direction: string) => {
        if (direction === "l") {
            if (index === 0) {
                setNoTransition(true)
                setIndex(images.length - 1)
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setNoTransition(false)
                    })
                })
            } else {
                setIndex(index - 1)
            }
        }
        if (direction === "r") {
            if (index === images.length - 1) {
                setNoTransition(true)
                setIndex(0)
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setNoTransition(false)
                    })
                })
            } else {
                setIndex(index + 1)
            }
        }
    };

    const autoScroll = useCallback(() => {
        setIndex((prevIndex) => {
            if (prevIndex === images.length - 1) {
                setNoTransition(true)
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setNoTransition(false)
                    })
                })
                return 0
            }
            return prevIndex + 1
        });
    }, [images.length]);

    useEffect(() => {
        const intervalId = setInterval(autoScroll, 10000);
        return () => clearInterval(intervalId);
    }, [autoScroll]);

    return (
        <div className={styles.container}>
            <div className={styles.arrowContainer} style={{ left: 0 }} onClick={() => handleArrow("l")}>
                <Image src="/img/arrowl.png" alt="" fill style={{ objectFit: 'contain' }} />
            </div>
            <div
                className={styles.wrapper}
                style={{
                    transform: `translateX(${-100 * index}vw)`,
                    transition: noTransition ? 'none' : undefined,
                }}
            >
                {images.map((img, i) => (
                    <div className={styles.imgContainer} key={i}>
                        <Image src={img} alt="" fill style={{ objectFit: 'contain' }} priority={i === 0} />
                    </div>
                ))}
            </div>
            <div className={styles.arrowContainer} style={{ right: 0 }} onClick={() => handleArrow("r")}>
                <Image src="/img/arrowr.png" alt="" fill style={{ objectFit: 'contain' }} />
            </div>
        </div>
    );
}
