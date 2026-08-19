"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/components/cart/CartContext";
import { ToastProvider } from "@/components/toast/ToastContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>{children}</CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
