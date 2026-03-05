import React from "react";
import SingleUserClient from "./SingleUserClient";
import { getUserById } from "@/lib/queries/userQueries";
import {
  userRecentOrders,
  userTotalOrders,
  userTotalSpent,
} from "@/lib/queries/orderQueries";

export default async function SingleUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUserById(userId);
  console.log(user);
  const totalSpent = await userTotalSpent(userId);
  const totalOrders = await userTotalOrders(userId);
  const recentOrders = await userRecentOrders(userId);
  console.log("totalspent", totalSpent);
  console.log("totalOrders", totalOrders);
  console.log("recentOrders", recentOrders);

  return (
    <div>
      <SingleUserClient
        user={user!}
        totalSpent={totalSpent}
        totalOrders={totalOrders}
        recentOrders={recentOrders}
      />
    </div>
  );
}
