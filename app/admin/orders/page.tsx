import { Suspense } from "react";
import Loader from "@/components/Loader";
import OrdersContent from "./components/OrdersContent";
import SearchBar from "../components/SearchBar";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { userId, search } = await searchParams;

  return (
    <div>
      <SearchBar
        action="/admin/orders"
        userId={userId}
        defaultSearch={search}
      />
      <h1 className="bg-neutral-700 text-white text-center text-xl py-2">
        All Orders
      </h1>
      <Suspense fallback={<Loader />}>
        <OrdersContent userId={userId} search={search} />
      </Suspense>
    </div>
  );
}
