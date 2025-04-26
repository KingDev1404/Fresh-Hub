import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import ProductGrid from '@/components/product/product-grid';
import Navbar from '@/components/layout/navbar';
import { prisma } from '@/lib/db';

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  
  return products;
}

export default async function Home() {
  const user = await getCurrentUser();
  const products = await getProducts();

  const stockPhotos = [
    'https://images.unsplash.com/photo-1463123081488-789f998ac9c4',
    'https://images.unsplash.com/photo-1464297162577-f5295c892194',
    'https://images.unsplash.com/photo-1516594798947-e65505dbb29d',
    'https://images.unsplash.com/photo-1490818387583-1baba5e638af',
    'https://images.unsplash.com/photo-1489450278009-822e9be04dff',
    'https://images.unsplash.com/photo-1561619128-84d4badf416e',
    'https://images.unsplash.com/photo-1506484381205-f7945653044d',
    'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0',
    'https://images.unsplash.com/photo-1518735869015-566a18eae4be',
    'https://images.unsplash.com/photo-1534940519139-f860fb3c6e38',
    'https://images.unsplash.com/photo-1484557985045-edf25e08da73',
    'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6',
  ];

  // Map products to include stock photos
  const productsWithImages = products.map((product, index) => ({
    ...product,
    imageUrl: product.imageUrl || stockPhotos[index % stockPhotos.length],
  }));

  return (
    <>
      <Navbar user={user} />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Fresh Produce</span>
                <span className="block text-green-600">Bulk Orders Made Easy</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
                Quality vegetables and fruits delivered in bulk for your business. 
                Straight from farms to your doorstep.
              </p>
            </div>
          </div>
        </section>

        {/* Product Catalog */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Fresh Produce</h2>
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductGrid products={productsWithImages} />
          </Suspense>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Why Choose FreshBulk?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-green-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Farm Fresh Quality</h3>
                <p className="text-gray-600">All our produce is sourced directly from trusted farms to ensure maximum freshness and quality.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-green-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Bulk Order Savings</h3>
                <p className="text-gray-600">Get competitive prices when you order in bulk. Perfect for restaurants, grocers, and food service.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-green-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Reliable Delivery</h3>
                <p className="text-gray-600">Track your orders in real-time and get predictable delivery to plan your business operations.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
