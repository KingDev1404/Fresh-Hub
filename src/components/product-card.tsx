import * as React from 'react';
import { useRouter } from 'next/router';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';

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
  const [imageError, setImageError] = React.useState(false);
  
  const handleOrderClick = () => {
    router.push(`/orders/new?productId=${product.id}`);
  };

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Default placeholder images for different categories
  const getCategoryPlaceholder = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('fruit')) return 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (lowerCategory.includes('vegetable')) return 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (lowerCategory.includes('organic')) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (lowerCategory.includes('herb')) return 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (lowerCategory.includes('exotic')) return 'https://images.unsplash.com/photo-1439127989242-c3749a012eac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    // Default image
    return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Fixed height image container */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imageError ? getCategoryPlaceholder(product.category) : product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out"
          onError={handleImageError}
          style={{ aspectRatio: '16/9' }}
        />
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 border border-green-200 shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      
      {/* Content area with fixed padding and consistent heights */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 flex-grow line-clamp-2 mb-3">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(product.price)} 
            <span className="text-xs text-gray-600 ml-1">per kg</span>
          </span>
          
          <button
            onClick={handleOrderClick}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md shadow text-sm transition-colors duration-200 flex items-center gap-1"
            aria-label={`Order ${product.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
            </svg>
            Order
          </button>
        </div>
      </div>
    </div>
  );
}