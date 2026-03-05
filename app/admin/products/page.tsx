import { Suspense } from "react";
import ProductsTable from "./components/ProductsTable";
import Loader from "@/components/Loader";
import SearchBar from "../components/SearchBar";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { userId, search } = await searchParams;
  return (
    <div>
      <SearchBar
        action="/admin/products"
        userId={userId}
        defaultSearch={search}
      />
      <h1 className="bg-neutral-700 text-white text-center text-xl py-2">
        All Products
      </h1>
      <Suspense fallback={<Loader />}>
        <ProductsTable search={search!} />
      </Suspense>
    </div>
  );
}
