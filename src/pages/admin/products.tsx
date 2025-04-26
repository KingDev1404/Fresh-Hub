import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { ProductForm } from '@/components/product-form';
import { formatCurrency } from '@/lib/utils';

export default function AdminProductsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [showForm, setShowForm] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);

  // Redirect to login if not authenticated or not admin
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  // Fetch products when the component loads
  React.useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchProducts();
    }
  }, [status, session]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Refresh the product list
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchProducts();
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If not admin, don't render the page (will redirect via useEffect)
  if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <>
      <Head>
        <title>Manage Products | FreshHarvest Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link href="/admin" legacyBehavior>
                <a className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Back to Dashboard
                </a>
              </Link>
              {!showForm && (
                <button
                  onClick={handleAddNewProduct}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add New Product
                </button>
              )}
            </div>
          </div>

          {showForm ? (
            <div className="mb-8">
              <button
                onClick={() => setShowForm(false)}
                className="mb-4 text-green-600 hover:text-green-800 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Products
              </button>
              <ProductForm product={selectedProduct} onSuccess={handleFormSuccess} />
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-lg">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg shadow">
              <p className="text-gray-600 mb-4">No products found in the system.</p>
              <button
                onClick={handleAddNewProduct}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {products.map((product) => (
                  <li key={product.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-12 w-12 object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-green-600 truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">{product.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {formatCurrency(product.price)}/kg
                          </span>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="ml-2 text-sm font-medium text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="ml-2 text-sm font-medium text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </>
  );
}