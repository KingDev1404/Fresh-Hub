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

      <div>
        <Navbar />

        {/* Hero Section with Bootstrap */}
        <div className="hero-gradient text-white">
          <div className="container py-5">
            <div className="row align-items-center">
              <div className="col-md-6 animate-slide-left">
                <h1 className="display-4 fw-bold text-shadow">
                  Fresh Produce, Direct to You
                </h1>
                <p className="lead text-white-50 my-4">
                  Quality fruits and vegetables in bulk for your business or family. 
                  Locally sourced and freshly delivered.
                </p>
                <div className="mt-4">
                  <a 
                    href="#products" 
                    className="btn btn-light btn-lg animate-pulse shadow-sm"
                  >
                    Browse Products
                  </a>
                </div>
              </div>
              <div className="col-md-6 text-center text-md-end animate-slide-right">
                <img 
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Fresh vegetables and fruits" 
                  className="img-fluid rounded shadow-lg animate-float" 
                  style={{ maxHeight: '350px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-light py-5">
          <div className="container">
            <div className="row g-4 text-center">
              <div className="col-md-4 animate-fade-in delay-100">
                <div className="p-3">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-block p-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-truck" viewBox="0 0 16 16">
                      <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm-8 2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    </svg>
                  </div>
                  <h4>Fast Delivery</h4>
                  <p className="text-muted">Get your fresh produce delivered to your doorstep within 24 hours.</p>
                </div>
              </div>
              <div className="col-md-4 animate-fade-in delay-300">
                <div className="p-3">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-block p-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-gem" viewBox="0 0 16 16">
                      <path d="M3.1.7a.5.5 0 0 1 .4-.2h9a.5.5 0 0 1 .4.2l2.976 3.974c.149.185.156.45.01.644L8.4 15.3a.5.5 0 0 1-.8 0L.1 5.3a.5.5 0 0 1 0-.6l3-4zm11.386 3.785-1.806-2.41-.776 2.413 2.582-.003zm-3.633.004.961-2.989H4.186l.963 2.995 5.704-.006zM5.47 5.495 8 13.366l2.532-7.876-5.062.005zm-1.371-.999-.78-2.422-1.818 2.425 2.598-.003zM1.499 5.5l5.113 6.817-2.192-6.82L1.5 5.5zm7.889 6.817 5.123-6.83-2.928.002-2.195 6.828z"/>
                    </svg>
                  </div>
                  <h4>Premium Quality</h4>
                  <p className="text-muted">All our produce is carefully selected for the highest quality and freshness.</p>
                </div>
              </div>
              <div className="col-md-4 animate-fade-in delay-500">
                <div className="p-3">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-block p-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-piggy-bank" viewBox="0 0 16 16">
                      <path d="M5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm1.138-1.496A6.613 6.613 0 0 1 7.964 4.5c.666 0 1.303.097 1.893.273a.5.5 0 0 0 .286-.958A7.602 7.602 0 0 0 7.964 3.5c-.35 0-.69.03-1.022.087a.5.5 0 1 0 .124.994zm3.413 2.24a.5.5 0 1 0 .732-.68.5.5 0 0 0-.732.68z"/>
                      <path d="M8 15A6 6 0 1 1 8 3a6 6 0 0 1 0 12zm0 1A7 7 0 1 0 8 2a7 7 0 0 0 0 14z"/>
                      <path d="M7 9.5V8.5a.5.5 0 0 1 1 0V12a.5.5 0 0 1-1 0v-2.5a.5.5 0 0 0-1 0V12a.5.5 0 0 1-1 0v-1.5a.5.5 0 0 1 1 0V10a.5.5 0 0 0 1 0z"/>
                    </svg>
                  </div>
                  <h4>Bulk Discounts</h4>
                  <p className="text-muted">Get great savings when you order in bulk for your business needs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main id="products" className="container py-5">
          {/* Category filter with Bootstrap */}
          <div className="mb-4 animate-fade-in">
            <h2 className="display-6 mb-4">Browse by Category</h2>
            <div className="d-flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`btn ${selectedCategory === '' ? 'btn-success' : 'btn-outline-success'}`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn ${selectedCategory === category ? 'btn-success' : 'btn-outline-success'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center animate-fade-in">
              <p className="mb-2">{error}</p>
              <button
                onClick={fetchProducts}
                className="btn btn-outline-danger"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="alert alert-warning text-center animate-fade-in">
              <p className="mb-2">
                {selectedCategory
                  ? `No products found in the "${selectedCategory}" category.`
                  : 'No products found.'}
              </p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory('')}
                  className="btn btn-outline-success"
                >
                  View All Products
                </button>
              )}
            </div>
          ) : (
            <>
              <h2 className="h3 mb-4 animate-fade-in">
                {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
                <span className="badge bg-secondary ms-2">
                  {filteredProducts.length} items
                </span>
              </h2>
              <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 mb-5">
                {filteredProducts.map((product) => (
                  <div className="col" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        <footer className="bg-dark text-white py-4">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h3 className="h5 text-success">FreshHarvest</h3>
                <p className="text-white-50 small">
                  Providing the freshest local produce directly to your doorstep
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="d-flex justify-content-md-end gap-3 mb-3">
                  <a href="#" className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                    </svg>
                  </a>
                </div>
                <p className="text-white-50 small">
                  &copy; {new Date().getFullYear()} FreshHarvest. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}