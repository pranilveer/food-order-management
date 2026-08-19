"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrders } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Order, OrderStatus } from "@/types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-yellow-100 text-yellow-800",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "Received",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

const formatPrice = (price: number) => `₹${(price / 100).toFixed(0)}`;

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-700 text-lg mb-2">Please login to view your orders</p>
          <button
            onClick={() => router.push("/login?redirect=/orders")}
            className="bg-[#d1411e] text-white px-6 py-3 rounded-lg hover:bg-[#b8371a] transition-colors font-medium mt-4"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-600 underline"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-gray-500">
                  #{order._id.slice(-6).toUpperCase()}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {order.items.map((item) => (
                  <span key={item.menuItemId}>
                    {item.name} x{item.quantity}
                    {order.items.indexOf(item) < order.items.length - 1
                      ? ", "
                      : ""}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-600">
                  {formatPrice(order.totalAmount)}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
