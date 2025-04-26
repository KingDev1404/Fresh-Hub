import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Navbar from '@/components/layout/navbar';
import OrderForm from '@/components/order/order-form';
import { redirect } from 'next/navigation';

interface OrderNewPageProps {
  searchParams: {
    productId?: string;
  };
}

export default async function OrderNewPage({ searchParams }: OrderNewPageProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth');
  }
  
  const { productId } = searchParams;

  // If no product ID is provided, redirect to the home page
  if (!productId) {
    redirect('/');
  }

  return (
    <>
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Place Bulk Order</h1>
          <p className="text-gray-600 mt-2">
            Fill out the form below to place your bulk order
          </p>
        </div>
        
        <OrderForm productId={productId} user={user} />
      </main>
    </>
  );
}
