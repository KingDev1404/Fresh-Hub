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
  const [imageError, setImageError] = React.useState(false);
  
  const handleOrderClick = () => {
    router.push(`/orders/new?productId=${product.id}`);
  };

  // Generate a placeholder image fallback with the product name if image fails to load
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
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-60 bg-gray-50 overflow-hidden">
        <img
          src={imageError ? getCategoryPlaceholder(product.category) : product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
          onError={handleImageError}
        />
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 border border-green-200 shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{product.name}</h3>
        
        <p className="text-gray-600 flex-grow line-clamp-3 mb-4">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(product.price)} <span className="text-sm text-gray-600">per kg</span>
          </span>
          
          <button
            onClick={handleOrderClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition-all duration-200 transform hover:-translate-y-1 flex items-center gap-1"
            aria-label={`Order ${product.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
            </svg>
            Order
          </button>
        </div>
      </div>
    </div>
  );
}