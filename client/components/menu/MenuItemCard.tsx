"use client";

import { MenuItem } from "@/types";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(0)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-green-600">
            {formatPrice(item.price)}
          </span>
          <button
            onClick={() => onAddToCart(item)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
