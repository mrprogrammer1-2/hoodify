"use server";

import { getOrCreateCart } from "./getOrCreateCart";
import { getDbUser } from "./getDbUser";
import { db } from "@/db";
import { productVariants, orderItems } from "@/db/schemas";
import { and, eq, sql } from "drizzle-orm";

export async function createOrder({
  productId,
  size,
  color,
  customization, // Add this parameter
}: {
  productId: string;
  size: string;
  color: string;
  customization?: Record<View, string | null>; // Canvas designs for each view
}) {
  const currentUser = await getDbUser();
  
  if (!currentUser) {
    throw new Error("User not authenticated");
  }
  
  const cart = await getOrCreateCart(currentUser.id);

  const [variant] = await db
    .select()
    .from(productVariants)
    .where(
      and(
        eq(productVariants.productId, productId),
        eq(productVariants.size, size),
        eq(productVariants.color, color),
      ),
    )
    .limit(1);

  if (!variant) {
    throw new Error("Variant not found");
  }

  const [existingItem] = await db
    .select()
    .from(orderItems)
    .where(
      and(
        eq(orderItems.orderId, cart.id),
        eq(orderItems.variantId, variant.id),
      ),
    )
    .limit(1);

  if (existingItem) {
    // For customized products, you might want to add as new item instead of incrementing
    // because each customization is unique
    if (customization) {
      await db.insert(orderItems).values({
        orderId: cart.id,
        productId,
        variantId: variant.id,
        quantity: 1,
        unitPrice: variant.price ?? 0,
        customization: customization as any, // Store the designs JSON
      });
    } else {
      // Only increment if not customized
      await db
        .update(orderItems)
        .set({
          quantity: sql`${orderItems.quantity} + 1`,
        })
        .where(eq(orderItems.id, existingItem.id));
    }
  } else {
    await db.insert(orderItems).values({
      orderId: cart.id,
      productId,
      variantId: variant.id,
      quantity: 1,
      unitPrice: variant.price ?? 0,
      customization: customization as any, // Store the designs JSON
    });
  }
}
