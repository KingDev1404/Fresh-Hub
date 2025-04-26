import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderForm } from "@/components/order-form";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { formatCurrency } from "@/lib/utils";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { productId } = router.query;
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null; // Will redirect to /auth
  }

  return (
    <>
      <Head>
        <title>My Orders - FreshHarvest</title>
      </Head>

      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{productId ? "Place New Order" : "My Orders"}</h1>
          {!productId && (
            <Button onClick={() => router.push("/")} variant="outline">
              Browse Products
            </Button>
          )}
        </div>

        {productId ? (
          <OrderForm productId={Number(productId)} />
        ) : (
          <div>
            {isLoading ? (
              <div className="text-center py-10">Loading your orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10">
                <p className="mb-4">You haven't placed any orders yet.</p>
                <Button onClick={() => router.push("/")}>
                  Browse Products
                </Button>
              </div>
            ) : (
              <Table>
                <TableCaption>List of your recent orders</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{order.orderItems.length} item(s)</TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/order/${order.id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>
    </>
  );
}
