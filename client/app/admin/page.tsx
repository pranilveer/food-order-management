"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getOrders, updateOrderStatus } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/toast/ToastContext";
import { Order, OrderStatus } from "@/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "Received",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-yellow-100 text-yellow-800",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  ORDER_RECEIVED: "PREPARING",
  PREPARING: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
  DELIVERED: null,
};

const formatPrice = (price: number) => `₹${(price / 100).toFixed(0)}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");

  const fetchOrders = useCallback(async () => {
    try {
      const data = await getOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !isAdmin) {
      setLoading(false);
      return;
    }

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders, isAuthenticated, isAdmin, authLoading]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      addToast(`Order status updated to ${STATUS_LABELS[newStatus]}`, "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      setError(message);
      addToast(message, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-700 text-lg mb-2">Access Denied</p>
          <p className="text-gray-500 text-sm mb-6">You need admin privileges to access this page.</p>
          {!isAuthenticated ? (
            <button
              onClick={() => router.push("/login?redirect=/admin")}
              className="bg-[#d1411e] text-white px-6 py-3 rounded-lg hover:bg-[#b8371a] transition-colors font-medium"
            >
              Login as Admin
            </button>
          ) : (
            <button
              onClick={() => router.push("/")}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Go to Home
            </button>
          )}
        </div>
      </div>
    );
  }

  const filteredOrders = filter === "ALL"
    ? orders
    : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    active: orders.filter((o) => o.status !== "DELIVERED").length,
    revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Active Orders</p>
          <p className="text-2xl font-bold text-orange-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">{formatPrice(stats.revenue)}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["ALL", "ORDER_RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status === "ALL" ? "All" : STATUS_LABELS[status]}
            {status !== "ALL" && (
              <span className="ml-1 text-xs opacity-75">
                ({orders.filter((o) => o.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Items
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Time
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const nextStatus = NEXT_STATUS[order.status];
                return (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>{order.customer.name}</div>
                      <div className="text-gray-500 text-xs">{order.customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items.map((item) => (
                        <div key={item.menuItemId}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      {nextStatus && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, nextStatus)}
                          disabled={updatingId === order._id}
                          className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600 disabled:opacity-50 transition-colors"
                        >
                          {updatingId === order._id ? "..." : `Move to ${STATUS_LABELS[nextStatus]}`}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
