import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const productId = parseInt(id as string);

  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  // GET: Fetch a single product
  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // PUT: Update a product (admin only)
  if (req.method === 'PUT') {
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    try {
      const { name, description, price, imageUrl, category } = req.body;

      // Validate required fields
      if (!name || !description || !price || !imageUrl || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Update product
      const product = await prisma.product.update({
        where: {
          id: productId,
        },
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
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // DELETE: Delete a product (admin only)
  if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    try {
      // Check if product exists
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Delete product
      await prisma.product.delete({
        where: {
          id: productId,
        },
      });

      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}