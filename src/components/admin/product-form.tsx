'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { fetcher } from '@/lib/utils';

// Form validation schema
const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  imageUrl: z.string().url('Must be a valid URL'),
  category: z.string().min(2, 'Category is required'),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
  };
  onSuccess: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!product;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    
    try {
      if (isEditing) {
        // Update existing product
        await fetcher(`/api/products/${product.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        
        toast({
          title: 'Product Updated',
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Create new product
        await fetcher('/api/products', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        
        toast({
          title: 'Product Created',
          description: `${data.name} has been added to the catalog.`,
        });
        
        // Reset form if creating a new product
        form.reset({
          name: '',
          description: '',
          price: 0,
          imageUrl: '',
          category: '',
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="price">Price (per unit)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...form.register('price', { valueAsNumber: true })}
            />
            {form.formState.errors.price && (
              <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              {...form.register('imageUrl')}
              placeholder="https://example.com/image.jpg"
            />
            {form.formState.errors.imageUrl && (
              <p className="text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              {...form.register('category')}
              placeholder="e.g., Fruits, Vegetables, etc."
            />
            {form.formState.errors.category && (
              <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
