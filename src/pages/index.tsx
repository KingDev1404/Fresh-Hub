import * as React from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { ProductCard } from '@/components/product-card';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // Fetch products when the component loads
  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);

      // Extract unique categories - safely handle it as any
      const uniqueCategories = [...new Set(data.map((product: any) => product.category))] as string[];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <>
      <Head>
        <title>FreshHarvest - Fresh Produce Delivered</title>
        <meta name="description" content="Order fresh fruits and vegetables in bulk" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
                  Fresh Produce, Direct to You
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-xl text-green-100">
                  Quality fruits and vegetables in bulk for your business or family. Locally sourced and freshly delivered.
                </p>
                <div className="mt-6">
                  <a 
                    href="#products" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-green-700"
                  >
                    Browse Products
                  </a>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <img 
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Fresh vegetables and fruits" 
                  className="rounded-lg shadow-xl max-h-72 object-cover" 
                />
              </div>
            </div>
          </div>
        </div>

        <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category filter */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
                  selectedCategory === ''
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-lg shadow-md">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                {selectedCategory
                  ? `No products found in the "${selectedCategory}" category.`
                  : 'No products found.'}
              </p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory('')}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  View All Products
                </button>
              )}
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
                <span className="text-gray-500 text-base font-normal ml-2">
                  ({filteredProducts.length} items)
                </span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </main>

        <footer className="bg-white border-t border-gray-200 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-green-600 mb-2">FreshHarvest</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                Providing the freshest local produce directly to your doorstep
              </p>
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} FreshHarvest. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}