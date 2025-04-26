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
  const [formData, setFormData] = React.useState<FormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    imageUrl: product?.imageUrl || '',
    category: product?.category || '',
  });
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const isEditing = !!product?.id;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError('');

    try {
      const url = isEditing ? `/api/products/${product.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
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
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate back to products page
        router.push('/admin/products');
      }
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.description || !formData.category || !formData.imageUrl) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.price <= 0) {
      setError('Price must be greater than zero');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Vegetables, Fruits, etc."
              required
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price ($ per kg) <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {submitting
              ? 'Saving...'
              : isEditing
              ? 'Update Product'
              : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}