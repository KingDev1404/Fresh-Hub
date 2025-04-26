import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET: Fetch all products
  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      return res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // POST: Create a new product (admin only)
  if (req.method === 'POST') {
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

      // Create new product
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          imageUrl,
          category,
        },
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}