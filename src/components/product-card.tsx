import * as React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          {truncateDescription(product.description)}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold text-lg">
            {formatCurrency(product.price)} / kg
          </span>
          <Link href={`/orders/new?productId=${product.id}`} legacyBehavior>
            <a className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors">
              Order Now
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}