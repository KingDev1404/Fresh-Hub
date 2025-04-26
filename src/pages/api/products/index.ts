import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get all products
  if (req.method === "GET") {
    try {
      const products = await prisma.product.findMany({
        orderBy: {
          name: "asc",
        },
      });
      
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ message: "Failed to fetch products" });
    }
  }

  // Create a new product (admin only)
  if (req.method === "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);
      
      if (!session || session.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { name, description, price, imageUrl, category } = req.body;

      if (!name || !description || !price || !imageUrl || !category) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: Number(price),
          imageUrl,
          category,
        },
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      return res.status(500).json({ message: "Failed to create product" });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: "Method not allowed" });
}
