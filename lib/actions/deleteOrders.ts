"use server";

import { db } from "@/db";
import { orders, orderItems } from "@/db/schemas";
import { inArray } from "drizzle-orm";

export const deleteOrders = async (orderIds: string[]) => {
  if (orderIds.length === 0) return;

  await db.delete(orderItems).where(inArray(orderItems.orderId, orderIds));
  await db.delete(orders).where(inArray(orders.id, orderIds));
};
