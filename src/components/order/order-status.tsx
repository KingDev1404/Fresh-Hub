import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatPrice, getOrderStatusBadgeColor } from '@/lib/utils';
import { Truck, ShoppingBag, Check } from 'lucide-react';

interface OrderStatusProps {
  order: {
    id: number;
    status: string;
    totalAmount: number;
    recipientName: string;
    contactNumber: string;
    deliveryAddress: string;
    createdAt: string;
    updatedAt: string;
    orderItems: {
      id: number;
      quantity: number;
      price: number;
      product: {
        id: number;
        name: string;
        imageUrl: string;
      };
    }[];
  };
}

export default function OrderStatus({ order }: OrderStatusProps) {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'PENDING':
        return <ShoppingBag className="h-8 w-8 text-yellow-500" />;
      case 'IN_PROGRESS':
        return <Truck className="h-8 w-8 text-blue-500" />;
      case 'DELIVERED':
        return <Check className="h-8 w-8 text-green-500" />;
      default:
        return <ShoppingBag className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'PENDING':
        return 'Your order has been received and is pending processing.';
      case 'IN_PROGRESS':
        return 'Your order is currently being processed and prepared for delivery.';
      case 'DELIVERED':
        return 'Your order has been successfully delivered.';
      default:
        return 'Order status unknown.';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Order #{order.id}</CardTitle>
        <Badge className={getOrderStatusBadgeColor(order.status)}>
          {order.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          {getStatusIcon(order.status)}
          <div>
            <p className="font-medium">{getStatusText(order.status)}</p>
            <p className="text-sm text-gray-500">Last updated: {formatDate(order.updatedAt)}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium text-lg mb-2">Order Details</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Items</h4>
              <ul className="space-y-2">
                {order.orderItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.product.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                <span>Total:</span>
                <span className="text-green-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Delivery Information</h4>
              <p><span className="text-gray-500">Recipient: </span>{order.recipientName}</p>
              <p><span className="text-gray-500">Contact: </span>{order.contactNumber}</p>
              <p><span className="text-gray-500">Address: </span>{order.deliveryAddress}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Order Timeline</h4>
              <p><span className="text-gray-500">Ordered on: </span>{formatDate(order.createdAt)}</p>
              {order.status !== 'PENDING' && (
                <p><span className="text-gray-500">Processing started: </span>{formatDate(order.updatedAt)}</p>
              )}
              {order.status === 'DELIVERED' && (
                <p><span className="text-gray-500">Delivered on: </span>{formatDate(order.updatedAt)}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
