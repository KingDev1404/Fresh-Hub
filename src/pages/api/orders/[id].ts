import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const orderId = Number(id);
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (isNaN(orderId)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  // Get a specific order
  if (req.method === "GET") {
    try {
      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if the user is authorized to view this order
      const isAdmin = session.user.role === "ADMIN";
      const isOwner = order.buyerId === Number(session.user.id);
      
      if (!isAdmin && !isOwner) {
        return res.status(403).json({ message: "Access denied" });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ message: "Failed to fetch order" });
    }
  }

  // Update order status (admin only)
  if (req.method === "PUT") {
    try {
      const isAdmin = session.user.role === "ADMIN";
      
      if (!isAdmin) {
        return res.status(403).json({ message: "Only admins can update order status" });
      }

      const { status } = req.body;

      if (!status || !["PENDING", "IN_PROGRESS", "DELIVERED"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const order = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status,
        },
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
      console.error("Error updating order:", error);
      return res.status(500).json({ message: "Failed to update order" });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: "Method not allowed" });
}
