import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    } else if (status === 'authenticated' && session.user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  // Fetch orders when authenticated and is admin
  React.useEffect(() => {
    if (status === 'authenticated' && session.user.role === 'ADMIN') {
      fetchOrders();
    }
  }, [status, session]);

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

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const updatedOrder = await response.json();
      
      // Update the orders state with the updated order
      setOrders(orders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ));
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  // Filter orders by selected status
  const filteredOrders = selectedStatus
    ? orders.filter(order => order.status === selectedStatus)
    : orders;

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
        <title>Admin Dashboard | FreshHarvest</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage orders and products
              </p>
            </div>
            <div className="mt-4 flex space-x-3 sm:mt-0">
              <Link href="/admin/products" legacyBehavior>
                <a className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Manage Products
                </a>
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Orders</h2>
            
            {/* Status filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedStatus('')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedStatus === ''
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setSelectedStatus('PENDING')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedStatus === 'PENDING'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setSelectedStatus('IN_PROGRESS')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedStatus === 'IN_PROGRESS'
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setSelectedStatus('DELIVERED')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedStatus === 'DELIVERED'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Delivered
              </button>
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
            ) : filteredOrders.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg shadow">
                <p className="text-gray-600">
                  {selectedStatus
                    ? `No ${selectedStatus.toLowerCase()} orders found.`
                    : 'No orders found.'}
                </p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <li key={order.id}>
                      <div className="block hover:bg-gray-50">
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
                            <div className="ml-2 flex items-center gap-2">
                              {order.status !== 'DELIVERED' && (
                                <div className="flex gap-2">
                                  {order.status === 'PENDING' && (
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'IN_PROGRESS')}
                                      className="inline-flex items-center px-2.5 py-1.5 border border-blue-300 text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100"
                                    >
                                      Mark In Progress
                                    </button>
                                  )}
                                  
                                  {order.status === 'IN_PROGRESS' && (
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                      className="inline-flex items-center px-2.5 py-1.5 border border-green-300 text-xs font-medium rounded text-green-700 bg-green-50 hover:bg-green-100"
                                    >
                                      Mark Delivered
                                    </button>
                                  )}
                                </div>
                              )}
                              
                              <Link href={`/orders/${order.id}`} legacyBehavior>
                                <a className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-gray-50 hover:bg-gray-100">
                                  View Details
                                </a>
                              </Link>
                            </div>
                          </div>
                          
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                Customer: {order.user?.name || 'Unknown'}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                Date: {formatDateTime(order.createdAt)}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <span className="font-medium text-gray-900">
                                {formatCurrency(order.totalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}