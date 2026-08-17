"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/services/api";
import { Order, OrderStatus } from "@/types";

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "ORDER_RECEIVED", label: "Order Received" },
  { key: "PREPARING", label: "Preparing" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

function StatusTimeline({ currentStatus }: { currentStatus: OrderStatus }) {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="flex items-center justify-between mb-8">
      {STATUS_STEPS.map((step, index) => {
        const isActive = index <= currentIndex;
        return (
          <div key={step.key} className="flex-1 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-xs mt-2 text-center ${
                isActive ? "text-orange-600 font-medium" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderStatusPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let mounted = true;

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        if (mounted) {
          setOrder(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load order");
          setLoading(false);
        }
      }
    };

    fetchOrder();

    interval = setInterval(fetchOrder, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [id]);

  const formatPrice = (price: number) => `₹${(price / 100).toFixed(0)}`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-600 underline"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Status</h1>
      <p className="text-gray-500 mb-8">
        Order #{order._id.slice(-8).toUpperCase()}
      </p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <StatusTimeline currentStatus={order.status} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Delivery Details
        </h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium text-gray-700">Name:</span>{" "}
            {order.customer.name}
          </p>
          <p>
            <span className="font-medium text-gray-700">Address:</span>{" "}
            {order.customer.address}
          </p>
          <p>
            <span className="font-medium text-gray-700">Phone:</span>{" "}
            {order.customer.phone}
          </p>
          <p>
            <span className="font-medium text-gray-700">Order Time:</span>{" "}
            {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Order Items
        </h2>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.name} x {item.quantity}
              </span>
              <span className="font-medium">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-bold text-lg text-green-600">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="text-orange-500 hover:text-orange-600 underline"
        >
          Order More
        </Link>
      </div>
    </div>
  );
}
