import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  // GET: Fetch all orders or filtered by user
  if (req.method === 'GET') {
    try {
      // If admin, allow fetching all orders
      // Otherwise, only fetch user's own orders
      const orders = session.user.role === 'ADMIN'
        ? await prisma.order.findMany({
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
              orderItems: {
                include: {
                  product: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          })
        : await prisma.order.findMany({
            where: {
              userId: parseInt(session.user.id),
            },
            include: {
              orderItems: {
                include: {
                  product: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          });

      return res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ message: 'Error fetching orders' });
    }
  }
  
  // POST: Create a new order
  if (req.method === 'POST') {
    const { productId, quantity, deliveryName, deliveryPhone, deliveryAddress } = req.body;

    // Validate required fields
    if (!productId || !quantity || !deliveryName || !deliveryPhone || !deliveryAddress) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    try {
      // Get the product to calculate price
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Calculate total amount
      const totalAmount = product.price * quantity;

      // Create the order with order item
      const order = await prisma.order.create({
        data: {
          userId: parseInt(session.user.id),
          totalAmount,
          status: 'PENDING',
          deliveryName,
          deliveryPhone,
          deliveryAddress,
          orderItems: {
            create: [
              {
                productId,
                quantity,
                price: product.price, // Store the price at time of order
              },
            ],
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ message: 'Error creating order' });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}