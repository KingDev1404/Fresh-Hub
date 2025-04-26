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
  const { data: session } = useSession();
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

  // Fetch product details if productId is provided
  React.useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    } else {
      setLoading(false);
    }
  }, [productId]);

  // Pre-fill delivery details from user session if available
  React.useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        deliveryName: session.user.name || prev.deliveryName,
      }));
    }
  }, [session]);

  const fetchProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details. Please try again.');
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
      [name]: name === 'quantity' ? Math.max(1, parseInt(value) || 1) : value,
    }));
  };

  const calculateTotal = () => {
    if (!product) return 0;
    return product.price * formData.quantity;
  };

  const onSubmit = async (data: FormData) => {
    if (!session) {
      router.push('/auth');
      return;
    }

    if (!product) {
      setError('No product selected');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const orderData = {
        orderItems: [
          {
            productId: product.id,
            quantity: data.quantity,
          },
        ],
        deliveryName: data.deliveryName,
        deliveryPhone: data.deliveryPhone,
        deliveryAddress: data.deliveryAddress,
        totalAmount: calculateTotal(),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const order = await response.json();
      
      // Redirect to order details page
      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (
      !formData.quantity ||
      !formData.deliveryName ||
      !formData.deliveryPhone ||
      !formData.deliveryAddress
    ) {
      setError('Please fill in all required fields');
      return;
    }
    
    onSubmit(formData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!product && productId) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">
          {error || 'Product not found. Please try again.'}
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Return to Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Place Your Order</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {product && (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <div className="flex items-center">
            <div className="w-16 h-16 overflow-hidden rounded-md mr-4 bg-gray-200">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.category}</p>
              <p className="font-medium mt-1">
                {formatCurrency(product.price)} / kg
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {product && (
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                Quantity (kg) <span className="text-red-500">*</span>
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          )}
          
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
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              id="deliveryPhone"
              name="deliveryPhone"
              type="tel"
              value={formData.deliveryPhone}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., 123-456-7890"
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
        
        {product && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Quantity:</span>
              <span>{formData.quantity} kg</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-medium">Price per kg:</span>
              <span>{formatCurrency(product.price)}</span>
            </div>
            <div className="flex justify-between items-center mt-2 text-lg font-bold">
              <span>Total Amount:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}