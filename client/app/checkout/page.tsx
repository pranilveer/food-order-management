"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/toast/ToastContext";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { createOrder } from "@/services/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const formatPrice = (price: number) => `₹${(price / 100).toFixed(0)}`;

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-700 text-lg mb-2">Please login to place your order</p>
          <p className="text-gray-500 text-sm mb-6">You need to be logged in to checkout.</p>
          <button
            onClick={() => router.push("/login?redirect=/checkout")}
            className="bg-[#d1411e] text-white px-6 py-3 rounded-lg hover:bg-[#b8371a] transition-colors font-medium"
          >
            Login to Checkout
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push("/")}
            className="bg-[#d1411e] text-white px-6 py-2 rounded-lg hover:bg-[#b8371a] transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (customer: {
    name: string;
    address: string;
    phone: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const order = await createOrder({
        items: items.map((item) => ({
          menuItemId: item.menuItem._id,
          quantity: item.quantity,
        })),
        customer,
      });

      setOrderSuccess(true);

      setTimeout(() => {
        clearCart();
        router.push(`/orders/${order._id}`);
      }, 2500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to place order";
      setError(message);
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="success-checkmark mb-6">
            <div className="checkmark-circle">
              <svg className="checkmark" viewBox="0 0 52 52">
                <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-500">Redirecting to your order...</p>
        </div>
        <style jsx>{`
          .success-checkmark {
            width: 80px;
            height: 80px;
            margin: 0 auto;
          }
          .checkmark-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: block;
            stroke-width: 2;
            stroke: #4ade80;
            stroke-miterlimit: 10;
            animation: scale .3s ease-in-out .9s both;
          }
          .checkmark {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: block;
            stroke-width: 2;
            stroke: #4ade80;
            stroke-miterlimit: 10;
            margin: 0 auto;
            box-shadow: inset 0 0 0 #4ade80;
            animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
          }
          .checkmark-circle-bg {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-width: 2;
            stroke-miterlimit: 10;
            stroke: #4ade80;
            animation: stroke .6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          }
          .checkmark-check {
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            stroke-width: 2;
            stroke: #fff;
            animation: stroke .3s cubic-bezier(0.65, 0, 0.45, 1) .4s forwards;
          }
          @keyframes stroke {
            100% { stroke-dashoffset: 0; }
          }
          @keyframes scale {
            0%, 100% { transform: none; }
            50% { transform: scale3d(1.1, 1.1, 1); }
          }
          @keyframes fill {
            100% { box-shadow: inset 0 0 0 40px #4ade80; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="order-2 lg:order-1 lg:col-span-3 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Delivery Details
          </h2>
          <CheckoutForm onSubmit={handleSubmit} loading={loading} />
          {error && (
            <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2 lg:col-span-2 bg-white rounded-xl shadow-md p-6 lg:sticky lg:top-28 lg:pt-4 lg:self-start">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>
          <div className="max-h-64 overflow-y-auto space-y-3 mb-4 pr-1">
            {items.map((item) => (
              <div key={item.menuItem._id} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.menuItem.name}</p>
                  <p className="text-xs text-gray-500">{formatPrice(item.menuItem.price)} x {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                  {formatPrice(item.menuItem.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
              <span className="text-gray-700">{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-lg text-green-600">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
          <a
            href="/cart"
            className="block text-center text-sm text-[#d1411e] hover:underline mt-4"
          >
            Edit Cart
          </a>
        </div>
      </div>
    </div>
  );
}
