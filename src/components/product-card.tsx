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
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden bg-gray-200">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full mb-2">
          {product.category}
        </span>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">
          {truncateDescription(product.description)}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(product.price)}/kg
          </span>
          <Link href={`/orders/new?productId=${product.id}`} legacyBehavior>
            <a className="bg-green-600 text-white text-sm font-medium py-2 px-4 rounded hover:bg-green-700 transition-colors">
              Order Now
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}