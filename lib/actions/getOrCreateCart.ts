// lib/db/getOrCreateCart.ts
import { db } from "@/db";
import { orders } from "@/db/schemas";
import { eq, and } from "drizzle-orm";

export async function getOrCreateCart(userId: string) {
  // 1. Try to find existing cart
  const [existingCart] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.status, "cart")));

  if (existingCart) return existingCart;

  // 2. Create new cart if not found
  const [newCart] = await db
    .insert(orders)
    .values({
      userId,
      status: "cart",
    })
    .returning();

  return newCart;
}
