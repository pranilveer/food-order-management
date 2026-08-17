import { MenuItem, Order, ApiResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data: ApiResponse<T> = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Something went wrong");
  }

  return data.data;
}

export const getMenuItems = (): Promise<MenuItem[]> => {
  return fetchAPI<MenuItem[]>("/menu");
};

export const getOrders = (): Promise<Order[]> => {
  return fetchAPI<Order[]>("/orders");
};

export const createOrder = (order: {
  items: { menuItemId: string; quantity: number }[];
  customer: { name: string; address: string; phone: string };
}): Promise<Order> => {
  return fetchAPI<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
};

export const getOrderById = (id: string): Promise<Order> => {
  return fetchAPI<Order>(`/orders/${id}`);
};

export const updateOrderStatus = (
  id: string,
  status: string
): Promise<Order> => {
  return fetchAPI<Order>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};
