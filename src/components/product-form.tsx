import * as React from 'react';
import { useRouter } from 'next/router';

interface ProductFormProps {
  product?: {
    id?: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
  };
  onSuccess?: () => void;
}

type FormData = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState<FormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    imageUrl: product?.imageUrl || '',
    category: product?.category || '',
  });

  // Update form data if product prop changes
  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');

    try {
      const endpoint = product?.id 
        ? `/api/products/${product.id}` 
        : '/api/products';
      
      const method = product?.id ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const responseData = await response.json();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.description || !formData.imageUrl || !formData.category) {
      setError('All fields are required');
      return;
    }
    
    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {product?.id ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (per kg) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              className="block w-full pl-7 pr-12 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
          {formData.imageUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <div className="h-32 w-32 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Error';
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="" disabled>Select category</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Herbs">Herbs</option>
            <option value="Organic">Organic</option>
            <option value="Exotic">Exotic</option>
          </select>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (onSuccess) onSuccess();
          }}
          className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : product?.id ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}