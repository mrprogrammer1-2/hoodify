"use server";

import { db } from "@/db";
import { orderItems, orders } from "@/db/schemas";
import { eq, and, isNull } from "drizzle-orm";
import { getDbUser } from "./getDbUser";

export default async function removeFromCartDb(
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

  // 🔑 build conditions safely
  const conditions = [
    eq(orderItems.orderId, cart.id),
    eq(orderItems.productId, productId),
    // eq(orderItems.itemType, itemType ?? "hoodie"),
    variantId
      ? eq(orderItems.variantId, variantId)
      : isNull(orderItems.variantId),
  ];

  await db.delete(orderItems).where(and(...conditions));
}
