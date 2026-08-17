"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-orange-500">
            FoodOrder
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Menu
            </Link>
            <Link
              href="/orders"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith("/orders")
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Orders
            </Link>
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
