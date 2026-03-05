import { getProductById } from "@/lib/queries/productQueries";
import EditForm from "./EditForm";

export default async function EditPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { productId } = await searchParams;

  if (!productId) return <p>Product id is missing</p>; // ← added return

  const product = await getProductById(productId);

  return (
    <div>
      <EditForm product={product} />
    </div>
  );
}
