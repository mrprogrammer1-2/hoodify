"use server";

import { db } from "@/db";
import { orders } from "@/db/schemas";
import { eq, count } from "drizzle-orm";

export async function getPendingOrdersCount() {
  const [result] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, "pending"));

  return result.count;
}
