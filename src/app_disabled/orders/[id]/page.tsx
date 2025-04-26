import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Navbar from '@/components/layout/navbar';
import OrderStatus from '@/components/order/order-status';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getOrder(id: number, userId: number) {
  const order = await prisma.order.findUnique({
    where: {
      id: id,
      userId: userId, // Ensure the user can only see their own orders
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return order;
}

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth');
  }
  
  const orderId = parseInt(params.id);
  const order = await getOrder(orderId, user.id);
  
  if (!order) {
    // Order not found or doesn't belong to this user
    redirect('/orders');
  }

  return (
    <>
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <Link href="/orders" passHref>
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>
        
        <OrderStatus order={order} />
      </main>
    </>
  );
}
