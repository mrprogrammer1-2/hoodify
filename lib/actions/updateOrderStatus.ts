"use server";

import { db } from "@/db";
import { orderItems, orders } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
) {
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));

  revalidatePath("/admin/orders");
  return { success: true };
}
type AddOn = {
  id: string;
  name: string;
  price: number;
  text?: string;
};

export async function editAddOn(
  variantId: string,
  productId: string,
  addons: AddOn[],
) {
  try {
    await db
      .update(orderItems)
      .set({ addOn: JSON.stringify(addons) })
      .where(
        and(
          eq(orderItems.variantId, variantId),
          eq(orderItems.productId, productId),
        ),
      );
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update add-ons" };
  }
}
