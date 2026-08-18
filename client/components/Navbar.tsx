"use client";

import styles from '../styles/Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './cart/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const cartCount = totalItems;

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
        <ul className={styles.list}>
          <li className={styles.listItem}><Link href="/">Home</Link></li>
          <Image src="/img/logo.png" alt="Logo" width={140} height={49} />
          <li className={styles.listItem}><Link href="/orders">Orders</Link></li>
          <li className={styles.listItem}><Link href="#footer">Contact</Link></li>
        </ul>
      </div>
      <div className={styles.item}>
        <div className={styles.cart}>
          <Image src="/img/cart.png" alt="Cart" width={30} height={30} />
          <div className={styles.counter}>{cartCount}</div>
        </div>
      </div>
    </div>
  );
}
