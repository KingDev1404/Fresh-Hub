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

  const { id } = req.query;
  const orderId = parseInt(id as string);

  if (isNaN(orderId)) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  // GET: Fetch a single order
  if (req.method === 'GET') {
    try {
      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
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
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if user is authorized to view this order (admin or order owner)
      if (session.user.role !== 'ADMIN' && order.buyerId !== Number(session.user.id)) {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to view this order' });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // PUT: Update order status (admin only)
  if (req.method === 'PUT') {
    // Only admins can update order status
    if (session.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Missing status field' });
      }

      // Validate status
      if (!['PENDING', 'IN_PROGRESS', 'DELIVERED'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      // Check if order exists
      const existingOrder = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });

      if (!existingOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Update order status
      const updatedOrder = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status,
        },
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
      });

      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}