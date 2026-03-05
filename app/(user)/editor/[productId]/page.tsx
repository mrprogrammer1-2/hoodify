import { getProductById } from "@/lib/queries/productQueries";
import Image from "next/image";
import EditorClient from "../components/EditorClient";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export default async function CustomizePage(props: {
  params: Promise<{ productId: string }>;
}) {
  const params = await props.params;
  const product = await getProductById(params.productId);
  console.log("page" + product);
  return (
    <div className="w-screen h-dvh overflow-hidden">
      <Suspense fallback={<Loader />}>
        <EditorClient product={product} />
      </Suspense>
    </div>
  );
}
