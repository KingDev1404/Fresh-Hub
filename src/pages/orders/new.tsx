import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { OrderForm } from '@/components/order-form';

export default function OrderNewPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { productId } = router.query;

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Place Your Order | FreshHarvest</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Place Your Order</h1>
            <p className="text-gray-600 mt-1">
              Fill in the details below to complete your purchase
            </p>
          </div>

          <OrderForm productId={productId ? parseInt(productId as string) : undefined} />
        </main>
      </div>
    </>
  );
}