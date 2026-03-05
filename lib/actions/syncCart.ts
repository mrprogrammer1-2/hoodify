"use server";

import { db } from "@/db";
import { orderItems } from "@/db/schemas";
import { sql } from "drizzle-orm";
import { getOrCreateCart } from "./getOrCreateCart";
import { getDbUser } from "./getDbUser";

type GuestCartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  // itemType: "product" | "customization" | "addon";
};

export async function syncCart(items: GuestCartItem[]) {
  if (!items.length) return;

  const user = await getDbUser();
  if (!user) throw new Error("User not found");

  const cart = await getOrCreateCart(user.id);

  await db
    .insert(orderItems)
    .values(
      items.map((item) => ({
        orderId: cart.id,
        productId: item.productId,
        variantId: item.variantId ?? null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        // itemType: item.itemType,
      })),
    )
    .onConflictDoUpdate({
      target: [
        orderItems.orderId,
        orderItems.productId,
        orderItems.variantId,
        // orderItems.itemType,
      ],
      set: {
        quantity: sql`${orderItems.quantity} + excluded.quantity`,
        unitPrice: sql`excluded.unit_price`, // keep price fresh
      },
    });
}
