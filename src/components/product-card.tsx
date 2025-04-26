import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const handleOrderClick = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      router.push("/auth");
      return;
    }
    
    router.push({
      pathname: "/orders",
      query: { productId: product.id },
    });
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <span className="font-bold text-green-600">{formatCurrency(product.price)}/kg</span>
        </div>
        <CardDescription className="text-xs uppercase tracking-wide">
          {product.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-gray-600">{product.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleOrderClick}
          className="w-full"
        >
          Order Now
        </Button>
      </CardFooter>
    </Card>
  );
}
