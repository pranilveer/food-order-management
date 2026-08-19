"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, totalAmount, totalItems } =
    useCart();

  const formatPrice = (price: number) => `₹${(price / 100).toFixed(0)}`;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-28">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Cart</h2>
        <p className="text-gray-500 text-sm">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-28">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
      </h2>

      <div className="space-y-4 mb-4">
        {items.map((item) => (
          <div
            key={item.menuItem._id}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {item.menuItem.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatPrice(item.menuItem.price)} each
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.menuItem._id, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                -
              </button>
              <span className="text-sm font-medium w-6 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(item.menuItem._id, item.quantity + 1)
                }
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 text-sm"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.menuItem._id)}
              className="text-red-500 hover:text-red-700 text-xs ml-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-lg" style={{ color: '#b7903c' }}>
            {formatPrice(totalAmount)}
          </span>
        </div>
        <Link
          href="/checkout"
          className="block w-full text-white text-center py-3 rounded-lg transition-all duration-300 font-medium hover:brightness-110 hover:shadow-md"
          style={{ backgroundColor: '#d1411e' }}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
