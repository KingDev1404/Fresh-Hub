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
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [categoryFilter, setCategoryFilter] = React.useState('');

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    } else if (status === 'authenticated' && session.user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  // Fetch products when authenticated and is admin
  React.useEffect(() => {
    if (status === 'authenticated' && session.user.role === 'ADMIN') {
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

  const deleteProduct = async (productId: number) => {
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

      // Remove the product from state
      setProducts(products.filter(product => product.id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchProducts();
  };

  // Get unique categories
  const categories = React.useMemo(() => {
    return ['', ...new Set(products.map(product => product.category))];
  }, [products]);

  // Filter products by category
  const filteredProducts = categoryFilter
    ? products.filter(product => product.category === categoryFilter)
    : products;

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (status === 'authenticated' && session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600 mb-4">You don't have permission to access this page.</p>
          <Link href="/" legacyBehavior>
            <a className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Return to Home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Manage Products | FreshHarvest</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
              <p className="text-gray-600 mt-1">
                Add, edit, or remove products from your inventory
              </p>
            </div>
            <div className="mt-4 flex space-x-3 sm:mt-0">
              <Link href="/admin" legacyBehavior>
                <a className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Back to Dashboard
                </a>
              </Link>
              <button
                onClick={handleAddNewClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Add New Product
              </button>
            </div>
          </div>

          {showForm ? (
            <div className="mb-6">
              <ProductForm 
                product={selectedProduct} 
                onSuccess={handleFormSuccess} 
              />
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
                  Filter by Category
                </label>
                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.filter(Boolean).map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {error ? (
                <div className="text-center p-8 bg-red-50 rounded-lg">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={fetchProducts}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                  <p className="text-gray-600 mb-4">
                    {categoryFilter
                      ? `No products found in the "${categoryFilter}" category.`
                      : 'No products found.'}
                  </p>
                  <button
                    onClick={handleAddNewClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                              <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={product.imageUrl}
                                        alt={product.name}
                                        onError={(e) => {
                                          e.currentTarget.src = 'https://via.placeholder.com/40?text=Error';
                                        }}
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {product.name}
                                      </div>
                                      <div className="text-sm text-gray-500 truncate max-w-xs">
                                        {product.description.length > 50
                                          ? `${product.description.substring(0, 50)}...`
                                          : product.description}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {product.category}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatCurrency(product.price)} / kg
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleEditClick(product)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteProduct(product.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}