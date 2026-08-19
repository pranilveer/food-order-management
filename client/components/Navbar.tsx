"use client";

import styles from '../styles/Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './cart/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = totalItems;
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
    <div className={styles.container}>
      <div className={styles.item}>
        <Link href="/" onClick={() => setMenuOpen(false)}><Image className={styles.mobileNavItemLogo} src="/img/logo.png" alt="Logo" width={100} height={35} /></Link>
        <div className={styles.callButton}>
          <Image src="/img/telephone.png" alt="Telephone" width={32} height={32} />
        </div>
        <div className={styles.texts}>
          <div className={styles.text}>ORDER NOW</div>
          <div className={styles.text}>012 345 678</div>
        </div>
      </div>
      <div className={styles.item}>
        <Link href="/" onClick={() => setMenuOpen(false)}><Image className={styles.mobileLogo} src="/img/logo.png" alt="Logo" width={100} height={35} /></Link>
        <ul className={`${styles.list} ${menuOpen ? styles.listOpen : ''}`}>
          <li className={styles.listItem}><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <Link href="/" onClick={() => setMenuOpen(false)}><Image className={styles.menuLogo} src="/img/logo.png" alt="Logo" width={140} height={49} /></Link>
          {isAuthenticated && (
            <li className={styles.listItem}><Link href="/orders" onClick={() => setMenuOpen(false)}>Orders</Link></li>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <li className={styles.listItem}><Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link></li>
          )}
          <li className={styles.listItem}><Link href="#footer" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          {isAuthenticated ? (
            <li className={`${styles.listItem} ${styles.mobileOnly}`}>
              <button onClick={() => { setMenuOpen(false); setShowLogoutModal(true); }}>
                Logout
              </button>
            </li>
          ) : (
            <li className={`${styles.listItem} ${styles.mobileOnly}`}>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            </li>
          )}
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

        {isAuthenticated ? (
          <div className="flex items-center gap-2 ml-3">
            <span className="text-white text-sm font-medium hidden md:block">{user?.name}</span>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-white text-sm border border-white/50 rounded-lg px-3 py-1.5 hover:bg-white/10 transition-colors hidden md:block"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-white text-sm border border-white/50 rounded-lg px-3 py-1.5 hover:bg-white/10 transition-colors ml-3 hidden md:block"
          >
            Login
          </Link>
        )}

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

    {showLogoutModal && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
          <p className="text-sm text-gray-500 mb-6">Are you sure you want to logout?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => { logout(); setShowLogoutModal(false); setMenuOpen(false); }}
              className="flex-1 bg-[#d1411e] text-white py-2.5 rounded-lg font-medium hover:bg-[#b8371a] transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
