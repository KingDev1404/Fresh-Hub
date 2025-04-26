import * as React from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';

export function CartDropdown() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, getTotalItems } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const totalItems = getTotalItems();

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button 
        className="btn btn-sm btn-warning position-relative"
        onClick={toggleDropdown}
        aria-label="Shopping cart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart3 me-1" viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401L5.5 9.5l-.002.2a.5.5 0 0 0 .5.5h6.25a.5.5 0 0 1 0 1H5.5a1.5 1.5 0 0 1-1.493-1.645L4 9l-.935-4.8H1.5a.5.5 0 0 1-.5-.5ZM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102ZM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/>
        </svg>
        Cart
        {totalItems > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger animate-pulse">
            {totalItems}
            <span className="visually-hidden">items in cart</span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="position-absolute end-0 mt-2 rounded-3 shadow-lg bg-white animate-fade-in z-index-dropdown" style={{ width: '320px', zIndex: 1050 }}>
          <div className="p-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Your Cart</h6>
              <span className="badge bg-success">{totalItems} Items</span>
            </div>
          </div>

          <div className="p-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {items.length === 0 ? (
              <div className="text-center p-4 text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-cart mb-3" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <p className="mb-0">Your cart is empty</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="d-flex py-2 border-bottom animate-fade-in">
                  <div className="flex-shrink-0" style={{ width: '50px', height: '50px' }}>
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
                  <div className="ms-2 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="mb-0 small fw-semibold text-truncate" style={{ maxWidth: '150px' }}>{item.name}</p>
                        <div className="d-flex align-items-center mt-1">
                          <div className="input-group input-group-sm" style={{ width: '100px' }}>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              type="button"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              className="form-control form-control-sm text-center"
                              value={item.quantity}
                              readOnly
                            />
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-end">
                        <p className="mb-0 small text-success fw-bold">{formatCurrency(item.price)}</p>
                        <button
                          className="btn btn-sm text-danger p-0 mt-1"
                          onClick={() => removeItem(item.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Total:</span>
              <span className="fw-bold text-success">{formatCurrency(getTotal())}</span>
            </div>
            <div className="d-grid gap-2">
              <button
                className="btn btn-success btn-sm"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check me-1" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                </svg>
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}