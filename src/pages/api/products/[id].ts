import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  
  const productId = parseInt(id);
  
  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  // GET: Fetch a single product
  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      return res.status(500).json({ message: 'Error fetching product' });
    }
  }
  
  // PUT: Update a product (admin only)
  if (req.method === 'PUT') {
    // Verify user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, price, imageUrl, category } = req.body;

    // Validate required fields
    if (!name || !description || !price || !imageUrl || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const product = await prisma.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          price: parseFloat(price),
          imageUrl,
          category,
        },
      });
      
      return res.status(200).json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ message: 'Error updating product' });
    }
  }
  
  // DELETE: Remove a product (admin only)
  if (req.method === 'DELETE') {
    // Verify user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    try {
      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Delete the product
      await prisma.product.delete({
        where: { id: productId },
      });
      
      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ message: 'Error deleting product' });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}