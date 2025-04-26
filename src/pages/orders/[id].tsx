import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  // Fetch order when authenticated and ID is available
  React.useEffect(() => {
    if (status === 'authenticated' && id) {
      fetchOrder();
    }
  }, [status, id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <>
        <Head>
          <title>Order Not Found | FreshHarvest</title>
        </Head>

        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center p-8 bg-red-50 rounded-lg">
              <p className="text-red-600 mb-4">
                {error || 'Order not found'}
              </p>
              <Link href="/orders" legacyBehavior>
                <a className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Return to Orders
                </a>
              </Link>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Order #{order.id} | FreshHarvest</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 mr-4">
                  Order #{order.id}
                </h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-gray-600 mt-1">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link href="/orders" legacyBehavior>
                <a className="text-green-600 hover:text-green-800 font-medium">
                  &larr; Back to orders
                </a>
              </Link>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order Summary
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <OrderStatusBadge status={order.status} />
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                    {formatCurrency(order.totalAmount)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Delivery Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.deliveryName}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.deliveryPhone}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Delivery Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.deliveryAddress}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {order.orderItems.map((item: any) => (
                  <li key={item.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              {item.product.name}
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {formatCurrency(item.price)} per kg
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {item.quantity} kg
                            </p>
                            <p className="mt-1 text-lg font-bold text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}