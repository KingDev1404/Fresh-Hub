import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Get orders (filtered by user or all for admin)
  if (req.method === "GET") {
    try {
      const { all } = req.query;
      const isAdmin = session.user.role === "ADMIN";
      
      // If admin requesting all orders
      if (isAdmin && all === "true") {
        const orders = await prisma.order.findMany({
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        
        return res.status(200).json(orders);
      }
      
      // Get user's orders
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
          createdAt: "desc",
        },
      });
      
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: "Failed to fetch orders" });
    }
  }

  // Create a new order
  if (req.method === "POST") {
    try {
      const { productId, quantity, deliveryName, deliveryPhone, deliveryAddress } = req.body;

      if (!productId || !quantity || !deliveryName || !deliveryPhone || !deliveryAddress) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Get product details to calculate price
      const product = await prisma.product.findUnique({
        where: {
          id: Number(productId),
        },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const totalAmount = product.price * quantity;

      // Create order with order items
      const order = await prisma.order.create({
        data: {
          buyerId: Number(session.user.id),
          deliveryName,
          deliveryPhone,
          deliveryAddress,
          totalAmount,
          orderItems: {
            create: {
              productId: Number(productId),
              quantity,
              price: product.price,
            },
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
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Failed to create order" });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: "Method not allowed" });
}
