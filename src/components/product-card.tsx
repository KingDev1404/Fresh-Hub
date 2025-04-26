import * as React from 'react';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  
  const handleOrderClick = () => {
    router.push(`/orders/new?productId=${product.id}`);
  };

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-4 aspect-h-3 bg-gray-200 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
            {product.category}
          </span>
        </div>
        
        <p className="mt-2 text-gray-600 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(product.price)} <span className="text-sm text-gray-500">/ kg</span>
          </span>
          
          <button
            onClick={handleOrderClick}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            aria-label={`Order ${product.name}`}
          >
            Order
          </button>
        </div>
      </div>
    </div>
  );
}