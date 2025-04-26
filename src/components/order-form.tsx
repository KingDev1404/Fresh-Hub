import * as React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { formatCurrency } from '@/lib/utils';

interface OrderFormProps {
  productId?: number;
}

type FormData = {
  quantity: number;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
};

export function OrderForm({ productId }: OrderFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState<FormData>({
    quantity: 1,
    deliveryName: '',
    deliveryPhone: '',
    deliveryAddress: '',
  });

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  // Fetch product details when the component loads
  React.useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value,
    }));
  };

  const onSubmit = async (data: FormData) => {
    if (!session?.user) return;
    
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: data.quantity,
          deliveryName: data.deliveryName,
          deliveryPhone: data.deliveryPhone,
          deliveryAddress: data.deliveryAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const orderData = await response.json();
      
      // Navigate to order confirmation page
      router.push(`/orders/${orderData.id}`);
    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (
      !formData.quantity ||
      !formData.deliveryName ||
      !formData.deliveryPhone ||
      !formData.deliveryAddress
    ) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    
    onSubmit(formData);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="alert alert-danger text-center p-4 animate-fade-in">
        <p>
          {error || 'Product not found. Please select a valid product.'}
        </p>
        <button
          onClick={() => router.push('/')}
          className="btn btn-success mt-3 animate-pulse"
        >
          <i className="bi bi-arrow-left-circle me-2"></i>
          Browse Products
        </button>
      </div>
    );
  }

  const totalPrice = product.price * formData.quantity;

  return (
    <div className="card shadow animate-fade-in">
      <div className="card-body p-4">
        <div className="row mb-4">
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="position-relative overflow-hidden rounded h-100 animate-fade-in">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-100 h-100 object-fit-cover"
                style={{ objectFit: 'cover', height: '200px' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="position-absolute top-0 end-0 p-2">
                <span className="badge badge-category">
                  {product.category}
                </span>
              </div>
            </div>
          </div>
          
          <div className="col-md-8 animate-slide-right">
            <h2 className="card-title h4 fw-bold mb-2">{product.name}</h2>
            <p className="text-muted mb-3">{product.description}</p>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
              <span className="text-muted">Price per kg:</span>
              <span className="fs-5 fw-bold text-success">{formatCurrency(product.price)}</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="alert alert-danger alert-dismissible fade show animate-fade-in" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="animate-fade-in delay-200">
          <div className="mb-4">
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label fw-semibold">
                Quantity (kg) <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-seam" viewBox="0 0 16 16">
                    <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                  </svg>
                </span>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4 p-3 border rounded bg-light animate-fade-in delay-300">
            <h3 className="h5 fw-bold mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-truck me-2" viewBox="0 0 16 16">
                <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm-8 2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              </svg>
              Delivery Information
            </h3>
            
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="deliveryName" className="form-label">
                  Full Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                    </svg>
                  </span>
                  <input
                    id="deliveryName"
                    name="deliveryName"
                    type="text"
                    value={formData.deliveryName}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <label htmlFor="deliveryPhone" className="form-label">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone" viewBox="0 0 16 16">
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                    </svg>
                  </span>
                  <input
                    id="deliveryPhone"
                    name="deliveryPhone"
                    type="tel"
                    value={formData.deliveryPhone}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              
              <div className="col-12">
                <label htmlFor="deliveryAddress" className="form-label">
                  Delivery Address <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                    </svg>
                  </span>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    rows={3}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        
          <div className="card bg-light mt-4 mb-4 animate-fade-in delay-400">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="h5 mb-0">Total Price:</h4>
                <div className="fs-4 fw-bold text-success animate-pulse">
                  {formatCurrency(totalPrice)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-end gap-2 animate-fade-in delay-500">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-outline-secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-1" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-success"
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check me-1" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                  </svg>
                  Place Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}