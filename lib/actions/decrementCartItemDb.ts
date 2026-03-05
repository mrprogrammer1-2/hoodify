"use server";

import { db } from "@/db";
import { orderItems, orders } from "@/db/schemas";
import { and, eq, isNull, sql } from "drizzle-orm";
import { getDbUser } from "./getDbUser";

export async function decrementCartItemDb(
  productId: string,
  variantId: string | null | undefined,
  // itemType: "hoodie" | "ticket" | undefined,
) {
  const user = await getDbUser();
  if (!user) return;

  const [cart] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, user.id), eq(orders.status, "cart")))
    .limit(1);

  if (!cart) return;

  const baseConditions = [
    eq(orderItems.orderId, cart.id),
    eq(orderItems.productId, productId),
    // eq(orderItems.itemType, itemType ?? "hoodie"),
    variantId
      ? eq(orderItems.variantId, variantId)
      : isNull(orderItems.variantId),
  ];

  // decrement
  await db
    .update(orderItems)
    .set({
      quantity: sql`${orderItems.quantity} - 1`,
    })
    .where(and(...baseConditions));

  // cleanup if quantity <= 0
  await db
    .delete(orderItems)
    .where(and(...baseConditions, sql`${orderItems.quantity} <= 0`));
}
