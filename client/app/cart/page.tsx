"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export default function CartPage() {
  const router = useRouter();
  const { items, totalAmount, totalItems, removeItem, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price: number) => `₹${(price / 100).toFixed(0)}`;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  if (items.length === 0) {
    return (
    <div className="max-w-2xl mx-auto px-4 py-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push("/")}
            className="bg-[#d1411e] text-white px-6 py-2 rounded-lg hover:bg-[#b8371a] transition-colors font-medium"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.menuItem._id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{item.menuItem.name}</h3>
                  <p className="text-sm text-gray-500">{formatPrice(item.menuItem.price)}</p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors text-lg font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">{formatPrice(item.menuItem.price * item.quantity)}</p>
                  <button
                    onClick={() => removeItem(item.menuItem._id)}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors hidden md:inline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 ml-[76px] md:hidden">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors text-lg font-bold"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.menuItem._id)}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Items</span>
          <span className="font-medium">{totalItems}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-lg text-green-600">{formatPrice(totalAmount)}</span>
        </div>
        {!isAuthenticated && (
          <p className="text-sm text-orange-600 mb-3 text-center">You&apos;ll need to login before checkout</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="flex-1 border border-red-500 text-red-500 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="flex-1 bg-[#d1411e] text-white py-3 rounded-lg font-medium hover:bg-[#b8371a] transition-colors"
          >
            {isAuthenticated ? "Checkout" : "Login to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
