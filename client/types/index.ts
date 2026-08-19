export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Customer {
  name: string;
  address: string;
  phone: string;
}

export type OrderStatus =
  | "ORDER_RECEIVED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  customer: Customer;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
