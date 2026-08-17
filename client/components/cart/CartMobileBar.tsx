"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export default function CartMobileBar() {
  const { totalItems, totalAmount } = useCart();

  if (totalItems === 0) return null;

  const formatPrice = (price: number) => `₹${(price / 100).toFixed(0)}`;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 px-4 py-3">
      <Link
        href="/checkout"
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-3">
          <span className="bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {totalItems === 1 ? "1 item" : `${totalItems} items`} in cart
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-green-600">{formatPrice(totalAmount)}</span>
          <span className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg font-medium">
            Checkout
          </span>
        </div>
      </Link>
    </div>
  );
}
