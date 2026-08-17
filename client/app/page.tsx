"use client";

import { useEffect, useState } from "react";
import { MenuItem } from "@/types";
import { getMenuItems } from "@/services/api";
import MenuItemCard from "@/components/menu/MenuItemCard";
import CartSidebar from "@/components/cart/CartSidebar";
import { useCart } from "@/components/cart/CartContext";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenuItems();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load menu");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Menu</h1>
      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No items available at the moment.
        </div>
      ) : (
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <MenuItemCard
                  key={item._id}
                  item={item}
                  onAddToCart={addItem}
                />
              ))}
            </div>
          </div>
          <div className="hidden lg:block w-80">
            <CartSidebar />
          </div>
        </div>
      )}
    </div>
  );
}
