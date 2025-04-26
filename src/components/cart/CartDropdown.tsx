import * as React from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';

export function CartDropdown() {
  const { items, removeItem, updateQuantity, getTotal, getTotalItems } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/orders/new');
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button 
        className="btn btn-outline-success position-relative" 
        onClick={toggleDropdown}
        aria-label="Shopping cart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        {getTotalItems() > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger animate-pulse">
            {getTotalItems()}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg animate-fade-in" style={{ width: '300px', zIndex: 1000 }}>
          <div className="p-3 border-bottom">
            <h6 className="fw-bold mb-0">Your Cart ({getTotalItems()} items)</h6>
          </div>

          <div className="p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {items.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-cart mb-2 text-muted" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <ul className="list-group list-group-flush">
                {items.map((item) => (
                  <li key={item.id} className="list-group-item py-2 px-3">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: '40px', height: '40px' }} className="flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>
                      <div className="flex-grow-1 ms-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0 text-truncate" style={{ maxWidth: '150px' }}>
                            {item.name}
                          </h6>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="btn btn-sm text-danger py-0 px-1"
                            aria-label="Remove item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <div className="input-group input-group-sm" style={{ width: '85px' }}>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="input-group-text bg-white px-1 py-0 text-center">
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <span className="fs-7 fw-semibold text-success">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold">Total:</span>
              <span className="fw-bold text-success">{formatCurrency(getTotal())}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="btn btn-success w-100"
              disabled={items.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}