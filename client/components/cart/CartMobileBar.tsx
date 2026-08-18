"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";

export default function CartMobileBar() {
  const { totalItems, totalAmount } = useCart();
  const pathname = usePathname();

  if (totalItems === 0) return null;
  if (pathname === "/cart" || pathname === "/checkout") return null;

  const formatPrice = (price: number) => `₹${(price / 100).toFixed(0)}`;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3">
      <Link
        href="/cart"
        className="flex items-center justify-between w-full bg-[#d1411e] text-white rounded-2xl px-4 py-3 shadow-[0_-2px_16px_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-center gap-3">
          <span className="bg-white text-[#d1411e] text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
          <span className="text-sm font-semibold">
            {totalItems === 1 ? "1 item" : `${totalItems} items`} in cart
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold">{formatPrice(totalAmount)}</span>
          <span className="bg-white text-[#d1411e] text-sm px-4 py-2 rounded-xl font-bold">
            Checkout
          </span>
        </div>
      </Link>
    </div>
  );
}
