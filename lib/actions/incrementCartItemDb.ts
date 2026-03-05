"use server";

import { db } from "@/db";
import { orderItems, orders } from "@/db/schemas";
import { and, eq, isNull, sql } from "drizzle-orm";
import { getDbUser } from "./getDbUser";

export async function incrementCartItemDb(
  productId: string,
  variantId: string | null | undefined,
  // itemType: "hoodie" | "ticket",
) {
  const user = await getDbUser();
  if (!user) return;

  const [cart] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, user.id), eq(orders.status, "cart")))
    .limit(1);

  if (!cart) return;

  const whereCondition = and(
    eq(orderItems.orderId, cart.id),
    eq(orderItems.productId, productId),
    // eq(orderItems.itemType, itemType),
    variantId
      ? eq(orderItems.variantId, variantId)
      : isNull(orderItems.variantId),
  );

  const result = await db
    .update(orderItems)
    .set({
      quantity: sql`${orderItems.quantity} + 1`,
    })
    .where(whereCondition)
    .returning({ id: orderItems.id });

  if (result.length === 0) {
    throw new Error("Cart item not found for increment");
  }
}
