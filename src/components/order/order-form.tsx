'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/utils';
import { fetcher } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  recipientName: z.string().min(2, 'Recipient name is required'),
  contactNumber: z.string().min(5, 'Contact number is required'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
});

interface OrderFormProps {
  productId?: string;
  user: any;
}

export default function OrderForm({ productId, user }: OrderFormProps) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: productId ? parseInt(productId) : 0,
      quantity: 1,
      recipientName: user?.name || '',
      contactNumber: '',
      deliveryAddress: '',
    },
  });

  // Get product details when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const productData = await fetcher(`/api/products/${productId}`);
          setProduct(productData);
          
          // Calculate initial total
          setTotalAmount(productData.price * form.getValues('quantity'));
        } catch (error) {
          console.error('Error fetching product:', error);
          toast({
            title: 'Error',
            description: 'Failed to load product information',
            variant: 'destructive',
          });
        }
      }
    };

    fetchProduct();
  }, [productId, form]);

  // Update total amount when quantity changes
  useEffect(() => {
    if (product) {
      const quantityValue = form.watch('quantity');
      setTotalAmount(product.price * quantityValue);
    }
  }, [form.watch('quantity'), product]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      // Create the order payload
      const orderData = {
        ...data,
        totalAmount,
      };
      
      await fetcher('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      
      toast({
        title: 'Order Placed',
        description: 'Your order has been successfully submitted!',
      });
      
      // Redirect to orders page
      router.push('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error',
        description: 'Failed to place your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Place Bulk Order</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-medium">{formatPrice(product.price)} per unit</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                {product.category}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              {...form.register('quantity', { valueAsNumber: true })}
              onChange={(e) => {
                form.setValue('quantity', parseInt(e.target.value) || 1);
              }}
            />
            {form.formState.errors.quantity && (
              <p className="text-sm text-red-500">{form.formState.errors.quantity.message}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="recipientName">Recipient Name</Label>
            <Input
              id="recipientName"
              {...form.register('recipientName')}
            />
            {form.formState.errors.recipientName && (
              <p className="text-sm text-red-500">{form.formState.errors.recipientName.message}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              {...form.register('contactNumber')}
            />
            {form.formState.errors.contactNumber && (
              <p className="text-sm text-red-500">{form.formState.errors.contactNumber.message}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="deliveryAddress">Delivery Address</Label>
            <Textarea
              id="deliveryAddress"
              {...form.register('deliveryAddress')}
            />
            {form.formState.errors.deliveryAddress && (
              <p className="text-sm text-red-500">{form.formState.errors.deliveryAddress.message}</p>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-green-600">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
