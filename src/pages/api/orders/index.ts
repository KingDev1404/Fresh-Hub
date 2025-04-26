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
    const { productId, quantity, items, deliveryName, deliveryPhone, deliveryAddress } = req.body;

    // Validate delivery details
    if (!deliveryName || !deliveryPhone || !deliveryAddress) {
      return res.status(400).json({ message: 'Missing delivery details' });
    }

    try {
      // Handle cart order (multiple items)
      if (items && Array.isArray(items) && items.length > 0) {
        // Validate items
        for (const item of items) {
          if (!item.productId || !item.quantity || item.quantity < 1) {
            return res.status(400).json({ 
              message: 'Invalid item data. Each item must have a productId and positive quantity.' 
            });
          }
        }

        // Fetch all products at once to calculate prices
        const productIds = items.map(item => item.productId);
        const products = await prisma.product.findMany({
          where: {
            id: {
              in: productIds
            }
          }
        });

        // Create a map for easy lookup
        const productMap = new Map(
          products.map(product => [product.id, product])
        );

        // Calculate total amount and prepare order items
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
          const product = productMap.get(item.productId);
          if (!product) {
            return res.status(404).json({ 
              message: `Product with ID ${item.productId} not found.` 
            });
          }

          const itemTotal = product.price * item.quantity;
          totalAmount += itemTotal;

          orderItems.push({
            productId: item.productId,
            quantity: item.quantity,
            price: product.price // Store the price at time of order
          });
        }

        // Create the order with all items
        const order = await prisma.order.create({
          data: {
            userId: parseInt(session.user.id.toString()),
            totalAmount,
            status: 'PENDING',
            deliveryName,
            deliveryPhone,
            deliveryAddress,
            orderItems: {
              create: orderItems
            }
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
      } 
      // Handle single product order
      else if (productId && quantity) {
        if (typeof quantity !== 'number' || quantity < 1) {
          return res.status(400).json({ message: 'Quantity must be a positive number' });
        }

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
            userId: parseInt(session.user.id.toString()),
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
      } else {
        return res.status(400).json({ 
          message: 'Missing required fields: Either provide productId and quantity, or an array of items'
        });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ message: 'Error creating order' });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}