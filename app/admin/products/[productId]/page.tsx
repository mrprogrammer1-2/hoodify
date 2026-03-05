import { getProductById } from "@/lib/queries/productQueries";
import SingleProductClient from "./SingleProductClient";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export default async function SingleProduct({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  console.log("productId:", productId);

  const product = await getProductById(productId);
  console.log("product:", product);

  return (
    <div>
      <Suspense fallback={<Loader />}>
        <SingleProductClient product={product} />
      </Suspense>
    </div>
  );
}
