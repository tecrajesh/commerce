
import { NextRequest } from "next/server";
import { connectToDb } from "@/app/lib/db"; // <- move it out of app/api

export async function GET(
  request: NextRequest,
  context?: { params?: { id?: string } }
) {
  const productId = context?.params?.id;
  const { db } = await connectToDb();

  if (!productId) {
    return new Response("Product ID is required", { status: 400 });
  }

  const product = await db.collection("products").findOne({ id: productId });

  if (!product) {
    return new Response("Product not found!", { status: 404 });
  }

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
