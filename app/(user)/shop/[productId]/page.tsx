import { getProductById } from "@/lib/queries/productQueries";
import SingleProductClient from "./SingleProductClient";
import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: { productId: string };
}): Promise<Metadata> {
  const params = await props.params;

  const product = await getProductById(params.productId);
  if (!product || !product.name) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} | Hoodify`,
    description: product.description ?? "Product details page",
  };
}

export default async function page(props: {
  params: Promise<{ productId: string }>;
}) {
  const params = await props.params;

  const product = await getProductById(params.productId);

  return <SingleProductClient product={product} />;
}
