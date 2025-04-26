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
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">
          {error || 'Product not found. Please select a valid product.'}
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const totalPrice = product.price * formData.quantity;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6 flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
          <div className="bg-gray-200 rounded-md overflow-hidden h-48 w-full">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700">Price per kg:</span>
            <span className="font-bold text-gray-900">{formatCurrency(product.price)}</span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium mb-1">
              Quantity (kg) <span className="text-red-500">*</span>
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Delivery Information</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="deliveryName" className="block text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="deliveryName"
                  name="deliveryName"
                  type="text"
                  value={formData.deliveryName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="deliveryPhone" className="block text-sm font-medium mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="deliveryPhone"
                  name="deliveryPhone"
                  type="tel"
                  value={formData.deliveryPhone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="deliveryAddress" className="block text-sm font-medium mb-1">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Total Price:</span>
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}