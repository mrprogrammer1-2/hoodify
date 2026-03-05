"use server";

import { db } from "@/db";
import {
  orders,
  orderItems,
  productVariants,
  products,
  productImages,
} from "@/db/schemas";
import { and, eq, sql } from "drizzle-orm";
import { getDbUser } from "./getDbUser";

export async function getUserCart() {
  const user = await getDbUser();
  if (!user) return [];

  const [cart] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, user.id), eq(orders.status, "cart")))
    .limit(1);

  if (!cart) return [];

  const items = await db
    .select({
      orderItemId: orderItems.id,
      productId: orderItems.productId,
      variantId: orderItems.variantId,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      customization: orderItems.customization,
      productName: products.name,
      image: sql<string>`
        COALESCE(
          (SELECT url FROM ${productImages} 
           WHERE ${productImages.productId} = ${products.id} 
           AND ${productImages.color} = ${productVariants.color} 
           ORDER BY ${productImages.position} LIMIT 1),
          (SELECT url FROM ${productImages} 
           WHERE ${productImages.productId} = ${products.id} 
           ORDER BY ${productImages.position} LIMIT 1)
        )
      `.as("image"),
      color: productVariants.color,
      size: productVariants.size,
    })
    .from(orderItems)
    .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, cart.id));

  return items;
}
