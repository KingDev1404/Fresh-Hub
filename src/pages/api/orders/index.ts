import { NextApiRequest, NextApiResponse } from 'next';
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
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // GET: Fetch orders (admin gets all, user gets their own)
  if (req.method === 'GET') {
    try {
      // If user is admin, fetch all orders with user info
      if (session.user.role === 'ADMIN') {
        const orders = await prisma.order.findMany({
          include: {
            buyer: {
              select: {
                id: true,
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
        });
        return res.status(200).json(orders);
      }

      // Otherwise, fetch only the user's orders
      const orders = await prisma.order.findMany({
        where: {
          buyerId: Number(session.user.id),
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
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // POST: Create a new order
  if (req.method === 'POST') {
    try {
      const { 
        orderItems, 
        deliveryName, 
        deliveryPhone, 
        deliveryAddress, 
        totalAmount 
      } = req.body;

      // Validate required fields
      if (!orderItems || !deliveryName || !deliveryPhone || !deliveryAddress || !totalAmount) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Validate order items
      if (!Array.isArray(orderItems) || orderItems.length === 0) {
        return res.status(400).json({ message: 'Order must contain at least one item' });
      }

      // Create order and order items in a transaction
      const order = await prisma.$transaction(async (prismaClient) => {
        // Create the order
        const newOrder = await prismaClient.order.create({
          data: {
            buyerId: Number(session.user.id),
            deliveryName,
            deliveryPhone,
            deliveryAddress,
            totalAmount: parseFloat(totalAmount),
            orderItems: {
              create: await Promise.all(orderItems.map(async (item: any) => {
                // Fetch current product price
                const product = await prismaClient.product.findUnique({
                  where: { id: item.productId },
                });
                
                if (!product) {
                  throw new Error(`Product with ID ${item.productId} not found`);
                }
                
                return {
                  productId: item.productId,
                  quantity: item.quantity,
                  price: product.price, // Use current product price
                };
              })),
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
        
        return newOrder;
      });

      return res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}