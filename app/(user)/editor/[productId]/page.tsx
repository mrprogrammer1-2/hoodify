import { getProductById } from "@/lib/queries/productQueries";
import Image from "next/image";
import EditorClient from "../components/EditorClient";
import { Suspense } from "react";
import Loader from "@/components/Loader";

export default async function CustomizePage(props: {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const product = await getProductById(params.productId);

  return (
    <div className="w-screen h-dvh overflow-hidden min-h-[150vh]">
      <Suspense fallback={<Loader />}>
        <EditorClient
          product={product}
        />
      </Suspense>
    </div>
  );
}
