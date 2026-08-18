"use client";

import { MenuItem } from "@/types";
import Image from "next/image";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(0)}`;
  };

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
          <button
            onClick={() => onAddToCart(item)}
            className="text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium hover:brightness-110 hover:shadow-md"
            style={{ backgroundColor: '#d1411e' }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
