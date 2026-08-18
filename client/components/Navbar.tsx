"use client";

import styles from '../styles/Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './cart/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { totalItems } = useCart();
  const cartCount = totalItems;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.callButton}>
          <Image src="/img/telephone.png" alt="Telephone" width={32} height={32} />
        </div>
        <div className={styles.texts}>
          <div className={styles.text}>ORDER NOW</div>
          <div className={styles.text}>012 345 678</div>
        </div>
      </div>
      <div className={styles.item}>
        <Image className={styles.mobileLogo} src="/img/logo.png" alt="Logo" width={100} height={35} />
        <ul className={`${styles.list} ${menuOpen ? styles.listOpen : ''}`}>
          <li className={styles.listItem}><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <Image className={styles.menuLogo} src="/img/logo.png" alt="Logo" width={140} height={49} />
          <li className={styles.listItem}><Link href="/orders" onClick={() => setMenuOpen(false)}>Orders</Link></li>
          <li className={styles.listItem}><Link href="#footer" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        </ul>
      </div>
      <div className={styles.item}>
        <Link href="/cart" className={styles.cartLink}>
          <svg className={styles.cartIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="white"/>
            <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="white"/>
            <path d="M1 1H5L7.68 14.39C7.77 14.8504 8.02 15.264 8.38 15.5583C8.74 15.8526 9.19 16.0084 9.65 16H19.4C19.8604 16.0084 20.3099 15.8526 20.6699 15.5583C21.0299 15.264 21.28 14.8504 21.37 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.counter}>{cartCount}</span>
        </Link>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ''}`} />
        </button>
      </div>
    </div>
  );
}
