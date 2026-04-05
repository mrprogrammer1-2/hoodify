"use server";

import { db } from "@/db";
import { products, productImages, productVariants, orderItems } from "@/db/schemas";
import { inArray } from "drizzle-orm";

export const deleteProducts = async (productIds: string[]) => {
  if (productIds.length === 0) return;

  await db.delete(orderItems).where(inArray(orderItems.productId, productIds));
  await db.delete(productVariants).where(inArray(productVariants.productId, productIds));
  await db.delete(productImages).where(inArray(productImages.productId, productIds));
  await db.delete(products).where(inArray(products.id, productIds));
};
