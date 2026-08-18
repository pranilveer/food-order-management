"use client";

import styles from '../styles/Featured.module.css'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Featured() {
    const [index, setIndex] = useState(0)
    const images = [
        "/img/featured.png",
        "/img/featured3.png",
        "/img/featured1.png",
        "/img/featured4.png",
        "/img/featured2.png"
    ]

    const handleArrow = (direction: string) => {
        if (direction === "l") {
            setIndex(index !== 0 ? index - 1 : images.length - 1)
        }
        if (direction === "r") {
            setIndex(index !== images.length - 1 ? index + 1 : 0)
        }
    };

    const autoScroll = () => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    useEffect(() => {
        const intervalId = setInterval(autoScroll, 10000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.arrowContainer} style={{ left: 0 }} onClick={() => handleArrow("l")}>
                <Image src="/img/arrowl.png" alt="" fill style={{ objectFit: 'contain' }} />
            </div>
            <div className={styles.wrapper} style={{ transform: `translateX(${-100 * index}vw)` }}>

                {images.map((img, i) => (
                    <div className={styles.imgContainer} key={i} >
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
