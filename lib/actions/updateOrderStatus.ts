"use server";

import { db } from "@/db";
import { orders } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
) {
  await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, orderId));

  revalidatePath("/admin/orders");
  return { success: true };
}
