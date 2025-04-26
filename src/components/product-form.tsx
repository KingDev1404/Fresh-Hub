import { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface ProductFormProps {
  product?: {
    id?: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
  };
  onSuccess?: () => void;
}

type FormData = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};

const categoryOptions = [
  "Vegetables",
  "Fruits",
  "Herbs",
  "Berries",
  "Root Vegetables",
  "Leafy Greens",
  "Citrus",
  "Exotic"
];

// Pre-defined stock image URLs
const stockImages = [
  "https://images.unsplash.com/photo-1463123081488-789f998ac9c4",
  "https://images.unsplash.com/photo-1464297162577-f5295c892194",
  "https://images.unsplash.com/photo-1516594798947-e65505dbb29d",
  "https://images.unsplash.com/photo-1490818387583-1baba5e638af",
  "https://images.unsplash.com/photo-1489450278009-822e9be04dff",
  "https://images.unsplash.com/photo-1561619128-84d4badf416e",
  "https://images.unsplash.com/photo-1506484381205-f7945653044d",
  "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0",
  "https://images.unsplash.com/photo-1518735869015-566a18eae4be",
  "https://images.unsplash.com/photo-1534940519139-f860fb3c6e38",
  "https://images.unsplash.com/photo-1484557985045-edf25e08da73",
  "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6"
];

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: product || {
      name: "",
      description: "",
      price: 0,
      imageUrl: stockImages[0],
      category: "Vegetables",
    },
  });
  
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!product?.id;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const url = isEdit ? `/api/products/${product.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: `Product ${isEdit ? "updated" : "created"} successfully`,
          variant: "default",
        });
        if (onSuccess) onSuccess();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to save product");
      }
    } catch (error: any) {
      toast({
        title: `Error ${isEdit ? "updating" : "creating"} product`,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} id="product-form">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Product name is required" })}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description", { required: "Description is required" })}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (per kg)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register("price", { 
                  required: "Price is required",
                  min: {
                    value: 0.01,
                    message: "Price must be greater than 0"
                  }
                })}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                {...register("category", { required: "Category is required" })}
                className={errors.category ? "border-red-500" : ""}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Select
                id="imageUrl"
                {...register("imageUrl", { required: "Image URL is required" })}
                className={errors.imageUrl ? "border-red-500" : ""}
              >
                {stockImages.map((url) => (
                  <option key={url} value={url}>
                    {url.split('/').pop()?.substring(0, 15) || url}
                  </option>
                ))}
              </Select>
              {errors.imageUrl && (
                <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          form="product-form" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
        </Button>
      </CardFooter>
    </Card>
  );
}
