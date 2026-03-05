import { getOrderById } from "@/lib/queries/orderQueries";
import SingleOrderClient from "./SingleOrderClient";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import SingleOrderContent from "../components/SingleOrderContent";

export default async function page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <Suspense fallback={<Loader />}>
      <SingleOrderContent orderId={orderId} />
    </Suspense>
  );
}
