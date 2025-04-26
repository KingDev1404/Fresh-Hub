import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const productId = Number(id);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  // Get a specific product
  if (req.method === "GET") {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({ message: "Failed to fetch product" });
    }
  }

  // Update a product (admin only)
  if (req.method === "PUT") {
    try {
      const session = await getServerSession(req, res, authOptions);
      
      if (!session || session.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { name, description, price, imageUrl, category } = req.body;

      if (!name || !description || !price || !imageUrl || !category) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const product = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          name,
          description,
          price: Number(price),
          imageUrl,
          category,
        },
      });

      return res.status(200).json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ message: "Failed to update product" });
    }
  }

  // Delete a product (admin only)
  if (req.method === "DELETE") {
    try {
      const session = await getServerSession(req, res, authOptions);
      
      if (!session || session.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await prisma.product.delete({
        where: {
          id: productId,
        },
      });

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ message: "Failed to delete product" });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: "Method not allowed" });
}
