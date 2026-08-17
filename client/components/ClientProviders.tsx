"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/components/cart/CartContext";
import { ToastProvider } from "@/components/toast/ToastContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>{children}</CartProvider>
    </ToastProvider>
  );
}
