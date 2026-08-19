"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { getOrders, updateOrderStatus } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/toast/ToastContext";
import { Order, OrderStatus } from "@/types";

function CustomDropdown<T extends string>({
  value,
  options,
  onChange,
  className = "",
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white hover:border-gray-400 transition-colors text-left"
      >
        <span className="truncate">{selected?.label}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                opt.value === value ? "bg-orange-50 text-[#d1411e] font-medium" : "text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "price-low", label: "Price: Low to High" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

const PAGE_SIZES = [5, 10, 20, 50];

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
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (filter !== "ALL") {
      result = result.filter((o) => o.status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o._id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "newest":
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result = [...result].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "price-low":
        result = [...result].sort((a, b) => a.totalAmount - b.totalAmount);
        break;
    }

    return result;
  }, [orders, filter, search, sort]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search, sort, pageSize]);

  const stats = {
    total: orders.length,
    active: orders.filter((o) => o.status !== "DELIVERED").length,
    revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-[60vh]">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d1411e] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-[60vh]">
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-gray-400">
          <p className="text-sm text-gray-500 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-[#d1411e]">
          <p className="text-sm text-gray-500 mb-1">Active Orders</p>
          <p className="text-2xl font-bold text-[#d1411e]">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">{formatPrice(stats.revenue)}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by order ID, name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#d1411e] focus:border-[#d1411e] outline-none transition-colors"
          />
        </div>
        <CustomDropdown
          value={sort}
          options={[...SORT_OPTIONS]}
          onChange={(v) => setSort(v)}
          className="w-full sm:w-52"
        />
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["ALL", "ORDER_RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? "bg-[#d1411e] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status === "ALL" ? "All" : STATUS_LABELS[status]}
            <span className="ml-1 text-xs opacity-75">
              ({status === "ALL" ? orders.length : orders.filter((o) => o.status === status).length})
            </span>
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          {orders.length === 0 ? "No orders yet" : "No orders match your filters"}
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedOrders.map((order) => {
                  const nextStatus = NEXT_STATUS[order.status];
                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{order.customer.name}</div>
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
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
                            className="bg-[#d1411e] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#b8371a] disabled:opacity-50 transition-colors"
                          >
                            {updatingId === order._id ? "..." : `→ ${STATUS_LABELS[nextStatus]}`}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {paginatedOrders.map((order) => {
              const nextStatus = NEXT_STATUS[order.status];
              return (
                <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-mono text-gray-500">#{order._id.slice(-6).toUpperCase()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium text-gray-900 text-sm">{order.customer.name}</p>
                    <p className="text-xs text-gray-500">{order.customer.phone}</p>
                  </div>
                  <div className="border-t pt-3 mb-3">
                    {order.items.map((item) => (
                      <div key={item.menuItemId} className="flex justify-between text-sm text-gray-600 py-0.5">
                        <span>{item.name} x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <div>
                      <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                    {nextStatus && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, nextStatus)}
                        disabled={updatingId === order._id}
                        className="bg-[#d1411e] text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-[#b8371a] disabled:opacity-50 transition-colors"
                      >
                        {updatingId === order._id ? "..." : `→ ${STATUS_LABELS[nextStatus]}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Show</span>
              <CustomDropdown
                value={String(pageSize)}
                options={PAGE_SIZES.map((s) => ({ value: String(s), label: String(s) }))}
                onChange={(v) => setPageSize(Number(v))}
                className="w-20"
              />
              <span>of {filteredOrders.length} orders</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                &laquo;
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                &lsaquo;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 5) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .reduce<(number | "...")[]>((acc, page, i, arr) => {
                  if (i > 0 && page - (arr[i - 1] as number) > 1) {
                    acc.push("...");
                  }
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item as number)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        currentPage === item
                          ? "bg-[#d1411e] text-white border-[#d1411e]"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                &rsaquo;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                &raquo;
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
