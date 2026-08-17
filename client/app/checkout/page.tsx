"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { useToast } from "@/components/toast/ToastContext";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { createOrder } from "@/services/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => `₹${(price / 100).toFixed(0)}`;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push("/")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
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

      clearCart();
      router.push(`/orders/${order._id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to place order";
      setError(message);
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.menuItem._id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.menuItem.name} x {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(item.menuItem.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-lg text-green-600">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
