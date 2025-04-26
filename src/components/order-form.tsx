import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";

interface OrderFormProps {
  productId?: number;
}

type FormData = {
  quantity: number;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
};

export function OrderForm({ productId }: OrderFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      router.push("/auth");
      return;
    }

    if (!product) {
      toast({
        title: "Product not found",
        description: "Please select a valid product",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: parseInt(data.quantity.toString()),
          deliveryName: data.deliveryName,
          deliveryPhone: data.deliveryPhone,
          deliveryAddress: data.deliveryAddress,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Order placed successfully",
          description: `Your order #${result.id} has been placed`,
          variant: "default",
        });
        router.push(`/order/${result.id}`);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to place order");
      }
    } catch (error: any) {
      toast({
        title: "Error placing order",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (product) {
      const quantity = parseInt(e.target.value) || 0;
      setTotal(quantity * product.price);
    }
  };

  if (!product && productId) {
    return <div className="text-center py-8">Loading product...</div>;
  }

  if (!productId && !product) {
    return (
      <div className="text-center py-8">
        <p>No product selected. Please select a product from the catalog.</p>
        <Button onClick={() => router.push("/")} className="mt-4">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Place Bulk Order</CardTitle>
        <CardDescription>
          {product?.name} - {formatCurrency(product?.price)}/kg
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} id="order-form">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (kg)</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                {...register("quantity", { 
                  required: "Quantity is required",
                  min: {
                    value: 1,
                    message: "Quantity must be at least 1"
                  }
                })}
                onChange={handleQuantityChange}
                className={errors.quantity ? "border-red-500" : ""}
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryName">Full Name</Label>
              <Input
                id="deliveryName"
                {...register("deliveryName", { required: "Full name is required" })}
                className={errors.deliveryName ? "border-red-500" : ""}
              />
              {errors.deliveryName && (
                <p className="text-red-500 text-xs mt-1">{errors.deliveryName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryPhone">Phone Number</Label>
              <Input
                id="deliveryPhone"
                {...register("deliveryPhone", { 
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9\+\-\(\) ]+$/,
                    message: "Please enter a valid phone number"
                  }
                })}
                className={errors.deliveryPhone ? "border-red-500" : ""}
              />
              {errors.deliveryPhone && (
                <p className="text-red-500 text-xs mt-1">{errors.deliveryPhone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Delivery Address</Label>
              <Textarea
                id="deliveryAddress"
                {...register("deliveryAddress", { required: "Delivery address is required" })}
                className={errors.deliveryAddress ? "border-red-500" : ""}
              />
              {errors.deliveryAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress.message}</p>
              )}
            </div>

            <div className="bg-gray-50 p-3 rounded-md mt-4">
              <div className="flex justify-between items-center text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between items-center font-bold mt-2 text-green-600">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          form="order-form" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Place Order"}
        </Button>
      </CardFooter>
    </Card>
  );
}
