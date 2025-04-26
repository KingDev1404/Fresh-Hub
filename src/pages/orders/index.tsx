import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function OrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  // Fetch orders when authenticated
  React.useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
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

  return (
    <>
      <Head>
        <title>My Orders | FreshHarvest</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">
              View and track the status of your orders
            </p>
          </div>

          {error ? (
            <div className="text-center p-8 bg-red-50 rounded-lg">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg shadow">
              <p className="text-gray-600 mb-4">You don't have any orders yet.</p>
              <Link href="/" legacyBehavior>
                <a className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Browse Products
                </a>
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <li key={order.id}>
                    <Link href={`/orders/${order.id}`} legacyBehavior>
                      <a className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-green-600 truncate">
                                Order #{order.id}
                              </p>
                              <div className="ml-4">
                                <OrderStatusBadge status={order.status} />
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="text-sm text-gray-500">
                                {formatDateTime(order.createdAt)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                Delivery to: {order.deliveryName}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <span className="font-medium text-gray-900">
                                {formatCurrency(order.totalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </Link>
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