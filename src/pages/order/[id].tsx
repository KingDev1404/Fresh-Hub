import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { formatCurrency } from "@/lib/utils";

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }

    if (id && status === "authenticated") {
      fetchOrder();
    }
  }, [id, status]);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to load order details");
      }
    } catch (error) {
      setError("An error occurred while fetching order details");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push("/orders")}>Back to Orders</Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">Order not found</p>
        <Button onClick={() => router.push("/orders")}>Back to Orders</Button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Order #{id} - FreshHarvest</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <Button variant="outline" onClick={() => router.push("/orders")}>
            Back to Orders
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                <CardDescription>
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Delivery Information</h3>
                <div className="mt-2 space-y-1">
                  <p>{order.deliveryName}</p>
                  <p>{order.deliveryPhone}</p>
                  <p className="whitespace-pre-line">{order.deliveryAddress}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
                <div className="border rounded-md divide-y">
                  {order.orderItems.map((item: any) => (
                    <div key={item.id} className="p-4 flex justify-between">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} kg × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.quantity * item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between py-2">
                  <p className="text-gray-500">Subtotal</p>
                  <p>{formatCurrency(order.totalAmount)}</p>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <p>Total</p>
                  <p>{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-1 bg-gray-200"></div>
              
              <div className="relative pl-8 pb-8">
                <div className={`absolute left-0 w-7 h-7 rounded-full flex items-center justify-center ${order.status === "PENDING" || order.status === "IN_PROGRESS" || order.status === "DELIVERED" ? "bg-green-500" : "bg-gray-300"}`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="font-medium">Order Received</h3>
                <p className="text-sm text-gray-500">Your order has been received and is being processed</p>
              </div>

              <div className="relative pl-8 pb-8">
                <div className={`absolute left-0 w-7 h-7 rounded-full flex items-center justify-center ${order.status === "IN_PROGRESS" || order.status === "DELIVERED" ? "bg-green-500" : "bg-gray-300"}`}>
                  {(order.status === "IN_PROGRESS" || order.status === "DELIVERED") ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <span className="text-white text-xs">2</span>
                  )}
                </div>
                <h3 className="font-medium">In Progress</h3>
                <p className="text-sm text-gray-500">Your order is being prepared for delivery</p>
              </div>

              <div className="relative pl-8">
                <div className={`absolute left-0 w-7 h-7 rounded-full flex items-center justify-center ${order.status === "DELIVERED" ? "bg-green-500" : "bg-gray-300"}`}>
                  {order.status === "DELIVERED" ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <span className="text-white text-xs">3</span>
                  )}
                </div>
                <h3 className="font-medium">Delivered</h3>
                <p className="text-sm text-gray-500">Your order has been delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
