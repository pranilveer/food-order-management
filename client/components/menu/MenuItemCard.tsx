"use client";

import { MenuItem } from "@/types";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem, updateQuantity, items } = useCart();
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(0)}`;
  };

  const cartItem = items.find((i) => i.menuItem._id === item._id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="bg-white rounded-lg overflow-hidden hover:scale-[1.03] transition-all duration-300 shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          unoptimized
          className="object-cover hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold" style={{ color: '#b7903c' }}>
            {formatPrice(item.price)}
          </span>
          {quantity === 0 ? (
            <button
              onClick={() => addItem(item)}
              className="text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium hover:brightness-110 hover:shadow-md"
              style={{ backgroundColor: '#d1411e' }}
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => quantity === 1 ? updateQuantity(item._id, 1) : updateQuantity(item._id, quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors text-lg font-bold"
              >
                -
              </button>
              <span className="w-6 text-center font-semibold text-sm">{quantity}</span>
              <button
                onClick={() => addItem(item)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-lg font-bold text-white"
                style={{ backgroundColor: '#d1411e' }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
