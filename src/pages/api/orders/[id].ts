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

  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }
  
  const orderId = parseInt(id);
  
  if (isNaN(orderId)) {
    return res.status(400).json({ message: 'Invalid order ID format' });
  }

  // GET: Fetch a single order
  if (req.method === 'GET') {
    try {
      // Find the order
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
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
      
      // Check if user is authorized to view this order
      const isAdmin = session.user.role === 'ADMIN';
      const isOwner = order.userId === parseInt(session.user.id);
      
      if (!isAdmin && !isOwner) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      
      return res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      return res.status(500).json({ message: 'Error fetching order' });
    }
  }
  
  // PATCH: Update an order's status (admin only)
  if (req.method === 'PATCH') {
    // Verify user is authenticated and has admin role
    if (session.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.body;

    // Validate status
    if (!status || !['PENDING', 'IN_PROGRESS', 'DELIVERED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
      // Check if order exists
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });
      
      if (!existingOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Update the order status
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
      
      return res.status(200).json(order);
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ message: 'Error updating order' });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}