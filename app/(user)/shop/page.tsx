import { Suspense } from "react";
import Products from "./Products";
import ProductSkeleton from "./ProductSkeleton";

export default function Shop() {
  return (
    <main className="max-container min-h-dvh">
      <h1 className="my-12 text-center text-2xl font-semibold font-mono">
        our shop
      </h1>
      <Suspense fallback={<ProductSkeleton />}>
        <Products />
      </Suspense>
    </main>
  );
}
