"use server";

import { getOrderById } from "@/lib/queries/orderQueries";

export const getOrderDetails = async (orderId: string) => {
  try {
    const order = await getOrderById(orderId);
    return { success: true, order };
  } catch (error) {
    console.error("Error fetching order details:", error);
    return { success: false, error: "Failed to fetch order details" };
  }
};
