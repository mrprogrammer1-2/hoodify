import { getAllOrders, getOrders } from "@/lib/queries/orderQueries";
import { getUserById } from "@/lib/queries/userQueries";
import OrdersPageClient from "./OrdersPageClient";

export default async function OrdersContent({
  userId,
  search,
}: {
  userId?: string;
  search?: string;
}) {
  let user;
  let orders;

  if (userId) {
    orders = await getOrders(userId, search);
    user = await getUserById(userId);
  } else {
    orders = await getAllOrders(search);
  }

  return (
    <>
      {userId && user && (
        <h1 className="mt-4 text-center font-semibold text-2xl">
          Showing orders for{" "}
          <span className="p-2 rounded-md text-white bg-blue-400">
            {user.firstName} {user.lastName}
          </span>
        </h1>
      )}
      <OrdersPageClient orders={orders} />
    </>
  );
}
