"use server";

import { getOrCreateCart } from "./getOrCreateCart";
import { getDbUser } from "./getDbUser";
import { db } from "@/db";
import { productVariants, orderItems, orders } from "@/db/schemas";
import { and, eq, sql } from "drizzle-orm";
import { calculateItemPrice } from "@/lib/pricing";

export async function createOrder({
  productId,
  size,
  color,
  customization,
  addOn,
}: {
  productId: string;
  size: string;
  color: string;
  customization?: string;
  addOn?: string;
}) {
  const currentUser = await getDbUser();
  if (!currentUser) throw new Error("User not authenticated");

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

  if (!variant) throw new Error("Variant not found");

  const basePrice = variant.price ?? 0;

  // Parse customization and add-ons ONCE, reuse for both price calc and DB insert
  let parsedCustomization: Record<string, string> | null = null;
  let parsedAddOns: Array<{
    id: string;
    name: string;
    price: number;
    text?: string;
  }> | null = null;

  if (customization) {
    try {
      parsedCustomization = JSON.parse(customization);
    } catch (e) {
      console.error("Failed to parse customization:", e);
    }
  }

  if (addOn) {
    try {
      parsedAddOns = JSON.parse(addOn);
    } catch (e) {
      console.error("Failed to parse addOn:", e);
    }
  }

  const hasCustomization =
    parsedCustomization && Object.values(parsedCustomization).some(Boolean);
  const hasAddOns = parsedAddOns && parsedAddOns.length > 0;

  // Calculate unit price: base (from variant) + customization sides × 100 + sum of addOn prices
  const unitPrice = calculateItemPrice(
    basePrice,
    parsedCustomization,
    parsedAddOns,
  );

  if (hasCustomization || hasAddOns) {
    // Always insert as a new unique item — customized items are never merged
    await db.insert(orderItems).values({
      orderId: cart.id,
      productId,
      variantId: variant.id,
      quantity: 1,
      unitPrice,
      customization: parsedCustomization as any, // store as JSONB, not raw string
      addOn: parsedAddOns as any, // store as JSONB, not raw string
    });
  } else {
    // Plain item: merge with existing cart entry for same variant
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
      await db
        .update(orderItems)
        .set({ quantity: sql`${orderItems.quantity} + 1` })
        .where(eq(orderItems.id, existingItem.id));
    } else {
      await db.insert(orderItems).values({
        orderId: cart.id,
        productId,
        variantId: variant.id,
        quantity: 1,
        unitPrice: basePrice,
      });
    }
  }

  // Recalculate and persist order total
  const allItems = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, cart.id));

  const totalPrice = allItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  await db.update(orders).set({ totalPrice }).where(eq(orders.id, cart.id));
}
