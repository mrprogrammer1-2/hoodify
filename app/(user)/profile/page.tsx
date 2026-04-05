import { getDbUser } from "@/lib/actions/getDbUser";
import ProfileClient from "@/components/ProfileClient";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import { getOrders, getOrderById } from "@/lib/queries/orderQueries";

export default async function ProfilePage() {
  const user = await getDbUser();
  const userOrders = user && (await getOrders(user.id));

  if (!user) {
    redirect("/");
  }

  const ordersWithDetails = userOrders ? await Promise.all(
    userOrders.map(async (order) => {
      const details = await getOrderById(order.id);
      return {
        ...order,
        createdAt: order.createdAt.toISOString(),
        details: details ? {
          ...details,
          createdAt: details.createdAt instanceof Date 
            ? details.createdAt.toISOString() 
            : details.createdAt,
        } : null,
      };
    })
  ) : undefined;

  return (
    <Suspense fallback={<Loader />}>
      <ProfileClient user={user} orders={ordersWithDetails} />
    </Suspense>
  );
}
