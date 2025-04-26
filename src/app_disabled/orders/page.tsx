import { Suspense } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatPrice, getOrderStatusBadgeColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

async function getOrders(userId: number) {
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders;
}

export default async function OrdersPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth');
  }
  
  const orders = await getOrders(user.id);

  return (
    <>
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Link href="/" passHref>
            <Button>Place New Order</Button>
          </Link>
        </div>

        <Suspense fallback={<div>Loading orders...</div>}>
          {orders.length > 0 ? (
            <div className="grid gap-6">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <Badge className={getOrderStatusBadgeColor(order.status)}>
                      {order.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      <div>
                        <h3 className="font-medium text-gray-500 mb-1">Order Date</h3>
                        <p>{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500 mb-1">Total Amount</h3>
                        <p className="font-semibold text-green-600">{formatPrice(order.totalAmount)}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500 mb-1">Items</h3>
                        <p>{order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t pt-4">
                      <h3 className="font-medium mb-2">Order Items</h3>
                      <ul className="space-y-2">
                        {order.orderItems.map((item) => (
                          <li key={item.id} className="flex justify-between">
                            <span>
                              {item.product.name} x{item.quantity}
                            </span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Link href={`/orders/${order.id}`} passHref>
                        <Button variant="outline">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
              <Link href="/" passHref>
                <Button>Browse Products</Button>
              </Link>
            </div>
          )}
        </Suspense>
      </main>
    </>
  );
}
