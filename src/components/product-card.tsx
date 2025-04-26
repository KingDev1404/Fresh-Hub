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
  const [isHovered, setIsHovered] = React.useState(false);
  
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

  // Generate random animation delay for staggered appearance
  const randomDelay = React.useMemo(() => {
    const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];
    return delays[Math.floor(Math.random() * delays.length)];
  }, []);

  return (
    <div 
      className={`card animate-fade-in ${randomDelay} shadow-sm`}
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="position-relative">
        <img
          src={imageError ? getCategoryPlaceholder(product.category) : product.imageUrl}
          alt={product.name}
          className="card-img-top"
          style={{ height: '150px', objectFit: 'cover' }}
          onError={handleImageError}
        />
        <span className="badge badge-category position-absolute top-0 end-0 m-2">
          {product.category}
        </span>
        {isHovered && (
          <div className="position-absolute top-0 left-0 w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in" 
               style={{ background: 'rgba(0,0,0,0.3)' }}>
            <button 
              className="btn btn-sm btn-success animate-pulse"
              onClick={handleOrderClick}
            >
              Quick Order
            </button>
          </div>
        )}
      </div>
      
      <div className="card-body p-2">
        <h5 className="card-title fs-6 text-truncate">
          {product.name}
        </h5>
        
        <p className="card-text text-muted small" style={{ 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          height: '32px'
        }}>
          {product.description}
        </p>
        
        <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
          <span className="fw-bold">
            {formatCurrency(product.price)} 
            <small className="text-muted ms-1">per kg</small>
          </span>
          
          <button
            onClick={handleOrderClick}
            className="btn btn-sm btn-success d-flex align-items-center gap-1"
            aria-label={`Order ${product.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-plus" viewBox="0 0 16 16">
              <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/>
              <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7z"/>
            </svg>
            Order
          </button>
        </div>
      </div>
    </div>
  );
}