import { getOrderById } from "@/lib/queries/orderQueries";
import SingleOrderClient from "../[orderId]/SingleOrderClient";

export default async function SingleOrderContent({
  orderId,
}: {
  orderId: string;
}) {
  const order = await getOrderById(orderId);
  return <SingleOrderClient order={order} />;
}
