"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/components/cart/CartContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
